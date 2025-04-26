import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { CreateUserRequest } from "@/types/users";
import bcrypt from "bcryptjs";

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  if (request.method === "POST") {
    const { email, password, username }: CreateUserRequest = request.body;

    if (!email || !password) {
      return response
        .status(400)
        .json({ error: "Email and password are required" });
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          username,
        },
      });

      return response.status(201).json(newUser);
    } catch (error) {
      return response.status(500).json({ error: "Something went wrong" });
    }
  }
}
