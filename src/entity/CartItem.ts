import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from "typeorm";

import { Carts } from "./Carts";
import { Products } from "./Products";

@Entity()
export class CartItem {
	@PrimaryColumn()
	id!: string;

	@Column()
	cart_id!: string;

	@ManyToOne(() => Carts, (cart) => cart.items)
	@JoinColumn({ name: "cart_id" })
	cart!: Carts;

	@Column()
	product_id!: string;

	@ManyToOne(() => Products, { cascade: true })
	@JoinColumn({ name: "product_id" })
	product!: Products;

	@Column()
	count!: number;
}
