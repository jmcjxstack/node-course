import express, { Router } from "express";
import {
    getProductsList,
    getProductById,
} from "../controllers/products.controller";

// Create products router
const productsRouter: Router = express.Router();

// Endpoint to get list of products
productsRouter.get("/", getProductsList);

// Endpoint to get specific product
productsRouter.get("/:productId", getProductById);

export default productsRouter;
