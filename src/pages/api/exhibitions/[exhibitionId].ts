import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import jwt, { JwtPayload } from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET!;

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  const { exhibitionId } = request.query;

  if (request.method === "GET") {
    try {
      const exhibition = await prisma.exhibition.findUnique({
        where: { id: exhibitionId as string },
      });

      if (!exhibition) {
        return response.status(404).json({ error: "Exhibition not found" });
      }

      return response.status(200).json(exhibition);
    } catch (error) {
      console.error("Error fetching exhibition:", error);
      return response
        .status(500)
        .json({ error: "Something went wrong while fetching the exhibition." });
    }
  } else if (request.method === "PUT") {
    const token = request.headers.authorization?.split(" ")[1];
    if (!token) {
      return response
        .status(401)
        .json({ error: "Unauthorized: No token provided" });
    }

    try {
      const decodedToken = jwt.verify(token, SECRET) as JwtPayload;
      const userId = decodedToken.userId;

      const { title, location, category } = request.body;

      const updatedExhibition = await prisma.exhibition.update({
        where: { id: exhibitionId as string, userId: userId },
        data: { title, location, category },
      });

      return response.status(200).json(updatedExhibition);
    } catch (error: any) {
      if (error.code === "P2025") {
        return response
          .status(404)
          .json({ error: "Exhibition not found or you are not the owner" });
      }
      return response
        .status(500)
        .json({ error: "Something went wrong while updating the exhibition." });
    }
  } else if (request.method === "DELETE") {
    const token = request.headers.authorization?.split(" ")[1];
    if (!token) {
      return response
        .status(401)
        .json({ error: "Unauthorized: No token provided" });
    }

    try {
      const decodedToken = jwt.verify(token, SECRET) as JwtPayload;
      const userId = decodedToken.userId;

      const deletedExhibition = await prisma.exhibition.delete({
        where: { id: exhibitionId as string, userId: userId },
      });

      if (!deletedExhibition) {
        return response
          .status(404)
          .json({ error: "Exhibition not found or you are not the owner" });
      }

      return response
        .status(200)
        .json({ message: "Exhibition deleted successfully" });
    } catch (error: any) {
      console.error("Error deleting exhibition:", error);
      if (error.code === "P2025") {
        return response
          .status(404)
          .json({ error: "Exhibition not found or you are not the owner" });
      }
      return response
        .status(500)
        .json({ error: "Something went wrong while deleting the exhibition." });
    }
  } else {
    return response.status(405).json({ error: "Method not allowed" });
  }
}
