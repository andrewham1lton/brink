import { expect, test } from '@playwright/test'

const readPosition = async (getAttribute: (name: string) => Promise<string | null>) => {
  const x = Number(await getAttribute('data-player-x'))
  const y = Number(await getAttribute('data-player-y'))
  return { x, y }
}

test('the player moves around the room with WASD', async ({ page }) => {
  await page.goto('/')

  const app = page.locator('#app')
  const start = await readPosition((name) => app.getAttribute(name))

  await page.keyboard.down('d')
  await page.waitForTimeout(150)
  await page.keyboard.up('d')

  const movedRight = await readPosition((name) => app.getAttribute(name))
  expect(movedRight.x).toBeGreaterThan(start.x + 5)

  await page.keyboard.down('w')
  await page.waitForTimeout(150)
  await page.keyboard.up('w')

  const movedUp = await readPosition((name) => app.getAttribute(name))
  expect(movedUp.y).toBeLessThan(movedRight.y - 5)
})
