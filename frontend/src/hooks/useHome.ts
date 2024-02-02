import { MouseEventHandler, useEffect } from "react";
import { axiosInstance } from "../config/axios";
import { addProductsToState, addToCart } from "../redux/slices/appSlice";
import { useDispatch, useSelector } from "../redux/store";

export const useHome = () => {
    const dispatch = useDispatch();
    const { email } = useSelector((state) => state.user);
    const { products, productsArr } = useSelector((state) => state.app);

    const getProducts = async () => {
        const { data } = await axiosInstance(
            `/products/${email}?offset=0&limit=10&sortBy=ASC`
        );

        dispatch(addProductsToState(data.products));
    };

    const handleAddToCartClick: MouseEventHandler<HTMLElement> = (e) => {
        const target = e.target as HTMLElement;

        const addToCartBtn = target.closest(
            "button[data-add-cart]"
        ) as HTMLElement;
        const productDiv = target.closest(
            "div[data-product-id]"
        ) as HTMLElement;

        const productId = productDiv?.dataset?.productId;

        console.log({ addToCartBtn, productDiv, productId });

        if (addToCartBtn && productId) {
            dispatch(addToCart(productId));
        }
    };

    useEffect(() => {
        getProducts();
    }, []);

    return {
        products,
        productsArr,
        handleAddToCartClick,
    };
};
