import { Request, Response } from "express";
import { ProductModel } from "../models/product.model";
import { RequestWithProfile } from "../types/RequestWithProfile";
import { SortBy } from "../types/SortBy";

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

export const getProducts = async (req: RequestWithProfile, res: Response) => {
    try {
        const { email } = req.profile;
        const { offset, limit } = req.query;
        const sortBy = req.query.sortBy as SortBy;

        const parsedOffset = parseInt(offset as string);
        const parsedLimit = parseInt(limit as string);
        const sortOrder = sortBy === "ASC" ? 1 : -1;

        const skip = parsedOffset > 0 ? (parsedOffset - 1) * parsedLimit : 0;

        const products = await ProductModel.find({})
            .skip(skip)
            .limit(parsedLimit)
            .sort({ createdAt: sortOrder })
            .exec();

        if (!products) {
            return res.status(400).json({
                success: false,
                message: `Failed to get todos for ${email}`,
            });
        }

        return res.json({
            success: true,
            message: "Products fetched successfully",
            products: products,
        });
    } catch (err) {
        console.log(err);
        return res.status(400).json({
            success: false,
            message: "Failed to fetch products",
            error: err,
        });
    }
};
