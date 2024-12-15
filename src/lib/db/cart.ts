import { CartItem } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession, type Session } from "next-auth";

import type { Cart } from "@prisma/client";
import type {
  CartWithProducts,
  CartWithProductsAndShipping,
  ShoppingCart,
  ShoppingCartWithShipping,
} from "@/types";

import { authOptions } from "@/lib/auth";
import prisma from "./prisma";

/**
 * @description Creates a new cart and sets a cookie with the cart ID
 * for future retrieval, eg. in case of guest users
 */
export const createCart = async ({
  setCartCookie,
  session,
}: {
  setCartCookie: (value: string, isExpired?: boolean) => void;
  session?: Session | null;
}): Promise<ShoppingCart> => {
  let newCart: Cart;

  if (session) {
    newCart = await prisma.cart.create({
      data: {
        userId: session.user.id,
      },
    });
  } else {
    newCart = await prisma.cart.create({
      data: {},
    });

    // if anonymous user create a cookie with the cart ID
    // Note: needs encryption and secure, httpOnly settings if to be used in production

    setCartCookie(newCart.id);

    // res.setHeader("Set-Cookie", `localCartId=${newCart.id}; Path=/`);
  }

  return {
    ...newCart,
    items: [],
    size: 0,
    subTotal: 0,
  };
};

export const getCart = async ({
  cookies,
  session,
  newCartId,
}: {
  cookies: Partial<{
    [key: string]: string;
  }>;
  session?: Session | null;
  newCartId?: string;
}): Promise<ShoppingCart | null> => {
  let cart: CartWithProducts | null = null;

  if (session) {
    cart = await prisma.cart.findFirst({
      where: {
        userId: session.user.id,
      },
      include: {
        items: {
          include: {
            product: true,
          },
          orderBy: {
            id: "asc",
          },
        },
      },
    });
  } else {
    const localCartId = cookies["localCartId"] || newCartId;

    cart = localCartId
      ? await prisma.cart.findUnique({
          where: {
            id: localCartId,
          },
          include: {
            items: {
              include: {
                product: true,
              },
              orderBy: {
                id: "asc",
              },
            },
          },
        })
      : null;
  }

  if (!cart) {
    return null;
  }

  return {
    ...cart,
    size: cart.items.reduce((totalQty, item) => totalQty + item.quantity, 0),
    subTotal: cart.items.reduce(
      (totalPrice, item) => totalPrice + item.product.price * item.quantity,
      0
    ),
  };
};

export const getCartWithShipping = async ({
  cookies,
  session,
  newCartId,
}: {
  cookies: Partial<{
    [key: string]: string;
  }>;
  session?: Session | null;
  newCartId?: string;
}): Promise<ShoppingCartWithShipping | null> => {
  let cart: CartWithProductsAndShipping | null = null;

  if (session) {
    cart = await prisma.cart.findFirst({
      where: {
        userId: session.user.id,
      },
      include: {
        items: {
          include: {
            product: true,
          },
          orderBy: {
            id: "asc",
          },
        },
        shipping: true,
      },
    });
  } else {
    const localCartId = cookies["localCartId"] || newCartId;

    cart = localCartId
      ? await prisma.cart.findUnique({
          where: {
            id: localCartId,
          },
          include: {
            items: {
              include: {
                product: true,
              },
              orderBy: {
                id: "asc",
              },
            },
            shipping: true,
          },
        })
      : null;
  }

  if (!cart) {
    return null;
  }

  return {
    ...cart,
    size: cart.items.reduce((totalQty, item) => totalQty + item.quantity, 0),
    subTotal: cart.items.reduce(
      (totalPrice, item) => totalPrice + item.product.price * item.quantity,
      0
    ),
  };
};

/**
 * @description merges the anonymous cart into the user cart
 * We want to call it just after the login ASAP
 * In the authOptions, create an event on login
 * at src/app/api/auth/[...nextauth]/route.ts
 */
export const mergeAnonymousCartIntoUserCart = async ({
  req,
  res,
  userId,
}: {
  userId: string;
  req: NextApiRequest;
  res: NextApiResponse;
}) => {
  // 1 fetch local cart if exists
  const localCartId = req.cookies["localCartId"];
  const localCart = localCartId
    ? await prisma.cart.findUnique({
        where: {
          id: localCartId,
        },
        include: {
          items: true,
        },
      })
    : null;

  // 2. if no local cart, there is nothing to merge. return
  if (!localCart) {
    return;
  }

  // 3. fetch user cart if exists
  const userCart = await prisma.cart.findFirst({
    where: {
      userId,
    },
    include: {
      items: true,
    },
  });

  // 4. we want to make a Prisma DB transaction operation
  // because we shall make several db operations in one go
  // and if any of them fails, we want to rollback the entire transaction
  await prisma.$transaction(async (tx) => {
    if (userCart) {
      const mergedItems = mergeCartItems(localCart.items, userCart.items);

      // 5. delete user cart items, and set these new merged items instead
      await tx.cartItem.deleteMany({
        where: {
          cartId: userCart.id,
        },
      });

      await tx.cart.update({
        where: {
          id: userCart.id,
        },
        data: {
          items: {
            createMany: {
              // we want to omit the previously existing item IDs
              data: mergedItems.map((item) => ({
                productId: item.productId,
                quantity: item.quantity,
              })),
            },
          },
        },
      });
    } else {
      // 6. if user cart does not exist, create a new cart and set these local cart items
      await tx.cart.create({
        data: {
          userId,
          items: {
            createMany: {
              data: localCart.items.map((item) => ({
                productId: item.productId,
                quantity: item.quantity,
              })),
            },
          },
        },
      });
    }

    // 7. delete the old local cart, because not needed any more
    // as it has been merged into the user cart
    await tx.cart.delete({
      where: {
        id: localCart.id,
      },
    });
    // 8. delete the local cart cookie
    res.setHeader(
      "Set-Cookie",
      "localCartId=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT;"
    );
  });
};

function mergeCartItems(...cartItems: CartItem[][]) {
  return cartItems.reduce((acc, items) => {
    items.forEach((item) => {
      const existingItem = acc.find((i) => i.productId === item.productId);
      if (existingItem) {
        existingItem.quantity += item.quantity;
      } else {
        acc.push(item);
      }
    });
    return acc;
  }, [] as CartItem[]);
}

export const incrementCartItemQty = async ({
  productId,
  req,
  res,
}: {
  req: NextApiRequest;
  res: NextApiResponse;
  productId: string;
}) => {
  const session = await getServerSession(req, res, authOptions);
  let newCartId: string | undefined;

  await prisma.$transaction(async (tx) => {
    let cart = await getCart({ cookies: req.cookies, session });
    if (!cart) {
      cart = await createCart({
        setCartCookie: (value: string) => {
          res.setHeader("Set-Cookie", `localCartId=${value}; Path=/`);
        },
        session,
      });
      newCartId = cart?.id;
    }

    const itemInTheCart = cart.items.find(
      (item) => item.productId === productId
    );

    if (itemInTheCart) {
      await tx.cart.update({
        where: {
          id: cart.id,
        },
        data: {
          items: {
            update: {
              where: {
                id: itemInTheCart.id,
              },
              data: {
                quantity: {
                  increment: 1,
                },
                product: {
                  update: {
                    quantity: {
                      decrement: 1,
                    },
                  },
                },
              },
            },
          },
        },
      });
    } else {
      await tx.cart.update({
        where: {
          id: cart.id,
        },
        data: {
          items: {
            create: {
              productId,
              quantity: 1,
            },
          },
        },
      });

      await tx.product.update({
        where: {
          id: productId,
        },
        data: {
          quantity: {
            decrement: 1,
          },
        },
      });
    }
  });

  return { newCartId };
};

export const setCartItemQty = async ({
  productId,
  quantity,
  req,
  res,
}: {
  productId: string;
  quantity: number;
  req: NextApiRequest;
  res: NextApiResponse;
}) => {
  const session = await getServerSession(req, res, authOptions);
  let newCartId: string | undefined;

  await prisma.$transaction(async (tx) => {
    let cart = await getCart({ cookies: req.cookies, session });
    if (!cart) {
      cart = await createCart({
        setCartCookie: (value: string) => {
          res.setHeader("Set-Cookie", `localCartId=${value}; Path=/`);
        },
        session,
      });
      newCartId = cart?.id;
    }

    const itemInTheCart = cart.items.find(
      (item) => item.productId === productId
    );
    if (itemInTheCart && quantity <= 0) {
      await tx.cart.update({
        where: {
          id: cart.id,
        },
        data: {
          items: {
            delete: {
              id: itemInTheCart.id,
            },
          },
        },
      });

      await tx.product.update({
        where: {
          id: productId,
        },
        data: {
          quantity: {
            increment: itemInTheCart.quantity,
          },
        },
      });

      return;
    }

    if (itemInTheCart) {
      const difference = quantity - itemInTheCart.quantity;
      await tx.cart.update({
        where: {
          id: cart.id,
        },
        data: {
          items: {
            update: {
              where: {
                id: itemInTheCart.id,
              },
              data: {
                quantity,
                product: {
                  update: {
                    quantity:
                      difference > 0
                        ? {
                            decrement: difference,
                          }
                        : {
                            increment: Math.abs(difference),
                          },
                  },
                },
              },
            },
          },
        },
      });
    } else {
      await tx.cart.update({
        where: {
          id: cart.id,
        },
        data: {
          items: {
            create: {
              productId,
              quantity,
            },
          },
        },
      });
      await tx.product.update({
        where: {
          id: productId,
        },
        data: {
          quantity: {
            decrement: quantity,
          },
        },
      });
    }
  });

  return { newCartId };
};
