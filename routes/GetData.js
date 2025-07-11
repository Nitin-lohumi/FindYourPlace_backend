import express from "express";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
const getDataRoute = express.Router();
getDataRoute.get("/SaveData/:userId", async (req, res) => {
    try {
        const { userId } = req.params;
        if (!userId) {
            return res.status(404).json({
                message: "Failed to find the user id",
                status: false,
            });
        }
        const data = await prisma.savedPlace.findMany({
            where: {
                userIds: {
                    has: userId,
                },
            },
        });
        if (!data.length) {
            return res.status(200).json({
                message: "No item to show! Save something first.",
                status: false,
            });
        }
        res.status(200).json({ data, status: true });
    } catch (error) {
        res.status(500).json({
            message: "Data fetching failed: " + error.message,
            status: false,
        });
    }
});

export default getDataRoute;
