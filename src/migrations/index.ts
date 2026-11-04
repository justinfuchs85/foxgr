import * as migration_20261103_181501_initial from './20261103_181501_initial';
import * as migration_20261104_143218_s3_storage_fields from './20261104_143218_s3_storage_fields';

export const migrations = [
  {
    up: migration_20261103_181501_initial.up,
    down: migration_20261103_181501_initial.down,
    name: '20261103_181501_initial',
  },
  {
    up: migration_20261104_143218_s3_storage_fields.up,
    down: migration_20261104_143218_s3_storage_fields.down,
    name: '20261104_143218_s3_storage_fields'
  },
];
