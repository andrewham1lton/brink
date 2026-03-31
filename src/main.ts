import './style.css'
import {
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  INITIAL_PLAYER_STATE,
  MOVEMENT_KEYS,
  ROOM_BOUNDS,
  stepPlayer,
  type ControlsState,
  type PlayerState,
} from './movement'
import { renderScene } from './render'

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
  setKeyState(event.code, true)
})

window.addEventListener('keyup', (event) => {
  if (!(event.code in MOVEMENT_KEYS)) {
    return
  }

  event.preventDefault()
  setKeyState(event.code, false)
})

window.addEventListener('blur', () => {
  controls.down = false
  controls.left = false
  controls.right = false
  controls.up = false
})

const frame = (time: number) => {
  const deltaTime = Math.min((time - previousTime) / 1000, 0.05)
  previousTime = time

  player = stepPlayer(player, controls, deltaTime, ROOM_BOUNDS)
  renderScene(context, player)
  syncDebugState()

  window.requestAnimationFrame(frame)
}

renderScene(context, player)
syncDebugState()
window.requestAnimationFrame(frame)
