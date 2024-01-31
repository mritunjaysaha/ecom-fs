import { Router } from "express";
import {
    isAdmin,
    isAuthenticated,
    isSignedIn,
} from "../../controllers/auth.controller";
import { addToCart, getOrderSummary } from "../../controllers/order.controller";
import { getUserById } from "../../controllers/user.controller";

const router = Router();

router.param("userId", getUserById);

/**
 * @method GET
 * @route /api/v1/order/:userId/summary
 */

router.get(
    "/:userId/summary",
    isSignedIn,
    isAuthenticated,
    isAdmin,
    getOrderSummary
);

/**
 * @method POST
 * @route /api/v1/order/:userId/add-to-cart
 */
router.post("/:userId/add-to-cart", isSignedIn, isAuthenticated, addToCart);

export default router;
