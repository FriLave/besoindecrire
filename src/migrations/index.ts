import * as migration_20261001_133853_initial from './20261001_133853_initial';

export const migrations = [
  {
    up: migration_20261001_133853_initial.up,
    down: migration_20261001_133853_initial.down,
    name: '20261001_133853_initial'
  },
];
