import express, { Router } from "express";
import {
	getCart,
	updateCart,
	emptyCart,
	createOrder,
} from "../controllers/cart.controller";

// Create products router
const cartRouter: Router = express.Router();

// Endpoint to get user cart or create if it's missing
cartRouter.get("/", getCart);

// Endpoint to update user cart
cartRouter.put("/", updateCart);

// Endpoint to empty user cart
cartRouter.delete("/", emptyCart);

// Endpoint to create an order
cartRouter.post("/checkout", createOrder);

export default cartRouter;
