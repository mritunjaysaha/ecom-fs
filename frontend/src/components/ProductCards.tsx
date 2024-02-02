import { FC } from "react";
import { useSelector } from "../redux/store";
import { Products } from "../types/Products";

export const ProductCards: FC<Products> = ({ id, name, price }) => {
    const { itemsQuantity } = useSelector((state) => state.app.cart);

    const quantity = itemsQuantity[id];

    return (
        <div
            data-product-id={id}
            className="flex flex-col gap-2 w-96 border p-4 rounded-md"
        >
            <h3 className="text-2xl font-bold">{name}</h3>
            <p className="text-xl">${price}</p>
            {!quantity ? (
                <button
                    data-add-cart
                    className="border rounded-full p-2 bg-black text-white"
                >
                    Add to cart
                </button>
            ) : (
                <div className="flex items-center justify-between w-3/4 mx-auto mb-4">
                    <button data-remove-from-cart className="text-4xl">
                        {" "}
                        -{" "}
                    </button>
                    <span className="text-xl font-semibold">{quantity}</span>
                    <button data-add-cart className="text-4xl">
                        {" "}
                        +{" "}
                    </button>
                </div>
            )}
        </div>
    );
};
