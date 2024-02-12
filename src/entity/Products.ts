import { Entity, PrimaryColumn, Column } from "typeorm";

@Entity()
export class Products {
	@PrimaryColumn()
	id!: string;

	@Column()
	title!: string;

	@Column()
	description!: string;

	@Column()
	price!: number;
}
