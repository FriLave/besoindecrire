import * as migration_20261001_133853_initial from './20261001_133853_initial';
import * as migration_20261001_171610_review_fixes from './20261001_171610_review_fixes';

export const migrations = [
  {
    up: migration_20261001_133853_initial.up,
    down: migration_20261001_133853_initial.down,
    name: '20261001_133853_initial',
  },
  {
    up: migration_20261001_171610_review_fixes.up,
    down: migration_20261001_171610_review_fixes.down,
    name: '20261001_171610_review_fixes'
  },
];
