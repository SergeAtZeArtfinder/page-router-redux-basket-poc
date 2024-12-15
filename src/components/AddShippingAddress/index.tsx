"use client";

import React, { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import AddShippingAddressForm from "./AddShippingAddressForm";

const AddShippingAddress = (): JSX.Element => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <Button className="text-lg font-semibold ml-auto" asChild>
        <DialogTrigger>+ Add</DialogTrigger>
      </Button>
      <DialogContent className="bg-slate-50 overflow-auto">
        <DialogHeader>
          <DialogTitle>Add new shipping address</DialogTitle>
        </DialogHeader>
        <AddShippingAddressForm
          onSuccess={() => {
            setIsOpen(false);
          }}
        />
      </DialogContent>
    </Dialog>
  );
};

export default AddShippingAddress;
