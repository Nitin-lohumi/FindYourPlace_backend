import express from "express";
const SaveRoute = express.Router();
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
SaveRoute.post("/data", async (req, res) => {
    try {
        const { SaveObject, userId = "685536e343df965e0a4e1087" } = req.body;
        if (!SaveObject.id) {
            return res.status(404).json({ msg: "not found id", status: false });
        }
        const save = await prisma.savedPlace.create({
            data: {
                placeId: SaveObject.id,
                photoUrl: SaveObject.originalPhoto || null,
                placeData: SaveObject,
                userId: userId,
            }
        });
        res.status(201).json({ message: "Place saved successfully", data: save });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: "Internal server error" });
    }
});
SaveRoute.delete("/RemoveFromSave", async (req, res) => {
    try {
        const { placeId = "ChIJzYd9IyljXw0RkVC3r0fMcuY", userId = "685536e343df965e0a4e1087" } = req.body;

        if (!placeId || !userId) {
            return res.status(400).json({ message: "placeId and userId are required", status: false });
        }
        const UnSavePlace = await prisma.savedPlace.deleteMany({
            where: {
                placeId,
                userId
            }
        });
        if (UnSavePlace.count === 0) {
            return res.status(200).json({ message: "No matching saved place found to delete", status: true });
        }
        res.status(200).json({ message: "Place removed from saved places", status: true });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", status: false });
    }
})
export default SaveRoute;