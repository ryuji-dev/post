import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCommentCount1741856051091 implements MigrationInterface {
    name = 'AddCommentCount1741856051091'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "post" ADD "commentCount" integer NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "post" DROP COLUMN "commentCount"`);
    }

}
