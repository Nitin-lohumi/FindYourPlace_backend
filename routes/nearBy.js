import express, { json } from "express";
import SearchNearBy from "../services/SearchNearBy.js";
import GetPlaceDetails from "../services/GetPlaceDetails.js";
import FetchPhoto from "../services/GetPhoto.js";
import getSearchBarText from "../services/SearchBYText.js";
import getRouteInfo from "../services/GetOtherDetails.js";
const API_route = express.Router();
API_route.get("/searchNearBy", async (req, res) => {
    const { lat, long, type, radius } = req.query;
    try {
        const data = await SearchNearBy(lat, long, radius, type);
        res.status(200).json({ data: data, status: true });
    } catch (error) {
        console.error(" Error fetching places:", error.message);
        res.status(500).json({ message: "Failed to fetch nearby places", status: false });
    }
});

API_route.get("/searchBar", async (req, res) => {
    try {
        const { text } = req.query;
        const data = await getSearchBarText(text);
        // const data =text;
        res.status(200).json({ data: data, status: true });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch nearby places", status: false });
    }
})

API_route.get("/placeDetails", async (req, res) => {
    try {
        const { placeid } = req.query;
        const data = await GetPlaceDetails(placeid);
        console.log(data);
        return res.status(200).json({ data: data, status: true });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch nearby places", status: false });
    }
})

API_route.get("/Searching_Type", async (req, res) => {
    try {
        const { type, lat, long } = req.query;
        const data = await SearchNearBy(lat, long, 5000, type);
        res.status(200).json({ data: data, status: true });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch nearby places", status: false });
    }
});

API_route.get("/getRoute", async (req, res) => {
    try {
        const startlng = -0.0349878;
        const startlat = 40.7881744;
        const endlong = 79.458074;
        const endlat = 29.836903;
        const data = await getRouteInfo(startlng, startlat, endlong, endlat);
        res.status(200).json({ data: data, status: true });
    } catch (error) {
        console.error("Error fetching route:", error.message);
        res.status(500).json({ message: "Failed to fetch route", status: false });
    }
});
export default API_route;