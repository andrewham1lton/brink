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

  // Chair rail molding line
  context.strokeStyle = 'rgba(120, 80, 40, 0.5)'
  context.lineWidth = 2
  context.beginPath()
  context.moveTo(0, 100)
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

  // === Bed (upper right) ===
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

  // Bedsheet / blanket (lower 2/3)
  context.fillStyle = '#4a6a8a'
  context.beginPath()
  context.roundRect(656, 250, 158, 74, [0, 0, 6, 6])
  context.fill()

  // Blanket fold line
  context.strokeStyle = 'rgba(30, 50, 70, 0.3)'
  context.lineWidth = 2
  context.beginPath()
  context.moveTo(660, 254)
  context.quadraticCurveTo(735, 246, 810, 254)
  context.stroke()

  // Blanket highlight
  context.fillStyle = 'rgba(255, 255, 255, 0.06)'
  context.fillRect(656, 256, 158, 8)

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

  // Legs
  context.fillStyle = '#3a2416'
  context.fillRect(242, 268, 8, 40)
  context.fillRect(290, 268, 8, 40)

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

  // === Lamp (on bookshelf) ===
  // Warm glow halo
  context.save()
  const glowGrad = context.createRadialGradient(160, 66, 5, 160, 66, 80)
  glowGrad.addColorStop(0, 'rgba(255, 220, 120, 0.2)')
  glowGrad.addColorStop(1, 'rgba(255, 220, 120, 0)')
  context.fillStyle = glowGrad
  context.beginPath()
  context.arc(160, 66, 80, 0, Math.PI * 2)
  context.fill()
  context.restore()

  // Lamp base/stand
  context.fillStyle = '#d7ad74'
  context.fillRect(155, 74, 10, 54)

  // Lamp base plate
  context.fillStyle = '#c49a63'
  context.fillRect(146, 124, 28, 6)

  // Lampshade
  context.fillStyle = '#f5e4b8'
  context.beginPath()
  context.moveTo(140, 74)
  context.lineTo(180, 74)
  context.lineTo(174, 46)
  context.lineTo(146, 46)
  context.closePath()
  context.fill()

  // Lampshade edge highlight
  context.strokeStyle = 'rgba(200, 170, 100, 0.6)'
  context.lineWidth = 1
  context.beginPath()
  context.moveTo(140, 74)
  context.lineTo(180, 74)
  context.stroke()

  // Lamp bulb glow
  context.fillStyle = '#f0d387'
  context.beginPath()
  context.arc(160, 66, 8, 0, Math.PI * 2)
  context.fill()

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

const drawAlarmClock = (context: CanvasRenderingContext2D) => {
  context.fillStyle = '#2a2a30'
  context.beginPath()
  context.roundRect(258, 210, 24, 16, 4)
  context.fill()
  // Clock face
  context.fillStyle = '#4a8a5a'
  context.fillRect(262, 213, 16, 10)
  // Time display
  context.fillStyle = '#7aff7a'
  context.font = '7px monospace'
  context.fillText('7:42', 263, 221)
}

const drawPlayerShadow = (
  context: CanvasRenderingContext2D,
  player: PlayerState,
) => {
  context.fillStyle = 'rgba(20, 12, 8, 0.38)'
  context.beginPath()
  context.ellipse(player.x, player.y + 26, 18, 8, 0, 0, Math.PI * 2)
  context.fill()
}

const WALK_CYCLE_SPEED = 10

// Shared rat head parts for the side-facing view
const drawRatHeadSide = (context: CanvasRenderingContext2D) => {
  // Ear (back)
  context.fillStyle = '#7a5a34'
  context.beginPath()
  context.arc(-3, -35, 8, 0, Math.PI * 2)
  context.fill()
  context.fillStyle = '#f0a0b0'
  context.beginPath()
  context.arc(-3, -35, 5.5, 0, Math.PI * 2)
  context.fill()

  // Ear (front)
  context.fillStyle = '#7a5a34'
  context.beginPath()
  context.arc(6, -37, 7, 0, Math.PI * 2)
  context.fill()
  context.fillStyle = '#f0a0b0'
  context.beginPath()
  context.arc(6, -37, 4.5, 0, Math.PI * 2)
  context.fill()

  // Head
  context.fillStyle = '#9a7a54'
  context.beginPath()
  context.ellipse(4, -26, 12, 11, 0.1, 0, Math.PI * 2)
  context.fill()

  // Snout
  context.fillStyle = '#b09070'
  context.beginPath()
  context.ellipse(15, -22, 7, 5, -0.1, 0, Math.PI * 2)
  context.fill()

  // Nose
  context.fillStyle = '#e87878'
  context.beginPath()
  context.arc(21, -22, 2.5, 0, Math.PI * 2)
  context.fill()
  context.fillStyle = 'rgba(255, 210, 210, 0.6)'
  context.beginPath()
  context.arc(20, -23, 0.9, 0, Math.PI * 2)
  context.fill()

  // Eye
  context.fillStyle = '#0d0808'
  context.beginPath()
  context.arc(10, -28, 3.2, 0, Math.PI * 2)
  context.fill()
  context.fillStyle = 'rgba(255, 255, 255, 0.75)'
  context.beginPath()
  context.arc(11, -29, 1.1, 0, Math.PI * 2)
  context.fill()

  // Whiskers
  context.strokeStyle = 'rgba(220, 200, 170, 0.75)'
  context.lineWidth = 0.9
  context.lineCap = 'round'
  context.beginPath()
  context.moveTo(14, -24)
  context.lineTo(28, -28)
  context.moveTo(14, -23)
  context.lineTo(28, -22)
  context.moveTo(14, -21)
  context.lineTo(28, -17)
  context.stroke()
}

// Side-facing humanoid rat (left / right)
const drawPlayerSide = (
  context: CanvasRenderingContext2D,
  player: PlayerState,
) => {
  const cycle = player.moving
    ? Math.sin(player.animationTime * WALK_CYCLE_SPEED)
    : 0
  const bob = player.moving
    ? Math.abs(Math.sin(player.animationTime * WALK_CYCLE_SPEED * 2)) * 2
    : 0
  const flip = player.facing === 'left' ? -1 : 1

  context.save()
  context.translate(player.x, player.y - bob)
  context.scale(flip, 1)

  // Tail — behind body, swings with walk
  context.strokeStyle = '#c49a7a'
  context.lineWidth = 2.5
  context.lineCap = 'round'
  context.beginPath()
  context.moveTo(-10, -4)
  context.bezierCurveTo(-28, 0, -34, -10 + cycle * 4, -26, -20 + cycle * 5)
  context.stroke()

  // Legs
  const legSwing = cycle * 10
  context.strokeStyle = '#6a4a2a'
  context.lineWidth = 7
  context.lineCap = 'round'
  context.beginPath()
  context.moveTo(-6, 6)
  context.lineTo(-6 + legSwing, 22)
  context.moveTo(6, 6)
  context.lineTo(6 - legSwing, 22)
  context.stroke()

  // Feet
  context.fillStyle = '#5a3a1a'
  context.beginPath()
  context.ellipse(-6 + legSwing, 25, 6, 3.5, 0.2, 0, Math.PI * 2)
  context.fill()
  context.beginPath()
  context.ellipse(6 - legSwing, 25, 6, 3.5, -0.2, 0, Math.PI * 2)
  context.fill()

  // Torso
  context.fillStyle = '#8a6a44'
  context.beginPath()
  context.roundRect(-13, -14, 26, 22, 8)
  context.fill()

  // Belly patch
  context.fillStyle = '#c8a882'
  context.beginPath()
  context.roundRect(-7, -10, 14, 16, 6)
  context.fill()

  // Arms
  const armSwing = cycle * 10
  context.strokeStyle = '#7a5a34'
  context.lineWidth = 6
  context.lineCap = 'round'
  context.beginPath()
  context.moveTo(-14, -8)
  context.lineTo(-22, 4 - armSwing)
  context.moveTo(14, -8)
  context.lineTo(22, 4 + armSwing)
  context.stroke()

  // Hands
  context.fillStyle = '#c8a882'
  context.beginPath()
  context.arc(-22, 4 - armSwing, 4, 0, Math.PI * 2)
  context.fill()
  context.beginPath()
  context.arc(22, 4 + armSwing, 4, 0, Math.PI * 2)
  context.fill()

  // Rat head (side view)
  drawRatHeadSide(context)

  context.restore()
}

// Back-facing humanoid rat (up / up-left / up-right)
const drawPlayerBack = (
  context: CanvasRenderingContext2D,
  player: PlayerState,
  lean: -1 | 0 | 1,
) => {
  const cycle = player.moving
    ? Math.sin(player.animationTime * WALK_CYCLE_SPEED)
    : 0
  const bob = player.moving
    ? Math.abs(Math.sin(player.animationTime * WALK_CYCLE_SPEED * 2)) * 2
    : 0

  context.save()
  context.translate(player.x, player.y - bob)
  // Mirror the whole sprite for up-left
  if (lean === -1) context.scale(-1, 1)

  const diagonal = lean !== 0

  // Tail — hangs from base of spine, curls to the side
  context.strokeStyle = '#c49a7a'
  context.lineWidth = 2.5
  context.lineCap = 'round'
  context.beginPath()
  context.moveTo(diagonal ? 4 : 0, 2)
  if (diagonal) {
    context.bezierCurveTo(20, 8, 28, 0, 22, -10)
  } else {
    context.bezierCurveTo(-18, 8, -26, 0, -20, -10)
  }
  context.stroke()

  // Legs
  const legSwing = cycle * 10
  context.strokeStyle = '#6a4a2a'
  context.lineWidth = 7
  context.lineCap = 'round'
  context.beginPath()
  context.moveTo(-6, 6)
  context.lineTo(-6 + legSwing, 22)
  context.moveTo(6, 6)
  context.lineTo(6 - legSwing, 22)
  context.stroke()

  // Feet
  context.fillStyle = '#5a3a1a'
  context.beginPath()
  context.ellipse(-6 + legSwing, 25, 6, 3.5, 0.2, 0, Math.PI * 2)
  context.fill()
  context.beginPath()
  context.ellipse(6 - legSwing, 25, 6, 3.5, -0.2, 0, Math.PI * 2)
  context.fill()

  // Torso (back — slightly darker, no belly patch)
  context.fillStyle = '#7a5a38'
  context.beginPath()
  context.roundRect(-13, -14, 26, 22, 8)
  context.fill()

  // Back fur stripe
  context.fillStyle = 'rgba(50, 32, 12, 0.18)'
  context.beginPath()
  context.roundRect(-5, -12, 10, 18, 4)
  context.fill()

  // Arms
  const armSwing = cycle * 10
  context.strokeStyle = '#7a5a34'
  context.lineWidth = 6
  context.lineCap = 'round'
  context.beginPath()
  context.moveTo(-14, -8)
  context.lineTo(-22, 4 - armSwing)
  context.moveTo(14, -8)
  context.lineTo(22, 4 + armSwing)
  context.stroke()

  // Hands
  context.fillStyle = '#c8a882'
  context.beginPath()
  context.arc(-22, 4 - armSwing, 4, 0, Math.PI * 2)
  context.fill()
  context.beginPath()
  context.arc(22, 4 + armSwing, 4, 0, Math.PI * 2)
  context.fill()

  // Head (back of head)
  const headX = diagonal ? 3 : 0
  context.fillStyle = '#9a7a54'
  context.beginPath()
  context.arc(headX, -26, 12, 0, Math.PI * 2)
  context.fill()

  // Left ear (from behind)
  context.fillStyle = '#7a5a34'
  context.beginPath()
  context.arc(headX - 10, -36, 8, 0, Math.PI * 2)
  context.fill()
  context.fillStyle = '#f0a0b0'
  context.beginPath()
  context.arc(headX - 10, -36, 5.5, 0, Math.PI * 2)
  context.fill()

  // Right ear (from behind)
  context.fillStyle = '#7a5a34'
  context.beginPath()
  context.arc(headX + 10, -36, 8, 0, Math.PI * 2)
  context.fill()
  context.fillStyle = '#f0a0b0'
  context.beginPath()
  context.arc(headX + 10, -36, 5.5, 0, Math.PI * 2)
  context.fill()

  // For diagonal: hint of near eye and whiskers peeking around the cheek
  if (diagonal) {
    context.fillStyle = '#0d0808'
    context.beginPath()
    context.arc(headX + 10, -24, 2.5, 0, Math.PI * 2)
    context.fill()
    context.fillStyle = 'rgba(255, 255, 255, 0.7)'
    context.beginPath()
    context.arc(headX + 11, -25, 0.8, 0, Math.PI * 2)
    context.fill()

    context.strokeStyle = 'rgba(220, 200, 170, 0.5)'
    context.lineWidth = 0.8
    context.lineCap = 'round'
    context.beginPath()
    context.moveTo(headX + 14, -22)
    context.lineTo(headX + 24, -19)
    context.moveTo(headX + 14, -21)
    context.lineTo(headX + 24, -25)
    context.stroke()
  }

  context.restore()
}

const drawPlayer = (context: CanvasRenderingContext2D, player: PlayerState) => {
  if (player.facing === 'up') {
    drawPlayerBack(context, player, 0)
  } else if (player.facing === 'up-right') {
    drawPlayerBack(context, player, 1)
  } else if (player.facing === 'up-left') {
    drawPlayerBack(context, player, -1)
  } else {
    drawPlayerSide(context, player)
  }
}

// Y threshold below which the alarm clock should render on top of the player.
// The alarm clock sits on the nightstand surface at y≈226; anything above that
// (lower Y) means the player is standing behind the clock.
const ALARM_CLOCK_DEPTH_Y = 228

export const renderScene = (
  context: CanvasRenderingContext2D,
  player: PlayerState,
) => {
  context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

  drawBackdrop(context)
  drawRug(context)
  drawFurniture(context)

  const playerBehindClock = player.y < ALARM_CLOCK_DEPTH_Y

  if (!playerBehindClock) {
    drawAlarmClock(context)
  }

  drawPlayerShadow(context, player)
  drawPlayer(context, player)

  if (playerBehindClock) {
    drawAlarmClock(context)
  }
}
