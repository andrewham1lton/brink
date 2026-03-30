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

  // === Exit door on right wall ===
  // Dark hallway behind the door
  context.fillStyle = '#1a100a'
  context.fillRect(840, 56, 80, 120)

  // Door frame
  context.fillStyle = '#5a3820'
  context.fillRect(832, 48, 8, 136)   // left frame
  context.fillRect(920, 48, 8, 136)   // right frame
  context.fillRect(832, 48, 96, 8)    // top frame

  // Door (ajar — drawn at an angle to suggest open)
  context.fillStyle = '#8a6040'
  context.beginPath()
  context.moveTo(920, 56)
  context.lineTo(900, 56)
  context.lineTo(893, 176)
  context.lineTo(920, 176)
  context.closePath()
  context.fill()

  // Door panel detail
  context.fillStyle = 'rgba(255, 220, 160, 0.08)'
  context.fillRect(898, 70, 18, 40)
  context.fillRect(898, 124, 18, 38)

  // Doorknob
  context.fillStyle = '#c4a860'
  context.beginPath()
  context.arc(900, 120, 4, 0, Math.PI * 2)
  context.fill()
  // Knob highlight
  context.fillStyle = 'rgba(255, 240, 180, 0.4)'
  context.beginPath()
  context.arc(899, 119, 1.5, 0, Math.PI * 2)
  context.fill()

  // Hallway depth — faint light at the far end
  context.fillStyle = 'rgba(180, 150, 110, 0.08)'
  context.fillRect(852, 60, 40, 110)

  // Baseboard break at door
  context.fillStyle = '#1a100a'
  context.fillRect(832, 160, 96, 24)

  // Floor threshold
  context.fillStyle = '#5a3820'
  context.fillRect(832, 180, 96, 6)

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

  // Alarm clock on nightstand
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

const drawPlayerShadow = (
  context: CanvasRenderingContext2D,
  player: PlayerState,
) => {
  context.fillStyle = 'rgba(20, 12, 8, 0.42)'
  context.beginPath()
  context.ellipse(player.x, player.y + 26, 20, 11, 0, 0, Math.PI * 2)
  context.fill()
}

const WALK_CYCLE_SPEED = 10

const drawPlayer = (context: CanvasRenderingContext2D, player: PlayerState) => {
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

  // Legs
  const legSwing = cycle * 8
  context.strokeStyle = '#1f1721'
  context.lineCap = 'round'
  context.lineWidth = 6
  context.beginPath()
  context.moveTo(-7, 18)
  context.lineTo(-7 + legSwing, 32)
  context.moveTo(7, 18)
  context.lineTo(7 - legSwing, 32)
  context.stroke()

  // Shoes
  context.fillStyle = '#2a1a12'
  context.beginPath()
  context.ellipse(-7 + legSwing, 34, 5, 3, 0, 0, Math.PI * 2)
  context.fill()
  context.beginPath()
  context.ellipse(7 - legSwing, 34, 5, 3, 0, 0, Math.PI * 2)
  context.fill()

  // Torso
  context.fillStyle = '#1d3b73'
  context.beginPath()
  context.roundRect(-16, -12, 32, 34, 10)
  context.fill()

  // Torso highlight
  context.fillStyle = 'rgba(255, 255, 255, 0.06)'
  context.beginPath()
  context.roundRect(-14, -10, 12, 30, 8)
  context.fill()

  // Collar / upper body
  context.fillStyle = '#345ea5'
  context.beginPath()
  context.roundRect(-10, -18, 20, 16, 6)
  context.fill()

  // Arms
  const armSwing = cycle * 12
  context.strokeStyle = '#1f1721'
  context.lineCap = 'round'
  context.lineWidth = 6
  context.beginPath()
  context.moveTo(-18, -2)
  context.lineTo(-28, 10 - armSwing)
  context.moveTo(18, -2)
  context.lineTo(28, 10 + armSwing)
  context.stroke()

  // Hands
  context.fillStyle = '#f0c9a0'
  context.beginPath()
  context.arc(-28, 10 - armSwing, 3.5, 0, Math.PI * 2)
  context.fill()
  context.beginPath()
  context.arc(28, 10 + armSwing, 3.5, 0, Math.PI * 2)
  context.fill()

  // Head
  context.fillStyle = '#f0c9a0'
  context.beginPath()
  context.arc(0, -24, 14, 0, Math.PI * 2)
  context.fill()

  // Hair
  context.fillStyle = '#2a1b14'
  context.beginPath()
  context.arc(0, -30, 14, Math.PI, Math.PI * 2)
  context.fill()

  // Eyes
  context.fillStyle = '#1f1721'
  context.beginPath()
  context.arc(5, -25, 2, 0, Math.PI * 2)
  context.arc(-1, -25, 1.5, 0, Math.PI * 2)
  context.fill()

  // Mouth
  context.strokeStyle = 'rgba(80, 40, 30, 0.5)'
  context.lineWidth = 1.5
  context.lineCap = 'round'
  context.beginPath()
  context.arc(3, -19, 3, 0.2, Math.PI - 0.2)
  context.stroke()

  context.restore()
}

export const renderScene = (
  context: CanvasRenderingContext2D,
  player: PlayerState,
) => {
  context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

  drawBackdrop(context)
  drawRug(context)
  drawFurniture(context)
  drawPlayerShadow(context, player)
  drawPlayer(context, player)
}
