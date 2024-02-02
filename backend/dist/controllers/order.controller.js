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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkout = exports.removeFromCart = exports.addToCart = exports.getOrderSummary = void 0;
const discount_model_1 = require("../models/discount.model");
const order_model_1 = require("../models/order.model");
const product_model_1 = require("../models/product.model");
const user_model_1 = require("../models/user.model");
const console_1 = __importDefault(require("console"));
const getOrderSummary = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const itemCount = yield order_model_1.OrderModel.countDocuments();
        const totalPurchaseAmount = yield order_model_1.OrderModel.aggregate([
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
        const discountCodes = yield discount_model_1.DiscountModel.find();
        const totalDiscountAmount = yield order_model_1.OrderModel.aggregate([
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
    }
    catch (error) {
        console_1.default.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.getOrderSummary = getOrderSummary;
const addToCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { productIds, id } = req.body;
        // Check if productIds is an array
        if (!Array.isArray(productIds)) {
            return res.status(400).json({
                error: "Invalid request. productIds must be an array.",
            });
        }
        // Check if an order with the given id already exists
        const existingOrder = yield order_model_1.OrderModel.findOne({ id });
        // If an order with the given id exists, update it
        if (existingOrder) {
            for (const productId of productIds) {
                const product = yield product_model_1.ProductModel.findOne({ id: productId });
                if (!product) {
                    return res.status(404).json({
                        error: `Product with ID ${productId} not found.`,
                    });
                }
                const existingProduct = existingOrder.products.find((existingProduct) => existingProduct.product.toString() ===
                    product._id.toString());
                // If the product is already in the order, increase its quantity
                if (existingProduct) {
                    existingProduct.quantity += 1;
                }
                else {
                    // If the product is not in the order, add it with quantity 1
                    existingOrder.products.push({
                        product: product._id,
                        quantity: 1,
                    });
                }
                existingOrder.totalAmount += product.price;
            }
            const updatedOrder = yield existingOrder.save();
            if (!updatedOrder) {
                return res.json({
                    success: false,
                    message: "Failed to update the order",
                });
            }
            res.json({
                success: true,
                message: "Order updated successfully.",
            });
        }
        else {
            // Create a new order
            const newOrder = new order_model_1.OrderModel();
            newOrder.id = id;
            let totalAmount = 0;
            for (const productId of productIds) {
                const product = yield product_model_1.ProductModel.findOne({ id: productId });
                if (!product) {
                    return res.status(404).json({
                        error: `Product with ID ${productId} not found.`,
                    });
                }
                totalAmount += product.price;
                newOrder.products.push({
                    product: product._id,
                    quantity: 1,
                });
            }
            newOrder.totalAmount = totalAmount;
            const savedOrder = yield newOrder.save();
            if (!savedOrder) {
                return res.json({
                    success: false,
                    message: "Failed to add products",
                });
            }
            yield user_model_1.UserModel.findOneAndUpdate({ email: req.profile.email }, { $inc: { orderCount: 1 } }, { new: true });
            res.json({
                success: true,
                message: "Products added to cart successfully.",
            });
        }
    }
    catch (error) {
        console_1.default.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.addToCart = addToCart;
const removeFromCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { productId, id } = req.body;
        // Check if productId and id are provided
        if (!productId || !id) {
            return res.status(400).json({
                error: "Invalid request. Both productId and id are required.",
            });
        }
        // Check if an order with the given id exists
        const existingOrder = yield order_model_1.OrderModel.findOne({ id });
        // If an order with the given id exists, update it
        if (existingOrder) {
            const productObj = yield product_model_1.ProductModel.findOne({ id: productId });
            const productIndex = existingOrder.products.findIndex((product) => {
                return product.product.toString() === productObj._id.toString();
            });
            console_1.default.log({ productIndex });
            // If the product is in the order, remove it
            if (productIndex !== -1) {
                const removedProduct = existingOrder.products[productIndex];
                console_1.default.log({ removedProduct });
                existingOrder.totalAmount -= productObj.price;
                if (removedProduct.quantity > 1) {
                    const copyProductsArr = existingOrder.products;
                    console_1.default.log({ copyProductsArr });
                    copyProductsArr[productIndex].quantity -= 1;
                    existingOrder.products = copyProductsArr;
                }
                else {
                    const updatedProducts = existingOrder.products.filter((product) => product.product.toString() !==
                        removedProduct.product.toString());
                    console_1.default.log({ updatedProducts });
                    existingOrder.products = updatedProducts;
                }
            }
            const updatedOrder = yield existingOrder.save();
            if (!updatedOrder) {
                return res.json({
                    success: false,
                    message: "Failed to update the order",
                });
            }
            res.json({
                success: true,
                message: "Product removed from cart successfully.",
            });
        }
        else {
            res.status(404).json({ error: `Order with ID ${id} not found.` });
        }
    }
    catch (error) {
        console_1.default.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.removeFromCart = removeFromCart;
const checkout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { orderId, code } = req.body;
        const discountCodeRes = yield discount_model_1.DiscountModel.findOne({ code: code });
        const order = yield order_model_1.OrderModel.findOne({ id: orderId });
        console_1.default.log({ order });
        if (discountCodeRes) {
            order.discountCode = discountCodeRes._id;
            const finalAmount = order.totalAmount - order.totalAmount * 0.1;
            order.totalAmount = finalAmount;
        }
        order.transactionCompleted = true;
        const updatedOrder = yield order.save();
        if (!updatedOrder) {
            return res.json({ success: false, message: "failed to checkout" });
        }
        return res.json({ success: true, message: "transaction complete" });
    }
    catch (err) {
        console_1.default.error(err);
        return res
            .status(500)
            .json({ success: false, message: "Internal server error" });
    }
});
exports.checkout = checkout;
//# sourceMappingURL=order.controller.js.map