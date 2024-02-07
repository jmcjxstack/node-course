import { Entity, PrimaryColumn, ManyToOne, JoinColumn, Column } from "typeorm";
import { Order } from "./Order";
import { Products } from "./Products";

@Entity()
export class OrderItem {
	@PrimaryColumn()
	id!: string;

	@Column()
	order_id!: string;

	@ManyToOne(() => Order, (order) => order.items)
	@JoinColumn({ name: "order_id" })
	order!: Order;

	@Column()
	product_id!: string;

	@ManyToOne(() => Products, { cascade: true })
	@JoinColumn({ name: "product_id" })
	product!: Products;

	@Column()
	count!: number;
}
