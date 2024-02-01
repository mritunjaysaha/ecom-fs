import { useState } from "react";
import { useSelector } from "../redux/store";
import { Products } from "../types/Products";

const Home = () => {
    const { email } = useSelector((state) => state.user);

    const [products, setProducts] = useState<Products>([]);

    const getProducts = async () => {
        const res = await fetch(
            `${
                import.meta.env.VITE_BASE_URL
            }/api/v1/products/:userId?offset=0&limit=10&sortBy=ASC`
        );
    };

    return <>Home</>;
};

export default Home;
