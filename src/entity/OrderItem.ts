import { Entity, PrimaryColumn, ManyToOne, JoinColumn, Column } from "typeorm";
import { Order } from "./Order";
import { Products } from "./Products";

@Entity()
export class OrderItem {
	@PrimaryColumn()
	id!: string;

	@Column()
	orderId!: string;

	@ManyToOne(() => Order, (order) => order.items)
	@JoinColumn({ name: "orderId" })
	order!: Order;

	@Column()
	productId!: string;

	@ManyToOne(() => Products, { cascade: true })
	@JoinColumn({ name: "productId" })
	product!: Products;

	@Column()
	count!: number;
}
