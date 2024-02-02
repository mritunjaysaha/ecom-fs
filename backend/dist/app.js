"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
require("dotenv").config();
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const db_config_1 = require("./config/db.config");
const auth_routes_1 = __importDefault(require("./routes/v1/auth.routes"));
const discount_routes_1 = __importDefault(require("./routes/v1/discount.routes"));
const order_routes_1 = __importDefault(require("./routes/v1/order.routes"));
const product_routes_1 = __importDefault(require("./routes/v1/product.routes"));
// INITIALIZE APP
const app = (0, express_1.default)();
exports.app = app;
// CONNECT DB
(0, db_config_1.connectDB)();
// INITIALIZE MIDDLEWARE
app.use((0, cors_1.default)({ origin: true }));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
// ROUTES
app.use("/api/v1/auth", auth_routes_1.default);
app.use("/api/v1/products", product_routes_1.default);
app.use("/api/v1/discount-code", discount_routes_1.default);
app.use("/api/v1/orders", order_routes_1.default);
app.get("/", (req, res) => {
    res.send("server up and running");
});
//# sourceMappingURL=app.js.map