import { Entity, PrimaryColumn, ManyToOne, JoinColumn, Column } from "typeorm";
import { Orders } from "./Orders";
import { Products } from "./Products";

@Entity()
export class OrderItem {
	@PrimaryColumn()
	id!: string;

	@Column()
	order_id!: string;

	@ManyToOne(() => Orders, (order) => order.items)
	@JoinColumn({ name: "order_id" })
	order!: Orders;

	@Column()
	product_id!: string;

	@ManyToOne(() => Products, { cascade: true })
	@JoinColumn({ name: "product_id" })
	product!: Products;

	@Column()
	count!: number;
}
