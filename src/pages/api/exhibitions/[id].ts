import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import jwt, { JwtPayload } from "jsonwebtoken";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  if (req.method === "DELETE") {
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

      const exhibition = await prisma.exhibition.findUnique({
        where: { id: id as string },
      });

      if (!exhibition) {
        return res.status(404).json({ error: "Exhibition not found" });
      }

      await prisma.exhibition.delete({
        where: { id: id as string },
      });

      return res
        .status(200)
        .json({ message: "Exhibition deleted successfully" });
    } catch (error) {
      console.error("Error deleting exhibition:", error);
      return res.status(500).json({ error: "Something went wrong" });
    }
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}
