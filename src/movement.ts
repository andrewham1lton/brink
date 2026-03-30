export const CANVAS_WIDTH = 960
export const CANVAS_HEIGHT = 540

export type Direction = 'up' | 'down' | 'left' | 'right'

export interface ControlsState {
  down: boolean
  left: boolean
  right: boolean
  up: boolean
}

export type Facing = 'left' | 'right'

export interface PlayerState {
  animationTime: number
  facing: Facing
  moving: boolean
  radius: number
  speed: number
  x: number
  y: number
}

export interface RoomBounds {
  maxX: number
  maxY: number
  minX: number
  minY: number
}

export const ROOM_BOUNDS: RoomBounds = {
  maxX: 844,
  maxY: 430,
  minX: 116,
  minY: 112,
}

export const INITIAL_PLAYER_STATE: PlayerState = {
  animationTime: 0,
  facing: 'right',
  moving: false,
  radius: 18,
  speed: 220,
  x: CANVAS_WIDTH / 2,
  y: CANVAS_HEIGHT / 2 + 52,
}

export const MOVEMENT_KEYS: Record<string, Direction> = {
  KeyA: 'left',
  KeyD: 'right',
  KeyS: 'down',
  KeyW: 'up',
}

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max)

export const stepPlayer = (
  player: PlayerState,
  controls: ControlsState,
  deltaTime: number,
  bounds: RoomBounds,
): PlayerState => {
  const horizontal = Number(controls.right) - Number(controls.left)
  const vertical = Number(controls.down) - Number(controls.up)
  const magnitude = Math.hypot(horizontal, vertical)

  if (magnitude === 0 || deltaTime <= 0) {
    return { ...player, moving: false }
  }

  const normalizedX = horizontal / magnitude
  const normalizedY = vertical / magnitude
  const distance = player.speed * deltaTime
  const facing: Facing =
    horizontal < 0 ? 'left' : horizontal > 0 ? 'right' : player.facing

  return {
    ...player,
    animationTime: player.animationTime + deltaTime,
    facing,
    moving: true,
    x: clamp(player.x + normalizedX * distance, bounds.minX, bounds.maxX),
    y: clamp(player.y + normalizedY * distance, bounds.minY, bounds.maxY),
  }
}
