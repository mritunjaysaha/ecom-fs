import { Request, Response } from "express";
import { DiscountModel } from "../models/discount.model";
import { OrderModel } from "../models/order.model";
import { ProductModel } from "../models/product.model";
import { UserModel } from "../models/user.model";
import { RequestWithProfile } from "../types/RequestWithProfile";
import console from "console";

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

        // Check if an order with the given id already exists
        const existingOrder = await OrderModel.findOne({ id });

        // If an order with the given id exists, update it
        if (existingOrder) {
            for (const productId of productIds) {
                const product = await ProductModel.findOne({ id: productId });

                if (!product) {
                    return res.status(404).json({
                        error: `Product with ID ${productId} not found.`,
                    });
                }

                const existingProduct = existingOrder.products.find(
                    (existingProduct) =>
                        existingProduct.product.toString() ===
                        product._id.toString()
                );

                // If the product is already in the order, increase its quantity
                if (existingProduct) {
                    existingProduct.quantity += 1;
                } else {
                    // If the product is not in the order, add it with quantity 1
                    existingOrder.products.push({
                        product: product._id,
                        quantity: 1,
                    });
                }

                existingOrder.totalAmount += product.price;
            }

            const updatedOrder = await existingOrder.save();

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
        } else {
            // Create a new order
            const newOrder = new OrderModel();
            newOrder.id = id;

            let totalAmount = 0;

            for (const productId of productIds) {
                const product = await ProductModel.findOne({ id: productId });

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
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const removeFromCart = async (
    req: RequestWithProfile,
    res: Response
) => {
    try {
        const { productId, id } = req.body;

        // Check if productId and id are provided
        if (!productId || !id) {
            return res.status(400).json({
                error: "Invalid request. Both productId and id are required.",
            });
        }

        // Check if an order with the given id exists
        const existingOrder = await OrderModel.findOne({ id });

        // If an order with the given id exists, update it
        if (existingOrder) {
            const productObj = await ProductModel.findOne({ id: productId });

            const productIndex = existingOrder.products.findIndex((product) => {
                return product.product.toString() === productObj._id.toString();
            });

            console.log({ productIndex });
            // If the product is in the order, remove it
            if (productIndex !== -1) {
                const removedProduct = existingOrder.products[productIndex];
                console.log({ removedProduct });
                existingOrder.totalAmount -= productObj.price;
                if (removedProduct.quantity > 1) {
                    const copyProductsArr = existingOrder.products;
                    console.log({ copyProductsArr });
                    copyProductsArr[productIndex].quantity -= 1;

                    existingOrder.products = copyProductsArr;
                } else {
                    const updatedProducts = existingOrder.products.filter(
                        (product) =>
                            product.product.toString() !==
                            removedProduct.product.toString()
                    );

                    console.log({ updatedProducts });
                    existingOrder.products = updatedProducts;
                }
            }

            const updatedOrder = await existingOrder.save();

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
        } else {
            res.status(404).json({ error: `Order with ID ${id} not found.` });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const checkout = async (req: Request, res: Response) => {
    try {
        const { orderId, code } = req.body;

        const discountCodeRes = await DiscountModel.findOne({ code: code });

        const order = await OrderModel.findOne({ id: orderId });

        console.log({ order });

        if (discountCodeRes) {
            order.discountCode = discountCodeRes._id;

            const finalAmount = order.totalAmount - order.totalAmount * 0.1;

            order.totalAmount = finalAmount;
        }

        order.transactionCompleted = true;

        const updatedOrder = await order.save();

        if (!updatedOrder) {
            return res.json({ success: false, message: "failed to checkout" });
        }

        return res.json({ success: true, message: "transaction complete" });
    } catch (err) {
        console.error(err);
        return res
            .status(500)
            .json({ success: false, message: "Internal server error" });
    }
};
