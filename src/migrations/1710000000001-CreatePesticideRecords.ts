import { MigrationInterface, QueryRunner } from "typeorm";

export class CreatePesticideRecords1710000000001 implements MigrationInterface {
    name = 'CreatePesticideRecords1710000000001'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Önce tabloyu sil (eğer varsa)
        await queryRunner.query(`DROP TABLE IF EXISTS "pesticide_records"`);

        // Sonra yeniden oluştur
        await queryRunner.query(`
            CREATE TABLE "pesticide_records" (
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "user_id" integer NOT NULL,
                "pesticide_name" varchar NOT NULL,
                "crop_type_id" integer NOT NULL,
                "growth_stage_id" integer NOT NULL,
                "dosage" varchar NOT NULL,
                "application_method" varchar NOT NULL,
                "effectiveness" float NOT NULL,
                "cost" float NOT NULL,
                "application_date" datetime NOT NULL,
                "target_pest" varchar NOT NULL,
                "temperature" float,
                "humidity" float,
                "wind_speed" float,
                "weather_description" varchar,
                "is_raining" boolean,
                "is_snowing" boolean,
                "weather_timestamp" datetime,
                "notes" varchar,
                "created_at" datetime NOT NULL DEFAULT (datetime('now')),
                "updated_at" datetime NOT NULL DEFAULT (datetime('now')),
                CONSTRAINT "FK_pesticide_records_user" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE,
                CONSTRAINT "FK_pesticide_records_crop_type" FOREIGN KEY ("crop_type_id") REFERENCES "crop_types" ("id") ON DELETE CASCADE,
                CONSTRAINT "FK_pesticide_records_growth_stage" FOREIGN KEY ("growth_stage_id") REFERENCES "growth_stages" ("id") ON DELETE CASCADE
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "pesticide_records"`);
    }
} 