import { Request, Response } from "express";
import { DiscountModel } from "../models/discount.model";
import { OrderModel } from "../models/order.model";
import { ProductModel } from "../models/product.model";
import { UserModel } from "../models/user.model";
import { RequestWithProfile } from "../types/RequestWithProfile";

export const getOrderSummary = async (req: Request, res: Response) => {
    try {
        const itemCount = await OrderModel.countDocuments();

        const totalPurchaseAmount = await OrderModel.aggregate([
            {
                $match: {
                    transactionCompleted: true,
                },
            },
            {
                $group: {
                    _id: null,
                    totalAmount: { $sum: "$totalAmount" },
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

export const addToCart = async (req: RequestWithProfile, res: Response) => {
    try {
        const { productIds, id } = req.body;

        // Check if productIds is an array
        if (!Array.isArray(productIds)) {
            return res.status(400).json({
                error: "Invalid request. productIds must be an array.",
            });
        }

        // Create a new order
        const newOrder = new OrderModel();
        newOrder.id = id;

        let totalAmount = 0;

        for (const productId of productIds) {
            const product = await ProductModel.findById(productId);

            if (!product) {
                return res
                    .status(404)
                    .json({ error: `Product with ID ${productId} not found.` });
            }

            totalAmount += product.price;

            newOrder.products.push(productId);
        }

        newOrder.totalAmount = totalAmount;

        const savedOrder = await newOrder.save();

        if (!savedOrder) {
            return res.json({
                success: false,
                message: "Failed to add products",
            });
        }

        await UserModel.findOneAndUpdate(
            { email: req.profile.email },
            { $inc: { orderCount: 1 } },
            { new: true }
        );

        res.json({
            success: true,
            message: "Products added to cart successfully.",
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const checkout = async (req: Request, res: Response) => {
    try {
        const { orderId, code } = req.body;

        const discountCodeRes = await DiscountModel.findOne({ code: code });

        if (discountCodeRes) {
            await OrderModel.findOneAndUpdate(
                { id: orderId },
                {
                    $set: {
                        discountCode: discountCodeRes._id,
                    },
                },
                { new: true }
            );
        }
        await OrderModel.findOneAndUpdate(
            { id: orderId },
            {
                $set: {
                    transactionCompleted: true,
                },
            },
            { new: true }
        );

        return res.json({ success: true, message: "transaction complete" });
    } catch (err) {
        return res
            .status(500)
            .json({ success: false, message: "Internal server error" });
    }
};
