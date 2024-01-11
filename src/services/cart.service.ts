import { v4 as uuidv4 } from "uuid";

import { CartRepository } from "../repositories/cart.repository";
import { UserRepository } from "../repositories/user.repository";
import { CartEntity } from "../schemas/cart.entity";

export class CartService {
	private cartRepository: CartRepository;
	private userRepository: UserRepository;

	constructor(
		cartRepository: CartRepository,
		userRepository: UserRepository
	) {
		this.cartRepository = cartRepository;
		this.userRepository = userRepository;
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

			// Find the cart that belongs to user
			const cart: CartEntity | undefined = carts.find(
				(cart) => cart.userId === user.id
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
}
