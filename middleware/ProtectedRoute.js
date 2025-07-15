import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
export const authMiddleWare = async (req, res, next) => {
  const token = req.cookies?.google_id_token;
  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token provided", Authenticate: false });
  }
  try {
    const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET);
    const { id, email, name, image } = decoded;
    const existingUser = await prisma.user.findUnique({
      where: { id },
    });
    if (!existingUser) {
      await prisma.user.create({
        data: { id, email, name, image },
      });
    }
    req.user = { id, email, name, image };
    next();
  } catch (error) {
    console.error("JWT verify error:", error);
    return res.status(403).json({ message: "Invalid or expired token", Authenticate: false });
  }
};
