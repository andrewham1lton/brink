import { describe, expect, it, vi } from 'vitest'

import { AudioManager } from './audio'
import type { AudioPlayback } from './audio'
import type { MusicTrackDefinition } from './areas'

class FakeAudio implements AudioPlayback {
  currentTime = 12
  loop = false
  pause = vi.fn()
  play = vi.fn(() => Promise.resolve())
  preload = ''
  readonly src: string
  volume = 1

  constructor(src: string) {
    this.src = src
  }
}

const homeTrack: MusicTrackDefinition = {
  id: 'home',
  loop: true,
  src: '/audio/home.wav',
  volume: 0.55,
}

describe('AudioManager', () => {
  it('creates and configures looping music for a new track', () => {
    const created: FakeAudio[] = []
    const manager = new AudioManager((src) => {
      const audio = new FakeAudio(src)
      created.push(audio)
      return audio
    })

    manager.syncMusic(homeTrack)

    expect(created).toHaveLength(1)
    expect(created[0]?.src).toBe(homeTrack.src)
    expect(created[0]?.loop).toBe(true)
    expect(created[0]?.preload).toBe('auto')
    expect(created[0]?.volume).toBe(homeTrack.volume)
    expect(created[0]?.play).toHaveBeenCalledTimes(1)
  })

  it('reuses the current music instance when the track id is unchanged', () => {
    const created: FakeAudio[] = []
    const manager = new AudioManager((src) => {
      const audio = new FakeAudio(src)
      created.push(audio)
      return audio
    })

    manager.syncMusic(homeTrack)
    manager.syncMusic({ ...homeTrack, volume: 0.7 })

    expect(created).toHaveLength(1)
    expect(created[0]?.volume).toBe(0.7)
    expect(created[0]?.play).toHaveBeenCalledTimes(1)
  })

  it('stops and rewinds music when the active track is cleared', () => {
    const created: FakeAudio[] = []
    const manager = new AudioManager((src) => {
      const audio = new FakeAudio(src)
      created.push(audio)
      return audio
    })

    manager.syncMusic(homeTrack)
    manager.stopMusic()

    expect(created[0]?.pause).toHaveBeenCalledTimes(1)
    expect(created[0]?.currentTime).toBe(0)
  })

  it('pauses background music while the app is inactive and resumes it afterward', () => {
    const created: FakeAudio[] = []
    const manager = new AudioManager((src) => {
      const audio = new FakeAudio(src)
      created.push(audio)
      return audio
    })

    manager.syncMusic(homeTrack)
    manager.setAppActive(false)
    manager.setAppActive(true)

    expect(created[0]?.pause).toHaveBeenCalledTimes(1)
    expect(created[0]?.play).toHaveBeenCalledTimes(2)
  })
})
