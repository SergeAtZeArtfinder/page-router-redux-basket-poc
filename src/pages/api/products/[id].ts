import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/db/prisma";
import { formatDateToString } from "@/lib/format";
import { updateProductSchema } from "@/lib/validation/product";

const handleGet = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;

  if (typeof id !== "string") {
    res.status(400).json({ error: "Invalid ID" });
    return;
  }

  try {
    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      res.status(404).json({ error: "Product not found" });
      return;
    }

    res.status(200).json(formatDateToString(product));
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Internal server error";
    res.status(500).json({ error: message });
  }
};

const handlePut = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;

  if (typeof id !== "string") {
    res.status(400).json({ error: "Invalid ID" });
    return;
  }

  const validation = updateProductSchema.safeParse(req.body);
  if (!validation.success) {
    res.status(400).json({ error: validation.error.errors[0].message });
    return;
  }

  try {
    const product = await prisma.product.update({
      where: { id },
      data: validation.data,
    });

    const formatted = formatDateToString(product);

    res.status(200).json(formatted);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Internal server error";
    res.status(500).json({ error: message });
  }
};

const handleDelete = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;

  if (typeof id !== "string") {
    res.status(400).json({ error: "Invalid ID" });
    return;
  }

  try {
    await prisma.product.delete({
      where: { id },
    });

    res.status(200).json({ id });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Internal server error";
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

    case "DELETE":
      return handleDelete(req, res);

    default:
      return res.status(405).json({ error: "Method not allowed" });
  }
}
