import { z } from "zod";

export const changeCartQtySchema = z.object({
  productId: z.string(),
  quantity: z.number().int(),
});

export const incrementCartQtySchema = z.object({
  productId: z.string(),
});

export const createAddressSchema = z.object({
  name: z.string().min(1, { message: "Recipient name is required" }),
  address: z.string().min(5, { message: "Street address is required" }),
  city: z.string().min(1, { message: "City is required" }),
  postal: z.string().min(5, { message: "Postal/zip code is required" }),
  country: z.string().min(1, { message: "Country is required" }),
  isSelected: z.boolean().optional().default(true),
});

export type CreateAddressInput = z.infer<typeof createAddressSchema>;

export const updateDeleteAddressSchema = z.object({
  cartId: z.string().min(1),
  addressId: z.string().min(1),
});

export type UpdateDeleteAddressInput = z.infer<
  typeof updateDeleteAddressSchema
>;
