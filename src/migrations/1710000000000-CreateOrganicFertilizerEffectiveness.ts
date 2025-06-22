import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateOrganicFertilizerEffectiveness1710000000000 implements MigrationInterface {
    name = 'CreateOrganicFertilizerEffectiveness1710000000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Önce tabloyu sil (eğer varsa)
        await queryRunner.query(`DROP TABLE IF EXISTS "organic_fertilizer_effectiveness"`);

        // Sonra yeniden oluştur
        await queryRunner.query(`
            CREATE TABLE "organic_fertilizer_effectiveness" (
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
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "organic_fertilizer_effectiveness"`);
    }
} 