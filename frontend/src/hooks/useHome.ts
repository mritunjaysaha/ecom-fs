import { useEffect } from "react";
import { axiosInstance } from "../config/axios";
import { useDispatch, useSelector } from "../redux/store";
import { addProductsToState } from "../redux/slices/appSlice";

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

    useEffect(() => {
        getProducts();
    }, []);

    return {
        products,
        productsArr,
    };
};
