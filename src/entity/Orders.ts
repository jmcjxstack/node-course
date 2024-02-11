import {
	Entity,
	PrimaryColumn,
	Column,
	OneToMany,
	ManyToOne,
	JoinColumn,
} from "typeorm";
import { Users } from "./Users";
import { Carts } from "./Carts";
import { OrderItem } from "./OrderItem";

@Entity()
export class Orders {
	@PrimaryColumn()
	id!: string;

	@Column()
	user_id!: string;

	@ManyToOne(() => Users)
	@JoinColumn({ name: "user_id" })
	user!: Users;

	@Column()
	cart_id!: string;

	@ManyToOne(() => Carts)
	@JoinColumn({ name: "cart_id" })
	cart!: Carts;

	@OneToMany(() => OrderItem, (item) => item.order, { cascade: true })
	items!: OrderItem[];

	@Column({ type: "jsonb", nullable: true })
	payment!: { type: string; address: string; creditCard: string };

	@Column({ type: "jsonb", nullable: true })
	delivery!: { type: string; address: string };

	@Column()
	comments!: string;

	@Column()
	status!: string;

	@Column()
	total!: number;
}
