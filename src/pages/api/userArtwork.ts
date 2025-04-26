import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import jwt, { JwtPayload } from "jsonwebtoken";

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  if (request.method !== "POST") {
    return response.status(405).json({ error: "Method not allowed" });
  }

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
  } catch (error) {
    console.error("Error creating artwork:", error);
    return response.status(500).json({ error: "Something went wrong" });
  }
}
