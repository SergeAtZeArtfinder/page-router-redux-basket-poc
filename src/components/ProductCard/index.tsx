"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

import type { Product } from "@/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/format";

interface Props {
  product: Product;
}

const ProductCard = ({ product }: Props): JSX.Element => {
  return (
    <Card className="flex flex-col h-full relative">
      <Link
        href={`/products/${product.id}`}
        className="absolute top-0 bottom-0 left-0 right-0"
      />
      <CardHeader>
        <figure>
          <Image
            src={product.imageUrl}
            alt={product.name}
            width={800}
            height={400}
            className="h-48 object-cover"
          />
        </figure>
        <CardTitle className="min-h-[50px]">{product.name}</CardTitle>
        <CardDescription>{product.description}</CardDescription>
      </CardHeader>
      <CardContent className="mt-auto flex flex-col">
        <p className="font-semibold">Qty: {product.quantity}</p>
        <Badge className="text-lg font-semibold ml-auto">
          {formatPrice(product.price)}
        </Badge>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
