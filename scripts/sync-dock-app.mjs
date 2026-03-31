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
import { fileURLToPath } from 'node:url'

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

if (shouldOpen) {
  run('open', [dockAppPath])
}
