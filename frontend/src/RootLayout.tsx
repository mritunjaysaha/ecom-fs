import { FC, ReactNode, useEffect } from "react";
import { Navbar } from "./components/Navbar";
import { axiosInstance } from "./config/axios";
import { setAuth } from "./redux/slices/userSlice";
import { useDispatch, useSelector } from "./redux/store";
import { setAuthToken } from "./utils/setAuthToken";

type RootLayoutProps = {
    children: ReactNode;
};

export const RootLayout: FC<RootLayoutProps> = ({ children }) => {
    const dispatch = useDispatch();
    const { isAuthenticated, email, token } = useSelector(
        (state) => state.user
    );

    const login = async () => {
        const email = "admin@foobar.com";
        const { data } = await axiosInstance.post("/auth/login", {
            email,
            password: "123456",
        });

        if (data?.success) {
            dispatch(setAuth({ token: data.token, email }));
        }
    };

    useEffect(() => {
        if (isAuthenticated) {
            setAuthToken(token);

            return;
        }

        console.log(import.meta.env.VITE_BASE_URL);

        login();
    }, [isAuthenticated]);

    return (
        <section>
            <Navbar />
            <p>{isAuthenticated}</p>
            {children}
        </section>
    );
};
