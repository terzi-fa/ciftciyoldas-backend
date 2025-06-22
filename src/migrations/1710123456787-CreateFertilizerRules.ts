import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateFertilizerRules1710123456787 implements MigrationInterface {
    name = 'CreateFertilizerRules1710123456787'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Sadece yeni tabloları oluştur, mevcut tabloya dokunma
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS "organic_fertilizer_effectiveness" (
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "user_id" integer NOT NULL,
                "fertilizer_id" integer NOT NULL,
                "crop_type_id" integer NOT NULL,
                "growth_stage_id" integer NOT NULL,
                "effectiveness" float NOT NULL,
                "soil_health_impact" float NOT NULL,
                "cost" float NOT NULL,
                "application_date" datetime NOT NULL,
                "notes" varchar,
                "created_at" datetime NOT NULL DEFAULT (datetime('now')),
                "updated_at" datetime NOT NULL DEFAULT (datetime('now')),
                CONSTRAINT "FK_organic_fertilizer_effectiveness_user" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE,
                CONSTRAINT "FK_organic_fertilizer_effectiveness_fertilizer" FOREIGN KEY ("fertilizer_id") REFERENCES "organic_fertilizers" ("id") ON DELETE CASCADE,
                CONSTRAINT "FK_organic_fertilizer_effectiveness_crop_type" FOREIGN KEY ("crop_type_id") REFERENCES "crop_types" ("id") ON DELETE CASCADE,
                CONSTRAINT "FK_organic_fertilizer_effectiveness_growth_stage" FOREIGN KEY ("growth_stage_id") REFERENCES "growth_stages" ("id") ON DELETE CASCADE
            )
        `);

        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS "pesticide_records" (
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

        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS "news" (
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "title" varchar NOT NULL,
                "content" text NOT NULL,
                "image_url" varchar,
                "source_url" varchar,
                "published_at" datetime NOT NULL,
                "created_at" datetime NOT NULL DEFAULT (datetime('now')),
                "updated_at" datetime NOT NULL DEFAULT (datetime('now'))
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE IF EXISTS "organic_fertilizer_effectiveness"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "pesticide_records"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "news"`);
    }
} 