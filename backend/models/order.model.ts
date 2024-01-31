import { Model, Schema, model } from "mongoose";
import { IDiscountCode } from "./discount.model";
import { IProduct } from "./product.model";

export interface IOrder extends Document {
    products: IProduct[];
    discountCode: IDiscountCode;
    transactionCompleted: boolean;
}

const OrderSchema: Schema = new Schema<IOrder>({
    products: [{ type: Schema.Types.ObjectId, ref: "ProductModel" }],
    discountCode: { type: Schema.Types.ObjectId, ref: "DiscountModel" },
    transactionCompleted: { type: Boolean, default: false },
});

export const OrderModel: Model<IOrder> = model<IOrder>("orders", OrderSchema);
