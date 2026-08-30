import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPhysicalDeletedAt1787805782051 implements MigrationInterface {
    name = 'AddPhysicalDeletedAt1787805782051'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "files" ADD "physicalDeletedAt" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "files" DROP COLUMN "physicalDeletedAt"`);
    }

}
