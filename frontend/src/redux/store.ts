import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";

import {
    useDispatch as useReduxDispatch,
    useSelector as useReduxSelector,
    type TypedUseSelectorHook,
} from "react-redux";
import { appSlice } from "./slices/appSlice";

const persistConfig = {
    key: "root",
    storage,
};

const rootReducer = combineReducers({
    app: appSlice.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    devTools: import.meta.env.NODE_ENV !== "production",
});

export const persistor = persistStore(store);

export type ReduxStore = typeof store;
export type ReduxState = ReturnType<typeof store.getState>;
export type ReduxDispatch = typeof store.dispatch;

export const useDispatch = () => useReduxDispatch<ReduxDispatch>();
export const useSelector: TypedUseSelectorHook<ReduxState> = useReduxSelector;
