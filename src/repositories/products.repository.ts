import { AppDataSource } from "../data-source";
import { Products } from "../entity/Products";

export class ProductsRepository {
    // Method to get list of products
    async getProductsList(): Promise<any> {
        try {
            const products = await AppDataSource.getRepository(Products).find();
            return products;
        } catch (error) {
            // Error handling
            console.log(`Error getting list of products: ${error}`);
            return null;
        }
    }

    // Method to get product by id
    async getProductById(id: string) {
        try {
            const results = await AppDataSource.getRepository(
                Products
            ).findOneBy({
                id: id,
            });

            return results;
        } catch (error) {
            // Error handling
            console.log(`Error getting product: ${error}`);
            return null;
        }
    }
}
