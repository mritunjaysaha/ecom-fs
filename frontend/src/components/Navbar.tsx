import { Link } from "react-router-dom";
import { ROUTES } from "../constants/routes";
import { useSelector } from "../redux/store";

export const Navbar = () => {
    const { total } = useSelector((state) => state.app.cart);

    return (
        <nav className="w-screen flex justify-between border py-4 px-12">
            <Link to={ROUTES.HOME} className="text-xl text-black">
                Home
            </Link>
            <Link to={ROUTES.CART} className="text-xl text-black">
                Cart {!!total && <span>{total}</span>}
            </Link>
        </nav>
    );
};
