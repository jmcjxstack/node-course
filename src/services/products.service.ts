import { ProductsRepository } from "../repositories/products.repository";
import { UserRepository } from "../repositories/user.repository";
import { TODO } from "../schemas/Todo";

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
    async getProductsList(
        headers: Record<string, any>
    ): Promise<Record<string, any>> {
        try {
            // Check if needed header is missing
            if (!headers["x-user-id"]) {
                return {
                    response: {
                        data: null,
                        error: { message: "You must be authorized user" },
                    },
                    code: 403,
                };
            }

            // Get the user with the id from the x-user-id header
            const user: TODO = await this.userRepository.getUserById(
                headers["x-user-id"]
            );

            // Response if no user matching authorization header is found
            if (!user) {
                return {
                    response: {
                        data: null,
                        error: { message: "User is not authorized" },
                    },
                    code: 401,
                };
            }

            // Get the array of products with getProducts method from productsRepository
            const products: TODO =
                await this.productsRepository.getProductsList();

            console.log(products);

            // return { data: products, error: null, code: 200 };
            return { response: { data: products, error: null }, code: 200 };
        } catch (error) {
            // Error handling
            console.error(error);
            return {
                response: {
                    data: null,
                    error: { message: "Internal Server error" },
                },
                code: 500,
            };
        }
    }

    // Method to get specific product
    async getProductById(
        headers: Record<string, any>,
        productId: string
    ): Promise<Record<string, any>> {
        try {
            // Check if needed header is missing
            if (!headers["x-user-id"]) {
                return {
                    response: {
                        data: null,
                        error: { message: "You must be authorized user" },
                    },
                    code: 403,
                };
            }

            // Get the user with the id from the x-user-id header
            const user: TODO = await this.userRepository.getUserById(
                headers["x-user-id"]
            );

            // Response if no user matching authorization header is found
            if (!user) {
                return {
                    response: {
                        data: null,
                        error: { message: "User is not authorized" },
                    },
                    code: 401,
                };
            }

            // Get the array of products with getProducts method from productsRepository
            const product: TODO = await this.productsRepository.getProductById(
                productId
            );

            // Response if no product is found
            if (!product) {
                return {
                    response: {
                        data: null,
                        error: { message: "No product with such id" },
                    },
                    code: 404,
                };
            }

            return { response: { data: product, error: null }, code: 200 };
        } catch (error) {
            // Error handling
            console.error(error);
            return {
                response: {
                    data: null,
                    error: { message: "Internal Server error" },
                },
                code: 500,
            };
        }
    }
}
