"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAdmin = exports.isAuthenticated = exports.isSignedIn = exports.signOut = exports.signIn = exports.signUp = void 0;
const express_validator_1 = require("express-validator");
const user_model_1 = require("../models/user.model");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const express_jwt_1 = require("express-jwt");
const signUp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ error: errors.array() });
        }
        const user = new user_model_1.UserModel(req.body);
        const savedUser = yield user.save();
        if (savedUser) {
            return res.json({
                success: true,
                message: "Sign up successful",
            });
        }
        else {
            return res.json({
                success: true,
                message: "Sign up failed. Failed to save user",
            });
        }
    }
    catch (err) {
        return res
            .status(400)
            .json({ error: err.message, message: "Sign up failed" });
    }
});
exports.signUp = signUp;
const signIn = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty) {
            return res.status(400).json({ error: errors.array() });
        }
        const { email, password } = req.body;
        const user = yield user_model_1.UserModel.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: "Email doesn't exists" });
        }
        // @ts-expect-error
        if (!user.authenticate(password)) {
            return res.status(401).json({
                success: false,
                error: "Email and password fo not match",
            });
        }
        const token = jsonwebtoken_1.default.sign({ email }, process.env.SECRET, {
            expiresIn: "7d",
        });
        res.cookie("token", token, {
            expires: new Date(Date.now() + 9999),
        });
        return res.json({
            success: true,
            message: "Login successfully",
            token,
        });
    }
    catch (err) {
        return res.status(400).json({ success: false, message: err.message });
    }
});
exports.signIn = signIn;
const signOut = (req, res) => {
    res.clearCookie("token");
    return res.json({ success: true, message: "signed out" });
};
exports.signOut = signOut;
exports.isSignedIn = (0, express_jwt_1.expressjwt)({
    secret: process.env.SECRET,
    userProperty: "auth",
    // @ts-ignore
    algorithms: ["sha256", "RS256", "HS256"],
});
const isAuthenticated = (req, res, next) => {
    // @ts-ignore
    const { profile, auth } = req;
    const checker = profile && auth && profile.email === auth.email;
    if (!checker) {
        return res.status(401).json({ error: "ACCESS DENIED" });
    }
    next();
};
exports.isAuthenticated = isAuthenticated;
const isAdmin = (req, res, next) => {
    if (req.profile.role !== "admin") {
        return res.status(403).json({
            error: "[ACCESS DENIED] You're not an admin",
        });
    }
    next();
};
exports.isAdmin = isAdmin;
//# sourceMappingURL=auth.controller.js.map