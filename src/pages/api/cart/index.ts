import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";

import {
  incrementCartQtySchema,
  changeCartQtySchema,
} from "@/lib/validation/cart";
import {
  getCart,
  getCartWithShipping,
  incrementCartItemQty,
  setCartItemQty,
} from "@/lib/db/cart";
import { authOptions } from "@/lib/auth";

/**
 * Get cart with or without shipping addresses
 * GET /api/cart?shipping=true
 * OR
 * GET /api/cart
 */
const handleGet = async (req: NextApiRequest, res: NextApiResponse) => {
  const { shipping } = req.query;
  const session = await getServerSession(req, res, authOptions);

  const cart = shipping
    ? await getCartWithShipping({ cookies: req.cookies, session })
    : await getCart({ cookies: req.cookies, session });

  res.status(200).json(cart);
};

/**
 * updated cart with line items
 * - increment OR set quantity of a line item
 * Update quantity: PUT /api/cart { productId: string, quantity: number }
 * OR
 * Increment: PUT /api/cart { productId: string }
 */
const handlePut = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const isUpdateQuantity = typeof req.body.quantity === "number";

    if (isUpdateQuantity) {
      const validation = changeCartQtySchema.safeParse(req.body);
      if (!validation.success) {
        res.status(400).json({ error: validation.error.errors[0].message });
        return;
      }

      await setCartItemQty({
        ...validation.data,
        req,
        res,
      });
    } else {
      const validation = incrementCartQtySchema.safeParse(req.body);
      if (!validation.success) {
        res.status(400).json({ error: validation.error.errors[0].message });
        return;
      }

      await incrementCartItemQty({
        ...validation.data,
        req,
        res,
      });
    }

    const session = await getServerSession(req, res, authOptions);
    const cart = await getCartWithShipping({ cookies: req.cookies, session });

    res.status(200).json(cart);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to update cart";
    res.status(500).json({ error: message });
  }
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case "GET":
      return handleGet(req, res);

    case "PUT":
      return handlePut(req, res);

    default:
      return res.status(405).json({ error: "Method not allowed" });
  }
}
