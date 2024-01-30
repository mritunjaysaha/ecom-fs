import { Router } from "express";
import {
    isAdmin,
    isAuthenticated,
    isSignedIn,
} from "../../controllers/auth.controller";
import { addProduct } from "../../controllers/product.controller";
import { getUserById } from "../../controllers/user.controller";

const router = Router();

router.param("userId", getUserById);

/**
 * @method POST
 * @route /api/v1/products/add
 */
router.post("/:userId/add", isSignedIn, isAuthenticated, isAdmin, addProduct);

export default router;
