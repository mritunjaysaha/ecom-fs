"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductModel = void 0;
const mongoose_1 = require("mongoose");
const ProductSchema = new mongoose_1.Schema({
    id: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        trim: true,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
});
exports.ProductModel = (0, mongoose_1.model)("products", ProductSchema);
//# sourceMappingURL=product.model.js.map