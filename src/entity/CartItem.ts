import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from "typeorm";

import { Carts } from "./Carts";
import { Products } from "./Products";

@Entity()
export class CartItem {
	@PrimaryColumn()
	id!: string;

	@Column()
	cartId!: string;

	@ManyToOne(() => Carts, (cart) => cart.items)
	@JoinColumn({ name: "cartId" })
	cart!: Carts;

	@Column()
	productId!: string;

	@ManyToOne(() => Products, { cascade: true })
	@JoinColumn({ name: "productId" })
	product!: Products;

	@Column()
	count!: number;
}
