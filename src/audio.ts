import type { MusicTrackDefinition } from './areas'

export interface AudioPlayback {
  currentTime: number
  loop: boolean
  pause: () => void
  play: () => Promise<void> | void
  preload: string
  volume: number
}

export type AudioFactory = (src: string) => AudioPlayback

export interface SoundEffectDefinition {
  id: string
  src: string
  volume?: number
}

export interface AudioUnlockTarget {
  addEventListener: (
    type: 'keydown' | 'pointerdown',
    listener: EventListener,
    options?: AddEventListenerOptions,
  ) => void
  removeEventListener: (
    type: 'keydown' | 'pointerdown',
    listener: EventListener,
  ) => void
}

const defaultAudioFactory: AudioFactory = (src) => new Audio(src)

export class AudioManager {
  private appActive = true
  private currentMusic: AudioPlayback | null = null
  private currentMusicTrackId: string | null = null
  private lastEffectId: string | null = null
  private readonly createAudio: AudioFactory

  constructor(createAudio: AudioFactory = defaultAudioFactory) {
    this.createAudio = createAudio
  }

  syncMusic(track: MusicTrackDefinition | null) {
    const nextTrackId = track?.id ?? null

    if (this.currentMusicTrackId === nextTrackId) {
      if (this.currentMusic && track) {
        this.currentMusic.loop = track.loop ?? true
        this.currentMusic.volume = track.volume ?? 1
      }
      return
    }

    this.stopMusic()

    if (!track) {
      return
    }

    const audio = this.createAudio(track.src)
    audio.loop = track.loop ?? true
    audio.preload = 'auto'
    audio.volume = track.volume ?? 1

    this.currentMusic = audio
    this.currentMusicTrackId = track.id
    this.tryPlay(audio)
  }

  setAppActive(active: boolean) {
    this.appActive = active

    if (!this.currentMusic) {
      return
    }

    if (!active) {
      this.currentMusic.pause()
      return
    }

    this.tryPlay(this.currentMusic)
  }

  retryPendingMusic() {
    if (!this.currentMusic) {
      return
    }

    this.tryPlay(this.currentMusic)
  }

  playEffect(effect: SoundEffectDefinition) {
    const audio = this.createAudio(effect.src)
    audio.loop = false
    audio.preload = 'auto'
    audio.volume = effect.volume ?? 1

    this.lastEffectId = effect.id
    this.tryPlay(audio)
  }

  getLastEffectId() {
    return this.lastEffectId
  }

  stopMusic() {
    if (!this.currentMusic) {
      return
    }

    this.currentMusic.pause()
    this.currentMusic.currentTime = 0
    this.currentMusic = null
    this.currentMusicTrackId = null
  }

  private tryPlay(audio: AudioPlayback) {
    if (!this.appActive) {
      return
    }

    const playback = audio.play()

    if (!playback || typeof (playback as Promise<void>).catch !== 'function') {
      return
    }

    void (playback as Promise<void>).catch(() => {
      // Autoplay can be blocked until the first user gesture. We retry
      // through installAudioUnlock without surfacing noisy console errors.
    })
  }
}

export const installAudioUnlock = (
  target: AudioUnlockTarget,
  audioManager: Pick<AudioManager, 'retryPendingMusic'>,
) => {
  const unlock: EventListener = () => {
    audioManager.retryPendingMusic()
    target.removeEventListener('keydown', unlock)
    target.removeEventListener('pointerdown', unlock)
  }

  target.addEventListener('keydown', unlock, { once: true })
  target.addEventListener('pointerdown', unlock, { once: true })
}
