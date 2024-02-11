import { v4 as uuidv4 } from "uuid";

import { CartRepository } from "../repositories/cart.repository";
import { UserRepository } from "../repositories/user.repository";
import { OrderRepository } from "../repositories/order.repository";
import { Users } from "../entity/Users";

export class OrderService {
	private cartRepository: CartRepository;
	private userRepository: UserRepository;
	private orderRepository: OrderRepository;

	constructor(
		cartRepository: CartRepository,
		userRepository: UserRepository,
		orderRepository: OrderRepository
	) {
		this.cartRepository = cartRepository;
		this.userRepository = userRepository;
		this.orderRepository = orderRepository;
	}

	// Method to create order
	async createOrder(
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

			// Get cart with the id from the x-user-id header
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

			// Response if cart is empty
			if (cart.items.length === 0) {
				return {
					data: null,
					error: { message: "Cart is empty" },
					code: 400,
				};
			}

			// Calculate total cost of the order
			const totalCost: number = cart?.items.reduce(
				(acc: number, item: Record<string, any>) => {
					return acc + item.product.price * item.count;
				},
				0
			);

			// Create object to add order to database
			const orderToAdd: Record<string, any> = {
				id: uuidv4(),
				user_id: user.id,
				cart_id: cart.id,
				payment: {
					type: "paypal",
					address: "London",
					creditCard: "1234-1234-1234-1234",
				},
				delivery: { type: "post", address: "London" },
				comments: "",
				status: "created",
				total: totalCost,
			};

			// Add order to database
			await this.orderRepository.addOrder(orderToAdd);

			// Add order items to database
			await cart.items.map((item: Record<string, any>) =>
				this.orderRepository.addOrderItem({
					id: uuidv4(),
					order_id: orderToAdd.id,
					product_id: item.product.id,
					count: item.count,
				})
			);

			// Construct order object for response
			const orderResponse: Record<string, any> = {
				id: orderToAdd.id,
				userId: user.id,
				cartId: cart.id,
				items: cart.items,
				payment: {
					type: "paypal",
					address: "London",
					creditCard: "1234-1234-1234-1234",
				},
				delivery: { type: "post", address: "London" },
				comments: "",
				status: "created",
				total: totalCost,
			};

			return {
				response: { data: orderResponse, error: null },
				code: 200,
			};
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
