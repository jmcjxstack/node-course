import { AppDataSource } from "../data-source";
import { Orders } from "../entity/Orders";
import { OrderItem } from "../entity/OrderItem";

import { TODO } from "../schemas/Todo";

export class OrderRepository {
	// Method to save orders
	async addOrder(newOrder: TODO): Promise<TODO> {
		try {
			const order: TODO = await AppDataSource.getRepository(
				Orders
			).create(newOrder);

			const result: TODO = await AppDataSource.getRepository(Orders).save(
				order
			);

			return result;
		} catch (error) {
			// Error handling
			console.error(`Error saving order: ${error}`);
		}
	}

	// Method to save order item
	async addOrderItem(newOrderItem: TODO): Promise<TODO> {
		try {
			const orderItem: TODO = await AppDataSource.getRepository(
				OrderItem
			).create(newOrderItem);

			const result: TODO = await AppDataSource.getRepository(
				OrderItem
			).save(orderItem);

			return result;
		} catch (error) {
			// Error handling
			console.error(`Error saving order item: ${error}`);
		}
	}
}
