import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class CreateExtensionUuidOssps extends BaseSchema {
  protected tableName = 'create_extension_uuid_ossps';

  public async up() {
    this.schema.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
  }

  public async down() {
    this.schema.raw('DROP EXTENSION IF EXISTS "uuid-ossp"');
  }
}
