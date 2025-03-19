import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUserRole1742202686329 implements MigrationInterface {
    name = 'AddUserRole1742202686329'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "role" character varying NOT NULL DEFAULT 'user'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "role"`);
    }

}
