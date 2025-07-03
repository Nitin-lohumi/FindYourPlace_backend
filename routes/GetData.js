import express from "express";
const getDataRoute = express.Router();
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
getDataRoute.get("/SaveData/:userId", async (req, res) => {
    try {
        const { userId } = req.params;
        if (!userId && !userPlaceId) {
            return res.status(404).json({ message: "Failed to find the user id or use place id", status: false });
        }
        const data = await prisma.savedPlace.findMany({ where: { userId: String(userId) } });
        if (!data.length) return res.status(200).json({ message: "No item to show", status: true });
        res.status(200).json({ data: data, status: true });
    } catch (error) {
        res.status(500).json({ message: " Data  is failed to getted", status: false });
    }
});
export default getDataRoute;