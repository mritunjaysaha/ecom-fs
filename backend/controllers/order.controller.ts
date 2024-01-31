import { Request, Response } from "express";
import { DiscountModel } from "../models/discount.model";
import { OrderModel } from "../models/order.model";
import { ProductModel } from "../models/product.model";

export const getOrderSummary = async (req: Request, res: Response) => {
    try {
        const itemCount = await OrderModel.countDocuments();

        const totalPurchaseAmount = await OrderModel.aggregate([
            {
                $group: {
                    _id: null,
                    totalAmount: { $sum: { $size: "$items" } },
                },
            },
        ]);

        const discountCodes = await DiscountModel.find();

        const totalDiscountAmount = await OrderModel.aggregate([
            {
                $match: {
                    discountCode: { $exists: true },
                },
            },
            {
                $lookup: {
                    from: "discountcodes",
                    localField: "discountCode",
                    foreignField: "_id",
                    as: "discountInfo",
                },
            },
            {
                $unwind: "$discountInfo",
            },
            {
                $group: {
                    _id: null,
                    totalDiscount: { $sum: 1 },
                },
            },
        ]);

        res.json({
            itemCount,
            totalPurchaseAmount: totalPurchaseAmount[0]
                ? totalPurchaseAmount[0].totalAmount
                : 0,
            discountCodes,
            totalDiscountAmount: totalDiscountAmount[0]
                ? totalDiscountAmount[0].totalDiscount
                : 0,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const addToCart = async (req: Request, res: Response) => {
    try {
        const { productIds } = req.body;

        // Check if productIds is an array
        if (!Array.isArray(productIds)) {
            return res.status(400).json({
                error: "Invalid request. productIds must be an array.",
            });
        }

        // Create a new order
        const newOrder = new OrderModel();

        for (const productId of productIds) {
            const product = await ProductModel.findById(productId);

            if (!product) {
                return res
                    .status(404)
                    .json({ error: `Product with ID ${productId} not found.` });
            }

            newOrder.products.push(productId);
        }

        await newOrder.save();

        res.json({
            success: true,
            message: "Products added to cart successfully.",
            order: newOrder,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
