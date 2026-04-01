import './style.css'
import {
  ALARM_CLOCK_ZONE,
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  INITIAL_PLAYER_STATE,
  MOVEMENT_KEYS,
  ROOM_BOUNDS,
  stepPlayer,
  type ControlsState,
  type PlayerState,
} from './movement'
import { type DialogState, renderScene } from './render'

const app = document.querySelector<HTMLDivElement>('#app')

if (!app) {
  throw new Error('App root not found')
}

app.innerHTML = `
  <main class="viewport">
    <div class="stage">
      <canvas
        class="game-canvas"
        width="${CANVAS_WIDTH}"
        height="${CANVAS_HEIGHT}"
        aria-label="A room with a movable character"
      ></canvas>
    </div>
  </main>
`

const canvas = app.querySelector<HTMLCanvasElement>('canvas')

if (!canvas) {
  throw new Error('Game canvas not found')
}

const context = canvas.getContext('2d')

if (!context) {
  throw new Error('2D context unavailable')
}

const controls: ControlsState = {
  down: false,
  left: false,
  right: false,
  up: false,
}

let player: PlayerState = { ...INITIAL_PLAYER_STATE }
let dialog: DialogState = { visible: false, message: '' }
let previousTime = performance.now()

const syncDebugState = () => {
  app.dataset.playerX = player.x.toFixed(2)
  app.dataset.playerY = player.y.toFixed(2)
}

const setKeyState = (code: string, pressed: boolean) => {
  const direction = MOVEMENT_KEYS[code]

  if (!direction) {
    return
  }

  controls[direction] = pressed
}

window.addEventListener('keydown', (event) => {
  if (!(event.code in MOVEMENT_KEYS)) {
    return
  }

  event.preventDefault()

  if (dialog.visible) return

  setKeyState(event.code, true)
})

window.addEventListener('keyup', (event) => {
  if (!(event.code in MOVEMENT_KEYS)) {
    return
  }

  event.preventDefault()

  if (dialog.visible) return

  setKeyState(event.code, false)
})

window.addEventListener('blur', () => {
  controls.down = false
  controls.left = false
  controls.right = false
  controls.up = false
})

const isInZone = (px: number, py: number, zone: typeof ALARM_CLOCK_ZONE) =>
  px >= zone.x && px <= zone.x + zone.width
  && py >= zone.y && py <= zone.y + zone.height

const formatTime = (): string => {
  const now = new Date()
  let hours = now.getHours()
  const minutes = now.getMinutes().toString().padStart(2, '0')
  const amPm = hours >= 12 ? 'PM' : 'AM'
  hours = hours % 12 || 12
  return `${hours}:${minutes} ${amPm}`
}

window.addEventListener('keydown', (event) => {
  if (event.code !== 'KeyF') return

  if (dialog.visible) {
    dialog = { visible: false, message: '' }
    return
  }

  if (!player.inBed && isInZone(player.x, player.y, ALARM_CLOCK_ZONE)) {
    dialog = { visible: true, message: `It's ${formatTime()}` }
    // Zero out held controls so player stops immediately
    controls.down = controls.left = controls.right = controls.up = false
  }
})

const frame = (time: number) => {
  const deltaTime = Math.min((time - previousTime) / 1000, 0.05)
  previousTime = time

  player = stepPlayer(player, controls, deltaTime, ROOM_BOUNDS)
  renderScene(context, player, dialog)
  syncDebugState()

  window.requestAnimationFrame(frame)
}

renderScene(context, player, dialog)
syncDebugState()
window.requestAnimationFrame(frame)
