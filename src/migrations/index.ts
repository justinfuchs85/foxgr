import * as migration_20261103_181501_initial from './20261103_181501_initial';

export const migrations = [
  {
    up: migration_20261103_181501_initial.up,
    down: migration_20261103_181501_initial.down,
    name: '20261103_181501_initial'
  },
];
