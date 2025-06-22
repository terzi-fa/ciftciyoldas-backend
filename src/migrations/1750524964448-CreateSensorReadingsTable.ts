import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateSensorReadingsTable1750524964448 implements MigrationInterface {
    name = 'CreateSensorReadingsTable1750524964448'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "sensor_readings" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "value" decimal(10,2) NOT NULL, "type" varchar NOT NULL, "timestamp" datetime NOT NULL DEFAULT (datetime('now')), "sensorId" integer)`);
        await queryRunner.query(`CREATE TABLE "temporary_sensor_readings" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "value" decimal(10,2) NOT NULL, "type" varchar NOT NULL, "timestamp" datetime NOT NULL DEFAULT (datetime('now')), "sensorId" integer, CONSTRAINT "FK_2294ea040e40e484fc719bd75bc" FOREIGN KEY ("sensorId") REFERENCES "sensors" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_sensor_readings"("id", "value", "type", "timestamp", "sensorId") SELECT "id", "value", "type", "timestamp", "sensorId" FROM "sensor_readings"`);
        await queryRunner.query(`DROP TABLE "sensor_readings"`);
        await queryRunner.query(`ALTER TABLE "temporary_sensor_readings" RENAME TO "sensor_readings"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sensor_readings" RENAME TO "temporary_sensor_readings"`);
        await queryRunner.query(`CREATE TABLE "sensor_readings" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "value" decimal(10,2) NOT NULL, "type" varchar NOT NULL, "timestamp" datetime NOT NULL DEFAULT (datetime('now')), "sensorId" integer)`);
        await queryRunner.query(`INSERT INTO "sensor_readings"("id", "value", "type", "timestamp", "sensorId") SELECT "id", "value", "type", "timestamp", "sensorId" FROM "temporary_sensor_readings"`);
        await queryRunner.query(`DROP TABLE "temporary_sensor_readings"`);
        await queryRunner.query(`DROP TABLE "sensor_readings"`);
    }

}
