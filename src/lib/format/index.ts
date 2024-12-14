import { Product as DbProduct } from "@prisma/client";
import { Product } from "@/types";

export const formatPrice = (
  intPrice: number,
  currency: "USD" | "GBP" | "EUR" = "USD"
) => {
  return (intPrice / 100).toLocaleString("en-US", {
    style: "currency",
    currency,
  });
};

export const formatDateToString = (item: DbProduct): Product => ({
  ...item,
  createdAt: item.createdAt.toString(),
  updatedAt: item.updatedAt.toString(),
});

export const getErrorFromAPI = async (
  response: Response,
  defaultMessage = "Failed to fetch data"
) => {
  const errorResponse: { error: string } = await response.json();

  return errorResponse.error || defaultMessage;
};
