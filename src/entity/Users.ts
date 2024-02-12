import { Entity, PrimaryColumn, Column } from "typeorm";

@Entity()
export class Users {
	@PrimaryColumn()
	id!: string;

	@Column({ unique: true })
	email!: string;

	@Column()
	role!: string;

	@Column()
	password!: string;
}
