import { ProductsRepository } from "../repositories/products.repository";
import { ProductEntity } from "../schemas/product.entity";
import { UserRepository } from "../repositories/user.repository";

export class ProductsService {
    private productsRepository: ProductsRepository;
    private userRepository: UserRepository;

    constructor(
        productsRepository: ProductsRepository,
        userRepository: UserRepository
    ) {
        this.productsRepository = productsRepository;
        this.userRepository = userRepository;
    }

    // Method to get list of products
    async getProducts(headers: Record<string, any>): Promise<any> {
        try {
            if (!headers["x-user-id"]) {
                return {
                    data: null,
                    error: { message: "You must be authorized user" },
                    code: 403,
                };
            }

            // Get the array of users with getUsers method from userRepository
            const users = await this.userRepository.getUsers();

            // Find user with same id as the x-user-id header
            const user = users.find((u) => u.id === headers["x-user-id"]);

            // Error handling
            if (!user) {
                return {
                    data: null,
                    error: { message: "User is not authorized" },
                    code: 401,
                };
            }

            // Get the array of products with getProducts method from userRepository
            const products: ProductEntity[] =
                await this.productsRepository.getProducts();

            return { data: products, error: null, code: 200 };
        } catch (error) {
            // Error handling
            console.error(error);
            return {
                data: null,
                error: { message: "Internal Server error" },
                code: 500,
            };
        }
    }

    // Method to get specific product
    async getProduct(productId: string): Promise<any> {
        try {
        } catch (error) {
            // Error handling
            console.error(error);
            return {
                data: null,
                error: { message: "Internal Server error" },
                code: 500,
            };
        }
    }
}
