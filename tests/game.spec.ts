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

const clearOpeningDialog = async (window: Page) => {
  const app = window.locator('#app')
  const canvas = window.locator('canvas')

  await expect(app).toHaveAttribute('data-dialog-message', '*knock knock knock*', { timeout: 5000 })
  await canvas.click()
  await expect(app).toHaveAttribute(
    'data-dialog-message',
    'Rise and shine, little one! Come meet me out in the garden when you\'re ready.',
  )
  await canvas.click()
  await expect(app).toHaveAttribute('data-dialog-visible', 'false')
  await expect(app).toHaveAttribute('data-cutscene-active', 'false')
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

test('the player stays frozen until the opening dialog is cleared and left click can advance it', async () => {
  const electronApp = await electron.launch({
    args: ['.'],
    cwd: projectRoot,
  })

  try {
    const window = await electronApp.firstWindow()
    await window.bringToFront()
    const app = window.locator('#app')
    const canvas = window.locator('canvas')
    await canvas.click()
    const start = await readPosition(window)

    await window.keyboard.down('d')
    await window.waitForTimeout(150)
    await window.keyboard.up('d')

    const frozen = await readPosition(window)
    expect(frozen.x).toBeCloseTo(start.x, 1)
    expect(frozen.y).toBeCloseTo(start.y, 1)

    await expect(app).toHaveAttribute('data-dialog-message', '*knock knock knock*', { timeout: 5000 })
    await canvas.click()
    await expect(app).toHaveAttribute(
      'data-dialog-message',
      'Rise and shine, little one! Come meet me out in the garden when you\'re ready.',
    )
    await canvas.click()
    await expect(app).toHaveAttribute('data-dialog-visible', 'false')

    const unlockedStart = await readPosition(window)

    await window.keyboard.down('d')
    await window.waitForTimeout(150)
    await window.keyboard.up('d')

    const movedRight = await readPosition(window)
    expect(movedRight.x).toBeGreaterThan(unlockedStart.x + 5)
  } finally {
    await electronApp.close()
  }
})

test('leaving the bed triggers the rat reveal dialog sequence before movement resumes', async () => {
  const electronApp = await electron.launch({
    args: ['.'],
    cwd: projectRoot,
  })

  try {
    const window = await electronApp.firstWindow()
    await window.bringToFront()
    const app = window.locator('#app')
    const canvas = window.locator('canvas')
    await canvas.click()

    await clearOpeningDialog(window)

    const inBedStart = await readPosition(window)

    await window.keyboard.down('a')
    await window.waitForTimeout(300)
    await window.keyboard.up('a')

    const movedInBed = await readPosition(window)
    expect(movedInBed.x).toBeLessThan(inBedStart.x - 5)
    await expect(app).toHaveAttribute('data-player-in-bed', 'true')

    await window.keyboard.down('a')
    await window.waitForTimeout(1200)
    await window.keyboard.up('a')

    await expect(app).toHaveAttribute('data-player-in-bed', 'false')
    await expect(app).toHaveAttribute('data-dialog-message', 'Oh. I\'m a rat.')

    const frozen = await readPosition(window)
    await window.keyboard.down('a')
    await window.waitForTimeout(150)
    await window.keyboard.up('a')

    const stillFrozen = await readPosition(window)
    expect(stillFrozen.x).toBeCloseTo(frozen.x, 1)
    expect(stillFrozen.y).toBeCloseTo(frozen.y, 1)

    await canvas.click()
    await expect(app).toHaveAttribute('data-dialog-message', 'Interesting.')

    await canvas.click()
    await expect(app).toHaveAttribute('data-dialog-visible', 'false')

    const unlockedStart = await readPosition(window)
    await window.keyboard.down('a')
    await window.waitForTimeout(150)
    await window.keyboard.up('a')

    const movedAgain = await readPosition(window)
    expect(movedAgain.x).toBeLessThan(unlockedStart.x - 5)
  } finally {
    await electronApp.close()
  }
})

test('left click can trigger the alarm clock interaction', async () => {
  const electronApp = await electron.launch({
    args: ['.'],
    cwd: projectRoot,
  })

  try {
    const window = await electronApp.firstWindow()
    await window.bringToFront()
    const app = window.locator('#app')
    const canvas = window.locator('canvas')
    await canvas.click()

    await clearOpeningDialog(window)

    await window.keyboard.down('a')
    await expect(app).toHaveAttribute('data-player-in-bed', 'false', { timeout: 3000 })
    await window.keyboard.up('a')
    await canvas.click()
    await expect(app).toHaveAttribute('data-dialog-message', 'Interesting.')
    await canvas.click()
    await expect(app).toHaveAttribute('data-dialog-visible', 'false')

    await window.keyboard.down('s')
    await window.waitForTimeout(150)
    await window.keyboard.up('s')
    await window.keyboard.down('a')
    await window.waitForTimeout(1800)
    await window.keyboard.up('a')
    await window.keyboard.down('s')
    await window.waitForTimeout(100)
    await window.keyboard.up('s')

    await canvas.click()
    await expect(app).toHaveAttribute('data-dialog-message', /This must be my alarm clock\./)
  } finally {
    await electronApp.close()
  }
})
