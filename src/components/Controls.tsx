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
    <div className="absolute bottom-0 w-full bg-gray-900 bg-opacity-50  p-2 gap-1">
      <div className="flex">
        {currentTime && <span>{formatTime(currentTime)}</span>}
        <input
          type="range"
          min={0}
          max={videoRef.current?.duration || 0}
          value={currentTime}
          onChange={handleSeek}
          className="flex-1 border-lime-600 border-1 w-full ml-2 mr-2"
        />
        {videoRef.current && videoRef.current.duration && (
          <span>{formatTime(videoRef.current.duration)}</span>
        )}
      </div>
      <div className="flex justify-between items-center">
        <div className="flex">
          <button onClick={togglePlay}>
            {isPlaying ? (
              <Icon icon="mdi:pause" height={ICON_HEIGHT_WIDTH} />
            ) : (
              <Icon icon="mdi:play" height={ICON_HEIGHT_WIDTH} />
            )}
          </button>
          <button onClick={() => handleSkip(-10)}>
            <Icon
              icon="fluent:skip-back-10-20-filled"
              height={ICON_HEIGHT_WIDTH}
            />
          </button>
          <button onClick={() => handleSkip(10)}>
            <Icon
              icon="fluent:skip-forward-10-20-filled"
              height={ICON_HEIGHT_WIDTH}
            />
          </button>
          <button onClick={toggleMute}>
            {isMuted ? (
              <Icon icon="mdi:volume-off" height={ICON_HEIGHT_WIDTH} />
            ) : (
              <Icon icon="mdi:volume" height={ICON_HEIGHT_WIDTH} />
            )}
          </button>
          <input
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
          <button onClick={toggleFullScreen}>
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