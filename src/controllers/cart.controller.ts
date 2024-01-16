import { Request, Response } from "express";

import { CartService } from "../services/cart.service";
import { CartRepository } from "../repositories/cart.repository";
import { UserRepository } from "../repositories/user.repository";
import { ProductsRepository } from "../repositories/products.repository";

export async function getCart(req: Request, res: Response) {
    try {
        // Get request headers
        const headers: Record<string, any> = req.headers;

        // New instance of CartRepository
        const cartRepository = new CartRepository();

        // New instance of UserRepository
        const userRepository = new UserRepository();

        // New instance of ProductsRepository
        const productsRepository = new ProductsRepository();

        // New instance of CartService with cartRepository and userRepository
        // as arguments for the constructor
        const cartService = new CartService(
            cartRepository,
            userRepository,
            productsRepository
        );

        // Wait for result of service to get cart
        const result: Record<string, any> = await cartService.getCart(headers);

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

export async function updateCart(req: Request, res: Response) {
    try {
        // Get request headers
        const headers: Record<string, any> = req.headers;

        // Get request body
        const body: Record<string, any> = req.body;

        // New instance of CartRepository
        const cartRepository = new CartRepository();

        // New instance of UserRepository
        const userRepository = new UserRepository();

        // New instance of ProductsRepository
        const productsRepository = new ProductsRepository();

        // New instance of CartService with cartRepository and userRepository
        // as arguments for the constructor
        const cartService = new CartService(
            cartRepository,
            userRepository,
            productsRepository
        );

        // Wait for result of service to get cart
        const result: Record<string, any> = await cartService.updateCart(
            headers,
            body
        );

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

export async function emptyCart(req: Request, res: Response) {
    try {
        // Get request headers
        const headers: Record<string, any> = req.headers;

        // New instance of CartRepository
        const cartRepository = new CartRepository();

        // New instance of UserRepository
        const userRepository = new UserRepository();

        // New instance of ProductsRepository
        const productsRepository = new ProductsRepository();

        // New instance of CartService with cartRepository and userRepository
        // as arguments for the constructor
        const cartService = new CartService(
            cartRepository,
            userRepository,
            productsRepository
        );

        // Wait for result of service to empty cart
        const result: Record<string, any> = await cartService.emptyCart(
            headers
        );

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
