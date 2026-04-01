import {
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  type PlayerState,
} from './movement'

const floorGradient = (context: CanvasRenderingContext2D) => {
  const gradient = context.createLinearGradient(0, 0, 0, CANVAS_HEIGHT)
  gradient.addColorStop(0, '#7d5432')
  gradient.addColorStop(0.44, '#6a4326')
  gradient.addColorStop(1, '#4b2d18')
  return gradient
}

const wallGradient = (context: CanvasRenderingContext2D) => {
  const gradient = context.createLinearGradient(0, 0, 0, 170)
  gradient.addColorStop(0, '#e6d3ae')
  gradient.addColorStop(1, '#c49a63')
  return gradient
}

const drawBackdrop = (context: CanvasRenderingContext2D) => {
  // Wall
  context.fillStyle = wallGradient(context)
  context.fillRect(0, 0, CANVAS_WIDTH, 178)

  // Wainscoting — lower wall panel
  context.fillStyle = 'rgba(160, 120, 70, 0.25)'
  context.fillRect(0, 100, CANVAS_WIDTH, 60)

  // Chair rail molding line (split to skip window)
  context.strokeStyle = 'rgba(120, 80, 40, 0.5)'
  context.lineWidth = 2
  context.beginPath()
  context.moveTo(0, 100)
  context.lineTo(366, 100)
  context.stroke()
  context.beginPath()
  context.moveTo(522, 100)
  context.lineTo(CANVAS_WIDTH, 100)
  context.stroke()

  // Baseboard
  context.fillStyle = '#3f2413'
  context.fillRect(0, 160, CANVAS_WIDTH, 24)

  // Baseboard top highlight
  context.strokeStyle = 'rgba(255, 220, 160, 0.15)'
  context.lineWidth = 1
  context.beginPath()
  context.moveTo(0, 160)
  context.lineTo(CANVAS_WIDTH, 160)
  context.stroke()

  // Floor
  context.fillStyle = floorGradient(context)
  context.fillRect(0, 184, CANVAS_WIDTH, CANVAS_HEIGHT - 184)

  // Wood plank lines
  context.strokeStyle = 'rgba(30, 18, 8, 0.18)'
  context.lineWidth = 1
  for (let y = 204; y < CANVAS_HEIGHT; y += 28) {
    context.beginPath()
    context.moveTo(0, y)
    context.lineTo(CANVAS_WIDTH, y)
    context.stroke()
  }

  // Vertical plank seams (staggered)
  context.strokeStyle = 'rgba(30, 18, 8, 0.1)'
  for (let row = 0; row < 14; row++) {
    const y = 184 + row * 28
    const offset = row % 2 === 0 ? 0 : 80
    for (let x = offset + 160; x < CANVAS_WIDTH; x += 160) {
      context.beginPath()
      context.moveTo(x, y)
      context.lineTo(x, y + 28)
      context.stroke()
    }
  }

  // === Window (moved left to ~center-left) ===
  context.fillStyle = 'rgba(180, 220, 255, 0.22)'
  context.fillRect(370, 34, 148, 86)
  context.strokeStyle = 'rgba(131, 82, 32, 0.7)'
  context.lineWidth = 8
  context.strokeRect(370, 34, 148, 86)

  // Window panes
  context.beginPath()
  context.strokeStyle = 'rgba(99, 60, 21, 0.9)'
  context.lineWidth = 4
  context.moveTo(444, 34)
  context.lineTo(444, 120)
  context.moveTo(370, 77)
  context.lineTo(518, 77)
  context.stroke()

  // Window sill
  context.fillStyle = 'rgba(99, 60, 21, 0.8)'
  context.fillRect(364, 118, 160, 8)

  // Curtain left
  context.fillStyle = 'rgba(100, 120, 160, 0.45)'
  context.beginPath()
  context.moveTo(366, 28)
  context.quadraticCurveTo(346, 80, 360, 132)
  context.lineTo(372, 132)
  context.lineTo(372, 28)
  context.closePath()
  context.fill()

  // Curtain right
  context.beginPath()
  context.moveTo(522, 28)
  context.quadraticCurveTo(542, 80, 528, 132)
  context.lineTo(516, 132)
  context.lineTo(516, 28)
  context.closePath()
  context.fill()

  // Curtain rod
  context.strokeStyle = 'rgba(80, 50, 25, 0.7)'
  context.lineWidth = 3
  context.beginPath()
  context.moveTo(356, 30)
  context.lineTo(532, 30)
  context.stroke()

  // Light rays from window
  context.save()
  context.globalAlpha = 0.05
  context.fillStyle = '#ffe8a0'
  context.beginPath()
  context.moveTo(370, 120)
  context.lineTo(518, 120)
  context.lineTo(580, CANVAS_HEIGHT)
  context.lineTo(290, CANVAS_HEIGHT)
  context.closePath()
  context.fill()
  context.restore()

  // Light pool on floor near window
  context.fillStyle = 'rgba(255, 220, 130, 0.15)'
  context.beginPath()
  context.ellipse(444, 220, 120, 44, -0.08, 0, Math.PI * 2)
  context.fill()

  // === Exit door on right wall (closed) ===
  // Door frame
  context.fillStyle = '#5a3820'
  context.fillRect(832, 48, 8, 136)   // left frame
  context.fillRect(920, 48, 8, 136)   // right frame
  context.fillRect(832, 48, 96, 8)    // top frame

  // Door (closed — flat against frame)
  context.fillStyle = '#8a6040'
  context.fillRect(840, 56, 80, 120)

  // Door panel details
  context.fillStyle = 'rgba(255, 220, 160, 0.08)'
  context.fillRect(852, 68, 56, 40)
  context.fillRect(852, 120, 56, 40)

  // Panel inset borders
  context.strokeStyle = 'rgba(90, 56, 32, 0.4)'
  context.lineWidth = 1
  context.strokeRect(852, 68, 56, 40)
  context.strokeRect(852, 120, 56, 40)

  // Doorknob
  context.fillStyle = '#c4a860'
  context.beginPath()
  context.arc(852, 116, 4, 0, Math.PI * 2)
  context.fill()
  // Knob highlight
  context.fillStyle = 'rgba(255, 240, 180, 0.4)'
  context.beginPath()
  context.arc(851, 115, 1.5, 0, Math.PI * 2)
  context.fill()

  // Baseboard continues across door
  context.fillStyle = '#3f2413'
  context.fillRect(832, 160, 96, 24)

  // Baseboard highlight
  context.strokeStyle = 'rgba(255, 220, 160, 0.15)'
  context.lineWidth = 1
  context.beginPath()
  context.moveTo(832, 160)
  context.lineTo(928, 160)
  context.stroke()

  // === Wall art — small framed painting ===
  context.fillStyle = '#3a2416'
  context.fillRect(604, 42, 72, 56)
  context.fillStyle = '#5a8a5a'
  context.fillRect(610, 48, 60, 44)
  // Simple landscape: sky
  context.fillStyle = '#7ab4d4'
  context.fillRect(610, 48, 60, 22)
  // Landscape: hills
  context.fillStyle = '#4a7a4a'
  context.beginPath()
  context.moveTo(610, 70)
  context.quadraticCurveTo(630, 58, 650, 68)
  context.quadraticCurveTo(660, 64, 670, 70)
  context.lineTo(670, 92)
  context.lineTo(610, 92)
  context.closePath()
  context.fill()
  // Frame border
  context.strokeStyle = '#8a6a3a'
  context.lineWidth = 3
  context.strokeRect(604, 42, 72, 56)
}

const drawRug = (context: CanvasRenderingContext2D) => {
  // Outer border ring
  context.fillStyle = '#7a4422'
  context.beginPath()
  context.ellipse(440, 360, 112, 62, 0, 0, Math.PI * 2)
  context.fill()

  // Decorative middle ring
  context.fillStyle = '#c48840'
  context.beginPath()
  context.ellipse(440, 360, 106, 58, 0, 0, Math.PI * 2)
  context.fill()

  // Inner pattern ring
  context.fillStyle = '#8a5028'
  context.beginPath()
  context.ellipse(440, 360, 98, 52, 0, 0, Math.PI * 2)
  context.fill()

  // Main rug body
  context.fillStyle = '#a8683f'
  context.beginPath()
  context.ellipse(440, 360, 90, 46, 0, 0, Math.PI * 2)
  context.fill()

  // Center medallion
  context.fillStyle = 'rgba(200, 150, 80, 0.3)'
  context.beginPath()
  context.ellipse(440, 360, 36, 20, 0, 0, Math.PI * 2)
  context.fill()

  // Fringe on short ends
  context.strokeStyle = 'rgba(180, 130, 70, 0.5)'
  context.lineWidth = 1.5
  for (let i = -8; i <= 8; i++) {
    const x = 440 + i * 10
    // Top fringe
    context.beginPath()
    context.moveTo(x, 300)
    context.lineTo(x, 292)
    context.stroke()
    // Bottom fringe
    context.beginPath()
    context.moveTo(x, 420)
    context.lineTo(x, 428)
    context.stroke()
  }
}

const BOOK_COLORS = [
  '#8b2e2e', '#2e5a8b', '#2e7a3e', '#8b6e2e', '#6e2e8b',
  '#2e7a7a', '#8b4e2e', '#4e2e8b',
]

const drawFurniture = (context: CanvasRenderingContext2D) => {
  // === Bookshelf ===
  // Shadow
  context.fillStyle = 'rgba(10, 5, 2, 0.25)'
  context.fillRect(110, 174, 118, 6)

  // Back
  context.fillStyle = '#4e3123'
  context.fillRect(106, 110, 126, 64)

  // Shelves
  context.fillStyle = '#6b4531'
  context.fillRect(116, 120, 106, 44)

  // Shelf divider
  context.fillStyle = '#5a3828'
  context.fillRect(116, 140, 106, 4)

  // Top shelf highlight
  context.fillStyle = 'rgba(255, 220, 160, 0.12)'
  context.fillRect(116, 120, 106, 2)

  // Books — top shelf
  let bx = 119
  for (let i = 0; i < 8; i++) {
    const w = 8 + Math.sin(i * 2.7) * 4
    const h = 14 + Math.cos(i * 1.9) * 4
    context.fillStyle = BOOK_COLORS[i % BOOK_COLORS.length]
    context.fillRect(bx, 138 - h, w, h)
    // Spine highlight
    context.fillStyle = 'rgba(255, 255, 255, 0.1)'
    context.fillRect(bx + 1, 138 - h, 1, h)
    bx += w + 2
  }

  // Books — bottom shelf
  bx = 119
  for (let i = 3; i < 11; i++) {
    const w = 7 + Math.cos(i * 3.1) * 3
    const h = 16 + Math.sin(i * 2.3) * 3
    context.fillStyle = BOOK_COLORS[i % BOOK_COLORS.length]
    context.fillRect(bx, 162 - h, w, h)
    context.fillStyle = 'rgba(255, 255, 255, 0.1)'
    context.fillRect(bx + 1, 162 - h, 1, h)
    bx += w + 2
  }

  // === Bed (upper right) — base layer ===
  // Shadow beneath bed
  context.fillStyle = 'rgba(10, 5, 2, 0.2)'
  context.beginPath()
  context.ellipse(730, 340, 90, 14, 0, 0, Math.PI * 2)
  context.fill()

  // Bed frame — base/sides
  context.fillStyle = '#5a3420'
  context.fillRect(650, 190, 170, 140)

  // Mattress
  context.fillStyle = '#e8ddd0'
  context.beginPath()
  context.roundRect(656, 196, 158, 128, 6)
  context.fill()

  // Pillow
  context.fillStyle = '#f0e8dc'
  context.beginPath()
  context.roundRect(672, 202, 56, 36, 12)
  context.fill()

  // Pillow shadow/crease
  context.strokeStyle = 'rgba(160, 140, 110, 0.3)'
  context.lineWidth = 1
  context.beginPath()
  context.moveTo(684, 220)
  context.quadraticCurveTo(700, 224, 716, 220)
  context.stroke()

  // Second pillow
  context.fillStyle = '#f0e8dc'
  context.beginPath()
  context.roundRect(736, 204, 52, 34, 12)
  context.fill()
  context.strokeStyle = 'rgba(160, 140, 110, 0.3)'
  context.lineWidth = 1
  context.beginPath()
  context.moveTo(748, 221)
  context.quadraticCurveTo(762, 225, 776, 221)
  context.stroke()

  // Headboard
  context.fillStyle = '#4a2a16'
  context.beginPath()
  context.roundRect(644, 178, 182, 18, [8, 8, 0, 0])
  context.fill()

  // Headboard highlight
  context.fillStyle = 'rgba(255, 220, 160, 0.1)'
  context.fillRect(644, 178, 182, 3)

  // Footboard
  context.fillStyle = '#4a2a16'
  context.fillRect(648, 326, 174, 10)

  // Bed legs visible below
  context.fillStyle = '#3a1e10'
  context.fillRect(656, 332, 10, 10)
  context.fillRect(800, 332, 10, 10)

  // === Nightstand (left of bed area, near wall) ===
  // Shadow
  context.fillStyle = 'rgba(10, 5, 2, 0.18)'
  context.beginPath()
  context.ellipse(268, 310, 40, 8, 0, 0, Math.PI * 2)
  context.fill()

  // Legs (always behind player)
  context.fillStyle = '#3a2416'
  context.fillRect(242, 268, 8, 40)
  context.fillRect(290, 268, 8, 40)

  // === Lamp (on top of bookshelf) ===
  // Warm glow halo
  context.save()
  const glowGrad = context.createRadialGradient(160, 46, 5, 160, 46, 80)
  glowGrad.addColorStop(0, 'rgba(255, 220, 120, 0.2)')
  glowGrad.addColorStop(1, 'rgba(255, 220, 120, 0)')
  context.fillStyle = glowGrad
  context.beginPath()
  context.arc(160, 46, 80, 0, Math.PI * 2)
  context.fill()
  context.restore()

  // Lamp bulb glow (drawn before shade so shade covers it)
  context.fillStyle = '#f0d387'
  context.beginPath()
  context.arc(160, 46, 8, 0, Math.PI * 2)
  context.fill()

  // Lamp base/stand
  context.fillStyle = '#d7ad74'
  context.fillRect(155, 54, 10, 50)

  // Lamp base plate
  context.fillStyle = '#c49a63'
  context.fillRect(146, 104, 28, 6)

  // Lampshade (drawn after bulb so it appears on top)
  context.fillStyle = '#f5e4b8'
  context.beginPath()
  context.moveTo(140, 54)
  context.lineTo(180, 54)
  context.lineTo(174, 26)
  context.lineTo(146, 26)
  context.closePath()
  context.fill()

  // Lampshade edge highlight
  context.strokeStyle = 'rgba(200, 170, 100, 0.6)'
  context.lineWidth = 1
  context.beginPath()
  context.moveTo(140, 54)
  context.lineTo(180, 54)
  context.stroke()

  // === Small dresser (between bookshelf and window) ===
  // Shadow
  context.fillStyle = 'rgba(10, 5, 2, 0.2)'
  context.fillRect(256, 174, 86, 6)

  // Body
  context.fillStyle = '#4a3020'
  context.fillRect(254, 118, 90, 56)

  // Top surface
  context.fillStyle = '#5d3824'
  context.fillRect(250, 112, 98, 10)

  // Top highlight
  context.fillStyle = 'rgba(255, 220, 160, 0.1)'
  context.fillRect(250, 112, 98, 3)

  // Drawer 1
  context.fillStyle = '#5a3828'
  context.fillRect(260, 122, 78, 22)
  context.fillStyle = '#c4a860'
  context.beginPath()
  context.arc(299, 133, 2.5, 0, Math.PI * 2)
  context.fill()

  // Drawer 2
  context.fillStyle = '#5a3828'
  context.fillRect(260, 148, 78, 22)
  context.fillStyle = '#c4a860'
  context.beginPath()
  context.arc(299, 159, 2.5, 0, Math.PI * 2)
  context.fill()
}

// Blanket bounds for clamping the lump drawing
const BK = { x: 656, y: 250, w: 158, h: 74 }

const drawBedBlanket = (
  context: CanvasRenderingContext2D,
  player: PlayerState,
) => {
  if (player.inBed) {
    // ── Base blanket layer ──
    context.fillStyle = '#4a6a8a'
    context.beginPath()
    context.roundRect(BK.x, BK.y, BK.w, BK.h, [0, 0, 6, 6])
    context.fill()

    // Clip all lump drawing to the blanket rectangle
    context.save()
    context.beginPath()
    context.roundRect(BK.x, BK.y, BK.w, BK.h, [0, 0, 6, 6])
    context.clip()

    // ── The lump follows the mouse's actual position ──
    const lumpX = player.x
    const lumpY = player.y
    const breathe = Math.sin(sceneTime * 2.0) * 2.0
    const lumpW = 40
    const lumpH = 24 + breathe

    // When moving, the lump stretches in travel direction, wobbles, and jiggles
    const wobble = player.moving ? Math.sin(sceneTime * 14) * 2.5 : 0
    const stretchX = player.moving ? 8 : 0
    const stretchY = player.moving ? -4 : 0

    // Lump shadow — dark ring at the base for depth
    context.fillStyle = 'rgba(20, 40, 60, 0.18)'
    context.beginPath()
    context.ellipse(lumpX, lumpY + 5, lumpW + 8 + stretchX, 7, 0, 0, Math.PI * 2)
    context.fill()

    // Main lump body — noticeably lighter than the blanket
    context.fillStyle = '#5d8aaa'
    context.beginPath()
    context.ellipse(
      lumpX, lumpY + 2 + wobble,
      lumpW + stretchX, lumpH + stretchY,
      0, Math.PI, 0,
    )
    context.fill()

    // Lump mid-tone — subtle gradient effect
    context.fillStyle = '#6898b4'
    context.beginPath()
    context.ellipse(
      lumpX, lumpY - 1 + wobble,
      lumpW - 6 + stretchX, lumpH - 5 + stretchY,
      0, Math.PI, 0,
    )
    context.fill()

    // Lump highlight — light catching the peak
    context.fillStyle = 'rgba(255, 255, 255, 0.13)'
    context.beginPath()
    context.ellipse(
      lumpX, lumpY - 4 + wobble,
      lumpW - 14 + stretchX, lumpH - 10 + stretchY,
      0, Math.PI, 0,
    )
    context.fill()

    // ── Blanket wrinkles radiating from the lump ──
    context.strokeStyle = 'rgba(30, 50, 70, 0.22)'
    context.lineWidth = 1.2
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2 + sceneTime * 0.12
      const innerR = lumpW + 4 + stretchX
      const outerR = innerR + 18 + Math.sin(angle * 3) * 5
      const sx = lumpX + Math.cos(angle) * innerR
      const sy = lumpY + Math.sin(angle) * (innerR * 0.38)
      const ex = lumpX + Math.cos(angle) * outerR
      const ey = lumpY + Math.sin(angle) * (outerR * 0.38)
      if (sx > BK.x + 4 && sx < BK.x + BK.w - 4
        && sy > BK.y + 2 && sy < BK.y + BK.h - 2) {
        context.beginPath()
        context.moveTo(sx, sy)
        context.lineTo(ex, ey)
        context.stroke()
      }
    }


    // Restore clip so ears can poke above the blanket
    context.restore()

    // ── Ears poking out at the top edge when near pillows ──
    const nearTop = lumpY < BK.y + 28
    if (nearTop) {
      const earBase = BK.y - 1
      const earBob = Math.sin(sceneTime * 1.3) * 0.6
      const earSpread = 7
      // Left ear
      context.fillStyle = '#8b6b50'
      context.beginPath()
      context.ellipse(lumpX - earSpread, earBase + earBob, 5, 7, -0.2, 0, Math.PI * 2)
      context.fill()
      context.fillStyle = '#d4a0a0'
      context.beginPath()
      context.ellipse(lumpX - earSpread, earBase + earBob + 0.5, 3, 4.5, -0.2, 0, Math.PI * 2)
      context.fill()
      // Right ear
      context.fillStyle = '#8b6b50'
      context.beginPath()
      context.ellipse(lumpX + earSpread, earBase + earBob - 1, 5, 7, 0.2, 0, Math.PI * 2)
      context.fill()
      context.fillStyle = '#d4a0a0'
      context.beginPath()
      context.ellipse(lumpX + earSpread, earBase + earBob - 0.5, 3, 4.5, 0.2, 0, Math.PI * 2)
      context.fill()
    }

  } else {
    // ── Normal blanket (no mouse) ──
    context.fillStyle = '#4a6a8a'
    context.beginPath()
    context.roundRect(BK.x, BK.y, BK.w, BK.h, [0, 0, 6, 6])
    context.fill()

    // Blanket fold line
    context.strokeStyle = 'rgba(30, 50, 70, 0.3)'
    context.lineWidth = 2
    context.beginPath()
    context.moveTo(BK.x + 4, BK.y + 4)
    context.quadraticCurveTo(BK.x + BK.w / 2, BK.y - 4, BK.x + BK.w - 4, BK.y + 4)
    context.stroke()

    // Blanket highlight
    context.fillStyle = 'rgba(255, 255, 255, 0.06)'
    context.fillRect(BK.x, BK.y + 6, BK.w, 8)
  }
}

const drawAlarmClock = (context: CanvasRenderingContext2D) => {
  context.fillStyle = '#2a2a30'
  context.beginPath()
  context.roundRect(258, 210, 24, 16, 4)
  context.fill()
  // Clock face
  context.fillStyle = '#4a8a5a'
  context.fillRect(261, 213, 18, 10)
  // Time display - show real system time
  const now = new Date()
  let hours = now.getHours()
  const minutes = now.getMinutes().toString().padStart(2, '0')
  hours = hours % 12 || 12
  const timeStr = `${hours}:${minutes}`
  context.fillStyle = '#7aff7a'
  context.font = '6px monospace'
  const textWidth = context.measureText(timeStr).width
  const faceX = 261
  const faceW = 18
  const textX = faceX + (faceW - textWidth) / 2
  context.fillText(timeStr, textX, 220)
}

const drawNightstandBody = (context: CanvasRenderingContext2D) => {
  // Body
  context.fillStyle = '#4a3020'
  context.fillRect(240, 230, 60, 42)

  // Drawer
  context.fillStyle = '#5a3828'
  context.fillRect(244, 246, 52, 18)
  // Drawer knob
  context.fillStyle = '#c4a860'
  context.beginPath()
  context.arc(270, 255, 2.5, 0, Math.PI * 2)
  context.fill()

  // Top surface
  context.fillStyle = '#5d3824'
  context.fillRect(236, 222, 68, 12)

  // Top highlight
  context.fillStyle = 'rgba(255, 220, 160, 0.1)'
  context.fillRect(236, 222, 68, 3)
}

const WALK_CYCLE_SPEED = 10

// ── Scene time tracking for idle & transition animations ──
let sceneTime = 0
let lastFrameTime = 0
let wasMoving = false
let stopBounceTimer = 0
let startSquashTimer = 0

// Pseudo-random but deterministic "twitch" generator so ear/nose
// twitches feel organic rather than perfectly periodic.
const twitch = (t: number, freq: number, duty = 0.12): number => {
  const phase = ((t * freq) % 1 + 1) % 1
  return phase < duty ? Math.sin(phase / duty * Math.PI) : 0
}

// ── Idle animation helpers ──
const idleBreath = (): number =>
  Math.sin(sceneTime * 2.2) * 0.6                // gentle torso pulse

const idleTailSway = (): number =>
  Math.sin(sceneTime * 1.6) * 6                  // slow tail wag

const idleEarTwitch = (): number =>
  twitch(sceneTime, 0.45, 0.08) * 3              // occasional ear flick

const idleNoseWiggle = (): number =>
  twitch(sceneTime, 0.7, 0.14) * 1.8             // periodic nose bob

// Blink: closed for a tiny window every ~3-4 seconds
const isBlinking = (): boolean => {
  const period = 3.4
  const phase = ((sceneTime / period) % 1 + 1) % 1
  return phase < 0.045
}

// ── Quadruped rat head (side view) — cuter, bigger proportions ──
const drawRatHeadSide = (context: CanvasRenderingContext2D, moving: boolean) => {
  const earBob = moving
    ? Math.sin(sceneTime * WALK_CYCLE_SPEED * 2) * 2
    : idleEarTwitch()
  const noseWob = moving ? 0 : idleNoseWiggle()
  const blink = !moving && isBlinking()
  const whiskerSpread = moving
    ? Math.sin(sceneTime * WALK_CYCLE_SPEED) * 1
    : twitch(sceneTime, 0.7, 0.14) * 2.5

  // Ear (back — far side)
  context.fillStyle = '#7a5a34'
  context.beginPath()
  context.arc(-4, -12 - earBob * 0.5, 9, 0, Math.PI * 2)
  context.fill()
  context.fillStyle = '#f5aabb'
  context.beginPath()
  context.arc(-4, -12 - earBob * 0.5, 6.5, 0, Math.PI * 2)
  context.fill()

  // Ear (front — near side)
  context.fillStyle = '#7a5a34'
  context.beginPath()
  context.arc(5, -14 - earBob, 8, 0, Math.PI * 2)
  context.fill()
  context.fillStyle = '#f5aabb'
  context.beginPath()
  context.arc(5, -14 - earBob, 5.5, 0, Math.PI * 2)
  context.fill()

  // Head — bigger, rounder
  context.fillStyle = '#a8855c'
  context.beginPath()
  context.ellipse(4, -2, 14, 13, 0.1, 0, Math.PI * 2)
  context.fill()

  // Cheek puff
  context.fillStyle = '#b89468'
  context.beginPath()
  context.ellipse(10, 2, 6, 5, 0, 0, Math.PI * 2)
  context.fill()

  // Snout — rounder, cuter
  context.fillStyle = '#c4a07a'
  context.beginPath()
  context.ellipse(16, 1 + noseWob, 8, 6, -0.1, 0, Math.PI * 2)
  context.fill()

  // Nose — bigger, pinker
  context.fillStyle = '#f08888'
  context.beginPath()
  context.arc(23, 0 + noseWob, 3, 0, Math.PI * 2)
  context.fill()
  context.fillStyle = 'rgba(255, 220, 220, 0.7)'
  context.beginPath()
  context.arc(22, -1 + noseWob, 1.2, 0, Math.PI * 2)
  context.fill()

  // Eye — bigger with larger highlight
  if (blink) {
    context.strokeStyle = '#0d0808'
    context.lineWidth = 2
    context.lineCap = 'round'
    context.beginPath()
    context.moveTo(5, -5)
    context.lineTo(12, -5)
    context.stroke()
  } else {
    context.fillStyle = '#0d0808'
    context.beginPath()
    context.arc(9, -5, 4, 0, Math.PI * 2)
    context.fill()
    // Large shine
    context.fillStyle = 'rgba(255, 255, 255, 0.85)'
    context.beginPath()
    context.arc(10.5, -6.5, 1.6, 0, Math.PI * 2)
    context.fill()
    // Small secondary shine
    context.fillStyle = 'rgba(255, 255, 255, 0.5)'
    context.beginPath()
    context.arc(7.5, -3.5, 0.8, 0, Math.PI * 2)
    context.fill()
  }

  // Whiskers
  context.strokeStyle = 'rgba(220, 200, 170, 0.75)'
  context.lineWidth = 0.9
  context.lineCap = 'round'
  context.beginPath()
  context.moveTo(16, -1)
  context.lineTo(32, -5 - whiskerSpread)
  context.moveTo(16, 0)
  context.lineTo(32, 1)
  context.moveTo(16, 2)
  context.lineTo(32, 6 + whiskerSpread)
  context.stroke()
}

// ── Quadruped side view (left / right / down) — rat on all 4s ──
const drawPlayerSide = (
  context: CanvasRenderingContext2D,
  player: PlayerState,
) => {
  const cycle = player.moving
    ? Math.sin(player.animationTime * WALK_CYCLE_SPEED)
    : 0
  const bob = player.moving
    ? Math.abs(Math.sin(player.animationTime * WALK_CYCLE_SPEED * 2)) * 1.5
    : 0
  const breath = player.moving ? 0 : idleBreath()
  const flip = player.facing === 'left' ? -1 : 1

  const stopBounce = stopBounceTimer > 0
    ? Math.sin(stopBounceTimer * 14) * stopBounceTimer * 6
    : 0
  const startSquash = startSquashTimer > 0
    ? Math.sin(startSquashTimer * 12) * startSquashTimer * 0.04
    : 0

  context.save()
  context.translate(player.x, player.y - bob - stopBounce)

  if (startSquash > 0) {
    context.scale(flip * (1 + startSquash), 1 - startSquash * 0.6)
  } else {
    context.scale(flip, 1)
  }

  // ── Tail — S-curve from rear ──
  const tailCycle = player.moving ? cycle : 0
  const tailIdle = player.moving ? 0 : idleTailSway()
  context.strokeStyle = '#d4a888'
  context.lineWidth = 2.5
  context.lineCap = 'round'
  context.beginPath()
  context.moveTo(-18, -2)
  context.bezierCurveTo(
    -30, -6 + tailIdle * 0.3,
    -38, -16 + tailCycle * 5 + tailIdle * 0.6,
    -28, -28 + tailCycle * 6 + tailIdle,
  )
  context.stroke()
  // Tail tip curl
  const tipX = -28 + tailCycle * 2 + tailIdle * 0.4
  const tipY = -28 + tailCycle * 6 + tailIdle
  context.beginPath()
  context.bezierCurveTo(tipX, tipY, tipX + 4, tipY - 6, tipX + 2, tipY - 10)
  context.stroke()

  // ── Back legs (far side, slightly behind near legs) ──
  const backLegSwing = cycle * 7
  const frontLegSwing = -cycle * 7  // opposite phase for trot
  context.strokeStyle = '#6a4a2a'
  context.lineWidth = 5.5
  context.lineCap = 'round'
  // Far back leg
  context.beginPath()
  context.moveTo(-10, 4)
  context.lineTo(-10 + backLegSwing, 16)
  context.stroke()
  // Far front leg
  context.beginPath()
  context.moveTo(12, 2)
  context.lineTo(12 + frontLegSwing, 16)
  context.stroke()

  // Far paws
  context.fillStyle = '#5a3a1a'
  context.beginPath()
  context.ellipse(-10 + backLegSwing, 18, 4.5, 2.5, 0.1, 0, Math.PI * 2)
  context.fill()
  context.beginPath()
  context.ellipse(12 + frontLegSwing, 18, 4.5, 2.5, -0.1, 0, Math.PI * 2)
  context.fill()

  // ── Body — horizontal ellipse ──
  context.fillStyle = '#96744e'
  context.beginPath()
  context.ellipse(0, -2 - breath * 0.2, 22, 12 + breath * 0.3, 0, 0, Math.PI * 2)
  context.fill()

  // Belly (lighter underside)
  context.fillStyle = '#d4b896'
  context.beginPath()
  context.ellipse(0, 3, 16, 6, 0, 0, Math.PI)
  context.fill()

  // Back fur stripe
  context.fillStyle = 'rgba(80, 50, 20, 0.15)'
  context.beginPath()
  context.ellipse(-2, -8, 14, 3, 0, Math.PI, Math.PI * 2)
  context.fill()

  // ── Near-side legs (on top of body) ──
  context.strokeStyle = '#7a5a34'
  context.lineWidth = 6
  context.lineCap = 'round'
  // Near back leg
  context.beginPath()
  context.moveTo(-10, 5)
  context.lineTo(-10 - backLegSwing, 16)
  context.stroke()
  // Near front leg
  context.beginPath()
  context.moveTo(12, 3)
  context.lineTo(12 - frontLegSwing, 16)
  context.stroke()

  // Near paws
  context.fillStyle = '#6a4a2a'
  context.beginPath()
  context.ellipse(-10 - backLegSwing, 18, 5, 3, -0.1, 0, Math.PI * 2)
  context.fill()
  context.beginPath()
  context.ellipse(12 - frontLegSwing, 18, 5, 3, 0.1, 0, Math.PI * 2)
  context.fill()


  // ── Bandana — prominent red scarf at the neck ──
  const bandanaFlutter = player.moving
    ? Math.sin(player.animationTime * WALK_CYCLE_SPEED * 1.5) * 4
    : Math.sin(sceneTime * 1.2) * 1.5

  // Scarf wrap around neck
  context.fillStyle = '#cc3333'
  context.beginPath()
  context.moveTo(10, -10)
  context.quadraticCurveTo(18, -8, 20, -2)
  context.quadraticCurveTo(18, 6, 10, 8)
  context.quadraticCurveTo(6, 4, 6, -2)
  context.quadraticCurveTo(6, -8, 10, -10)
  context.closePath()
  context.fill()

  // Scarf highlight fold
  context.fillStyle = '#dd4444'
  context.beginPath()
  context.moveTo(12, -8)
  context.quadraticCurveTo(17, -6, 18, -2)
  context.quadraticCurveTo(17, 2, 14, 4)
  context.quadraticCurveTo(12, 0, 12, -8)
  context.closePath()
  context.fill()

  // Knot
  context.fillStyle = '#aa2222'
  context.beginPath()
  context.arc(10, 2, 3.5, 0, Math.PI * 2)
  context.fill()
  context.fillStyle = '#cc3333'
  context.beginPath()
  context.arc(10, 2, 2, 0, Math.PI * 2)
  context.fill()

  // Flowing tail — two trailing ends
  context.fillStyle = '#cc3333'
  // First tail
  context.beginPath()
  context.moveTo(8, 3)
  context.quadraticCurveTo(2, 8 + bandanaFlutter, -4, 14 + bandanaFlutter)
  context.lineTo(-1, 12 + bandanaFlutter)
  context.quadraticCurveTo(4, 7 + bandanaFlutter * 0.5, 9, 4)
  context.closePath()
  context.fill()
  // Second tail (slightly offset)
  context.fillStyle = '#bb2828'
  context.beginPath()
  context.moveTo(10, 4)
  context.quadraticCurveTo(5, 10 + bandanaFlutter * 0.8, 0, 16 + bandanaFlutter * 0.7)
  context.lineTo(3, 14 + bandanaFlutter * 0.7)
  context.quadraticCurveTo(7, 9 + bandanaFlutter * 0.4, 11, 5)
  context.closePath()
  context.fill()

  // ── Head — positioned at front of body ──
  const headBob = player.moving
    ? Math.sin(player.animationTime * WALK_CYCLE_SPEED * 2) * 1
    : 0
  context.save()
  context.translate(18, -6 - headBob * 0.5)
  drawRatHeadSide(context, player.moving)
  context.restore()

  context.restore()
}

// ── Quadruped back view (up / up-left / up-right) — rat on all 4s from behind ──
const drawPlayerBack = (
  context: CanvasRenderingContext2D,
  player: PlayerState,
  lean: -1 | 0 | 1,
) => {
  const cycle = player.moving
    ? Math.sin(player.animationTime * WALK_CYCLE_SPEED)
    : 0
  const bob = player.moving
    ? Math.abs(Math.sin(player.animationTime * WALK_CYCLE_SPEED * 2)) * 1.5
    : 0
  const breath = player.moving ? 0 : idleBreath()

  const stopBounce = stopBounceTimer > 0
    ? Math.sin(stopBounceTimer * 14) * stopBounceTimer * 6
    : 0

  context.save()
  context.translate(player.x, player.y - bob - stopBounce)
  if (lean === -1) context.scale(-1, 1)

  // ── Tail — hangs down toward the viewer from the rump ──
  const tailIdle = player.moving ? 0 : idleTailSway()
  const tailWalk = player.moving ? cycle * 2 : 0
  context.strokeStyle = '#d4a888'
  context.lineWidth = 3
  context.lineCap = 'round'
  context.beginPath()
  context.moveTo(tailIdle * 0.15, 8)
  context.bezierCurveTo(
    2 + tailIdle * 0.3 + tailWalk, 14,
    -2 + tailIdle * 0.5 + tailWalk * 0.5, 22,
    3 + tailIdle * 0.7 + tailWalk * 0.3, 28,
  )
  context.stroke()
  // Tail tip thinning with gentle curl
  context.lineWidth = 1.8
  context.beginPath()
  context.moveTo(3 + tailIdle * 0.7 + tailWalk * 0.3, 28)
  context.bezierCurveTo(
    5 + tailIdle * 0.4, 31,
    4 + tailIdle * 0.3, 34,
    2 + tailIdle * 0.2, 36,
  )
  context.stroke()

  // ── Back legs — chunky haunches with 2-segment bend (trot gait) ──
  // Trot: diagonal pairs — left-back swings with right-front
  const backLegSwingL = cycle * 5
  const backLegSwingR = -cycle * 5

  // Left back leg (haunch + lower)
  const drawBackLeg = (side: number, swing: number) => {
    const hipX = side * 10
    const kneeX = hipX + side * 2 + swing * 0.5
    const kneeY = 10 + Math.abs(swing) * 0.3
    const pawX = kneeX + swing
    const pawY = 18

    // Upper leg (thick haunch)
    context.strokeStyle = '#6a4a2a'
    context.lineWidth = 7
    context.lineCap = 'round'
    context.beginPath()
    context.moveTo(hipX, 4)
    context.lineTo(kneeX, kneeY)
    context.stroke()

    // Lower leg
    context.lineWidth = 5
    context.beginPath()
    context.moveTo(kneeX, kneeY)
    context.lineTo(pawX, pawY)
    context.stroke()

    // Paw — round and chunky
    context.fillStyle = '#5a3a1a'
    context.beginPath()
    context.ellipse(pawX, pawY + 1, 5.5, 3, 0, 0, Math.PI * 2)
    context.fill()

  }

  // ── Front legs — drawn first (farther from viewer, peeking past head side) ──
  const frontLegSwingL = -cycle * 5
  const frontLegSwingR = cycle * 5

  const drawFrontLeg = (side: number, swing: number) => {
    const shoulderX = side * 5
    const pawX = shoulderX + swing
    const pawY = -10

    context.strokeStyle = '#7a5a34'
    context.lineWidth = 4.5
    context.lineCap = 'round'
    context.beginPath()
    context.moveTo(shoulderX, -8)
    context.quadraticCurveTo(shoulderX + side * 2 + swing * 0.3, -4, pawX + side * 3, pawY)
    context.stroke()

    // Front paw (smaller, farther away)
    context.fillStyle = '#6a4a2a'
    context.beginPath()
    context.ellipse(pawX + side * 3, pawY, 4, 2.2, 0, 0, Math.PI * 2)
    context.fill()
  }

  drawFrontLeg(-1, frontLegSwingL)
  drawFrontLeg(1, frontLegSwingR)

  drawBackLeg(-1, backLegSwingL)
  drawBackLeg(1, backLegSwingR)

  // ── Rump / body — plump pear shape, wider at haunches ──
  // Main body as a smooth pear/teardrop: wide rump tapering to shoulders
  context.fillStyle = '#96744e'
  context.beginPath()
  context.moveTo(0, -14 - breath * 0.2)
  // Right side: shoulder → haunch
  context.bezierCurveTo(
    13 + breath * 0.15, -14, 17 + breath * 0.2, -2, 16 + breath * 0.2, 6,
  )
  // Right haunch curve to bottom
  context.bezierCurveTo(15, 12, 8, 14, 0, 14)
  // Left haunch curve
  context.bezierCurveTo(-8, 14, -15, 12, -16 - breath * 0.2, 6)
  // Left side: haunch → shoulder
  context.bezierCurveTo(
    -17 - breath * 0.2, -2, -13 - breath * 0.15, -14, 0, -14 - breath * 0.2,
  )
  context.closePath()
  context.fill()

  // Rump highlight (cute round butt)
  context.fillStyle = '#a8855c'
  context.beginPath()
  context.ellipse(0, 5, 11, 7, 0, 0.3, Math.PI - 0.3)
  context.fill()

  // Back fur stripe / spine
  context.fillStyle = 'rgba(60, 36, 14, 0.12)'
  context.beginPath()
  context.ellipse(0, -3, 2.5, 13, 0, 0, Math.PI * 2)
  context.fill()

  drawFrontLeg(-1, frontLegSwingL)
  drawFrontLeg(1, frontLegSwingR)

  // ── Head (back of head) — slightly oval, showing crown ──
  const headBob = player.moving
    ? Math.sin(player.animationTime * WALK_CYCLE_SPEED * 2) * 1
    : idleNoseWiggle() * 0.3
  const headY = -16 - headBob

  // Back of head
  context.fillStyle = '#a8855c'
  context.beginPath()
  context.ellipse(0, headY, 12, 11, 0, 0, Math.PI * 2)
  context.fill()

  // Crown tuft — a little floof between ears
  context.fillStyle = '#b8956c'
  context.beginPath()
  context.ellipse(0, headY - 7, 5, 3, 0, Math.PI, Math.PI * 2)
  context.fill()

  // ── Bandana — wraps around neck, visible from behind ──
  context.fillStyle = '#cc3333'
  context.beginPath()
  context.moveTo(-10, headY + 9)
  context.quadraticCurveTo(-12, headY + 13, -8, headY + 15)
  context.lineTo(8, headY + 15)
  context.quadraticCurveTo(12, headY + 13, 10, headY + 9)
  context.quadraticCurveTo(6, headY + 12, 0, headY + 12)
  context.quadraticCurveTo(-6, headY + 12, -10, headY + 9)
  context.closePath()
  context.fill()

  // Bandana knot at nape
  context.fillStyle = '#aa2222'
  context.beginPath()
  context.arc(0, headY + 12, 3, 0, Math.PI * 2)
  context.fill()
  context.fillStyle = '#cc3333'
  context.beginPath()
  context.arc(0, headY + 12, 1.8, 0, Math.PI * 2)
  context.fill()

  // Bandana tails hanging from knot (short, cute)
  const bandanaFlutter = player.moving
    ? Math.sin(player.animationTime * WALK_CYCLE_SPEED * 1.5) * 2.5
    : Math.sin(sceneTime * 1.2) * 1
  context.fillStyle = '#cc3333'
  context.beginPath()
  context.moveTo(-1, headY + 14)
  context.quadraticCurveTo(-3 + bandanaFlutter * 0.3, headY + 19, -5 + bandanaFlutter * 0.5, headY + 23)
  context.lineTo(-3 + bandanaFlutter * 0.5, headY + 22)
  context.quadraticCurveTo(-1 + bandanaFlutter * 0.15, headY + 18, 0, headY + 14)
  context.closePath()
  context.fill()
  context.fillStyle = '#bb2828'
  context.beginPath()
  context.moveTo(1, headY + 14)
  context.quadraticCurveTo(3 + bandanaFlutter * 0.2, headY + 18, 4 + bandanaFlutter * 0.4, headY + 22)
  context.lineTo(3 + bandanaFlutter * 0.4, headY + 21)
  context.quadraticCurveTo(2 + bandanaFlutter * 0.1, headY + 17, 0, headY + 14)
  context.closePath()
  context.fill()

  // ── Ears — large, round, cute ──
  const earBob = player.moving
    ? Math.sin(sceneTime * WALK_CYCLE_SPEED * 2) * 2
    : idleEarTwitch()

  // Left ear (back view — brown outer ear, no pink inner visible)
  context.fillStyle = '#7a5a34'
  context.beginPath()
  context.ellipse(-10, headY - 8 - earBob * 0.5, 8, 9, -0.2, 0, Math.PI * 2)
  context.fill()
  context.fillStyle = '#6b4c2c'
  context.beginPath()
  context.ellipse(-10, headY - 8 - earBob * 0.5, 5.5, 6.5, -0.2, 0, Math.PI * 2)
  context.fill()

  // Right ear (back view — brown outer ear, no pink inner visible)
  context.fillStyle = '#7a5a34'
  context.beginPath()
  context.ellipse(10, headY - 8 - earBob, 8, 9, 0.2, 0, Math.PI * 2)
  context.fill()
  context.fillStyle = '#6b4c2c'
  context.beginPath()
  context.ellipse(10, headY - 8 - earBob, 5.5, 6.5, 0.2, 0, Math.PI * 2)
  context.fill()

  // ── Snout bump — tiny hint of muzzle poking past top of head ──
  context.fillStyle = '#b8956c'
  context.beginPath()
  context.ellipse(0, headY - 10, 4, 2.5, 0, Math.PI, Math.PI * 2)
  context.fill()

  // For diagonal: hint of near eye, cheek, and whiskers
  if (lean !== 0) {
    // Cheek puff
    context.fillStyle = '#c4a57c'
    context.beginPath()
    context.ellipse(11, headY + 3, 5, 4, 0.2, 0, Math.PI * 2)
    context.fill()

    const blink = !player.moving && isBlinking()
    if (blink) {
      context.strokeStyle = '#0d0808'
      context.lineWidth = 2
      context.lineCap = 'round'
      context.beginPath()
      context.moveTo(9, headY + 1)
      context.lineTo(14, headY + 1)
      context.stroke()
    } else {
      // Eye
      context.fillStyle = '#0d0808'
      context.beginPath()
      context.ellipse(11, headY + 0.5, 3.5, 3, 0.1, 0, Math.PI * 2)
      context.fill()
      // Eye highlight
      context.fillStyle = 'rgba(255, 255, 255, 0.85)'
      context.beginPath()
      context.arc(12.5, headY - 0.5, 1.3, 0, Math.PI * 2)
      context.fill()
      context.beginPath()
      context.arc(10, headY + 1.5, 0.6, 0, Math.PI * 2)
      context.fill()
    }

    // Whiskers
    const whiskerSpread = player.moving
      ? Math.sin(sceneTime * WALK_CYCLE_SPEED) * 1.5
      : twitch(sceneTime, 0.7, 0.14) * 2.5
    context.strokeStyle = 'rgba(220, 200, 170, 0.55)'
    context.lineWidth = 0.8
    context.lineCap = 'round'
    context.beginPath()
    context.moveTo(15, headY + 4)
    context.lineTo(27, headY + 7 + whiskerSpread)
    context.moveTo(15, headY + 2)
    context.lineTo(27, headY - 1 - whiskerSpread)
    context.moveTo(14, headY + 3)
    context.lineTo(26, headY + 3)
    context.stroke()

    // Hint of nose on the side
    context.fillStyle = '#f08888'
    context.beginPath()
    context.ellipse(14, headY - 5, 2, 1.5, 0.3, 0, Math.PI * 2)
    context.fill()
  }

  context.restore()
}

// ── Quadruped front view (down / down-left / down-right) — rat facing the camera ──
const drawPlayerFront = (
  context: CanvasRenderingContext2D,
  player: PlayerState,
  lean: -1 | 0 | 1,
) => {
  const cycle = player.moving
    ? Math.sin(player.animationTime * WALK_CYCLE_SPEED)
    : 0
  const bob = player.moving
    ? Math.abs(Math.sin(player.animationTime * WALK_CYCLE_SPEED * 2)) * 1.5
    : 0
  const breath = player.moving ? 0 : idleBreath()

  const stopBounce = stopBounceTimer > 0
    ? Math.sin(stopBounceTimer * 14) * stopBounceTimer * 6
    : 0

  context.save()
  context.translate(player.x, player.y - bob - stopBounce)
  if (lean === -1) context.scale(-1, 1)

  // ── Tail — peeks out behind the body, curling up ──
  const tailIdle = player.moving ? 0 : idleTailSway()
  const tailSway = tailIdle * 0.3
  context.strokeStyle = '#d4a888'
  context.lineWidth = 2.5
  context.lineCap = 'round'
  context.beginPath()
  context.moveTo(-4 + tailSway * 0.2, -8)
  context.bezierCurveTo(
    -10 + tailSway * 0.5, -16,
    -8 + tailSway * 0.7 + cycle * 2, -26 + cycle * 3,
    -4 + tailSway + cycle * 2, -34 + cycle * 3,
  )
  context.stroke()

  // ── Back legs (behind body, peeking out to sides) ──
  const legSwingL = cycle * 5
  const legSwingR = -cycle * 5
  context.strokeStyle = '#6a4a2a'
  context.lineWidth = 5
  context.lineCap = 'round'
  context.beginPath()
  context.moveTo(-12, 0)
  context.lineTo(-15 + legSwingL, 13)
  context.stroke()
  context.beginPath()
  context.moveTo(12, 0)
  context.lineTo(15 + legSwingR, 13)
  context.stroke()

  // Back paws
  context.fillStyle = '#5a3a1a'
  context.beginPath()
  context.ellipse(-15 + legSwingL, 15, 4.5, 2.5, 0, 0, Math.PI * 2)
  context.fill()
  context.beginPath()
  context.ellipse(15 + legSwingR, 15, 4.5, 2.5, 0, 0, Math.PI * 2)
  context.fill()

  // ── Body — round chest/belly facing camera ──
  context.fillStyle = '#96744e'
  context.beginPath()
  context.ellipse(0, 0 - breath * 0.2, 15, 12 + breath * 0.3, 0, 0, Math.PI * 2)
  context.fill()

  // Belly patch — lighter, rounder
  context.fillStyle = '#d4b896'
  context.beginPath()
  context.ellipse(0, 2, 10, 8, 0, 0, Math.PI * 2)
  context.fill()

  // ── Front legs (in front of body) ──
  const frontLegL = cycle * 6
  const frontLegR = -cycle * 6
  context.strokeStyle = '#7a5a34'
  context.lineWidth = 6
  context.lineCap = 'round'
  context.beginPath()
  context.moveTo(-9, 5)
  context.lineTo(-10 + frontLegL, 17)
  context.stroke()
  context.beginPath()
  context.moveTo(9, 5)
  context.lineTo(10 + frontLegR, 17)
  context.stroke()

  // Front paws
  context.fillStyle = '#6a4a2a'
  context.beginPath()
  context.ellipse(-10 + frontLegL, 19, 5, 3, 0, 0, Math.PI * 2)
  context.fill()
  context.beginPath()
  context.ellipse(10 + frontLegR, 19, 5, 3, 0, 0, Math.PI * 2)
  context.fill()


  // ── Head — full face, centered ──
  const headBob = player.moving
    ? Math.sin(player.animationTime * WALK_CYCLE_SPEED * 2) * 1
    : 0
  const headY = -13 - headBob
  const earBob = player.moving
    ? Math.sin(sceneTime * WALK_CYCLE_SPEED * 2) * 2
    : idleEarTwitch()
  const noseWob = player.moving ? 0 : idleNoseWiggle()
  const blink = !player.moving && isBlinking()
  const whiskerSpread = player.moving
    ? Math.sin(sceneTime * WALK_CYCLE_SPEED) * 1
    : twitch(sceneTime, 0.7, 0.14) * 2.5

  // Ears (behind head)
  context.fillStyle = '#7a5a34'
  context.beginPath()
  context.arc(-11, headY - 8 - earBob * 0.5, 9, 0, Math.PI * 2)
  context.fill()
  context.fillStyle = '#f5aabb'
  context.beginPath()
  context.arc(-11, headY - 8 - earBob * 0.5, 6.5, 0, Math.PI * 2)
  context.fill()

  context.fillStyle = '#7a5a34'
  context.beginPath()
  context.arc(11, headY - 8 - earBob, 9, 0, Math.PI * 2)
  context.fill()
  context.fillStyle = '#f5aabb'
  context.beginPath()
  context.arc(11, headY - 8 - earBob, 6.5, 0, Math.PI * 2)
  context.fill()

  // Head circle
  context.fillStyle = '#a8855c'
  context.beginPath()
  context.arc(0, headY, 13, 0, Math.PI * 2)
  context.fill()

  // Cheeks
  context.fillStyle = '#b89468'
  context.beginPath()
  context.ellipse(-8, headY + 4, 5, 4, -0.2, 0, Math.PI * 2)
  context.fill()
  context.beginPath()
  context.ellipse(8, headY + 4, 5, 4, 0.2, 0, Math.PI * 2)
  context.fill()

  // Snout — centered
  context.fillStyle = '#c4a07a'
  context.beginPath()
  context.ellipse(0, headY + 5 + noseWob, 7, 5, 0, 0, Math.PI * 2)
  context.fill()

  // Nose — centered, prominent
  context.fillStyle = '#f08888'
  context.beginPath()
  context.arc(0, headY + 3 + noseWob, 3.2, 0, Math.PI * 2)
  context.fill()
  context.fillStyle = 'rgba(255, 220, 220, 0.7)'
  context.beginPath()
  context.arc(-0.5, headY + 2 + noseWob, 1.2, 0, Math.PI * 2)
  context.fill()

  // Eyes — both visible, symmetrical
  if (blink) {
    context.strokeStyle = '#0d0808'
    context.lineWidth = 2
    context.lineCap = 'round'
    context.beginPath()
    context.moveTo(-9, headY - 2)
    context.lineTo(-4, headY - 2)
    context.stroke()
    context.beginPath()
    context.moveTo(4, headY - 2)
    context.lineTo(9, headY - 2)
    context.stroke()
  } else {
    // Left eye
    context.fillStyle = '#0d0808'
    context.beginPath()
    context.arc(-7, headY - 2, 3.5, 0, Math.PI * 2)
    context.fill()
    context.fillStyle = 'rgba(255, 255, 255, 0.85)'
    context.beginPath()
    context.arc(-5.8, headY - 3.5, 1.5, 0, Math.PI * 2)
    context.fill()
    context.fillStyle = 'rgba(255, 255, 255, 0.5)'
    context.beginPath()
    context.arc(-8.2, headY - 0.5, 0.7, 0, Math.PI * 2)
    context.fill()

    // Right eye
    context.fillStyle = '#0d0808'
    context.beginPath()
    context.arc(7, headY - 2, 3.5, 0, Math.PI * 2)
    context.fill()
    context.fillStyle = 'rgba(255, 255, 255, 0.85)'
    context.beginPath()
    context.arc(8.2, headY - 3.5, 1.5, 0, Math.PI * 2)
    context.fill()
    context.fillStyle = 'rgba(255, 255, 255, 0.5)'
    context.beginPath()
    context.arc(5.8, headY - 0.5, 0.7, 0, Math.PI * 2)
    context.fill()
  }

  // Whiskers — both sides
  context.strokeStyle = 'rgba(220, 200, 170, 0.75)'
  context.lineWidth = 0.9
  context.lineCap = 'round'
  // Left whiskers
  context.beginPath()
  context.moveTo(-8, headY + 3)
  context.lineTo(-22, headY + 0 - whiskerSpread)
  context.moveTo(-8, headY + 4)
  context.lineTo(-22, headY + 5)
  context.moveTo(-8, headY + 6)
  context.lineTo(-22, headY + 10 + whiskerSpread)
  context.stroke()
  // Right whiskers
  context.beginPath()
  context.moveTo(8, headY + 3)
  context.lineTo(22, headY + 0 - whiskerSpread)
  context.moveTo(8, headY + 4)
  context.lineTo(22, headY + 5)
  context.moveTo(8, headY + 6)
  context.lineTo(22, headY + 10 + whiskerSpread)
  context.stroke()

  // ── Bandana — visible at neck/chest, prominent ──
  const bandanaFlutter = player.moving
    ? Math.sin(player.animationTime * WALK_CYCLE_SPEED * 1.5) * 3
    : Math.sin(sceneTime * 1.2) * 1

  // Scarf wrap
  context.fillStyle = '#cc3333'
  context.beginPath()
  context.arc(0, headY + 12, 7, 0.3, Math.PI - 0.3)
  context.lineTo(-5, headY + 14)
  context.closePath()
  context.fill()

  // Knot
  context.fillStyle = '#aa2222'
  context.beginPath()
  context.arc(0, headY + 14, 2.5, 0, Math.PI * 2)
  context.fill()

  // Bandana tails hanging down chest
  context.fillStyle = '#cc3333'
  context.beginPath()
  context.moveTo(-2, headY + 15)
  context.quadraticCurveTo(-5, headY + 22 + bandanaFlutter, -6, headY + 26 + bandanaFlutter)
  context.lineTo(-3, headY + 24 + bandanaFlutter)
  context.quadraticCurveTo(-2, headY + 20 + bandanaFlutter * 0.5, 0, headY + 16)
  context.closePath()
  context.fill()
  context.fillStyle = '#bb2828'
  context.beginPath()
  context.moveTo(2, headY + 15)
  context.quadraticCurveTo(4, headY + 21 + bandanaFlutter * 0.8, 5, headY + 25 + bandanaFlutter * 0.7)
  context.lineTo(3, headY + 23 + bandanaFlutter * 0.7)
  context.quadraticCurveTo(2, headY + 19 + bandanaFlutter * 0.4, 1, headY + 16)
  context.closePath()
  context.fill()

  context.restore()
}

const drawPlayer = (context: CanvasRenderingContext2D, player: PlayerState) => {
  if (player.facing === 'up') {
    drawPlayerBack(context, player, 0)
  } else if (player.facing === 'up-right') {
    drawPlayerBack(context, player, 1)
  } else if (player.facing === 'up-left') {
    drawPlayerBack(context, player, -1)
  } else if (player.facing === 'down') {
    drawPlayerFront(context, player, 0)
  } else if (player.facing === 'down-right') {
    drawPlayerFront(context, player, 1)
  } else if (player.facing === 'down-left') {
    drawPlayerFront(context, player, -1)
  } else {
    drawPlayerSide(context, player)
  }
}

export const renderScene = (
  context: CanvasRenderingContext2D,
  player: PlayerState,
) => {
  // Track scene-level time for idle animations & transitions
  const now = performance.now() / 1000
  const dt = lastFrameTime > 0 ? Math.min(now - lastFrameTime, 0.05) : 0
  lastFrameTime = now
  sceneTime += dt

  // Detect start/stop transitions
  if (player.moving && !wasMoving) {
    startSquashTimer = 0.2   // anticipation squash
  }
  if (!player.moving && wasMoving) {
    stopBounceTimer = 0.35   // settle bounce
  }
  wasMoving = player.moving

  // Decay transition timers
  if (stopBounceTimer > 0) stopBounceTimer = Math.max(0, stopBounceTimer - dt * 2.5)
  if (startSquashTimer > 0) startSquashTimer = Math.max(0, startSquashTimer - dt * 3)

  context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

  drawBackdrop(context)
  drawRug(context)
  drawFurniture(context)

  // Blanket draws on top of mattress (and mouse lump if in bed)
  drawBedBlanket(context, player)

  // Depth sorting: nightstand body renders on top when player is behind
  const NIGHTSTAND_DEPTH_Y = 248
  const playerBehindNightstand = player.y < NIGHTSTAND_DEPTH_Y
    && player.x > 210 && player.x < 330

  if (!playerBehindNightstand) {
    drawNightstandBody(context)
  }

  if (!player.inBed) {
    // Shadow — wider for quadruped body, breathes slightly
    const shadowBreath = player.moving ? 0 : idleBreath() * 0.3
    context.fillStyle = 'rgba(20, 12, 8, 0.32)'
    context.beginPath()
    context.ellipse(
      player.x, player.y + 20,
      24 + shadowBreath, 7 + shadowBreath * 0.2,
      0, 0, Math.PI * 2,
    )
    context.fill()

    drawPlayer(context, player)
  }

  if (playerBehindNightstand) {
    drawNightstandBody(context)
  }

  // Alarm clock always renders in front of the player
  drawAlarmClock(context)
}
