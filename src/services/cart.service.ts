import { v4 as uuidv4 } from "uuid";
import Joi, { ObjectSchema, ValidationResult } from "joi";

import { CartRepository } from "../repositories/cart.repository";
import { UserRepository } from "../repositories/user.repository";
import { ProductsRepository } from "../repositories/products.repository";
import { Carts } from "../entity/Carts";
import { Users } from "../entity/Users";
import { Products } from "../entity/Products";

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
					response: {
						data: null,
						error: { message: "You must be authorized user" },
					},
					code: 403,
				};
			}

			// Get the user with the id from the x-user-id header
			const user: Users | null = await this.userRepository.getUserById(
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

			// Get the cart with the id from the x-user-id header
			const cart: Record<string, any> | null =
				await this.cartRepository.getCartById(headers["x-user-id"]);

			// Response if searched cart does not exist or is already deleted
			if (!cart) {
				// Generate new UUID
				const id: string = uuidv4();

				// Create cart and save it to database
				const newCart: Carts | null =
					await this.cartRepository.addNewCart({
						id,
						user_id: headers["x-user-id"],
						is_deleted: false,
					});

				return {
					response: {
						data: {
							cart: { id: newCart?.id, items: [] },
							total: 0,
						},
						error: null,
					},
					code: 200,
				};
			}

			// Calculate total cost of the cart
			const totalCost: number = cart?.items.reduce(
				(acc: number, item: Record<string, any>) => {
					return acc + item.product.price * item.count;
				},
				0
			);

			// Create data object
			const cartResponse: Record<string, any> = {
				cart,
				total: totalCost,
			};

			return { response: { data: cartResponse, error: null }, code: 200 };
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
					response: {
						data: null,
						error: { message: "You must be authorized user" },
					},
					code: 403,
				};
			}

			// Get the user with the id from the x-user-id header
			const user: Users | null = await this.userRepository.getUserById(
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

			let cart: Record<string, any> | null =
				await this.cartRepository.getCartById(headers["x-user-id"]);

			// Response if searched cart does not exist or is already deleted
			if (!cart) {
				return {
					response: {
						data: null,
						error: { message: "Cart was not found" },
					},
					code: 404,
				};
			}

			// Get the product to update from the user cart
			const selectedProduct: Record<string, any> = cart.items.find(
				(item: Record<string, any>) =>
					item.product.id === body.productId
			);

			// Add product to cart if product on request body does not exist on cart
			if (!selectedProduct) {
				// Handle if product does not exist on cart
				// but product count in request body is 0
				if (body.count === 0) {
					return {
						response: {
							data: null,
							error: { message: "Products are not valid" },
						},
						code: 400,
					};
				}

				// Get product based on its id
				const productToAdd: Products | null =
					await this.productsRepository.getProductById(
						body.productId
					);

				// Handle if the product does not exist in either the cart or the products database.
				if (!selectedProduct && !productToAdd) {
					return {
						response: {
							data: null,
							error: { message: "Products are not valid" },
						},
						code: 400,
					};
				}

				// Construct cart item object and add to cart
				if (productToAdd) {
					const id: string = uuidv4();

					const cartItemToAdd: Record<string, any> = {
						id,
						count: body.count,
						cart_id: cart.id,
						product_id: body.productId,
					};

					await this.cartRepository.addCartItem(cartItemToAdd);
				}
			}
			// Handle removing product from cart if count from request body is 0
			else if (selectedProduct && body.count === 0) {
				await this.cartRepository.deleteCartItem(
					selectedProduct.product.id,
					cart.id
				);
			} else {
				await this.cartRepository.updateCartItem(
					selectedProduct.product.id,
					cart.id,
					body.count
				);
			}

			cart = await this.cartRepository.getCartById(headers["x-user-id"]);

			// Calculate total cost of the cart
			const totalCost: number = cart?.items.reduce(
				(acc: number, item: Record<string, any>) => {
					return acc + item.product.price * item.count;
				},
				0
			);

			// Create data object
			const cartResponse: Record<string, any> = {
				cart,
				total: totalCost,
			};

			return { response: { data: cartResponse, error: null }, code: 200 };
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

			// Get the user with the id from the x-user-id header
			const user: Users | null = await this.userRepository.getUserById(
				headers["x-user-id"]
			);

			// Response if no user matching authorization header is found
			if (!user) {
				return {
					data: null,
					error: { message: "User is not authorized" },
					code: 401,
				};
			}

			// Get the cart with the id from the x-user-id header
			const cart: Record<string, any> | null =
				await this.cartRepository.getCartById(headers["x-user-id"]);

			// Response if searched cart does not exist or is already deleted
			if (!cart) {
				return {
					data: null,
					error: { message: "Internal Server error" },
					code: 500,
				};
			}

			// Delete cart
			await this.cartRepository.deleteCart(user.id);

			return {
				response: { data: { success: true }, error: null },
				code: 200,
			};
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
