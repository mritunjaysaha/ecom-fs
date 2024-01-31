import { Model, Schema, model } from "mongoose";
import { IUser } from "./user.model";

export interface IDiscountCode extends Document {
    code: string;
    generatedBy: IUser;
}

const DiscountSchema: Schema = new Schema<IDiscountCode>({
    code: {
        type: String,
        required: true,
    },
    generatedBy: {
        type: Schema.Types.ObjectId,
        ref: "UserModel",
    },
});

export const DiscountModel: Model<IDiscountCode> = model<IDiscountCode>(
    "discount-codes",
    DiscountSchema
);
