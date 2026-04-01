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
const HIDDEN_DIALOG: DialogState = { visible: false, message: '' }
let blockingDialog: DialogState = { ...HIDDEN_DIALOG }
let ambientDialog = { ...HIDDEN_DIALOG, timer: 0 }
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
const TAIL_REACTION_LINE = 'What the heck is up with this tail...'
const TAIL_REACTION_DISTANCE = 40
const TAIL_REACTION_DURATION = 3.2

const cutscene = { active: true, step: 0, timer: 2.0 }
const bedReveal = { active: false, complete: false, delay: 0, step: 0 }
const tailReaction = { distance: 0, shown: false }

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

const getActiveDialog = (): DialogState => {
  if (blockingDialog.visible) {
    return blockingDialog
  }

  if (ambientDialog.visible) {
    return ambientDialog
  }

  return HIDDEN_DIALOG
}

const hideAmbientDialog = () => {
  ambientDialog = { ...HIDDEN_DIALOG, timer: 0 }
}

const showBlockingDialog = (message: string) => {
  hideAmbientDialog()
  blockingDialog = { visible: true, message }
  clearControls()
}

const hideBlockingDialog = () => {
  blockingDialog = { ...HIDDEN_DIALOG }
}

const showAmbientDialog = (message: string, duration: number) => {
  if (blockingDialog.visible) {
    return
  }

  ambientDialog = { visible: true, message, timer: duration }
}

const isMovementLocked = () => cutscene.active || bedReveal.active || blockingDialog.visible

const syncDebugState = () => {
  const dialog = getActiveDialog()
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
  if (cutscene.active && blockingDialog.visible) {
    cutscene.step++
    if (cutscene.step < OPENING_LINES.length) {
      showBlockingDialog(OPENING_LINES[cutscene.step])
    } else {
      hideBlockingDialog()
      cutscene.active = false
    }
    return
  }

  if (bedReveal.active && blockingDialog.visible) {
    bedReveal.step++
    if (bedReveal.step < BED_REVEAL_LINES.length) {
      showBlockingDialog(BED_REVEAL_LINES[bedReveal.step])
    } else {
      hideBlockingDialog()
      bedReveal.active = false
      bedReveal.complete = true
    }
    return
  }

  // Normal dialog dismiss
  if (blockingDialog.visible) {
    hideBlockingDialog()
    return
  }

  // Block interactions during cutscene (waiting for timer)
  if (cutscene.active) return
  if (bedReveal.active) return

  if (!player.inBed && isInZone(player.x, player.y, ALARM_CLOCK_ZONE)) {
    showBlockingDialog(`This must be my alarm clock. It says it's ${formatTime()}.`)
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
  if (cutscene.active && cutscene.step === 0 && !blockingDialog.visible) {
    cutscene.timer -= deltaTime
    if (cutscene.timer <= 0) {
      showBlockingDialog(OPENING_LINES[0])
      cutscene.step = 0
    }
  }

  if (bedReveal.active && !blockingDialog.visible) {
    bedReveal.delay -= deltaTime
    if (bedReveal.delay <= 0) {
      showBlockingDialog(BED_REVEAL_LINES[bedReveal.step])
    }
  }

  if (!isMovementLocked()) {
    const previousPlayer = player
    const nextPlayer = stepPlayer(player, controls, deltaTime, ROOM_BOUNDS)
    const justLeftBed = player.inBed && !nextPlayer.inBed && !bedReveal.complete
    const distanceMoved = Math.hypot(nextPlayer.x - previousPlayer.x, nextPlayer.y - previousPlayer.y)

    player = justLeftBed
      ? { ...nextPlayer, moving: false }
      : nextPlayer

    if (justLeftBed) {
      bedReveal.active = true
      bedReveal.delay = BED_REVEAL_DELAY
      bedReveal.step = 0
      tailReaction.distance = 0
      clearControls()
    } else if (bedReveal.complete && !tailReaction.shown) {
      tailReaction.distance += distanceMoved

      if (tailReaction.distance >= TAIL_REACTION_DISTANCE) {
        showAmbientDialog(TAIL_REACTION_LINE, TAIL_REACTION_DURATION)
        tailReaction.shown = true
      }
    }
  } else if (player.moving) {
    player = { ...player, moving: false }
  }

  if (ambientDialog.visible) {
    ambientDialog = { ...ambientDialog, timer: ambientDialog.timer - deltaTime }

    if (ambientDialog.timer <= 0) {
      hideAmbientDialog()
    }
  }

  audioManager.syncMusic(getCurrentMusic())
  renderScene(context, player, getActiveDialog())
  syncDebugState()

  window.requestAnimationFrame(frame)
}

audioManager.syncMusic(getCurrentMusic())
renderScene(context, player, getActiveDialog())
syncDebugState()
window.requestAnimationFrame(frame)
