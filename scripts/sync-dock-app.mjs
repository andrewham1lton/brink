import { spawnSync } from 'node:child_process'
import {
  existsSync,
  mkdirSync,
  readdirSync,
  rmSync,
  statSync,
} from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const dockBuildRoot = path.join(repoRoot, 'artifacts', 'dock-build')
const releaseRoot = path.join(repoRoot, 'artifacts', 'release')
const dockApplicationsDir = path.join(os.homedir(), 'Applications')
const dockPlistPath = path.join(
  os.homedir(),
  'Library',
  'Preferences',
  'com.apple.dock.plist',
)
const dockAppPath = path.join(dockApplicationsDir, 'Brink.app')
const legacyDockAppPath = path.join(dockApplicationsDir, 'Guy In A Room Dev.app')

const args = new Set(process.argv.slice(2))
const shouldOpen = args.has('--open')
const shouldSkipBuild = args.has('--skip-build')

if (process.platform !== 'darwin') {
  console.error('dock:sync is only available on macOS.')
  process.exit(1)
}

const run = (command, commandArgs) => {
  const result = spawnSync(command, commandArgs, {
    cwd: repoRoot,
    stdio: 'inherit',
  })

  if (result.status !== 0) {
    process.exit(result.status ?? 1)
  }
}

const readDockEntryUrl = (index) => {
  const result = spawnSync(
    '/usr/libexec/PlistBuddy',
    ['-c', `Print :persistent-apps:${index}:tile-data:file-data:_CFURLString`, dockPlistPath],
    {
      cwd: repoRoot,
      encoding: 'utf8',
    },
  )

  if (result.status !== 0) {
    return null
  }

  return result.stdout.trim()
}

const findAppBundle = (rootDir) => {
  const entries = readdirSync(rootDir, { withFileTypes: true })

  for (const entry of entries) {
    const entryPath = path.join(rootDir, entry.name)

    if (entry.isDirectory() && entry.name.endsWith('.app')) {
      return entryPath
    }

    if (entry.isDirectory()) {
      const nestedMatch = findAppBundle(entryPath)

      if (nestedMatch) {
        return nestedMatch
      }
    }
  }

  return null
}

const ensureDockPinned = () => {
  const dockAppUrl = `${pathToFileURL(dockAppPath).href}/`
  const legacyDockAppUrl = `${pathToFileURL(legacyDockAppPath).href}/`
  const matchingIndexes = []
  let currentEntryCount = 0
  let legacyEntryCount = 0

  for (let index = 0; index < 200; index += 1) {
    const entryUrl = readDockEntryUrl(index)

    if (!entryUrl) {
      continue
    }

    if (entryUrl === dockAppUrl) {
      currentEntryCount += 1
      matchingIndexes.push(index)
      continue
    }

    if (entryUrl === legacyDockAppUrl) {
      legacyEntryCount += 1
      matchingIndexes.push(index)
    }
  }

  if (currentEntryCount === 1 && legacyEntryCount === 0) {
    console.log(`Dock app already pinned at ${dockAppPath}`)
    return
  }

  if (matchingIndexes.length > 0) {
    for (const index of matchingIndexes.toReversed()) {
      run('/usr/libexec/PlistBuddy', [
        '-c',
        `Delete :persistent-apps:${index}`,
        dockPlistPath,
      ])
    }
  }

  const dockTile = [
    '<dict>',
    '<key>tile-data</key>',
    '<dict>',
    '<key>file-data</key>',
    '<dict>',
    '<key>_CFURLString</key>',
    `<string>${dockAppUrl}</string>`,
    '<key>_CFURLStringType</key>',
    '<integer>15</integer>',
    '</dict>',
    '<key>file-label</key>',
    '<string>Brink</string>',
    '</dict>',
    '<key>tile-type</key>',
    '<string>file-tile</string>',
    '</dict>',
  ].join('')

  run('defaults', [
    'write',
    'com.apple.dock',
    'persistent-apps',
    '-array-add',
    dockTile,
  ])
  run('killall', ['Dock'])
  console.log(`Pinned Dock app at ${dockAppPath}`)
}

if (!shouldSkipBuild) {
  run('npm', ['run', 'build'])
  run('npx', [
    'electron-builder',
    '--dir',
    '--mac',
    '--publish',
    'never',
    '--config.directories.output=artifacts/dock-build',
  ])
}

const bundleSearchRoots = shouldSkipBuild
  ? [dockBuildRoot, releaseRoot]
  : [dockBuildRoot]

const appBundlePath = bundleSearchRoots.reduce((match, rootDir) => {
  if (match || !existsSync(rootDir)) {
    return match
  }

  return findAppBundle(rootDir)
}, null)

if (!appBundlePath) {
  console.error(
    `No macOS app bundle found under ${bundleSearchRoots.join(', ')}.`,
  )
  process.exit(1)
}

const appBundleStats = statSync(appBundlePath)

if (!appBundleStats.isDirectory()) {
  console.error(`App bundle path is not a directory: ${appBundlePath}`)
  process.exit(1)
}

mkdirSync(dockApplicationsDir, { recursive: true })
rmSync(legacyDockAppPath, { force: true, recursive: true })
rmSync(dockAppPath, { force: true, recursive: true })
run('ditto', [appBundlePath, dockAppPath])

console.log(`Updated Dock app at ${dockAppPath}`)
ensureDockPinned()

if (shouldOpen) {
  run('open', [dockAppPath])
}
