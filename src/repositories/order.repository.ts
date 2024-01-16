import fs from "fs/promises";
import path from "path";

import { OrderEntity } from "../schemas/order.entity";

export class OrderRepository {
	private ordersFilePath: string = path.join(
		__dirname,
		"../data/orders.json"
	);

	// Method to get list of orders
	async getOrders(): Promise<OrderEntity[]> {
		try {
			// Reads the contents of the file
			const content: string = await fs.readFile(
				this.ordersFilePath,
				"utf-8"
			);

			// Returns the contents of the file parsed as an object
			return JSON.parse(content);
		} catch (error) {
			// Error handling
			console.log(`Error getting list of orders: ${error}`);
			return [];
		}
	}

	// Method to save orders
	async saveOrders(orders: OrderEntity[]): Promise<void> {
		try {
			// Stringifies array of orders and saves it to file
			await fs.writeFile(
				this.ordersFilePath,
				JSON.stringify(orders, null, 2),
				"utf-8"
			);
		} catch (error) {
			// Error handling
			console.log(`Error writing to file: ${error}`);
		}
	}
}
