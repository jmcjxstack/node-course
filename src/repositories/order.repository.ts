import { AppDataSource } from "../data-source";
import { Orders } from "../entity/Orders";
import { OrderItem } from "../entity/OrderItem";

import { TODO } from "../schemas/Todo";

export class OrderRepository {
	// Method to save orders
	async addOrder(newOrder: Record<string, any>): Promise<Orders | null> {
		try {
			const order: Orders = await AppDataSource.getRepository(
				Orders
			).create(newOrder);

			const result: Orders = await AppDataSource.getRepository(
				Orders
			).save(order);

			return result;
		} catch (error) {
			// Error handling
			console.error(`Error saving order: ${error}`);
			return null;
		}
	}

	// Method to save order item
	async addOrderItem(newOrderItem: Record<string, any>): Promise<OrderItem | null> {
		try {
			const orderItem: OrderItem = await AppDataSource.getRepository(
				OrderItem
			).create(newOrderItem);

			const result: OrderItem  = await AppDataSource.getRepository(
				OrderItem
			).save(orderItem);

			return result;
		} catch (error) {
			// Error handling
			console.error(`Error saving order item: ${error}`);
			return null
		}
	}
}
