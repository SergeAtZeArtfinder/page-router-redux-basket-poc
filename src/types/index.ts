import { Product as DbProduct, Prisma } from "@prisma/client";

export interface Product extends Omit<DbProduct, "createdAt" | "updatedAt"> {
  createdAt: string;
  updatedAt: string;
}

export type CartWithProducts = Prisma.CartGetPayload<{
  include: {
    items: {
      include: {
        product: true;
      };
    };
  };
}>;

export type CartWithProductsAndShipping = Prisma.CartGetPayload<{
  include: {
    items: {
      include: {
        product: true;
      };
    };
    shipping: true;
  };
}>;

export type CartItemWithProducts = Prisma.CartItemGetPayload<{
  include: {
    product: true;
  };
}>;

export type ShoppingCart = CartWithProducts & {
  size: number;
  subTotal: number;
};

export type ShoppingCartWithShipping = CartWithProductsAndShipping & {
  size: number;
  subTotal: number;
};
