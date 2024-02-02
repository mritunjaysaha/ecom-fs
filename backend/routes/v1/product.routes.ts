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
 * @method GET
 * @route /api/v1/products
 */
router.get("/:userId", getProducts);

/**
 * @method POST
 * @route /api/v1/products/add
 */
router.post("/:userId/add", isSignedIn, isAuthenticated, isAdmin, addProduct);

export default router;
