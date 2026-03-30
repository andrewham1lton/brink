import {
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  ROOM_BOUNDS,
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
  context.fillStyle = wallGradient(context)
  context.fillRect(0, 0, CANVAS_WIDTH, 178)

  context.fillStyle = '#3f2413'
  context.fillRect(0, 160, CANVAS_WIDTH, 24)

  context.fillStyle = floorGradient(context)
  context.fillRect(0, 184, CANVAS_WIDTH, CANVAS_HEIGHT - 184)

  context.fillStyle = 'rgba(255, 242, 212, 0.18)'
  context.fillRect(704, 34, 148, 86)
  context.strokeStyle = 'rgba(131, 82, 32, 0.7)'
  context.lineWidth = 8
  context.strokeRect(704, 34, 148, 86)

  context.beginPath()
  context.strokeStyle = 'rgba(99, 60, 21, 0.9)'
  context.lineWidth = 4
  context.moveTo(778, 34)
  context.lineTo(778, 120)
  context.moveTo(704, 77)
  context.lineTo(852, 77)
  context.stroke()

  context.fillStyle = 'rgba(255, 220, 130, 0.22)'
  context.beginPath()
  context.ellipse(780, 188, 160, 60, -0.08, 0, Math.PI * 2)
  context.fill()
}

const drawFurniture = (context: CanvasRenderingContext2D) => {
  context.fillStyle = '#4e3123'
  context.fillRect(106, 110, 126, 64)
  context.fillStyle = '#6b4531'
  context.fillRect(116, 120, 106, 44)

  context.fillStyle = '#6d4229'
  context.fillRect(720, 254, 146, 70)
  context.fillStyle = '#83513a'
  context.fillRect(708, 240, 170, 32)
  context.fillRect(742, 320, 16, 70)
  context.fillRect(828, 320, 16, 70)

  context.fillStyle = '#3a2416'
  context.fillRect(250, 250, 110, 62)
  context.fillStyle = '#5d3824'
  context.fillRect(238, 236, 134, 26)
  context.fillRect(250, 312, 12, 54)
  context.fillRect(348, 312, 12, 54)

  context.fillStyle = '#a8683f'
  context.beginPath()
  context.ellipse(484, 338, 104, 56, 0, 0, Math.PI * 2)
  context.fill()

  context.strokeStyle = 'rgba(255, 220, 160, 0.2)'
  context.lineWidth = 3
  context.stroke()

  context.fillStyle = '#d7ad74'
  context.fillRect(146, 74, 28, 54)
  context.fillStyle = '#f0d387'
  context.beginPath()
  context.arc(160, 66, 24, 0, Math.PI * 2)
  context.fill()
}

const drawRoomBounds = (context: CanvasRenderingContext2D) => {
  context.strokeStyle = 'rgba(255, 255, 255, 0.06)'
  context.setLineDash([12, 12])
  context.lineWidth = 2
  context.strokeRect(
    ROOM_BOUNDS.minX,
    ROOM_BOUNDS.minY,
    ROOM_BOUNDS.maxX - ROOM_BOUNDS.minX,
    ROOM_BOUNDS.maxY - ROOM_BOUNDS.minY,
  )
  context.setLineDash([])
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

const drawPlayer = (context: CanvasRenderingContext2D, player: PlayerState) => {
  context.save()
  context.translate(player.x, player.y)

  context.fillStyle = '#1d3b73'
  context.beginPath()
  context.roundRect(-16, -12, 32, 34, 10)
  context.fill()

  context.fillStyle = '#345ea5'
  context.beginPath()
  context.roundRect(-10, -18, 20, 16, 6)
  context.fill()

  context.fillStyle = '#f0c9a0'
  context.beginPath()
  context.arc(0, -24, 14, 0, Math.PI * 2)
  context.fill()

  context.fillStyle = '#2a1b14'
  context.beginPath()
  context.arc(0, -30, 14, Math.PI, Math.PI * 2)
  context.fill()

  context.strokeStyle = '#1f1721'
  context.lineCap = 'round'
  context.lineWidth = 6
  context.beginPath()
  context.moveTo(-10, 18)
  context.lineTo(-12, 34)
  context.moveTo(10, 18)
  context.lineTo(12, 34)
  context.moveTo(-18, -2)
  context.lineTo(-28, 10)
  context.moveTo(18, -2)
  context.lineTo(28, 10)
  context.stroke()

  context.restore()
}

export const renderScene = (
  context: CanvasRenderingContext2D,
  player: PlayerState,
) => {
  context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

  drawBackdrop(context)
  drawFurniture(context)
  drawRoomBounds(context)
  drawPlayerShadow(context, player)
  drawPlayer(context, player)
}
