// @vitest-environment node
import { describe, expect, it } from 'vitest'

import {
  HONEYPOT_FIELD,
  MAX_VALUE_LENGTH,
  MIN_FILL_MS,
  FILL_MS_FIELD,
  inspectSubmission,
} from '@/blocks/Form/spam'

const allowed = new Set(['name', 'message'])
const ok = { field: FILL_MS_FIELD, value: String(MIN_FILL_MS + 1) }
const run = (rows: { field: string; value: unknown }[]) => inspectSubmission(rows, allowed)

describe('inspectSubmission', () => {
  it('accepts a valid submission and strips control rows', () => {
    expect(run([{ field: 'name', value: 'A' }, { field: HONEYPOT_FIELD, value: '' }, ok])).toEqual({
      rows: [{ field: 'name', value: 'A' }],
    })
  })
  it('rejects a filled honeypot', () => {
    expect(run([{ field: HONEYPOT_FIELD, value: 'x' }, ok])).toEqual({ reject: 'honeypot' })
  })
  it('rejects too fast or missing timestamp', () => {
    expect(run([{ field: FILL_MS_FIELD, value: '100' }])).toEqual({
      reject: 'tooFast',
    })
    expect(run([{ field: 'name', value: 'A' }])).toEqual({ reject: 'tooFast' })
  })
  it('rejects unknown and duplicate field names', () => {
    expect(run([{ field: 'evil', value: 'x' }, ok])).toEqual({ reject: 'unknownField' })
    expect(run([{ field: 'name', value: 'a' }, { field: 'name', value: 'b' }, ok])).toEqual({
      reject: 'duplicate',
    })
  })
  it('rejects oversized values', () => {
    expect(run([{ field: 'message', value: 'x'.repeat(MAX_VALUE_LENGTH + 1) }, ok])).toEqual({
      reject: 'tooLong',
    })
  })
})
