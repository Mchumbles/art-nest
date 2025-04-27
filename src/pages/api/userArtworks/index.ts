import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import jwt, { JwtPayload } from "jsonwebtoken";

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
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

    if (request.method === "POST") {
      const { title, artist, date, image, url, exhibitionId } = request.body;

      if (!title || !artist || !date || !image || !url || !exhibitionId) {
        return response.status(400).json({ error: "Missing required fields" });
      }

      const newArtwork = await prisma.artwork.create({
        data: {
          title,
          artist,
          date: new Date(date),
          image,
          url,
          exhibitionId,
        },
      });

      return response.status(201).json(newArtwork);
    }

    if (request.method === "DELETE") {
      const { id } = request.query;

      if (!id) {
        return response.status(400).json({ error: "Artwork ID is required" });
      }

      const deletedArtwork = await prisma.artwork.delete({
        where: { id: String(id) },
      });

      return response
        .status(200)
        .json({ message: "Artwork deleted successfully", deletedArtwork });
    }

    return response.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    console.error("Error:", error);
    return response.status(500).json({ error: "Something went wrong" });
  }
}
