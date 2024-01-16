import express, { Router } from "express";
import { getProducts, getProduct } from "../controllers/products.controller";

// Create products router
const productsRouter: Router = express.Router();

// Endpoint to get list of products
productsRouter.get("/", getProducts);

// Endpoint to get specific product
productsRouter.get("/:productId", getProduct);

export default productsRouter;
