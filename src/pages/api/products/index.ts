import prisma from "@/lib/db/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { formatDateToString } from "@/lib/format";
import { createProductSchema } from "@/lib/validation/product";

const handleGet = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const products = await prisma.product.findMany();
    const formatted = products.map((product) => formatDateToString(product));

    res.status(200).json(formatted);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch products";
    res.status(500).json({ error: message });
  }
};

const handlePost = async (req: NextApiRequest, res: NextApiResponse) => {
  const validation = createProductSchema.safeParse(req.body);
  if (!validation.success) {
    res.status(400).json({ error: validation.error });
    return;
  }

  try {
    const product = await prisma.product.create({
      data: validation.data,
    });

    const formatted = formatDateToString(product);

    res.status(201).json(formatted);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to create product";
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

    case "POST":
      return handlePost(req, res);
    default:
      return res.status(405).json({ error: "Method not allowed" });
  }
}
