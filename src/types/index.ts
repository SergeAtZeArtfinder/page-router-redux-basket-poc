import { Product as DbProduct } from "@prisma/client";

export interface Product extends Omit<DbProduct, "createdAt" | "updatedAt"> {
  createdAt: string;
  updatedAt: string;
}
