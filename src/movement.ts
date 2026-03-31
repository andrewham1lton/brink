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
  maxX: 940,
  maxY: 505,
  minX: 20,
  minY: 170,
}

export interface Rect {
  height: number
  width: number
  x: number
  y: number
}

export const FURNITURE_HITBOXES: Rect[] = [
  { x: 96, y: 90, width: 142, height: 94 },    // Bookshelf
  { x: 242, y: 90, width: 108, height: 94 },    // Dresser
  { x: 228, y: 216, width: 80, height: 100 },   // Nightstand
  { x: 636, y: 168, width: 194, height: 182 },  // Bed
  { x: 826, y: 40, width: 134, height: 152 },   // Closed door + frame
]

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

const resolveCircleRect = (
  cx: number,
  cy: number,
  radius: number,
  rect: Rect,
): { x: number; y: number } => {
  const nearestX = clamp(cx, rect.x, rect.x + rect.width)
  const nearestY = clamp(cy, rect.y, rect.y + rect.height)
  const dx = cx - nearestX
  const dy = cy - nearestY
  const distSq = dx * dx + dy * dy

  if (distSq >= radius * radius) {
    return { x: cx, y: cy }
  }

  const dist = Math.sqrt(distSq)

  if (dist > 0) {
    const overlap = radius - dist
    return { x: cx + (dx / dist) * overlap, y: cy + (dy / dist) * overlap }
  }

  // Center is inside rect — push out via shortest axis
  const left = cx - rect.x
  const right = rect.x + rect.width - cx
  const top = cy - rect.y
  const bottom = rect.y + rect.height - cy
  const min = Math.min(left, right, top, bottom)

  if (min === left) return { x: rect.x - radius, y: cy }
  if (min === right) return { x: rect.x + rect.width + radius, y: cy }
  if (min === top) return { x: cx, y: rect.y - radius }
  return { x: cx, y: rect.y + rect.height + radius }
}

export const stepPlayer = (
  player: PlayerState,
  controls: ControlsState,
  deltaTime: number,
  bounds: RoomBounds,
  hitboxes: Rect[] = FURNITURE_HITBOXES,
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

  let newX = clamp(player.x + normalizedX * distance, bounds.minX, bounds.maxX)
  let newY = clamp(player.y + normalizedY * distance, bounds.minY, bounds.maxY)

  for (const hitbox of hitboxes) {
    const resolved = resolveCircleRect(newX, newY, player.radius, hitbox)
    newX = resolved.x
    newY = resolved.y
  }

  newX = clamp(newX, bounds.minX, bounds.maxX)
  newY = clamp(newY, bounds.minY, bounds.maxY)

  return {
    ...player,
    animationTime: player.animationTime + deltaTime,
    facing,
    moving: true,
    x: newX,
    y: newY,
  }
}
