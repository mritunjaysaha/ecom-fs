import { createSlice } from "@reduxjs/toolkit";

type UserSlice = {
    isAuthenticated: boolean;
    email: string;
    token: string;
};

const initialState: UserSlice = {
    isAuthenticated: false,
    email: "",
    token: "",
};

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setAuth: (state, { payload }) => {
            state.isAuthenticated = !!payload;
            state.token = payload.token;
            state.email = payload.email;
        },
    },
});

export const { setAuth } = userSlice.actions;
