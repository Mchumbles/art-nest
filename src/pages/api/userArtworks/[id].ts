import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import jwt, { JwtPayload } from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET!;

const verifyToken = (
  request: NextApiRequest,
  response: NextApiResponse
): JwtPayload | null => {
  const token = request.headers.authorization?.split(" ")[1];

  if (!token) {
    response.status(401).json({ error: "Unauthorized: No token provided" });
    return null;
  }

  if (!SECRET) {
    response
      .status(500)
      .json({ error: "Server configuration error: Missing JWT_SECRET" });
    return null;
  }

  try {
    const decodedToken = jwt.verify(token, SECRET) as JwtPayload;
    if (!decodedToken.userId) {
      response.status(401).json({ error: "Unauthorized: Invalid token" });
      return null;
    }
    return decodedToken;
  } catch (error) {
    response.status(401).json({ error: "Unauthorized: Invalid token" });
    return null;
  }
};

const getArtworkAndCheckOwnership = async (
  id: string,
  userId: string,
  response: NextApiResponse
) => {
  const artwork = await prisma.artwork.findUnique({
    where: { id },
    include: {
      exhibition: true,
      user: true,
    },
  });

  if (!artwork) {
    response.status(404).json({ error: "Artwork not found" });
    return null;
  }

  if (artwork.user && artwork.user.id !== userId) {
    response
      .status(403)
      .json({ error: "You are not authorized to modify this artwork" });
    return null;
  }

  return artwork;
};

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  const { id } = request.query;

  const handleGet = async () => {
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
  };

  const handlePut = async () => {
    // const decodedToken = verifyToken(request, response);
    // if (!decodedToken) return; // Error response is already handled in verifyToken
    //
    // try {
    //   const userId = decodedToken.userId;
    //   const artwork = await getArtworkAndCheckOwnership(
    //     id as string,
    //     userId,
    //     response
    //   );
    //   if (!artwork) return; // Error response is already handled
    //
    //   const { title, artist, image, date } = request.body;
    //
    //   const updatedArtwork = await prisma.artwork.update({
    //     where: { id: id as string },
    //     data: {
    //       title: title || artwork.title,
    //       artist: artist || artwork.artist,
    //       image: image || artwork.image,
    //       date: date || artwork.date, // Keep original date type (string or null)
    //     },
    //   });
    //
    //   return response.status(200).json({ updatedArtwork });
    // } catch (error: any) {
    //   console.error("Error updating artwork:", error);
    //   return response.status(500).json({ error: "Something went wrong" });
    // }
    return response.status(405).json({ error: "PUT method is disabled" });
  };

  const handleDelete = async () => {
    const decodedToken = verifyToken(request, response);
    if (!decodedToken) return;

    try {
      const userId = decodedToken.userId;
      const artwork = await getArtworkAndCheckOwnership(
        id as string,
        userId,
        response
      );
      if (!artwork) return;

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
  };

  switch (request.method) {
    case "GET":
      await handleGet();
      break;
    case "PUT":
      await handlePut();
      break;
    case "DELETE":
      await handleDelete();
      break;
    default:
      response.status(405).json({ error: "Method not allowed" });
  }
}
