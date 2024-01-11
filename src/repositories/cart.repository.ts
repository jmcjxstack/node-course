import fs from "fs/promises";
import path from "path";

import { CartEntity } from "../schemas/cart.entity";

export class CartRepository {
	private cartsFilePath: string = path.join(__dirname, "../data/carts.json");

	// Method to get list of carts
	async getCarts(): Promise<CartEntity[]> {
		try {
			// Reads the contents of the file
			const content: string = await fs.readFile(
				this.cartsFilePath,
				"utf-8"
			);

			// Returns the contents of the file parsed as an object
			return JSON.parse(content);
		} catch (error) {
			// Error handling
			console.log(`Error getting list of carts: ${error}`);
			return [];
		}
	}

	// Method to save carts
	async saveCarts(carts: Record<string, any>[]): Promise<void> {
		try {
			// Stringifies array of carts and saves it to file
			await fs.writeFile(
				this.cartsFilePath,
				JSON.stringify(carts, null, 2),
				"utf-8"
			);
		} catch (error) {
			// Error handling
			console.log(`Error writing to file: ${error}`);
		}
	}
}
