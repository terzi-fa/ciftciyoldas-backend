import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateFertilizerRules implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'fertilizer_rules',
        columns: [
          { name: 'id', type: 'integer', isPrimary: true, isGenerated: true, generationStrategy: 'increment' },
          { name: 'crop_type_id', type: 'integer' },
          { name: 'growth_stage_id', type: 'integer' },
          { name: 'nutrient_type', type: 'varchar' },
          { name: 'operator', type: 'varchar' },
          { name: 'value', type: 'float' },
          { name: 'fertilizer_id', type: 'integer' },
          { name: 'dosage', type: 'varchar', isNullable: true },
          { name: 'application_method', type: 'varchar', isNullable: true },
          { name: 'notes', type: 'varchar', isNullable: true },
        ],
      }),
    );

    await queryRunner.createForeignKey(
      'fertilizer_rules',
      new TableForeignKey({
        columnNames: ['fertilizer_id'],
        referencedTableName: 'organic_fertilizers',
        referencedColumnNames: ['id'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('fertilizer_rules');
  }
}