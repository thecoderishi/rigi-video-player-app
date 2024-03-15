import React from 'react'
import {
  ICON_HEIGHT_WIDTH,
  SPEED,
} from "../video_player_constants"
import { Icon } from "@iconify/react"

interface Props {
  videoRef: React.RefObject<HTMLVideoElement>
  currentTime: number
  isPlaying: boolean
  isFullScreen: boolean
  isMuted: boolean
  speed: number
  volume: number
  toggleMute: () => void
  handleVolumeChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleSpeedChange: (speedValue: number) => void
  toggleFullScreen: () => void
  handleSkip: (amount: number) => void
  togglePlay: () => void
  handleSeek: (e: React.ChangeEvent<HTMLInputElement>) => void
  formatTime(time: number): string
}

const Controls: React.FC<Props> = (props) => {

  const {
    videoRef,
    currentTime,
    isPlaying,
    isFullScreen,
    isMuted,
    speed,
    volume,
    toggleMute,
    handleVolumeChange,
    handleSpeedChange,
    toggleFullScreen,
    handleSkip,
    togglePlay,
    handleSeek,
    formatTime,
  } = props

  return (
    <div aria-label='Video Controls' className="absolute bottom-0 w-full bg-gray-900 bg-opacity-50  p-2 gap-1">
      <div className="flex">
        {currentTime && (
          <span aria-label="Video Current Time">{formatTime(currentTime)}</span>
        )}
        <input
          type="range"
          min={0}
          max={videoRef.current?.duration || 0}
          value={currentTime}
          onChange={handleSeek}
          className="flex-1 border-lime-600 border-1 w-full ml-2 mr-2"
          aria-label="Video Timeline"
        />
        {videoRef.current && videoRef.current.duration && (
          <span aria-label="Video Duration">
            {formatTime(videoRef.current.duration)}
          </span>
        )}
      </div>
      <div className="flex justify-between items-center">
        <div className="flex">
          <button
            aria-label={isPlaying ? "Pause" : "Play"}
            onClick={togglePlay}
          >
            {isPlaying ? (
              <Icon icon="mdi:pause" height={ICON_HEIGHT_WIDTH} />
            ) : (
              <Icon icon="mdi:play" height={ICON_HEIGHT_WIDTH} />
            )}
          </button>
          <button aria-label="Skip Backward" onClick={() => handleSkip(-10)}>
            <Icon
              icon="fluent:skip-back-10-20-filled"
              height={ICON_HEIGHT_WIDTH}
            />
          </button>
          <button aria-label="Skip Forward" onClick={() => handleSkip(10)}>
            <Icon
              icon="fluent:skip-forward-10-20-filled"
              height={ICON_HEIGHT_WIDTH}
            />
          </button>
          <button aria-label={isMuted ? "Unmute" : "Mute"} onClick={toggleMute}>
            {isMuted ? (
              <Icon icon="mdi:volume-off" height={ICON_HEIGHT_WIDTH} />
            ) : (
              <Icon icon="mdi:volume" height={ICON_HEIGHT_WIDTH} />
            )}
          </button>
          <input
            aria-label="Volume Level"
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={volume}
            onChange={handleVolumeChange}
            className="max-w-[100px]"
          />
        </div>
        <div className="flex">
          <select
            aria-label="Playback Speed"
            value={speed}
            onChange={(e) => {
              e.preventDefault()
              handleSpeedChange(parseFloat(e.target.value))
            }}
            className="bg-neutral-700 text-white p-1 mr-2 rounded-md z-10"
          >
            {SPEED.map((speed: number) => (
              <option key={speed} value={speed}>
                {speed}
              </option>
            ))}
          </select>
          <button aria-label="Full Screen" onClick={toggleFullScreen}>
            {isFullScreen ? (
              <Icon
                icon="material-symbols:fullscreen-exit"
                height={ICON_HEIGHT_WIDTH}
              />
            ) : (
              <Icon
                icon="material-symbols:fullscreen"
                height={ICON_HEIGHT_WIDTH}
              />
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Controls