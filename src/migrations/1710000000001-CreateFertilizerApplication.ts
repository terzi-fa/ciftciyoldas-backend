import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateFertilizerApplication1710000000001 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'fertilizer_applications',
        columns: [
          {
            name: 'id',
            type: 'integer',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'user_id',
            type: 'int',
          },
          {
            name: 'field_id',
            type: 'int',
          },
          {
            name: 'fertilizer_id',
            type: 'int',
          },
          {
            name: 'amount',
            type: 'decimal',
            precision: 10,
            scale: 2,
          },
          {
            name: 'cost',
            type: 'decimal',
            precision: 10,
            scale: 2,
          },
          {
            name: 'application_date',
            type: 'timestamp',
          },
          {
            name: 'notes',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'weather_conditions',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'effectiveness',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'soil_health_impact',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'fertilizer_applications',
      new TableForeignKey({
        columnNames: ['user_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'fertilizer_applications',
      new TableForeignKey({
        columnNames: ['field_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'fields',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'fertilizer_applications',
      new TableForeignKey({
        columnNames: ['fertilizer_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'fertilizers',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('fertilizer_applications');
    
    if (table) {
      const foreignKeys = table.foreignKeys;
      for (const foreignKey of foreignKeys) {
        await queryRunner.dropForeignKey('fertilizer_applications', foreignKey);
      }
      await queryRunner.dropTable('fertilizer_applications');
    }
  }
} 