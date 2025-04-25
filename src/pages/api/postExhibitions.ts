import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const SECRET = process.env.JWT_SECRET!;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { title, location, category } = req.body;

  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: "No auth token provided" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, SECRET) as { userId: string };

    const exhibition = await prisma.exhibition.create({
      data: {
        title,
        location,
        category,
        userId: decoded.userId,
      },
    });

    res.status(201).json({ exhibition });
  } catch (err) {
    console.error(err);
    res.status(401).json({ error: "Invalid token" });
  }
}
