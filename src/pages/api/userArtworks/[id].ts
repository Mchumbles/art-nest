import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import jwt, { JwtPayload } from "jsonwebtoken";

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  const { id } = request.query;

  if (request.method === "DELETE") {
    const token = request.headers.authorization?.split(" ")[1];

    if (!token) {
      return response
        .status(401)
        .json({ error: "Unauthorized: No token provided" });
    }

    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
      return response
        .status(500)
        .json({ error: "Server configuration error: Missing JWT_SECRET" });
    }

    try {
      const decodedToken = jwt.verify(token, jwtSecret) as JwtPayload;
      if (!decodedToken.userId) {
        return response
          .status(401)
          .json({ error: "Unauthorized: Invalid token" });
      }

      const artwork = await prisma.artwork.findUnique({
        where: { id: id as string },
      });

      if (!artwork) {
        return response.status(404).json({ error: "Artwork not found" });
      }

      await prisma.artwork.delete({
        where: { id: id as string },
      });

      return response
        .status(200)
        .json({ message: "Artwork deleted successfully" });
    } catch (error) {
      console.error("Error deleting artwork:", error);
      return response.status(500).json({ error: "Something went wrong" });
    }
  } else {
    return response.status(405).json({ error: "Method not allowed" });
  }
}
