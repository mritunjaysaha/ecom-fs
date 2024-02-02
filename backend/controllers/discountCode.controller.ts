import { Response } from "express";
import { DiscountModel } from "../models/discount.model";
import { RequestWithProfile } from "../types/RequestWithProfile";
import { generateRandomCode } from "../utils/generateRandomCode";

export const generateDiscountCode = async (
    req: RequestWithProfile,
    res: Response
) => {
    try {
        const code = generateRandomCode();

        const discount = new DiscountModel({
            code,
            generatedBy: req.profile._id,
        });

        const savedDiscount = await discount.save();

        if (savedDiscount) {
            return res.json({ success: true, code });
        } else {
            return res.json({
                success: false,
                message: "Failed to generate code",
            });
        }
    } catch (err) {
        console.error(err);

        return res.status(400).json({
            success: false,
            message: "Error while generating discount code",
        });
    }
};

export const getDiscountCode = async (
    req: RequestWithProfile,
    res: Response
) => {
    try {
        const availableCodes = await DiscountModel.find({});

        const { orderCount } = req.profile;
        console.log({ orderCount });
        if (orderCount % 3 === 0) {
            return res.json({
                success: true,
                error: "discount code generated",
                discountCode:
                    availableCodes[
                        Math.floor(Math.random() * availableCodes.length)
                    ].code,
            });
        } else {
            return res.json({
                success: false,
                error: "Discount code cannot be generated",
            });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};
