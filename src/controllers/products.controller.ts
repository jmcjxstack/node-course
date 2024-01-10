import { Request, Response } from "express";

import { ProductsService } from "../services/products.service";
import { ProductsRepository } from "../repositories/products.repository";
import { UserRepository } from "../repositories/user.repository";

export const getProducts = async (req: Request, res: Response) => {
	try {
		const headers: Record<string, any> = req.headers;

		// New instance of ProductsRepository
		const productsRepository = new ProductsRepository();

		// New instance of UserRepository
		const userRepository = new UserRepository();

		// New instance of ProductsService with productsRepository as argument for the constructor
		const productsService = new ProductsService(
			productsRepository,
			userRepository
		);

		// Wait for result of service to get list of products
		const result = await productsService.getProducts(headers);

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
};

export const getProduct = async (req: Request, res: Response) => {
	try {
	} catch (error) {
		// Error handling
		console.error(error);
		return res.status(500).json({
			data: null,
			error: { message: "Internal Server error" },
		});
	}
};
