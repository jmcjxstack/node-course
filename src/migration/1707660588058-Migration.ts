import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1707660588058 implements MigrationInterface {
    name = 'Migration1707660588058'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "orders" ("id" character varying NOT NULL, "user_id" character varying NOT NULL, "cart_id" character varying NOT NULL, "payment" jsonb, "delivery" jsonb, "comments" character varying NOT NULL, "status" character varying NOT NULL, "total" integer NOT NULL, CONSTRAINT "PK_710e2d4957aa5878dfe94e4ac2f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "orders_item" ("id" character varying NOT NULL, "order_id" character varying NOT NULL, "product_id" character varying NOT NULL, "count" integer NOT NULL, CONSTRAINT "PK_dc3e36e170f232cf73510c104eb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "orders" ADD CONSTRAINT "FK_a922b820eeef29ac1c6800e826a" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "orders" ADD CONSTRAINT "FK_f42b1d95404c45b10bf2451d814" FOREIGN KEY ("cart_id") REFERENCES "carts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "orders_item" ADD CONSTRAINT "FK_0e0ff232cdf5a2c66258406059b" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "orders_item" ADD CONSTRAINT "FK_6f49fc5aea9cc37e377a261c14b" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders_item" DROP CONSTRAINT "FK_6f49fc5aea9cc37e377a261c14b"`);
        await queryRunner.query(`ALTER TABLE "orders_item" DROP CONSTRAINT "FK_0e0ff232cdf5a2c66258406059b"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP CONSTRAINT "FK_f42b1d95404c45b10bf2451d814"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP CONSTRAINT "FK_a922b820eeef29ac1c6800e826a"`);
        await queryRunner.query(`DROP TABLE "orders_item"`);
        await queryRunner.query(`DROP TABLE "orders"`);
    }

}
