import express from "express";
const SaveRoute = express.Router();
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
SaveRoute.post("/data", async (req, res) => {
    try {
        const { SaveObject, userId } = req.body;
        if (!SaveObject?.id) {
            return res.status(400).json({ message: "Place ID missing", status: false });
        }
        const placeId = SaveObject.id;
        const existingPlace = await prisma.savedPlace.findFirst({
            where: { placeId },
        });
        if (existingPlace) {
            if (existingPlace.userIds.includes(userId)) {
                return res.status(200).json({
                    message: "You already saved this place.",
                    alreadySaved: true,
                });
            }
            await prisma.savedPlace.update({
                where: { id: existingPlace.id },
                data: {
                    userIds: { push: userId },
                },
            });

            await prisma.user.update({
                where: { id: userId },
                data: {
                    savedPlace: { push: placeId },
                },
            });

            return res.status(200).json({
                message: "Added to your saved places",
                alreadySaved: false,
            });
        }
        const newPlace = await prisma.savedPlace.create({
            data: {
                placeId,
                photoUrl: SaveObject.originalPhoto || null,
                placeData: SaveObject,
                userIds: [userId],
            },
        });
        await prisma.user.update({
            where: { id: userId },
            data: {
                savedPlace: { push: placeId },
            },
        });
        return res.status(201).json({
            message: "Place saved successfully",
            alreadySaved: false,
            data: newPlace,
        });
    } catch (error) {
        console.error("Save error:", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
});


SaveRoute.delete("/RemoveFromSave/:placeId/:userId", async (req, res) => {
    try {
        const { placeId, userId } = req.params;
        if (!placeId || !userId) {
            return res.status(400).json({
                message: "placeId and userId are required",
                status: false,
            });
        }
        const savedPlace = await prisma.savedPlace.findFirst({
            where: { placeId },
        });

        if (!savedPlace) {
            return res.status(404).json({
                message: "Saved place not found",
                status: false,
            });
        }
        const updatedUserIds = savedPlace.userIds.filter((id) => id !== userId);

        if (updatedUserIds.length === 0) {
            await prisma.savedPlace.delete({
                where: { id: savedPlace.id },
            });
        } else {
            await prisma.savedPlace.update({
                where: { id: savedPlace.id },
                data: {
                    userIds: updatedUserIds,
                },
            });
        }
        const user = await prisma.user.findUnique({
            where: { id: userId },
        });
        if (user) {
            const updatedPlaceIds = user.savedPlace.filter((id) => id !== placeId);
            await prisma.user.update({
                where: { id: userId },
                data: {
                    savedPlace: updatedPlaceIds,
                },
            });
        }
        res.status(200).json({
            message: "Place removed from saved list",
            status: true,
        });
    } catch (error) {
        console.error("Delete error:", error.message);
        res.status(500).json({
            message: "Internal server error",
            status: false,
        });
    }
});


SaveRoute.post("/check/isSaved", async (req, res) => {
    try {
        const { placeId, userId } = req.body;
        if (!placeId || !userId) {
            return res.status(400).json({ message: "placeId and userId are required", Save: false });
        }
        const savedPlace = await prisma.savedPlace.findFirst({
            where: { placeId },
        });
        if (!savedPlace) {
            return res.status(200).json({ Save: false });
        }
        const isSaved = savedPlace.userIds.includes(userId);
        res.status(200).json({
            Save: isSaved
        });
    } catch (error) {
        console.error("Check save error:", error.message);
        res.status(500).json({ message: "Internal server error", isSaved: false });
    }
});



export default SaveRoute;