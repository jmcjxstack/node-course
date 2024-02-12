import {
	Entity,
	PrimaryColumn,
	Column,
	OneToMany,
	ManyToOne,
	JoinColumn,
} from "typeorm";

import { Users } from "./Users";
import { CartItem } from "./CartItem";

@Entity()
export class Carts {
	@PrimaryColumn()
	id!: string;

	@Column()
	user_id!: string;

	@ManyToOne(() => Users)
	@JoinColumn({ name: "user_id" })
	user!: Users;

	@Column()
	is_deleted!: boolean;

	@OneToMany(() => CartItem, (item) => item.cart, { cascade: true })
	items!: CartItem[];
}
