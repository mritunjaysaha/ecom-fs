import { MouseEventHandler, useEffect, useState } from "react";
import { v4 } from "uuid";
import { axiosInstance } from "../config/axios";
import {
    addOrderId,
    addProductsToState,
    addToCart,
    removeFromCart,
} from "../redux/slices/appSlice";
import { useDispatch, useSelector } from "../redux/store";

export const useHome = () => {
    const dispatch = useDispatch();
    const { email, isAuthenticated } = useSelector((state) => state.user);
    const { products, productsArr, cart } = useSelector((state) => state.app);

    const { orderId } = cart;

    const [newOrderId, setNewOrderId] = useState(orderId);

    const getProducts = async () => {
        const { data } = await axiosInstance(
            `/products/${email}?offset=0&limit=10&sortBy=ASC`
        );

        dispatch(addProductsToState(data.products));
    };

    const handleAddToCartClick: MouseEventHandler<HTMLElement> = async (e) => {
        const target = e.target as HTMLElement;

        const addToCartBtn = target.closest(
            "button[data-add-cart]"
        ) as HTMLElement;
        const removeFromCartBtn = target.closest(
            "button[data-remove-from-cart]"
        );
        const productDiv = target.closest(
            "div[data-product-id]"
        ) as HTMLElement;

        const productId = productDiv?.dataset?.productId;

        console.log({ addToCartBtn, productDiv, productId });

        if (addToCartBtn && productId) {
            dispatch(addToCart(productId));

            const { data } = await axiosInstance.post(
                `${import.meta.env.VITE_BASE_URL}/orders/${email}/add-to-cart`,
                {
                    id: newOrderId,
                    productIds: [productId],
                }
            );

            if (!data.success) {
                console.error("failed to update order", data?.message);
            }
        } else if (removeFromCartBtn && productId) {
            dispatch(removeFromCart(productId));

            const { data } = await axiosInstance.post(
                `${
                    import.meta.env.VITE_BASE_URL
                }/orders/${email}/remove-from-cart`,
                {
                    id: newOrderId,
                    productId: productId,
                }
            );

            if (!data.success) {
                console.error("failed to update order", data?.message);
            }
        }
    };

    useEffect(() => {
        if (isAuthenticated) {
            getProducts();
        }
    }, [isAuthenticated]);

    useEffect(() => {
        if (!newOrderId) {
            const id = v4();
            setNewOrderId(id);
            dispatch(addOrderId(id));
        }
    }, [newOrderId]);

    return {
        products,
        productsArr,
        handleAddToCartClick,
    };
};
