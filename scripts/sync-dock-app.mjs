import { spawnSync } from 'node:child_process'
import {
  cpSync,
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
const dockAppPath = path.join(dockApplicationsDir, 'Guy In A Room Dev.app')

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

const runJson = (command, commandArgs) => {
  const result = spawnSync(command, commandArgs, {
    cwd: repoRoot,
    encoding: 'utf8',
  })

  if (result.status !== 0) {
    process.exit(result.status ?? 1)
  }

  return result.stdout
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
  const persistentApps = runJson('defaults', ['read', 'com.apple.dock', 'persistent-apps'])

  if (persistentApps.includes(dockAppUrl)) {
    console.log(`Dock app already pinned at ${dockAppPath}`)
    return
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
    '<string>Guy In A Room Dev</string>',
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
rmSync(dockAppPath, { force: true, recursive: true })
cpSync(appBundlePath, dockAppPath, { recursive: true })

console.log(`Updated Dock app at ${dockAppPath}`)
ensureDockPinned()

if (shouldOpen) {
  run('open', [dockAppPath])
}
