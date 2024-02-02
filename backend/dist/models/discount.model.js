"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiscountModel = void 0;
const mongoose_1 = require("mongoose");
const DiscountSchema = new mongoose_1.Schema({
    code: {
        type: String,
        required: true,
    },
    generatedBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "UserModel",
    },
});
exports.DiscountModel = (0, mongoose_1.model)("discount-codes", DiscountSchema);
//# sourceMappingURL=discount.model.js.map