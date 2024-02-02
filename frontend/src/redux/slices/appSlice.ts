import { createSlice } from "@reduxjs/toolkit";
import { Products } from "../../types/Products";

type Cart = {
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
    cart: { itemsId: [], itemsQuantity: {}, totalPrice: 0 },
};

export const appSlice = createSlice({
    name: "app",
    initialState,
    reducers: {
        addProductsToState: (state, { payload }) => {
            console.log({ payload });
            payload.forEach((data: Products) => {
                state.products[data.id] = data;
                state.productsArr.push(data.id);
            });
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
                itemsId: [],
                itemsQuantity: {},
                totalPrice: 0,
            };
        },
    },
});

export const { addToCart, removeFromCart } = appSlice.actions;
