import { Schema, model } from "mongoose";

export interface IProduct extends Document {
    id: string;
    name: string;
    price: number;
}

const ProductSchema: Schema = new Schema<IProduct>({
    id: {
        type: String,
        required: true,
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

export const ProductModel = model<IProduct>("products", ProductSchema);
