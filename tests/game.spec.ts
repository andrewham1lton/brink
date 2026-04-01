import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { _electron as electron, expect, test, type Page } from '@playwright/test'

const projectRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
)

const readPosition = async (window: Page) => {
  const app = window.locator('#app')
  const x = Number(await app.getAttribute('data-player-x'))
  const y = Number(await app.getAttribute('data-player-y'))
  return { x, y }
}

test('the bedroom area boots with its home music track selected', async () => {
  const electronApp = await electron.launch({
    args: ['.'],
    cwd: projectRoot,
  })

  try {
    const window = await electronApp.firstWindow()
    const app = window.locator('#app')

    await expect(app).toHaveAttribute('data-area-id', 'bedroom')
    await expect(app).toHaveAttribute('data-music-track-id', 'home')
  } finally {
    await electronApp.close()
  }
})

test('the player moves around the room with WASD', async () => {
  const electronApp = await electron.launch({
    args: ['.'],
    cwd: projectRoot,
  })

  try {
    const window = await electronApp.firstWindow()
    await window.bringToFront()
    await window.locator('canvas').click()
    const start = await readPosition(window)

    await window.keyboard.down('d')
    await window.waitForTimeout(150)
    await window.keyboard.up('d')

    const movedRight = await readPosition(window)
    expect(movedRight.x).toBeGreaterThan(start.x + 5)

    await window.keyboard.down('w')
    await window.waitForTimeout(150)
    await window.keyboard.up('w')

    const movedUp = await readPosition(window)
    expect(movedUp.y).toBeLessThan(movedRight.y - 5)
  } finally {
    await electronApp.close()
  }
})
