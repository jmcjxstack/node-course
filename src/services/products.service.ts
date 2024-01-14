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
	async getProducts(
		headers: Record<string, any>
	): Promise<Record<string, any>> {
		try {
			// Check if needed header is missing
			if (!headers["x-user-id"]) {
				return {
					data: null,
					error: { message: "You must be authorized user" },
					code: 403,
				};
			}

			// Get the array of users with getUsers method from userRepository
			const users: Record<string, any>[] =
				await this.userRepository.getUsers();

			// Find user with same id as the x-user-id header
			const user: Record<string, any> | undefined = users.find(
				(user) => user.id === headers["x-user-id"]
			);

			// Response if no user matching authorization header is found
			if (!user) {
				return {
					data: null,
					error: { message: "User is not authorized" },
					code: 401,
				};
			}

			// Get the array of products with getProducts method from productsRepository
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
	async getProduct(
		headers: Record<string, any>,
		productId: string
	): Promise<Record<string, any>> {
		try {
			// Check if needed header is missing
			if (!headers["x-user-id"]) {
				return {
					data: null,
					error: { message: "You must be authorized user" },
					code: 403,
				};
			}

			// Get the array of users with getUsers method from userRepository
			const users: Record<string, any>[] =
				await this.userRepository.getUsers();

			// Find user with same id as the x-user-id header
			const user: Record<string, any> | undefined = users.find(
				(user) => user.id === headers["x-user-id"]
			);

			// Response if no user matching authorization header is found
			if (!user) {
				return {
					data: null,
					error: { message: "User is not authorized" },
					code: 401,
				};
			}

			// Get the array of products with getProducts method from productsRepository
			const products: ProductEntity[] =
				await this.productsRepository.getProducts();

			// Find product with same id as productId param
			const product: ProductEntity | undefined = products.find(
				(product) => product.id === productId
			);

			// Response if no product is found
			if (!product) {
				return {
					data: null,
					error: { message: "No product with such id" },
					code: 404,
				};
			}

			return { data: product, error: null, code: 200 };
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
