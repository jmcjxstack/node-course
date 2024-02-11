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

			if (!cart) return null;

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

	async deleteCart(id: string) {
		try {
			const result = await AppDataSource.getRepository(Carts)
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
		}
	}

	// Method to add new cart item to cart
	async addCartItem(newCartItem: TODO): Promise<TODO> {
		try {
			const cartItem: TODO = await AppDataSource.getRepository(
				CartItem
			).create(newCartItem);

			const result: TODO = await AppDataSource.getRepository(
				CartItem
			).save(cartItem);

			return result;
		} catch (error) {
			// Error handling
			console.error(`Error adding cart item: ${error}`);
		}
	}

	async deleteCartItem(productId: string, cartId: string): Promise<TODO> {
		try {
			const result = await AppDataSource.getRepository(CartItem)
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
		}
	}

	async updateCartItem(
		productId: string,
		cartId: string,
		newCount: number
	): Promise<TODO> {
		try {
			const result = await AppDataSource.getRepository(CartItem)
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
		}
	}
}
