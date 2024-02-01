import { createSlice } from "@reduxjs/toolkit";
import { Products } from "../../types/Products";

type AppSliceState = {
    productsArr: Products[];
    cart: { products: string[]; total: number };
};

const initialState: AppSliceState = {
    productsArr: [],
    cart: { products: [], total: 0 },
};

export const appSlice = createSlice({
    name: "app",
    initialState,
    reducers: {
        addToCart: (state, { payload }) => {},
        removeFromCart: (state, { payload }) => {},
        clearCart: (state, { payload }) => {},
    },
});

export const { addToCart, removeFromCart } = appSlice.actions;
