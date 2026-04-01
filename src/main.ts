import './style.css'
import { AudioManager, installAudioUnlock } from './audio'
import { resolveAreaMusic, type AreaId } from './areas'
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
const currentAreaId: AreaId = 'bedroom'
const audioManager = new AudioManager()

installAudioUnlock(window, audioManager)

// ── Opening cutscene ──
const OPENING_LINES = [
  '*knock knock knock*',
  'Rise and shine, little one! Come meet me out in the garden when you\'re ready.',
]

const cutscene = { active: true, step: 0, timer: 2.0 }

const getCurrentMusic = () => resolveAreaMusic(
  currentAreaId,
  cutscene.active ? 'cutscene' : 'ambient',
)

const syncDebugState = () => {
  app.dataset.playerX = player.x.toFixed(2)
  app.dataset.playerY = player.y.toFixed(2)
  app.dataset.areaId = currentAreaId
  app.dataset.musicTrackId = getCurrentMusic()?.id ?? ''
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

document.addEventListener('visibilitychange', () => {
  audioManager.setAppActive(document.visibilityState === 'visible')
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

  // During cutscene: advance to next line or finish
  if (cutscene.active && dialog.visible) {
    cutscene.step++
    if (cutscene.step < OPENING_LINES.length) {
      dialog = { visible: true, message: OPENING_LINES[cutscene.step] }
    } else {
      dialog = { visible: false, message: '' }
      cutscene.active = false
    }
    return
  }

  // Normal dialog dismiss
  if (dialog.visible) {
    dialog = { visible: false, message: '' }
    return
  }

  // Block interactions during cutscene (waiting for timer)
  if (cutscene.active) return

  if (!player.inBed && isInZone(player.x, player.y, ALARM_CLOCK_ZONE)) {
    dialog = { visible: true, message: `This must be my alarm clock. It says it's ${formatTime()}.` }
    controls.down = controls.left = controls.right = controls.up = false
  }
})

const frame = (time: number) => {
  const deltaTime = Math.min((time - previousTime) / 1000, 0.05)
  previousTime = time

  // Cutscene timer: show first knock after delay
  if (cutscene.active && cutscene.step === 0 && !dialog.visible) {
    cutscene.timer -= deltaTime
    if (cutscene.timer <= 0) {
      dialog = { visible: true, message: OPENING_LINES[0] }
      cutscene.step = 0
    }
  }

  if (!dialog.visible) {
    player = stepPlayer(player, controls, deltaTime, ROOM_BOUNDS)
  }

  audioManager.syncMusic(getCurrentMusic())
  renderScene(context, player, dialog)
  syncDebugState()

  window.requestAnimationFrame(frame)
}

audioManager.syncMusic(getCurrentMusic())
renderScene(context, player, dialog)
syncDebugState()
window.requestAnimationFrame(frame)
