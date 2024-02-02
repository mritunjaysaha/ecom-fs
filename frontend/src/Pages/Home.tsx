import { ProductCards } from "../components/ProductCards";
import { useHome } from "../hooks/useHome";

const Home = () => {
    const { products, productsArr } = useHome();

    return (
        <section className="p-12 flex flex-wrap gap-8">
            {productsArr.map((productId) => {
                const product = products[productId];
                return product && <ProductCards key={productId} {...product} />;
            })}
        </section>
    );
};

export default Home;
