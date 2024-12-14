import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";

import prisma from "@/lib/db/prisma";
import {
  createAddressSchema,
  updateDeleteAddressSchema,
} from "@/lib/validation/cart";
import type { ShoppingCartWithShipping } from "@/types";
import { authOptions } from "@/lib/auth";

const selectShippingAddress = async (cartId: string, addressId: string) => {
  const address = await prisma.shippingInformation.findUnique({
    where: {
      id: addressId,
    },
    select: {
      id: true,
    },
  });

  if (!address) {
    return {
      error: true,
      message: "Address not found",
    };
  }

  await prisma.cart.update({
    where: {
      id: cartId,
    },
    data: {
      selectedShippingAddress: addressId,
    },
  });
};

const deleteShippingAddress = async (cartId: string, addressId: string) => {
  const cart = await prisma.cart.findUnique({
    where: {
      id: cartId,
    },
    select: {
      shipping: {
        select: {
          id: true,
        },
      },
      selectedShippingAddress: true,
    },
  });

  const isAddressSelected = cart?.selectedShippingAddress === addressId;
  const nextSelectedAddressId = isAddressSelected
    ? cart?.shipping[0].id
    : cart?.selectedShippingAddress;

  await prisma.cart.update({
    where: {
      id: cartId,
    },
    data: {
      selectedShippingAddress: nextSelectedAddressId,
      shipping: {
        delete: {
          id: addressId,
        },
      },
    },
  });
};

/**
 * add a new shipping address to the cart
 * POST /api/cart/shipping { address: string, city: string, state: string, zip: string, isSelected: boolean }
 */
const handlePost = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getServerSession(authOptions);
  if (!session) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const cartFound = await prisma.cart.findFirst({
    where: {
      userId: session.user.id,
    },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  });
  if (!cartFound) {
    return res.status(404).json({ error: "Cart not found" });
  }
  const cartId = cartFound.id;
  const validation = createAddressSchema.safeParse(req.body);
  if (!validation.success) {
    return res.status(400).json({ error: validation.error.errors[0].message });
  }

  const { isSelected, ...addressData } = validation.data;

  const newShippingAddress = await prisma.shippingInformation.create({
    data: {
      cartId,
      ...addressData,
    },
    select: {
      id: true,
    },
  });

  if (isSelected) {
    await prisma.cart.update({
      where: {
        id: cartId,
      },
      data: {
        selectedShippingAddress: newShippingAddress.id,
      },
    });
  }

  const cart = await prisma.cart.findFirst({
    where: {
      id: cartId,
    },
    include: {
      items: {
        include: {
          product: true,
        },
      },
      shipping: true,
    },
  });

  const shoppingCart: ShoppingCartWithShipping | null = cart
    ? {
        ...cart,
        size:
          cart?.items.reduce((totalQty, item) => totalQty + item.quantity, 0) ||
          0,
        subTotal:
          cart?.items.reduce(
            (totalPrice, item) =>
              totalPrice + item.product.price * item.quantity,
            0
          ) || 0,
      }
    : null;

  res.status(201).json(shoppingCart);
};

/**
 * select or delete shipping address in the cart
 * PUT /api/cart/shipping?operation=select { addressId: string }
 * or
 * PUT /api/cart/shipping?operation=delete { addressId: string }
 */
const handlePut = async (req: NextApiRequest, res: NextApiResponse) => {
  const operation = req.query.operation as "select" | "delete" | undefined;

  if (operation !== "select" && operation !== "delete") {
    return res.status(400).json({ error: "Operation not provided" });
  }

  const session = await getServerSession(authOptions);
  if (!session) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const cartFound = await prisma.cart.findFirst({
    where: {
      userId: session.user.id,
    },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  });

  if (!cartFound) {
    return res.status(404).json({ error: "Cart not found" });
  }

  const cartId = cartFound.id;
  const validation = updateDeleteAddressSchema.safeParse(req.body);
  if (!validation.success) {
    return res.status(400).json({ error: validation.error.errors[0].message });
  }
  const address = await prisma.shippingInformation.findUnique({
    where: {
      id: validation.data.addressId,
    },
    select: {
      id: true,
    },
  });

  if (!address) {
    return res.status(404).json({ error: "Address not found" });
  }

  if (operation === "select") {
    await selectShippingAddress(cartId, validation.data.addressId);
  } else if (operation === "delete") {
    await deleteShippingAddress(cartId, validation.data.addressId);
  }

  const cart = await prisma.cart.findFirst({
    where: {
      id: cartId,
    },
    include: {
      items: {
        include: {
          product: true,
        },
      },
      shipping: true,
    },
  });

  const shoppingCart: ShoppingCartWithShipping | null = cart
    ? {
        ...cart,
        size:
          cart?.items.reduce((totalQty, item) => totalQty + item.quantity, 0) ||
          0,
        subTotal:
          cart?.items.reduce(
            (totalPrice, item) =>
              totalPrice + item.product.price * item.quantity,
            0
          ) || 0,
      }
    : null;

  res.status(200).json(shoppingCart);
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case "POST":
      return handlePost(req, res);

    case "PUT":
      return handlePut(req, res);
    default:
      return res.status(405).json({ error: "Method not allowed" });
  }
}
