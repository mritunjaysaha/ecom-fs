require("dotenv").config();

import express from "express";

import cookieParser from "cookie-parser";
import cors from "cors";

import { connectDB } from "./config/db.config";

// INITIALIZE APP
const app = express();

// CONNECT DB
connectDB();

// INITIALIZE MIDDLEWARE
app.use(cors({ origin: true }));
app.use(cookieParser());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("server up and running");
});

export { app };
