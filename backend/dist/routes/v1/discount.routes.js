"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../../controllers/auth.controller");
const discountCode_controller_1 = require("../../controllers/discountCode.controller");
const user_controller_1 = require("../../controllers/user.controller");
const router = (0, express_1.Router)();
router.param("userId", user_controller_1.getUserById);
/**
 * @method GET
 * @route /api/v1/discount/:userId
 */
router.get("/:userId", auth_controller_1.isSignedIn, auth_controller_1.isAuthenticated, discountCode_controller_1.getDiscountCode);
/**
 * @method GET
 * @route /api/v1/discount-code/:userId
 */
router.get("/:userId/generate-code", auth_controller_1.isSignedIn, auth_controller_1.isAuthenticated, auth_controller_1.isAdmin, discountCode_controller_1.generateDiscountCode);
exports.default = router;
//# sourceMappingURL=discount.routes.js.map