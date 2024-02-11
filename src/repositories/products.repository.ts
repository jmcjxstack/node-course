import { AppDataSource } from "../data-source";
import { Products } from "../entity/Products";
import { TODO } from "../schemas/Todo";

export class ProductsRepository {
	// Method to get list of products
	async getProductsList(): Promise<Products[] | null> {
		try {
			const products: Products[] = await AppDataSource.getRepository(
				Products
			).find();

			return products;
		} catch (error) {
			// Error handling
			console.error(`Error getting list of products: ${error}`);
			return null;
		}
	}

	// Method to get product by id
	async getProductById(id: string): Promise<Products | null> {
		try {
			const results: Products | null = await AppDataSource.getRepository(
				Products
			).findOneBy({
				id: id,
			});

			return results;
		} catch (error) {
			// Error handling
			console.error(`Error getting product: ${error}`);
			return null;
		}
	}
}
