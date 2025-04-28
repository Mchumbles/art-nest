import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import jwt, { JwtPayload } from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET!;

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
        include: {
          exhibition: true,
          user: true,
        },
      });

      if (!artwork) {
        return response.status(404).json({ error: "Artwork not found" });
      }

      if (artwork.user && artwork.user.id !== decodedToken.userId) {
        return response
          .status(403)
          .json({ error: "You are not authorized to update this artwork" });
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
  }

  if (request.method === "PUT") {
    const { title, artist, image, date } = request.body;

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
        include: {
          exhibition: true,
          user: true,
        },
      });

      if (!artwork) {
        return response.status(404).json({ error: "Artwork not found" });
      }

      if (artwork.user && artwork.user.id !== decodedToken.userId) {
        return response
          .status(403)
          .json({ error: "You are not authorized to update this artwork" });
      }

      const updatedArtwork = await prisma.artwork.update({
        where: { id: id as string },
        data: {
          title: title || artwork.title,
          artist: artist || artwork.artist,
          image: image || artwork.image,
          date: date ? new Date(date) : artwork.date,
        },
      });

      return response.status(200).json({ updatedArtwork });
    } catch (error) {
      console.error("Error updating artwork:", error);
      return response.status(500).json({ error: "Something went wrong" });
    }
  }

  if (request.method === "GET") {
    try {
      const artwork = await prisma.artwork.findUnique({
        where: { id: id as string },
        include: {
          exhibition: true,
          user: true,
        },
      });

      if (!artwork) {
        return response.status(404).json({ error: "Artwork not found" });
      }

      return response.status(200).json(artwork);
    } catch (error) {
      console.error("Error fetching artwork:", error);
      return response.status(500).json({ error: "Something went wrong" });
    }
  }

  return response.status(405).json({ error: "Method not allowed" });
}
