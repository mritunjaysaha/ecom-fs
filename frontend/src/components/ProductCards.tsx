import { FC } from "react";
import { Products } from "../types/Products";

export const ProductCards: FC<Products> = ({ id, name, price }) => {
    return (
        <div
            data-product-id={id}
            className="flex flex-col flex-1 gap-2 w-96 border p-4 rounded-md"
        >
            <h3 className="text-2xl font-bold">{name}</h3>
            <p className="text-xl">${price}</p>
            <button data-add className="border rounded-full p-2 text-white">
                Add to cart
            </button>
        </div>
    );
};
