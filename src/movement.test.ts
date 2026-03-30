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
    )

    expect(next.y).toBeLessThan(INITIAL_PLAYER_STATE.y)
    expect(next.x).toBe(INITIAL_PLAYER_STATE.x)
  })

  it('normalizes diagonal movement speed', () => {
    const next = stepPlayer(
      INITIAL_PLAYER_STATE,
      { ...neutralControls(), right: true, up: true },
      1,
      ROOM_BOUNDS,
    )

    const distance = Math.hypot(
      next.x - INITIAL_PLAYER_STATE.x,
      next.y - INITIAL_PLAYER_STATE.y,
    )

    expect(distance).toBeCloseTo(INITIAL_PLAYER_STATE.speed, 5)
  })

  it('clamps movement to the room bounds', () => {
    const next = stepPlayer(
      { ...INITIAL_PLAYER_STATE, x: ROOM_BOUNDS.maxX, y: ROOM_BOUNDS.maxY },
      { ...neutralControls(), down: true, right: true },
      1,
      ROOM_BOUNDS,
    )

    expect(next.x).toBe(ROOM_BOUNDS.maxX)
    expect(next.y).toBe(ROOM_BOUNDS.maxY)
  })
})
