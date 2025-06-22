import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateNews1710000000003 implements MigrationInterface {
    name = 'CreateNews1710000000003'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Önce tabloyu sil (eğer varsa)
        await queryRunner.query(`DROP TABLE IF EXISTS "news"`);

        // Sonra yeniden oluştur
        await queryRunner.query(`
            CREATE TABLE "news" (
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
        await queryRunner.query(`DROP TABLE "news"`);
    }
} 