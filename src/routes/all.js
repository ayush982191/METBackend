
import express from "express";
import { allUser } from "../controllers/all.js";
const app = express.Router();

app.get("/",allUser)

export default app;