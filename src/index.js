import express from "express";
import "dotenv/config.js";
import API_route from "../routes/nearBy.js";
import SaveRoute from "../routes/SaveRoute.js";
import cors from "cors";
import getDataRoute from "../routes/GetData.js";
const port = process.env.PORT;
const app = express();
app.use(cors());
app.use(express.json());
app.use("/api", API_route);
app.use("/save", SaveRoute);
app.use("/get", getDataRoute);
app.listen(port, () => {
    console.log("listing at port number ", port);
})