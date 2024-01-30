import { Request, Response } from "express";
import { ProductModel } from "../models/product.model";

export const addProduct = async (req: Request, res: Response) => {
    try {
        const product = new ProductModel(req.body);
        const savedProduct = await product.save();

        if (savedProduct) {
            return res.json({
                success: true,
                message: "product added",
            });
        } else {
            return res.json({
                success: false,
                message: "failed to add product",
            });
        }
    } catch (err: any) {
        return res
            .status(400)
            .json({ error: err.message, message: "Sign up failed" });
    }
};
