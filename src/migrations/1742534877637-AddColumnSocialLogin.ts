import { MigrationInterface, QueryRunner } from "typeorm";

export class AddColumnSocialLogin1742534877637 implements MigrationInterface {
    name = 'AddColumnSocialLogin1742534877637'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "socialId" character varying DEFAULT 'common'`);
        await queryRunner.query(`CREATE TYPE "public"."user_socialtype_enum" AS ENUM('google', 'kakao', 'naver', 'common')`);
        await queryRunner.query(`ALTER TABLE "user" ADD "socialType" "public"."user_socialtype_enum" NOT NULL DEFAULT 'common'`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "password" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "password" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "socialType"`);
        await queryRunner.query(`DROP TYPE "public"."user_socialtype_enum"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "socialId"`);
    }

}
