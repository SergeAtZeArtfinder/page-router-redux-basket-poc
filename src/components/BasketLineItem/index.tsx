"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";

import { ShoppingCartWithShipping } from "@/types";

import { Card, CardContent, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import Spinner from "@/components/Spinner";
import { formatPrice } from "@/lib/format";
import clsx from "clsx";

const getOptions = (quantityAvailable: number) => {
  return Array.from({ length: quantityAvailable + 1 }, (_, i) => i);
};

interface Props {
  item: ShoppingCartWithShipping["items"][number];
  onChangeQuantity: (quantity: number) => void;
  loading: boolean;
}

const BasketLineItem = ({
  item,
  onChangeQuantity,
  loading,
}: Props): JSX.Element => {
  return (
    <Card>
      <CardContent
        className={clsx("pt-6 grid gap-4 sm:grid-cols-[1fr,2fr]", {
          "opacity-80": loading,
        })}
      >
        <figure className="rounded-lg overflow-hidden h-48">
          <Link
            href={`/products/${item.product.id}`}
            className="hover:opacity-75 active:opacity-85"
          >
            <Image
              src={item.product.imageUrl}
              alt={item.product.name}
              width={400}
              height={200}
              className="h-96 object-cover"
            />
          </Link>
        </figure>
        <div className="flex flex-col gap-4 pt-4">
          <CardTitle>
            <Link
              href={`/products/${item.product.id}`}
              className="hover:underline"
            >
              {item.product.name}
            </Link>
          </CardTitle>

          <Label htmlFor="quantity">Quantity</Label>
          <div className="flex gap-4 items-center">
            <Select
              onValueChange={(value) => {
                onChangeQuantity(parseInt(value, 10));
              }}
              value={item.quantity.toString()}
              disabled={loading}
            >
              <SelectTrigger className="w-[100px]" disabled={loading}>
                <SelectValue placeholder="Qty" />
              </SelectTrigger>
              <SelectContent id="quantity">
                {getOptions(item.product.quantity).map((option) => (
                  <SelectItem key={option} value={option.toString()}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {loading && <Spinner />}
          </div>

          <Badge className="text-lg font-semibold ml-auto">
            Price: {formatPrice(item.quantity * item.product.price)}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};

export default BasketLineItem;
