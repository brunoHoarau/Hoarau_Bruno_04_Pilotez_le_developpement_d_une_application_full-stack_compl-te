import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveRoleFromUser1787279057181 implements MigrationInterface {
    name = 'RemoveRoleFromUser1787279057181'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "role"`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "name" SET DEFAULT 'John Doe'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "name" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "user" ADD "role" character varying NOT NULL DEFAULT 'user'`);
    }

}
