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
exports.getProducts = exports.addProduct = void 0;
const product_model_1 = require("../models/product.model");
const addProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const product = new product_model_1.ProductModel(req.body);
        const savedProduct = yield product.save();
        if (savedProduct) {
            return res.json({
                success: true,
                message: "product added",
            });
        }
        else {
            return res.json({
                success: false,
                message: "failed to add product",
            });
        }
    }
    catch (err) {
        return res
            .status(400)
            .json({ error: err.message, message: "Sign up failed" });
    }
});
exports.addProduct = addProduct;
const getProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.profile;
        const { offset, limit } = req.query;
        const sortBy = req.query.sortBy;
        const parsedOffset = parseInt(offset);
        const parsedLimit = parseInt(limit);
        const sortOrder = sortBy === "ASC" ? 1 : -1;
        const skip = parsedOffset > 0 ? (parsedOffset - 1) * parsedLimit : 0;
        const products = yield product_model_1.ProductModel.find({})
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
    }
    catch (err) {
        console.log(err);
        return res.status(400).json({
            success: false,
            message: "Failed to fetch products",
            error: err,
        });
    }
});
exports.getProducts = getProducts;
//# sourceMappingURL=product.controller.js.map