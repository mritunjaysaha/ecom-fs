import { createSlice } from "@reduxjs/toolkit";
import { Products } from "../../types/Products";

type Cart = {
    items: string[];
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
    cart: { items: [], itemsQuantity: {}, totalPrice: 0 },
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
        addToCart: (state, { payload }) => {},
        removeFromCart: (state, { payload }) => {},
        clearCart: (state, { payload }) => {},
    },
});

export const { addToCart, removeFromCart } = appSlice.actions;
