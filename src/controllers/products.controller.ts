import { Request, Response } from "express";

import { ProductsService } from "../services/products.service";
import { ProductsRepository } from "../repositories/products.repository";
import { UserRepository } from "../repositories/user.repository";

export async function getProducts(req: Request, res: Response) {
    try {
        // Get request headers
        const headers: Record<string, any> = req.headers;

        // New instance of ProductsRepository
        const productsRepository = new ProductsRepository();

        // New instance of UserRepository
        const userRepository = new UserRepository();

        // New instance of ProductsService with productsRepository and userRepository
        // as arguments for the constructor
        const productsService = new ProductsService(
            productsRepository,
            userRepository
        );

        // Wait for result of service to get list of products
        const result: Record<string, any> = await productsService.getProducts(headers);

        // Return both status code and response
        return res.status(result.code).json(result);
    } catch (error) {
        // Error handling
        console.error(error);
        return res.status(500).json({
            data: null,
            error: { message: "Internal Server error" },
        });
    }
}

export async function getProduct(req: Request, res: Response) {
    try {
        // Get request headers
        const headers: Record<string, any> = req.headers;

        // Get productId param
        const productId: string = req.params.productId;

        // New instance of ProductsRepository
        const productsRepository = new ProductsRepository();

        // New instance of UserRepository
        const userRepository = new UserRepository();

        // New instance of ProductsService with productsRepository and userRepository 
        // as arguments for the constructor
        const productsService = new ProductsService(
            productsRepository,
            userRepository
        );

        // Wait for result of service to get specific product
        const result: Record<string, any> = await productsService.getProduct(headers, productId);

        // Return both status code and response
        return res.status(result.code).json(result);
    } catch (error) {
        // Error handling
        console.error(error);
        return res.status(500).json({
            data: null,
            error: { message: "Internal Server error" },
        });
    }
}
