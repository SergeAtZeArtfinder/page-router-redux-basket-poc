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

export interface IpAPIResponse {
  ip: string;
  network: string;
  version: string;
  city: string;
  region: string;
  region_code: string;
  country: string;
  country_name: string;
  country_code: string;
  country_code_iso3: string;
  country_capital: string;
  country_tld: string;
  continent_code: string;
  in_eu: boolean;
  postal: string;
  latitude: number;
  longitude: number;
  timezone: string;
  utc_offset: string;
  country_calling_code: string;
  currency: string;
  currency_name: string;
  languages: string;
  country_area: number;
  country_population: number;
  asn: string;
  org: string;
}

export interface UserLocation
  extends Pick<
    IpAPIResponse,
    "city" | "region" | "postal" | "latitude" | "longitude" | "ip"
  > {
  countryName: string;
  countryCode: string;
  timestamp: number;
}
