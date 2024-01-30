import { Router } from "express";
import { isAuthenticated, isSignedIn } from "../../controllers/auth.controller";
import { generateDiscountCode } from "../../controllers/discountCode.controller";
import { getUserById } from "../../controllers/user.controller";

const router = Router();

router.param("userId", getUserById);

/**
 * @method GET
 * @route /api/v1/discount-code/:userId
 */
router.get("/:userId", isSignedIn, isAuthenticated, generateDiscountCode);

export default router;
