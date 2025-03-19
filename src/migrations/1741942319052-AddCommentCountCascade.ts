import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCommentCountCascade1741942319052 implements MigrationInterface {
    name = 'AddCommentCountCascade1741942319052'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "comment" DROP CONSTRAINT "FK_e3aebe2bd1c53467a07109be596"`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email")`);
        await queryRunner.query(`ALTER TABLE "comment" ADD CONSTRAINT "FK_e3aebe2bd1c53467a07109be596" FOREIGN KEY ("parentId") REFERENCES "comment"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "comment" DROP CONSTRAINT "FK_e3aebe2bd1c53467a07109be596"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22"`);
        await queryRunner.query(`ALTER TABLE "comment" ADD CONSTRAINT "FK_e3aebe2bd1c53467a07109be596" FOREIGN KEY ("parentId") REFERENCES "comment"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
