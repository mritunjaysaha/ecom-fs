import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { axiosInstance } from "../config/axios";
import { ROUTES } from "../constants/routes";
import { clearCart } from "../redux/slices/appSlice";
import { useDispatch, useSelector } from "../redux/store";

export const useCart = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { products, cart } = useSelector((state) => state.app);
    const { email } = useSelector((state) => state.user);
    const { itemsId, orderId, totalPrice } = cart;

    const [discountCode, setDiscountCode] = useState<string>("");

    const handleCheckout = async () => {
        const { data } = await axiosInstance.post(`/orders/${email}/checkout`, {
            orderId,
            discountCode,
        });

        if (data?.success) {
            dispatch(clearCart());
            navigate(ROUTES.HOME);
        } else {
            toast.error("Checkout failed. Try Again.");
        }
    };

    const generateDiscountCode = async () => {
        const { data } = await axiosInstance.get(`/discount-code/${email}`);

        if (data?.success) {
            setDiscountCode(data.discountCode);
        } else {
            toast.warn("No tokens available");
        }
    };

    return {
        itemsId,
        products,
        totalPrice,
        discountCode,
        handleCheckout,
        generateDiscountCode,
    };
};
