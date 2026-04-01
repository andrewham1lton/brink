export const CANVAS_WIDTH = 960
export const CANVAS_HEIGHT = 540

export type Direction = 'up' | 'down' | 'left' | 'right'

export interface ControlsState {
  down: boolean
  left: boolean
  right: boolean
  up: boolean
}

export type Facing = 'left' | 'right' | 'up' | 'up-left' | 'up-right' | 'down' | 'down-left' | 'down-right'

export interface PlayerState {
  animationTime: number
  facing: Facing
  inBed: boolean
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

// The blanket zone — the walkable area of the bed where the mouse
// appears as a lump. Headboard/pillows and footboard remain solid.
export const BLANKET_ZONE: Rect = { x: 656, y: 250, width: 158, height: 74 }

// Zone in front of the nightstand where the player can interact
// with the alarm clock by pressing F (touching the front face).
// Accounts for player radius pushing the center outside the hitbox.
export const ALARM_CLOCK_ZONE: Rect = { x: 216, y: 308, width: 126, height: 40 }

export const FURNITURE_HITBOXES: Rect[] = [
  { x: 96, y: 90, width: 142, height: 94 },    // Bookshelf
  { x: 242, y: 90, width: 108, height: 94 },    // Dresser
  { x: 236, y: 222, width: 68, height: 86 },    // Nightstand (full body + legs)
  { x: 636, y: 168, width: 194, height: 84 },   // Bed — headboard + pillows (top block)
  { x: 636, y: 322, width: 194, height: 28 },   // Bed — footboard (bottom block)
  { x: 826, y: 40, width: 134, height: 152 },   // Closed door + frame
]

export const INITIAL_PLAYER_STATE: PlayerState = {
  animationTime: 0,
  facing: 'down',
  inBed: true,
  moving: false,
  radius: 18,
  speed: 220,
  x: 735,
  y: 287,
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

export const isInBlanketZone = (x: number, y: number, radius: number): boolean => {
  const z = BLANKET_ZONE
  return x + radius > z.x && x - radius < z.x + z.width
    && y + radius > z.y && y - radius < z.y + z.height
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
  // Move slower when under the covers
  const speedMultiplier = player.inBed ? 0.45 : 1
  const distance = player.speed * speedMultiplier * deltaTime
  let facing: Facing
  if (vertical < 0 && horizontal === 0) {
    facing = 'up'
  } else if (vertical < 0 && horizontal > 0) {
    facing = 'up-right'
  } else if (vertical < 0 && horizontal < 0) {
    facing = 'up-left'
  } else if (vertical > 0 && horizontal < 0) {
    facing = 'down-left'
  } else if (vertical > 0 && horizontal > 0) {
    facing = 'down-right'
  } else if (vertical > 0 && horizontal === 0) {
    facing = 'down'
  } else if (horizontal < 0) {
    facing = 'left'
  } else {
    facing = 'right'
  }

  let newX = clamp(player.x + normalizedX * distance, bounds.minX, bounds.maxX)
  let newY = clamp(player.y + normalizedY * distance, bounds.minY, bounds.maxY)

  for (const hitbox of hitboxes) {
    const resolved = resolveCircleRect(newX, newY, player.radius, hitbox)
    newX = resolved.x
    newY = resolved.y
  }

  newX = clamp(newX, bounds.minX, bounds.maxX)
  newY = clamp(newY, bounds.minY, bounds.maxY)

  const inBed = isInBlanketZone(newX, newY, player.radius)

  return {
    ...player,
    animationTime: player.animationTime + deltaTime,
    facing,
    inBed,
    moving: true,
    x: newX,
    y: newY,
  }
}
