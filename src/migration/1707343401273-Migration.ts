import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1707343401273 implements MigrationInterface {
    name = 'Migration1707343401273'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cart_item" DROP CONSTRAINT "FK_29e590514f9941296f3a2440d39"`);
        await queryRunner.query(`ALTER TABLE "cart_item" DROP CONSTRAINT "FK_75db0de134fe0f9fe9e4591b7bf"`);
        await queryRunner.query(`ALTER TABLE "carts" DROP CONSTRAINT "FK_69828a178f152f157dcf2f70a89"`);
        await queryRunner.query(`ALTER TABLE "order" DROP CONSTRAINT "FK_caabe91507b3379c7ba73637b84"`);
        await queryRunner.query(`ALTER TABLE "order" DROP CONSTRAINT "FK_fe3963d525b2ee03ba471953a7c"`);
        await queryRunner.query(`ALTER TABLE "order_item" DROP CONSTRAINT "FK_646bf9ece6f45dbe41c203e06e0"`);
        await queryRunner.query(`ALTER TABLE "order_item" DROP CONSTRAINT "FK_904370c093ceea4369659a3c810"`);
        await queryRunner.query(`ALTER TABLE "cart_item" DROP COLUMN "cartId"`);
        await queryRunner.query(`ALTER TABLE "cart_item" DROP COLUMN "productId"`);
        await queryRunner.query(`ALTER TABLE "carts" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "carts" DROP COLUMN "isDeleted"`);
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "cartId"`);
        await queryRunner.query(`ALTER TABLE "order_item" DROP COLUMN "orderId"`);
        await queryRunner.query(`ALTER TABLE "order_item" DROP COLUMN "productId"`);
        await queryRunner.query(`ALTER TABLE "cart_item" ADD "cart_id" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "cart_item" ADD "product_id" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "carts" ADD "user_id" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "carts" ADD "is_deleted" boolean NOT NULL`);
        await queryRunner.query(`ALTER TABLE "order" ADD "user_id" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "order" ADD "cart_id" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "order_item" ADD "order_id" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "order_item" ADD "product_id" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "cart_item" ADD CONSTRAINT "FK_b6b2a4f1f533d89d218e70db941" FOREIGN KEY ("cart_id") REFERENCES "carts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "cart_item" ADD CONSTRAINT "FK_67a2e8406e01ffa24ff9026944e" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "carts" ADD CONSTRAINT "FK_2ec1c94a977b940d85a4f498aea" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order" ADD CONSTRAINT "FK_199e32a02ddc0f47cd93181d8fd" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order" ADD CONSTRAINT "FK_c99a206eb11ad45f6b7f04f2dcc" FOREIGN KEY ("cart_id") REFERENCES "carts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order_item" ADD CONSTRAINT "FK_e9674a6053adbaa1057848cddfa" FOREIGN KEY ("order_id") REFERENCES "order"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order_item" ADD CONSTRAINT "FK_5e17c017aa3f5164cb2da5b1c6b" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order_item" DROP CONSTRAINT "FK_5e17c017aa3f5164cb2da5b1c6b"`);
        await queryRunner.query(`ALTER TABLE "order_item" DROP CONSTRAINT "FK_e9674a6053adbaa1057848cddfa"`);
        await queryRunner.query(`ALTER TABLE "order" DROP CONSTRAINT "FK_c99a206eb11ad45f6b7f04f2dcc"`);
        await queryRunner.query(`ALTER TABLE "order" DROP CONSTRAINT "FK_199e32a02ddc0f47cd93181d8fd"`);
        await queryRunner.query(`ALTER TABLE "carts" DROP CONSTRAINT "FK_2ec1c94a977b940d85a4f498aea"`);
        await queryRunner.query(`ALTER TABLE "cart_item" DROP CONSTRAINT "FK_67a2e8406e01ffa24ff9026944e"`);
        await queryRunner.query(`ALTER TABLE "cart_item" DROP CONSTRAINT "FK_b6b2a4f1f533d89d218e70db941"`);
        await queryRunner.query(`ALTER TABLE "order_item" DROP COLUMN "product_id"`);
        await queryRunner.query(`ALTER TABLE "order_item" DROP COLUMN "order_id"`);
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "cart_id"`);
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "user_id"`);
        await queryRunner.query(`ALTER TABLE "carts" DROP COLUMN "is_deleted"`);
        await queryRunner.query(`ALTER TABLE "carts" DROP COLUMN "user_id"`);
        await queryRunner.query(`ALTER TABLE "cart_item" DROP COLUMN "product_id"`);
        await queryRunner.query(`ALTER TABLE "cart_item" DROP COLUMN "cart_id"`);
        await queryRunner.query(`ALTER TABLE "order_item" ADD "productId" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "order_item" ADD "orderId" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "order" ADD "cartId" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "order" ADD "userId" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "carts" ADD "isDeleted" boolean NOT NULL`);
        await queryRunner.query(`ALTER TABLE "carts" ADD "userId" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "cart_item" ADD "productId" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "cart_item" ADD "cartId" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "order_item" ADD CONSTRAINT "FK_904370c093ceea4369659a3c810" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order_item" ADD CONSTRAINT "FK_646bf9ece6f45dbe41c203e06e0" FOREIGN KEY ("orderId") REFERENCES "order"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order" ADD CONSTRAINT "FK_fe3963d525b2ee03ba471953a7c" FOREIGN KEY ("cartId") REFERENCES "carts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order" ADD CONSTRAINT "FK_caabe91507b3379c7ba73637b84" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "carts" ADD CONSTRAINT "FK_69828a178f152f157dcf2f70a89" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "cart_item" ADD CONSTRAINT "FK_75db0de134fe0f9fe9e4591b7bf" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "cart_item" ADD CONSTRAINT "FK_29e590514f9941296f3a2440d39" FOREIGN KEY ("cartId") REFERENCES "carts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
