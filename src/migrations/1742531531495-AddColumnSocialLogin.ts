import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddColumnSocialLogin1742531531495 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const tableExists = await queryRunner.hasTable('post');
    if (!tableExists) {
      await queryRunner.query(`
                CREATE TABLE "post" (
                    "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                    "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                    "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                    "title" character varying NOT NULL,
                    "content" character varying NOT NULL,
                    "thumbnailUrl" character varying NOT NULL,
                    "views" integer NOT NULL DEFAULT '0',
                    "commentCount" integer NOT NULL DEFAULT '0',
                    "userId" uuid,
                    CONSTRAINT "PK_be5fda3aac270b134ff9c21cdee" PRIMARY KEY ("id")
                )
            `);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "post"`);
  }
}
