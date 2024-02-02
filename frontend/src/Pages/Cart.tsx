import { ProductCards } from "../components/ProductCards";
import { useCart } from "../hooks/useCart";

const Cart = () => {
    const {
        itemsId,
        products,
        totalAmount,
        discountCode,
        generateDiscountCode,
        handleCheckout,
    } = useCart();

    return (
        <section className="p-12 flex flex-col gap-4">
            <div className="flex flex-wrap gap-8">
                {itemsId.map((productId) => {
                    const product = products[productId];
                    return (
                        product && <ProductCards key={productId} {...product} />
                    );
                })}
            </div>

            {itemsId.length ? (
                <>
                    <p>Total amount: ${totalAmount}</p>
                    <div>
                        {!!discountCode && <p>{discountCode}</p>}
                        {!discountCode && (
                            <button
                                onClick={generateDiscountCode}
                                className="rounded-full bg-slate-500 text-white font-semibold py-2 px-6 w-max"
                            >
                                Generate discount code
                            </button>
                        )}
                    </div>
                    <button
                        onClick={handleCheckout}
                        className="rounded-full bg-black text-white text-2xl font-bold py-2 px-6 w-max"
                    >
                        Checkout
                    </button>
                </>
            ) : (
                <p>No items in carts</p>
            )}
        </section>
    );
};

export default Cart;
