import express from "express";
import "dotenv/config.js";
import API_route from "../routes/nearBy.js";
import SaveRoute from "../routes/SaveRoute.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import getDataRoute from "../routes/GetData.js";
import { authMiddleWare } from "../middleware/ProtectedRoute.js";
const port = process.env.PORT;
const app = express();
app.use(cors({
  origin: ["http://localhost:3000", "https://find-your-place-frontend-omega.vercel.app"],
  credentials: true
}));
app.use(cookieParser());
app.use(express.json());
app.use(authMiddleWare);
app.get("/protected", (req, res) => {
  res.json({ message: "yesspppppp ", user: req.user });
});
app.use("/api", API_route);
app.use("/save", SaveRoute);
app.use("/get", getDataRoute);
app.listen(port, () => {
  console.log("listing at port number ", port);
})