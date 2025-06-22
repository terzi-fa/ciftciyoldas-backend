import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateFertilizerApplications1710000000002 implements MigrationInterface {
    name = 'CreateFertilizerApplications1710000000002'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Önce tabloyu sil (eğer varsa)
        await queryRunner.query(`DROP TABLE IF EXISTS "fertilizer_applications"`);

        // Sonra yeniden oluştur
        await queryRunner.query(`
            CREATE TABLE "fertilizer_applications" (
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "user_id" integer NOT NULL,
                "fertilizer_id" integer NOT NULL,
                "crop_type_id" integer NOT NULL,
                "growth_stage_id" integer NOT NULL,
                "dosage" varchar NOT NULL,
                "application_method" varchar NOT NULL,
                "application_date" datetime NOT NULL,
                "cost" float NOT NULL,
                "notes" varchar,
                "created_at" datetime NOT NULL DEFAULT (datetime('now')),
                "updated_at" datetime NOT NULL DEFAULT (datetime('now')),
                CONSTRAINT "FK_fertilizer_applications_user" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE,
                CONSTRAINT "FK_fertilizer_applications_fertilizer" FOREIGN KEY ("fertilizer_id") REFERENCES "fertilizers" ("id") ON DELETE CASCADE,
                CONSTRAINT "FK_fertilizer_applications_crop_type" FOREIGN KEY ("crop_type_id") REFERENCES "crop_types" ("id") ON DELETE CASCADE,
                CONSTRAINT "FK_fertilizer_applications_growth_stage" FOREIGN KEY ("growth_stage_id") REFERENCES "growth_stages" ("id") ON DELETE CASCADE
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "fertilizer_applications"`);
    }
} 