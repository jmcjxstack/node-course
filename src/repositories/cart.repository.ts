import { DeleteResult, UpdateResult } from "typeorm";

import { AppDataSource } from "../data-source";
import { CartItem } from "../entity/CartItem";
import { Carts } from "../entity/Carts";

export class CartRepository {
	// Method to get cart by its id
	async getCartById(id: string): Promise<Record<string, any> | null> {
		try {
			// Get non-deleted cart
			const cart: Carts | null = await AppDataSource.getRepository(Carts)
				.createQueryBuilder("carts")
				.where("carts.user_id = :user_id", { user_id: id })
				.andWhere("carts.is_deleted = :is_deleted", {
					is_deleted: false,
				})
				.getOne();

			if (!cart) return null;

			// Get cart items data using join between cart_item table and products table
			const cartItems: CartItem[] = await AppDataSource.getRepository(
				CartItem
			)
				.createQueryBuilder("cart_item")
				.innerJoinAndSelect("cart_item.product", "product")
				.where("cart_item.cart_id = :cart_id", { cart_id: cart?.id })
				.getMany();

			// Manipulate cartItems to create desired array
			const cartItemsTransformed: Record<string, any> = cartItems.map(
				(item) => ({
					product: {
						id: item.product_id,
						title: item.product.title,
						description: item.product.description,
						price: item.product.price,
					},
					count: item.count,
				})
			);

			// Create response object
			const cartResponse: Record<string, any> = {
				id: cart?.id,
				items: cartItemsTransformed,
			};

			return cartResponse;
		} catch (error) {
			// Error handling
			console.error(`Error getting cart: ${error}`);
			return null;
		}
	}

	// Method to save cart to database
	async addNewCart(newCart: Record<string, any>): Promise<Carts | null> {
		try {
			const cart: Carts = await AppDataSource.getRepository(Carts).create(
				newCart
			);

			const result: Carts = await AppDataSource.getRepository(Carts).save(
				cart
			);

			return result;
		} catch (error) {
			// Error handling
			console.error(`Error adding cart: ${error}`);
			return null;
		}
	}

	// Method to soft delete cart by its id
	async deleteCart(id: string): Promise<UpdateResult | null> {
		try {
			const result: UpdateResult = await AppDataSource.getRepository(
				Carts
			)
				.createQueryBuilder("carts")
				.update(Carts)
				.set({ is_deleted: true })
				.where("carts.user_id = :user_id", { user_id: id })
				.andWhere("carts.is_deleted = :is_deleted", {
					is_deleted: false,
				})
				.execute();

			return result;
		} catch (error) {
			// Error handling
			console.error(`Error deleting cart: ${error}`);
			return null;
		}
	}

	// Method to add new cart item to cart
	async addCartItem(
		newCartItem: Record<string, any>
	): Promise<CartItem | null> {
		try {
			const cartItem: CartItem = await AppDataSource.getRepository(
				CartItem
			).create(newCartItem);

			const result: CartItem = await AppDataSource.getRepository(
				CartItem
			).save(cartItem);

			return result;
		} catch (error) {
			// Error handling
			console.error(`Error adding cart item: ${error}`);
			return null;
		}
	}

	// Method to delete cart item given its product id and cart id
	async deleteCartItem(
		productId: string,
		cartId: string
	): Promise<DeleteResult | null> {
		try {
			const result: DeleteResult = await AppDataSource.getRepository(
				CartItem
			)
				.createQueryBuilder("cart_item")
				.delete()
				.from(CartItem)
				.where("cart_item.cart_id = :cart_id", { cart_id: cartId })
				.andWhere("cart_item.product_id = :product_id", {
					product_id: productId,
				})
				.execute();

			return result;
		} catch (error) {
			// Error handling
			console.error(`Error deleting cart item: ${error}`);
			return null;
		}
	}

	// Method to update cart item
	async updateCartItem(
		productId: string,
		cartId: string,
		newCount: number
	): Promise<UpdateResult | null> {
		try {
			const result: UpdateResult = await AppDataSource.getRepository(
				CartItem
			)
				.createQueryBuilder("cart_item")
				.update(CartItem)
				.set({ count: newCount })
				.where("cart_item.cart_id = :cart_id", { cart_id: cartId })
				.andWhere("cart_item.product_id = :product_id", {
					product_id: productId,
				})
				.execute();

			return result;
		} catch (error) {
			// Error handling
			console.error(`Error updating cart item: ${error}`);
			return null;
		}
	}
}
