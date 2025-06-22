import { MigrationInterface, QueryRunner } from "typeorm";

export class AddSensorFieldRelation1720000000000 implements MigrationInterface {
    name = 'AddSensorFieldRelation1720000000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sensors" ADD "field_id" integer`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sensors" DROP COLUMN "field_id"`);
    }

} 