import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import jwt, { JwtPayload } from "jsonwebtoken";
import { ArtObject } from "@/types/artworks";

const SECRET = process.env.JWT_SECRET!;

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  const { exhibitionId } = request.query;

  if (request.method === "POST") {
    const token = request.headers.authorization?.split(" ")[1];
    if (!token) {
      return response
        .status(401)
        .json({ error: "Unauthorized: No token provided" });
    }

    try {
      const decodedToken = jwt.verify(token, SECRET) as JwtPayload;
      const userId = decodedToken.userId;

      const externalArtworkData: ArtObject = request.body;

      if (
        !externalArtworkData.id ||
        !externalArtworkData.title ||
        !externalArtworkData.artist
      ) {
        return response
          .status(400)
          .json({ error: "Missing required artwork data" });
      }

      const newArtwork = await prisma.artwork.create({
        data: {
          id: externalArtworkData.id,
          title: externalArtworkData.title,
          artist: externalArtworkData.artist,
          date: externalArtworkData.date || "",
          image: externalArtworkData.image,
          url: externalArtworkData.url,
          source: externalArtworkData.source,
          description: externalArtworkData.description,
          medium: externalArtworkData.medium,
          culture: externalArtworkData.culture,
          creditLine: externalArtworkData.creditLine,
          objectWikidata_URL: externalArtworkData.objectWikidata_URL,
          exhibitionId: exhibitionId as string,
          userId: userId,
        },
      });

      return response.status(201).json({ artwork: newArtwork });
    } catch (error: any) {
      console.error("Error adding external artwork:", error);
      if (error.code === "P2002") {
        return response.status(409).json({
          error:
            "This artwork is already in the exhibition or has been added previously.",
        });
      }
      return response
        .status(500)
        .json({ error: "Something went wrong while adding the artwork." });
    }
  } else {
    return response.status(405).json({ error: "Method not allowed" });
  }
}
