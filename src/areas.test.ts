import { describe, expect, it } from 'vitest'

import { getAreaDefinition, resolveAreaMusic } from './areas'

describe('resolveAreaMusic', () => {
  it('returns the bedroom home track for ambient exploration', () => {
    expect(resolveAreaMusic('bedroom', 'ambient')?.id).toBe('home')
  })

  it('returns the bedroom home track during cutscenes', () => {
    expect(resolveAreaMusic('bedroom', 'cutscene')?.id).toBe('home')
  })

  it('keeps the ambient track defined for future situation fallbacks', () => {
    expect(getAreaDefinition('bedroom').music.ambient?.id).toBe('home')
  })
})
