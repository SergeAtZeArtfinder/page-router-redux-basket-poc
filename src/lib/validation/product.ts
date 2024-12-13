import { z } from "zod";

export const createProductSchema = z.object({
  description: z.string().min(1, "Description is required"),
  imageUrl: z.string().url("Invalid URL"),
  name: z.string().min(1, "Name is required"),
  price: z.number().int().positive("Price must be a positive integer"),
  quantity: z
    .number()
    .int()
    .nonnegative("Quantity must be a non-negative integer")
    .default(100),
});

export const updateProductSchema = createProductSchema.partial();

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
