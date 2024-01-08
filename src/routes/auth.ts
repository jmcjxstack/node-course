import express from "express";
import { registerUser, loginUser } from "../controllers/auth.controller";

// Create router
const authRouter = express.Router();

// Endpoint to register user
authRouter.post("/register", registerUser);

// Endpoint to login user
authRouter.post("/login", loginUser);

export default authRouter;
