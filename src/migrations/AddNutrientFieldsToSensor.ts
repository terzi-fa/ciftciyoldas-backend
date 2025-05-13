// src/migrations/1710123456789-AddNutrientFieldsToSensor.ts
import { MigrationInterface, QueryRunner } from "typeorm";

export class AddNutrientFieldsToSensor1710123456789 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE sensors
            ADD COLUMN IF NOT EXISTS magnesium_ratio DECIMAL(10,2),
            ADD COLUMN IF NOT EXISTS boron_ratio DECIMAL(10,2),
            ADD COLUMN IF NOT EXISTS sulfur_ratio DECIMAL(10,2),
            ADD COLUMN IF NOT EXISTS zinc_ratio DECIMAL(10,2),
            ADD COLUMN IF NOT EXISTS calcium_ratio DECIMAL(10,2),
            ADD COLUMN IF NOT EXISTS iron_ratio DECIMAL(10,2)
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE sensors
            DROP COLUMN IF EXISTS magnesium_ratio,
            DROP COLUMN IF EXISTS boron_ratio,
            DROP COLUMN IF EXISTS sulfur_ratio,
            DROP COLUMN IF EXISTS zinc_ratio,
            DROP COLUMN IF EXISTS calcium_ratio,
            DROP COLUMN IF EXISTS iron_ratio
        `);
    }
}