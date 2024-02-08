import { AppDataSource } from "../data-source";

import { CartItem } from "../entity/CartItem";
import { Carts } from "../entity/Carts";
import { TODO } from "../schemas/Todo";

export class CartRepository {
	// Method to get list of carts
	async getCartById(id: string): Promise<TODO> {
		try {
			// Get non-deleted cart using id
			const cart = await AppDataSource.getRepository(Carts)
				.createQueryBuilder("carts")
				.where("carts.user_id = :user_id", { user_id: id })
				.andWhere("carts.is_deleted = :is_deleted", {
					is_deleted: false,
				})
				.getOne();

			// Get cart items data using join between cart_item table and products table
			const cartItems = await AppDataSource.getRepository(CartItem)
				.createQueryBuilder("cart_item")
				.innerJoinAndSelect("cart_item.product", "product")
				.where("cart_item.cart_id = :cart_id", { cart_id: cart?.id })
				.getMany();

			const cartItemsTransformed = cartItems.map((item) => ({
				product: {
					id: item.product_id,
					title: item.product.title,
					description: item.product.description,
					price: item.product.price,
				},
				count: item.count,
			}));

			const cartResponse = {
				id: cart?.id,
				items: cartItemsTransformed,
			};

			// return cart data
			return cartResponse;
		} catch (error) {
			// Error handling
			console.error(`Error getting cart: ${error}`);
			return null;
		}
	}

	// Method to save carts
	async addNewCart(newCart: TODO): Promise<TODO> {
		try {
			const cart: TODO = await AppDataSource.getRepository(Carts).create(
				newCart
			);

			const result: TODO = await AppDataSource.getRepository(Carts).save(
				cart
			);

			return result;
		} catch (error) {
			// Error handling
			console.error(`Error adding cart: ${error}`);
		}
	}
}
