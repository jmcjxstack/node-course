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
	userId!: string;

	@ManyToOne(() => Users)
	@JoinColumn({ name: "userId" })
	user!: Users;

	@Column()
	isDeleted!: boolean;

	@OneToMany(() => CartItem, (item) => item.cart, { cascade: true })
	items!: CartItem[];
}
