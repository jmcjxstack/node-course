import { v4 as uuidv4 } from "uuid";

import { CartRepository } from "../repositories/cart.repository";
import { UserRepository } from "../repositories/user.repository";
import { ProductsRepository } from "../repositories/products.repository";
import { OrderRepository } from "../repositories/order.repository";
import { CartEntity } from "../schemas/cart.entity";
import { OrderEntity } from "../schemas/order.entity";

export class OrderService {
	private cartRepository: CartRepository;
	private userRepository: UserRepository;
	private orderRepository: OrderRepository;

	constructor(
		cartRepository: CartRepository,
		userRepository: UserRepository,
		productsRepository: ProductsRepository,
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

			// Get the array of users with getUsers method from userRepository
			const users: Record<string, any>[] =
				await this.userRepository.getUser("a");

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

			// Response if cart is empty
			if (cart.items.length === 0) {
				return {
					data: null,
					error: { message: "Cart is empty" },
					code: 400,
				};
			}

			// Calculate total cost of the order
			const totalCost: number | undefined = cart?.items.reduce(
				(acc, item) => {
					return acc + item.product.price * item.count;
				},
				0
			);

			// Generate new UUID
			const id: string = uuidv4();

			// Construct order to be saved to file
			const order: OrderEntity = {
				id,
				userId: cart.userId,
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

			// Get the array of orders with getOrders method from orderRepository
			const orders: OrderEntity[] =
				await this.orderRepository.getOrders();

			// Add the new order object to orders array
			orders.push(order);

			// Save updated orders array to file using saveOrders method from orderRepository
			await this.orderRepository.saveOrders(orders);

			// Construct data object for response
			const orderResponse: Record<string, any> = {
				order,
			};

			return { data: orderResponse, error: null, code: 200 };
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
