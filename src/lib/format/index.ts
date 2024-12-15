import { Product as DbProduct } from "@prisma/client";
import { Product, IpAPIResponse, UserLocation } from "@/types";

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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const serializeDates = <D = any>(
  obj: Record<string, unknown> | Record<string, unknown>[]
): D => {
  if (Array.isArray(obj)) {
    return obj.map((item) => serializeDates(item)) as unknown as D;
  }

  if (obj && typeof obj === "object") {
    return Object.keys(obj).reduce((acc, key) => {
      acc[key] =
        obj[key] instanceof Date
          ? obj[key].toISOString()
          : serializeDates(obj[key] as Record<string, unknown>);
      return acc;
    }, {} as Record<string, unknown>) as unknown as D;
  }

  return obj as unknown as D; // Return non-object values as is
};

export const readCookies = (headersCookie?: string): Record<string, string> => {
  if (!headersCookie) return {};
  return headersCookie.split(";").reduce((acc, current) => {
    const [key, value] = current.trim().split("=");
    acc[key] = value;
    return acc;
  }, {} as Record<string, string>);
};

export const formatUserLocation = ({
  ip,
  city,
  country_code,
  country_name,
  region,
  postal,
  latitude,
  longitude,
}: IpAPIResponse): UserLocation => ({
  ip,
  countryName: country_name,
  countryCode: country_code,
  city,
  region,
  postal,
  latitude,
  longitude,
  timestamp: Date.now(),
});
