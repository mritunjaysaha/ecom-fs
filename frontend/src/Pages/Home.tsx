import { ProductCards } from "../components/ProductCards";
import { useHome } from "../hooks/useHome";

const Home = () => {
    const { products } = useHome();

    return (
        <section className="p-12 flex flex-wrap gap-8">
            {products.map((product) => (
                <ProductCards key={product.id} {...product} />
            ))}
        </section>
    );
};

export default Home;
