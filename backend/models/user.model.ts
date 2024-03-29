import crypto from "crypto";
import { Document, Model, Schema, model } from "mongoose";
import { v1 as uuidV1 } from "uuid";

export interface IUser extends Document {
    firstName: string;
    lastName: string;
    email: string;
    encryptedPassword: string;
    salt: string;
    orders: any;
    discountCode: any;
    role: string;
    orderCount: number;
}

const UserSchema: Schema = new Schema<IUser>(
    {
        firstName: {
            type: String,
            maxlength: 32,
            trim: true,
        },
        lastName: {
            type: String,
            maxlength: 32,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        encryptedPassword: {
            type: String,
            required: true,
        },
        salt: {
            type: String,
        },
        role: {
            type: String,
            enum: ["user", "admin"],
            default: "user",
            required: true,
        },
        discountCode: [{ type: Schema.Types.ObjectId, ref: "DiscountModel" }],
        orders: [{ type: Schema.Types.ObjectId, ref: "OrderModel" }],
        orderCount: { type: Number, default: 0 },
    },
    { timestamps: true }
);

UserSchema.virtual("password")
    .set(function (password) {
        this._password = password;
        this.salt = uuidV1();
        // @ts-ignore
        this.encryptedPassword = this.securePassword(password);
    })
    .get(function () {
        return this._password;
    });

UserSchema.methods = {
    authenticate: function (plainPassword: string) {
        return this.securePassword(plainPassword) === this.encryptedPassword;
    },
    securePassword: function (plainPassword: string) {
        if (!plainPassword) return "";

        try {
            return crypto
                .createHmac("sha256", this.salt)
                .update(plainPassword)
                .digest("hex");
        } catch (err) {
            return "";
        }
    },
};

export const UserModel: Model<IUser> = model<IUser>("users", UserSchema);
