"use client";

import React from "react";

import { ShoppingCartWithShipping } from "@/types";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "../ui/button";

interface Props {
  address: ShoppingCartWithShipping["shipping"][number];
  handleUpdate: (operation: "select" | "delete") => void;
  isSelected: boolean;
}

const ShippingAddress = ({
  address,
  handleUpdate,
  isSelected,
}: Props): JSX.Element => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>To: {address.name}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <p> {address.address}</p>
        <p>
          {address.city} / {address.postal}
        </p>
        <p> {address.country}</p>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <Button
          variant="destructive"
          onClick={() => {
            handleUpdate("delete");
          }}
        >
          delete
        </Button>
        <Button
          variant="secondary"
          onClick={() => {
            handleUpdate("select");
          }}
          disabled={isSelected}
        >
          {isSelected ? "✔ selected" : "select"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ShippingAddress;
