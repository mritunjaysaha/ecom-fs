import { ProductCards } from "../components/ProductCards";
import { useCart } from "../hooks/useCart";

const Cart = () => {
    const {
        itemsId,
        products,
        discountCode,
        generateDiscountCode,
        handleCheckout,
    } = useCart();

    return (
        <section className="p-12">
            <div className="flex flex-wrap gap-8">
                {itemsId.map((productId) => {
                    const product = products[productId];
                    return (
                        product && <ProductCards key={productId} {...product} />
                    );
                })}
            </div>{" "}
            <div>
                {!!discountCode && <p>{discountCode}</p>}
                {!discountCode && (
                    <button onClick={generateDiscountCode}>
                        Generate discount code
                    </button>
                )}
            </div>
            <button onClick={handleCheckout}>Checkout</button>
        </section>
    );
};

export default Cart;
