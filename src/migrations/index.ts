import * as migration_20261103_181501_initial from './20261103_181501_initial';
import * as migration_20261104_143218_s3_storage_fields from './20261104_143218_s3_storage_fields';
import * as migration_20261104_174226_homepage_sections from './20261104_174226_homepage_sections';
import * as migration_20261104_174500_homepage_redesign_content from './20261104_174500_homepage_redesign_content';

export const migrations = [
  {
    up: migration_20261103_181501_initial.up,
    down: migration_20261103_181501_initial.down,
    name: '20261103_181501_initial',
  },
  {
    up: migration_20261104_143218_s3_storage_fields.up,
    down: migration_20261104_143218_s3_storage_fields.down,
    name: '20261104_143218_s3_storage_fields',
  },
  {
    up: migration_20261104_174226_homepage_sections.up,
    down: migration_20261104_174226_homepage_sections.down,
    name: '20261104_174226_homepage_sections'
  },
  {
    up: migration_20261104_174500_homepage_redesign_content.up,
    down: migration_20261104_174500_homepage_redesign_content.down,
    name: '20261104_174500_homepage_redesign_content',
  },
];
