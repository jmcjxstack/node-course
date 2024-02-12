import { Request, Response } from "express";

import { OrderService } from "../services/order.service";
import { CartRepository } from "../repositories/cart.repository";
import { UserRepository } from "../repositories/user.repository";
import { OrderRepository } from "../repositories/order.repository";

export async function createOrder(req: Request, res: Response) {
	try {
		// Get request headers
		const headers: Record<string, any> = req.headers;

		// New instance of CartRepository
		const cartRepository = new CartRepository();

		// New instance of UserRepository
		const userRepository = new UserRepository();

		// New instance of OrderRepository
		const orderRepository = new OrderRepository();

		// New instance of CartService with cartRepository and userRepository
		// as arguments for the constructor
		const orderService = new OrderService(
			cartRepository,
			userRepository,
			orderRepository
		);

		// Wait for result of service to get cart
		const result: Record<string, any> = await orderService.createOrder(
			headers
		);

		// Return both status code and response
		return res.status(result.code).json(result.response);
	} catch (error) {
		// Error handling
		console.error(error);
		return res.status(500).json({
			data: null,
			error: { message: "Internal Server error" },
		});
	}
}
