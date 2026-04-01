import { describe, expect, it } from 'vitest'

import {
  INITIAL_PLAYER_STATE,
  ROOM_BOUNDS,
  stepPlayer,
  type ControlsState,
} from './movement'

const neutralControls = (): ControlsState => ({
  down: false,
  left: false,
  right: false,
  up: false,
})

describe('stepPlayer', () => {
  it('moves upward with W input', () => {
    const next = stepPlayer(
      INITIAL_PLAYER_STATE,
      { ...neutralControls(), up: true },
      0.25,
      ROOM_BOUNDS,
      [],
    )

    expect(next.y).toBeLessThan(INITIAL_PLAYER_STATE.y)
    expect(next.x).toBe(INITIAL_PLAYER_STATE.x)
  })

  it('normalizes diagonal movement speed', () => {
    // Place player in center of a large bounds so clamping doesn't interfere
    const largeBounds = { minX: 0, maxX: 2000, minY: 0, maxY: 2000 }
    const centeredPlayer = { ...INITIAL_PLAYER_STATE, x: 1000, y: 1000, inBed: false }
    const next = stepPlayer(
      centeredPlayer,
      { ...neutralControls(), right: true, up: true },
      1,
      largeBounds,
      [],
    )

    const distance = Math.hypot(
      next.x - centeredPlayer.x,
      next.y - centeredPlayer.y,
    )

    expect(distance).toBeCloseTo(INITIAL_PLAYER_STATE.speed, 5)
  })

  it('clamps movement to the room bounds', () => {
    const next = stepPlayer(
      { ...INITIAL_PLAYER_STATE, x: ROOM_BOUNDS.maxX, y: ROOM_BOUNDS.maxY },
      { ...neutralControls(), down: true, right: true },
      1,
      ROOM_BOUNDS,
      [],
    )

    expect(next.x).toBe(ROOM_BOUNDS.maxX)
    expect(next.y).toBe(ROOM_BOUNDS.maxY)
  })

  it('resolves collision with furniture hitbox', () => {
    const hitbox = { x: 400, y: 300, width: 100, height: 100 }
    const playerInside = {
      ...INITIAL_PLAYER_STATE,
      x: 450,
      y: 299,
    }

    const next = stepPlayer(
      playerInside,
      { ...neutralControls(), down: true },
      0.1,
      ROOM_BOUNDS,
      [hitbox],
    )

    // Player should be pushed above the hitbox
    expect(next.y).toBeLessThanOrEqual(300 - INITIAL_PLAYER_STATE.radius)
  })
})
