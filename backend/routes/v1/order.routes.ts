import { Router } from "express";
import {
    isAdmin,
    isAuthenticated,
    isSignedIn,
} from "../../controllers/auth.controller";
import {
    addToCart,
    checkout,
    getOrderSummary,
    removeFromCart,
} from "../../controllers/order.controller";
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

/**
 * @method POST
 * @route /api/v1/order/:userId/remove-from-cart
 */
router.post(
    "/:userId/remove-from-cart",
    isSignedIn,
    isAuthenticated,
    removeFromCart
);

/**
 * @method POST
 * @route /api/v1/order/:userId/checkout
 */
router.post("/:userId/checkout", isSignedIn, isAuthenticated, checkout);

export default router;
