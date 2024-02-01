import { Model, Schema, model } from "mongoose";
import { IDiscountCode } from "./discount.model";
import { IProduct } from "./product.model";

export interface IOrder extends Document {
    id: string;
    products: IProduct[];
    totalAmount: number;
    discountCode: IDiscountCode;
    transactionCompleted: boolean;
}

const OrderSchema: Schema = new Schema<IOrder>({
    id: { type: String, required: true },
    products: [{ type: Schema.Types.ObjectId, ref: "ProductModel" }],
    totalAmount: { type: Number },
    discountCode: { type: Schema.Types.ObjectId, ref: "DiscountModel" },
    transactionCompleted: { type: Boolean, default: false },
});

export const OrderModel: Model<IOrder> = model<IOrder>("orders", OrderSchema);
