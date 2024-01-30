require("dotenv").config();

import express from "express";

import cookieParser from "cookie-parser";
import cors from "cors";

import { connectDB } from "./config/db.config";
import authRoutesV1 from "./routes/v1/auth.routes";
import discountCodeRoutesV1 from "./routes/v1/discount.routes";
import productRoutesV1 from "./routes/v1/product.routes";

// INITIALIZE APP
const app = express();

// CONNECT DB
connectDB();

// INITIALIZE MIDDLEWARE
app.use(cors({ origin: true }));
app.use(cookieParser());
app.use(express.json());

// ROUTES
app.use("/api/v1/auth", authRoutesV1);
app.use("/api/v1/products", productRoutesV1);
app.use("/api/v1/discount-code", discountCodeRoutesV1);

app.get("/", (req, res) => {
    res.send("server up and running");
});

export { app };
