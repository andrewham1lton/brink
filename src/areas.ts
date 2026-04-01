import homeMusicUrl from './assets/audio/music/home.wav'

export type AreaId = 'bedroom'
export type AudioSituationId = 'ambient' | 'cutscene'

export interface MusicTrackDefinition {
  id: string
  loop?: boolean
  src: string
  volume?: number
}

export interface AreaMusicDefinition extends Partial<Record<AudioSituationId, MusicTrackDefinition | null>> {
  ambient: MusicTrackDefinition | null
}

export interface AreaDefinition {
  id: AreaId
  music: AreaMusicDefinition
}

const HOME_TRACK: MusicTrackDefinition = {
  id: 'home',
  loop: true,
  src: homeMusicUrl,
  volume: 0.55,
}

const AREAS: Record<AreaId, AreaDefinition> = {
  bedroom: {
    id: 'bedroom',
    music: {
      ambient: HOME_TRACK,
    },
  },
}

export const getAreaDefinition = (areaId: AreaId): AreaDefinition => AREAS[areaId]

export const resolveAreaMusic = (
  areaId: AreaId,
  situation: AudioSituationId = 'ambient',
): MusicTrackDefinition | null => {
  const area = getAreaDefinition(areaId)

  return area.music[situation] ?? area.music.ambient ?? null
}
