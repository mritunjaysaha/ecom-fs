import { useEffect, useState } from "react";
import { axiosInstance } from "../config/axios";
import { useSelector } from "../redux/store";
import { Products } from "../types/Products";

export const useHome = () => {
    const { email } = useSelector((state) => state.user);

    const [products, setProducts] = useState<Products[]>([]);

    const getProducts = async () => {
        const { data } = await axiosInstance(
            `/products/${email}?offset=0&limit=10&sortBy=ASC`
        );

        setProducts(data.products);
    };

    useEffect(() => {
        getProducts();
    }, []);

    return {
        products,
    };
};