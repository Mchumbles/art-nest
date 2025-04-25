import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import jwt, { JwtPayload } from "jsonwebtoken";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }

  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    return res
      .status(500)
      .json({ error: "Server configuration error: Missing JWT_SECRET" });
  }

  try {
    const decodedToken = jwt.verify(token, jwtSecret) as JwtPayload;

    if (!decodedToken.userId) {
      return res.status(401).json({ error: "Unauthorized: Invalid token" });
    }

    const { userId } = decodedToken;

    const exhibitions = await prisma.exhibition.findMany({
      where: { userId },
    });

    return res.status(200).json(exhibitions);
  } catch (error) {
    console.error("Error fetching exhibitions:", error);
    return res.status(500).json({ error: "Something went wrong" });
  }
}
