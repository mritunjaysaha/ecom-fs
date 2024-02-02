import { createSlice } from "@reduxjs/toolkit";
import { Products } from "../../types/Products";

type Cart = {
    orderId: string;
    itemsId: string[];
    itemsQuantity: Record<string, number>;
    totalPrice: number;
};

type AppSliceState = {
    products: Record<string, Products>;
    productsArr: string[];
    cart: Cart;
};

const initialState: AppSliceState = {
    products: {},
    productsArr: [],
    cart: { orderId: "", itemsId: [], itemsQuantity: {}, totalPrice: 0 },
};

export const appSlice = createSlice({
    name: "app",
    initialState,
    reducers: {
        addProductsToState: (state, { payload }) => {
            const productsArr = payload as Products[];

            const arr: string[] = [];
            productsArr.forEach((product: Products) => {
                state.products[product.id] = product;

                arr.push(product.id);
            });

            const set = new Set([...state.productsArr, ...arr]);

            state.productsArr = Array.from(set);
        },
        addToCart: (state, { payload }) => {
            const productId = payload as string;

            if (!state.cart.itemsId.includes(productId)) {
                state.cart.itemsId.push(productId);
            }

            if (state.cart.itemsQuantity[productId]) {
                state.cart.itemsQuantity[productId] += 1;
            } else {
                state.cart.itemsQuantity[productId] = 1;
            }

            state.cart.totalPrice += state.products[productId].price;

            console.log(state);
        },
        removeFromCart: (state, { payload }) => {
            const productId = payload as string;

            if (state.cart.itemsQuantity[productId] === 1) {
                state.cart.itemsId = state.cart.itemsId.filter(
                    (id) => id !== productId
                );
                state.cart.totalPrice -= state.products[productId].price;
            } else {
                state.cart.itemsQuantity[productId] -= 1;
            }

            state.cart.totalPrice -= state.products[productId].price;
        },
        clearCart: (state) => {
            state.cart = {
                orderId: "",
                itemsId: [],
                itemsQuantity: {},
                totalPrice: 0,
            };
        },
        addOrderId: (state, { payload }) => {
            state.cart.orderId = payload;
        },
    },
});

export const {
    addProductsToState,
    addToCart,
    removeFromCart,
    clearCart,
    addOrderId,
} = appSlice.actions;
