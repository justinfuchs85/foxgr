import * as migration_20261102_203331_initial from './20261102_203331_initial';

export const migrations = [
  {
    up: migration_20261102_203331_initial.up,
    down: migration_20261102_203331_initial.down,
    name: '20261102_203331_initial'
  },
];
