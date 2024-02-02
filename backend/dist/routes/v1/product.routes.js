"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../../controllers/auth.controller");
const product_controller_1 = require("../../controllers/product.controller");
const user_controller_1 = require("../../controllers/user.controller");
const router = (0, express_1.Router)();
router.param("userId", user_controller_1.getUserById);
/**
 * @method GET
 * @route /api/v1/products
 */
router.get("/:userId", product_controller_1.getProducts);
/**
 * @method POST
 * @route /api/v1/products/add
 */
router.post("/:userId/add", auth_controller_1.isSignedIn, auth_controller_1.isAuthenticated, auth_controller_1.isAdmin, product_controller_1.addProduct);
exports.default = router;
//# sourceMappingURL=product.routes.js.map