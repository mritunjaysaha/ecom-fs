import { Router } from "express";
import {
    isAdmin,
    isAuthenticated,
    isSignedIn,
} from "../../controllers/auth.controller";
import { addProduct, getProducts } from "../../controllers/product.controller";
import { getUserById } from "../../controllers/user.controller";

const router = Router();

router.param("userId", getUserById);

/**
 * @method POST
 * @route /api/v1/products/add
 */
router.post("/:userId/add", isSignedIn, isAuthenticated, isAdmin, addProduct);

/**
 * @method GET
 * @route /api/v1/products
 */
router.get("/:userId", isSignedIn, isAuthenticated, getProducts);

export default router;
