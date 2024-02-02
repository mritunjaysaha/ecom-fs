"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderModel = void 0;
const mongoose_1 = require("mongoose");
const OrderSchema = new mongoose_1.Schema({
    id: { type: String, required: true },
    products: [
        {
            product: { type: mongoose_1.Schema.Types.ObjectId, ref: "ProductModel" },
            quantity: { type: Number, default: 0 },
        },
    ],
    totalAmount: { type: Number },
    discountCode: { type: mongoose_1.Schema.Types.ObjectId, ref: "DiscountModel" },
    transactionCompleted: { type: Boolean, default: false },
});
exports.OrderModel = (0, mongoose_1.model)("orders", OrderSchema);
//# sourceMappingURL=order.model.js.map