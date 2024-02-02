"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../../controllers/auth.controller");
const order_controller_1 = require("../../controllers/order.controller");
const user_controller_1 = require("../../controllers/user.controller");
const router = (0, express_1.Router)();
router.param("userId", user_controller_1.getUserById);
/**
 * @method GET
 * @route /api/v1/order/:userId/summary
 */
router.get("/:userId/summary", auth_controller_1.isSignedIn, auth_controller_1.isAuthenticated, auth_controller_1.isAdmin, order_controller_1.getOrderSummary);
/**
 * @method POST
 * @route /api/v1/order/:userId/add-to-cart
 */
router.post("/:userId/add-to-cart", auth_controller_1.isSignedIn, auth_controller_1.isAuthenticated, order_controller_1.addToCart);
/**
 * @method POST
 * @route /api/v1/order/:userId/remove-from-cart
 */
router.post("/:userId/remove-from-cart", auth_controller_1.isSignedIn, auth_controller_1.isAuthenticated, order_controller_1.removeFromCart);
/**
 * @method POST
 * @route /api/v1/order/:userId/checkout
 */
router.post("/:userId/checkout", auth_controller_1.isSignedIn, auth_controller_1.isAuthenticated, order_controller_1.checkout);
exports.default = router;
//# sourceMappingURL=order.routes.js.map