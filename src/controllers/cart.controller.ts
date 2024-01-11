import { Request, Response } from "express";

import { CartService } from "../services/cart.service";
import { CartRepository } from "../repositories/cart.repository";
import { UserRepository } from "../repositories/user.repository";

export async function getCart(req: Request, res: Response) {
	try {
		// Get request headers
		const headers: Record<string, any> = req.headers;

		// New instance of CartRepository
		const cartRepository = new CartRepository();

		// New instance of UserRepository
		const userRepository = new UserRepository();

		// New instance of CartService with cartRepository and userRepository
		// as arguments for the constructor
		const cartService = new CartService(cartRepository, userRepository);

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
	} catch (error) {
		// Error handling
		console.error(error);
		return res.status(500).json({
			data: null,
			error: { message: "Internal Server error" },
		});
	}
}

export async function createOrder(req: Request, res: Response) {
	try {
	} catch (error) {
		// Error handling
		console.error(error);
		return res.status(500).json({
			data: null,
			error: { message: "Internal Server error" },
		});
	}
}
