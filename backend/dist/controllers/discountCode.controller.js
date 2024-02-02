"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDiscountCode = exports.generateDiscountCode = void 0;
const discount_model_1 = require("../models/discount.model");
const generateRandomCode_1 = require("../utils/generateRandomCode");
const generateDiscountCode = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const code = (0, generateRandomCode_1.generateRandomCode)();
        const discount = new discount_model_1.DiscountModel({
            code,
            generatedBy: req.profile._id,
        });
        const savedDiscount = yield discount.save();
        if (savedDiscount) {
            return res.json({ success: true, code });
        }
        else {
            return res.json({
                success: false,
                message: "Failed to generate code",
            });
        }
    }
    catch (err) {
        console.error(err);
        return res.status(400).json({
            success: false,
            message: "Error while generating discount code",
        });
    }
});
exports.generateDiscountCode = generateDiscountCode;
const getDiscountCode = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const availableCodes = yield discount_model_1.DiscountModel.find({});
        const { orderCount } = req.profile;
        console.log({ orderCount });
        if (orderCount % 3 === 0) {
            return res.json({
                success: true,
                error: "discount code generated",
                discountCode: availableCodes[Math.floor(Math.random() * availableCodes.length)].code,
            });
        }
        else {
            return res.json({
                success: false,
                error: "Discount code cannot be generated",
            });
        }
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.getDiscountCode = getDiscountCode;
//# sourceMappingURL=discountCode.controller.js.map