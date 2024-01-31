import { Request, Response } from "express";
import { DiscountModel } from "../models/discount.model";
import { OrderModel } from "../models/order.model";

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
