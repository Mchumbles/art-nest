import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import jwt, { JwtPayload } from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET!;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
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

  if (req.method === "POST") {
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
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}
