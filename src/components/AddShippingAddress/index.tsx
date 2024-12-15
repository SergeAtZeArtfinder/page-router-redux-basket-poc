"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

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
  const { data: session } = useSession();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = (isOpen: boolean) => {
    if (session) {
      setIsOpen(isOpen);
    } else {
      router.push("/api/auth/signin?callbackUrl=/basket");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpen}>
      <Button className="text-lg font-semibold ml-auto" asChild>
        <DialogTrigger>+ Add address</DialogTrigger>
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
