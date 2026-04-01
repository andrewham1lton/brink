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
const BED_REVEAL_LINES = [
  'Oh.',
  'I\'m a rat.',
  'Interesting.',
]
const BED_REVEAL_DELAY = 0.6

const cutscene = { active: true, step: 0, timer: 2.0 }
const bedReveal = { active: false, complete: false, delay: 0, step: 0 }

const getCurrentMusic = () => resolveAreaMusic(
  currentAreaId,
  cutscene.active ? 'cutscene' : 'ambient',
)

const clearControls = () => {
  controls.down = false
  controls.left = false
  controls.right = false
  controls.up = false
}

const showDialog = (message: string) => {
  dialog = { visible: true, message }
  clearControls()
}

const hideDialog = () => {
  dialog = { visible: false, message: '' }
}

const isMovementLocked = () => cutscene.active || bedReveal.active || dialog.visible

const syncDebugState = () => {
  app.dataset.playerX = player.x.toFixed(2)
  app.dataset.playerY = player.y.toFixed(2)
  app.dataset.playerInBed = String(player.inBed)
  app.dataset.areaId = currentAreaId
  app.dataset.cutsceneActive = String(cutscene.active)
  app.dataset.dialogMessage = dialog.message
  app.dataset.dialogVisible = String(dialog.visible)
  app.dataset.movementLocked = String(isMovementLocked())
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

  if (isMovementLocked()) return

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
  clearControls()
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

const advanceDialogOrInteract = () => {
  if (cutscene.active && dialog.visible) {
    cutscene.step++
    if (cutscene.step < OPENING_LINES.length) {
      showDialog(OPENING_LINES[cutscene.step])
    } else {
      hideDialog()
      cutscene.active = false
    }
    return
  }

  if (bedReveal.active && dialog.visible) {
    bedReveal.step++
    if (bedReveal.step < BED_REVEAL_LINES.length) {
      showDialog(BED_REVEAL_LINES[bedReveal.step])
    } else {
      hideDialog()
      bedReveal.active = false
      bedReveal.complete = true
    }
    return
  }

  // Normal dialog dismiss
  if (dialog.visible) {
    hideDialog()
    return
  }

  // Block interactions during cutscene (waiting for timer)
  if (cutscene.active) return
  if (bedReveal.active) return

  if (!player.inBed && isInZone(player.x, player.y, ALARM_CLOCK_ZONE)) {
    showDialog(`This must be my alarm clock. It says it's ${formatTime()}.`)
  }
}

window.addEventListener('keydown', (event) => {
  if (event.code !== 'KeyF') return

  event.preventDefault()
  advanceDialogOrInteract()
})

canvas.addEventListener('pointerdown', (event) => {
  if (!event.isPrimary || event.button !== 0) {
    return
  }

  event.preventDefault()
  advanceDialogOrInteract()
})

const frame = (time: number) => {
  const deltaTime = Math.min((time - previousTime) / 1000, 0.05)
  previousTime = time

  // Cutscene timer: show first knock after delay
  if (cutscene.active && cutscene.step === 0 && !dialog.visible) {
    cutscene.timer -= deltaTime
    if (cutscene.timer <= 0) {
      showDialog(OPENING_LINES[0])
      cutscene.step = 0
    }
  }

  if (bedReveal.active && !dialog.visible) {
    bedReveal.delay -= deltaTime
    if (bedReveal.delay <= 0) {
      showDialog(BED_REVEAL_LINES[bedReveal.step])
    }
  }

  if (!isMovementLocked()) {
    const nextPlayer = stepPlayer(player, controls, deltaTime, ROOM_BOUNDS)
    const justLeftBed = player.inBed && !nextPlayer.inBed && !bedReveal.complete

    player = justLeftBed
      ? { ...nextPlayer, moving: false }
      : nextPlayer

    if (justLeftBed) {
      bedReveal.active = true
      bedReveal.delay = BED_REVEAL_DELAY
      bedReveal.step = 0
      clearControls()
    }
  } else if (player.moving) {
    player = { ...player, moving: false }
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
