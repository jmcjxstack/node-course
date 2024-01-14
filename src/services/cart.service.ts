import { v4 as uuidv4 } from "uuid";
import Joi, { ObjectSchema, ValidationResult } from "joi";

import { CartRepository } from "../repositories/cart.repository";
import { UserRepository } from "../repositories/user.repository";
import { ProductsRepository } from "../repositories/products.repository";
import { CartEntity } from "../schemas/cart.entity";
import { ProductEntity } from "../schemas/product.entity";
import { CartItemEntity } from "../schemas/cart.entity";

export class CartService {
	private cartRepository: CartRepository;
	private userRepository: UserRepository;
	private productsRepository: ProductsRepository;

	constructor(
		cartRepository: CartRepository,
		userRepository: UserRepository,
		productsRepository: ProductsRepository
	) {
		this.cartRepository = cartRepository;
		this.userRepository = userRepository;
		this.productsRepository = productsRepository;
	}

	// Method to get specific cart, or create one if it does not exist
	async getCart(headers: Record<string, any>): Promise<Record<string, any>> {
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

			// Get the array of carts with getCarts method from cartRepository
			const carts: CartEntity[] = await this.cartRepository.getCarts();

			// Find the cart that belongs to user and is not deleted
			const cart: CartEntity | undefined = carts.find(
				(cart) => cart.userId === user.id && cart.isDeleted === false
			);

			// Response if searched cart does not exist
			if (!cart) {
				// Generate new UUID
				const id: string = uuidv4();

				// Add the new cart object to carts array
				carts.push({
					id,
					userId: headers["x-user-id"],
					isDeleted: false,
					items: [],
				});

				// Save updated carts array to file using saveCarts method from cartRepository
				await this.cartRepository.saveCarts(carts);

				return {
					data: { cart: { id: user.id, items: [] } },
					total: 0,
					error: null,
					code: 200,
				};
			}

			// Calculate total cost of the cart
			const totalCost: number | undefined = cart?.items.reduce(
				(acc, item) => {
					return acc + item.product.price * item.count;
				},
				0
			);

			// Construct data object
			const cartResponse: Record<string, any> = {
				cart: { id: cart?.userId, items: cart?.items },
				total: totalCost,
			};

			return { data: cartResponse, error: null, code: 200 };
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

	// Method to update cart
	async updateCart(
		headers: Record<string, any>,
		body: Record<string, any>
	): Promise<Record<string, any>> {
		try {
			// Define request body schema
			const requestBodySchema: ObjectSchema = Joi.object({
				productId: Joi.string().uuid().required(),
				count: Joi.number().integer().required(),
			});

			// Destructure error from Joi validation result object
			const { error }: ValidationResult =
				requestBodySchema.validate(body);

			// Check if request body is not valid
			if (error) {
				return {
					data: null,
					error: { message: "Products are not valid" },
					code: 400,
				};
			}

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

			// Get the array of carts with getCarts method from cartRepository
			const carts: CartEntity[] = await this.cartRepository.getCarts();

			// Find the cart that belongs to user and is not deleted
			const cart: CartEntity | undefined = carts.find(
				(cart) => cart.userId === user.id && cart.isDeleted === false
			);

			// Response if searched cart does not exist or if is deleted
			if (!cart || cart.isDeleted === true) {
				return {
					data: null,
					error: { message: "Cart was not found" },
					code: 404,
				};
			}

			// Get the product to update from the user cart
			const selectedProduct: CartItemEntity | undefined = cart.items.find(
				(item) => item.product.id === body.productId
			);

			// Add product to cart if product on request body does not exist on cart
			if (!selectedProduct) {
				// Handle if product does not exist on cart
				// but product count in request body is 0
				if (body.count === 0) {
					return {
						data: null,
						error: { message: "Products are not valid" },
						code: 400,
					};
				}

				// Get the array of products with getProducts method from productsRepository
				const products: ProductEntity[] =
					await this.productsRepository.getProducts();

				// From array of products get product to add to cart
				const productToAdd: ProductEntity | undefined = products.find(
					(product) => body.productId === product.id
				);

				if (!selectedProduct && !productToAdd) {
					// Handle if the product does not exist in either the cart or the products array.
					return {
						data: null,
						error: { message: "Products are not valid" },
						code: 400,
					};
				}

				// Construct cart item object and add to cart
				if (productToAdd) {
					const cartItemToAdd: CartItemEntity = {
						product: productToAdd,
						count: body.count,
					};

					cart.items.push(cartItemToAdd);

					// Save updated carts array to file using saveCarts method from cartRepository
					await this.cartRepository.saveCarts(carts);
				}

				// Handle removing product from cart if count from request body is 0
			} else if (selectedProduct && body.count === 0) {
				cart.items = cart.items.filter(
					(item) => item.product.id !== body.productId
				);

				// Save updated carts array to file using saveCarts method from cartRepository
				await this.cartRepository.saveCarts(carts);
			} else {
				// Update count of product in cart
				selectedProduct.count = body.count;

				// Save updated carts array to file using saveCarts method from cartRepository
				await this.cartRepository.saveCarts(carts);
			}

			// Calculate total cost of the cart
			const totalCost: number | undefined = cart?.items.reduce(
				(acc, item) => {
					return acc + item.product.price * item.count;
				},
				0
			);

			// Construct data object
			const cartResponse: Record<string, any> = {
				cart: { id: cart?.userId, items: cart?.items },
				total: totalCost,
			};

			return { data: cartResponse, error: null, code: 200 };
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

	async emptyCart(
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

			// Get the array of carts with getCarts method from cartRepository
			const carts: CartEntity[] = await this.cartRepository.getCarts();

			// Find the cart that belongs to user and is not deleted
			const cart: CartEntity | undefined = carts.find(
				(cart) => cart.userId === user.id && cart.isDeleted === false
			);

			// Response if searched cart does not exist or is already deleted
			if (!cart) {
				return {
					data: null,
					error: { message: "Internal Server error" },
					code: 500,
				};
			}

			// Change isDeleted property to true
			cart.isDeleted = true;

			// Save updated carts array to file using saveCarts method from cartRepository
			await this.cartRepository.saveCarts(carts);

			return { data: { success: true }, error: null, code: 200 };
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
