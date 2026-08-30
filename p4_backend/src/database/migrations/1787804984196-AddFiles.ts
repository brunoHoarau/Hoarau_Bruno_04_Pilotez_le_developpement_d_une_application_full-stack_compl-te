import { MigrationInterface, QueryRunner } from "typeorm";

export class AddFiles1787804984196 implements MigrationInterface {
    name = 'AddFiles1787804984196'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "files" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "token" character varying NOT NULL, "filename" character varying NOT NULL, "originalName" character varying NOT NULL, "mimetype" character varying NOT NULL, "size" integer NOT NULL, "storagePath" character varying NOT NULL, "passwordHash" character varying, "expiresAt" TIMESTAMP NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer NOT NULL, CONSTRAINT "PK_6c16b9093a142e0e7613b04a3d9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_7c7b95b0da1d6a523dd122905b" ON "files"  ("token") `);
        await queryRunner.query(`ALTER TABLE "files" ADD CONSTRAINT "FK_7e7425b17f9e707331e9a6c7335" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "files" DROP CONSTRAINT "FK_7e7425b17f9e707331e9a6c7335"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_7c7b95b0da1d6a523dd122905b"`);
        await queryRunner.query(`DROP TABLE "files"`);
    }

}
