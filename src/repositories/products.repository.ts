import fs from "fs/promises";
import path from "path";

import { ProductEntity } from "../schemas/product.entity";

export class ProductsRepository {
	private productsFilePath = path.join(__dirname, "../data/products.json");

	// Method to get list of products
	async getProducts(): Promise<ProductEntity[]> {
		try {
			// Reads the contents of the file
			const content = await fs.readFile(this.productsFilePath, "utf-8");

			// Returns the contents of the file parsed as an object
			return JSON.parse(content);
		} catch (error) {
			// Error handling
			console.log(`Error getting list of products: ${error}`);
			return [];
		}
	}
}
