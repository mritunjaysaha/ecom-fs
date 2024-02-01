import { useEffect, useState } from "react";
import { ProductCards } from "../components/ProductCards";
import { axiosInstance } from "../config/axios";
import { useSelector } from "../redux/store";
import { Products } from "../types/Products";

const Home = () => {
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

    return (
        <section className="p-12 flex flex-wrap gap-8">
            {products.map((product) => (
                <ProductCards key={product.id} {...product} />
            ))}
        </section>
    );
};

export default Home;
