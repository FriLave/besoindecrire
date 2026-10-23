import * as migration_20261001_133853_initial from './20261001_133853_initial';
import * as migration_20261001_171610_review_fixes from './20261001_171610_review_fixes';
import * as migration_20261009_155313_besoindecrire_blocks from './20261009_155313_besoindecrire_blocks';

export const migrations = [
  {
    up: migration_20261001_133853_initial.up,
    down: migration_20261001_133853_initial.down,
    name: '20261001_133853_initial',
  },
  {
    up: migration_20261001_171610_review_fixes.up,
    down: migration_20261001_171610_review_fixes.down,
    name: '20261001_171610_review_fixes',
  },
  {
    up: migration_20261009_155313_besoindecrire_blocks.up,
    down: migration_20261009_155313_besoindecrire_blocks.down,
    name: '20261009_155313_besoindecrire_blocks'
  },
];
