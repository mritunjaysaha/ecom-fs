import { Route, Routes } from "react-router-dom";

import Auth from "./Pages/Auth";
import Cart from "./Pages/Cart";
import Home from "./Pages/Home";
import { ROUTES } from "./constants/routes";

export const AppRoutes = () => {
    return (
        <Routes>
            <Route path={ROUTES.AUTH} element={<Auth />} />
            <Route path={ROUTES.CART} element={<Cart />} />
            <Route path={ROUTES.HOME} element={<Home />} />
        </Routes>
    );
};
