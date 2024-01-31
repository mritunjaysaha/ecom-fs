import { Router } from "express";
import {
    isAdmin,
    isAuthenticated,
    isSignedIn,
} from "../../controllers/auth.controller";
import {
    generateDiscountCode,
    getDiscountCode,
} from "../../controllers/discountCode.controller";
import { getUserById } from "../../controllers/user.controller";

const router = Router();

router.param("userId", getUserById);

/**
 * @method GET
 * @route /api/v1/discount/:userId
 */
router.get("/:userId", isSignedIn, isAuthenticated, getDiscountCode);

/**
 * @method GET
 * @route /api/v1/discount-code/:userId
 */
router.get(
    "/:userId/generate-code",
    isSignedIn,
    isAuthenticated,
    isAdmin,
    generateDiscountCode
);

export default router;
