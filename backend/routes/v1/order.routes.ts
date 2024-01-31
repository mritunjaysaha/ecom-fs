import { Router } from "express";
import {
    isAdmin,
    isAuthenticated,
    isSignedIn,
} from "../../controllers/auth.controller";
import { getOrderSummary } from "../../controllers/order.controller";
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

export default router;
