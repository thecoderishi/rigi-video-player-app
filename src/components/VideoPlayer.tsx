import React, { useRef, useState, useEffect } from "react"
import {
  TIME_UPDATE_LOCALSTORAGE,
  VOLUME_INCREASE_DECREASE_BY,
} from "../video_player_constants"

import Controls from "./Controls"
import Buffering from "./Buffering"
import Video from "./Video"

interface VideoPLayerInterface {
  videoSource: string
  poster: string
  skipBackLeftKey?: number
  skipForwardRightKey?: number
  controlCurosrHideTimout?: number
  playbackSpeed?: 0.25 | 0.5 | 0.75 | 1 | 1.25 | 1.5 | 1.75 | 2
  isAutoplay?: boolean
}

const CustomVideoPlayer: React.FC<VideoPLayerInterface> = ({
  videoSource,
  poster,
  skipBackLeftKey = -5,
  skipForwardRightKey = 5,
  controlCurosrHideTimout = 5000,
  playbackSpeed = 1,
  isAutoplay = true,
}) => {
  
  // States
  const videoRef = useRef<HTMLVideoElement>(null)
  const playerRef = useRef<HTMLDivElement>(null)
  const [isPlaying, setIsPlaying] = useState<boolean>(isAutoplay)
  const [currentTime, setCurrentTime] = useState<number>(0)
  const [volume, setVolume] = useState<number>(0)
  const [isMuted, setIsMuted] = useState<boolean>(true)
  const [speed, setSpeed] = useState<number>(playbackSpeed)
  const [showControls, setShowControls] = useState<boolean>(false)
  const [duration, setDuration] = useState<number>(0)
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false)
  const [isCursorVisible, setIsCursorVisible] = useState(true)
  const [isBuffering, setIsBuffering] = useState<boolean>(false)
  const [hideTimer, setHideTimer] = useState<number>(0)

  // Initial Settings
  useEffect(() => {
    const savedTime = localStorage.getItem("videoTime")
    const volume = localStorage.getItem("volume")
    const speed = localStorage.getItem("speed")
    if (savedTime) {
      setCurrentTime(parseFloat(savedTime))
      if (videoRef.current) {
        videoRef.current.currentTime = parseFloat(savedTime)
      }
    }
    if (volume) {
      setVolume(parseInt(volume))
      if (videoRef.current) {
        videoRef.current.volume = parseInt(volume)
      }
      if (parseInt(volume) <= 0) {
        setIsMuted(true)
      } else {
        setIsMuted(false)
      }
    }
    if (speed) {
      setSpeed(parseFloat(speed))
      if (videoRef.current) {
        videoRef.current.playbackRate = parseFloat(speed)
      }
    }
    if (videoRef.current) {
      if (isAutoplay) {
        videoRef.current.play()
      }
    }
  }, [])

  // useEffect(() => {
  //   if (videoRef.current) {
  //     setDuration(videoRef.current.duration)
  //   }
  // }, [videoRef.current?.duration])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      e.preventDefault()
      switch (e.code) {
        case "Space":
          togglePlay()
          break
        case "ArrowLeft":
          handleSkip(skipBackLeftKey)
          break
        case "ArrowRight":
          handleSkip(skipForwardRightKey)
          break
        case "ArrowUp":
          setVolume((prevVolume) => {
            const newVolume = Math.min(
              prevVolume + VOLUME_INCREASE_DECREASE_BY,
              1
            )
            if (videoRef.current) {
              videoRef.current.volume = newVolume
            }
            setIsMuted(false)
            localStorage.setItem("volume", String(newVolume))
            return newVolume
          })
          break
        case "ArrowDown":
          setVolume((prevVolume) => {
            const newVolume = Math.max(
              prevVolume - VOLUME_INCREASE_DECREASE_BY,
              0
            )
            if (videoRef.current) {
              videoRef.current.volume = newVolume
            }
            if (newVolume <= 0) {
              setIsMuted(true)
            }
            localStorage.setItem("volume", String(newVolume))
            return newVolume
          })
          break
        case "KeyM":
          setIsMuted((prevMute) => {
            if (prevMute) {
              setVolume(1)
              localStorage.setItem("volume", "1")
              if (videoRef.current) {
                videoRef.current.volume = 1
              }
            } else {
              setVolume(0)
              localStorage.setItem("volume", "0")
              if (videoRef.current) {
                videoRef.current.volume = 0
              }
            }
            return !prevMute
          })
          break
        case "KeyF":
          toggleFullScreen()
          break
        default:
          break
      }
    }
    const handleBuffering = () => {
      if (videoRef.current) {
        setIsBuffering(videoRef.current.readyState < 3)
      }
    }

    if (videoRef.current) {
      videoRef.current.addEventListener("waiting", handleBuffering)
      videoRef.current.addEventListener("playing", handleBuffering)
      videoRef.current.addEventListener("timeupdate", handleTimeUpdate)
      videoRef.current.addEventListener("keydown", handleKeyDown)
    }

    return () => {
      if (videoRef.current) {
        videoRef.current.removeEventListener("waiting", handleBuffering)
        videoRef.current.removeEventListener("playing", handleBuffering)
        videoRef.current.removeEventListener("timeupdate", handleTimeUpdate)
        videoRef.current.removeEventListener("keydown", handleKeyDown)
      }
    }
  }, [])

  const togglePlay = () => {
    setIsPlaying((prevState) => {
      const newState = !prevState
      if (videoRef.current) {
        newState ? videoRef.current.play() : videoRef.current.pause()
      }
      return newState
    })
  }

  const toggleMute = () => {
    setIsMuted((prevState) => {
      const newState = !prevState
      setVolume(Number(prevState))
      localStorage.setItem("volume", String(Number(prevState)))
      if (videoRef.current) {
        videoRef.current.muted = newState
      }
      return newState
    })
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const volumeLevel = parseFloat(e.target.value)
    setVolume(volumeLevel)
    localStorage.setItem("volume", String(volumeLevel))
    if (videoRef.current) {
      videoRef.current.volume = volumeLevel
    }
    setIsMuted(!Boolean(volumeLevel))
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const seekTime = parseFloat(e.target.value)
    setCurrentTime(seekTime)
    if (videoRef.current) {
      videoRef.current.currentTime = seekTime
    }
  }

  const handleSkip = (amount: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime += amount
      setCurrentTime(videoRef.current.currentTime)
    }
  }

  const handleSpeedChange = (speedValue: number) => {
    setSpeed(speedValue)
    localStorage.setItem("speed", String(speedValue))
    if (videoRef.current) {
      videoRef.current.playbackRate = speedValue
    }
  }

  const handleMouseEnter = () => {
    setShowControls(true)
  }

  const handleMouseLeave = () => {
    setShowControls(false)
  }

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const currentTime = videoRef.current.currentTime
      setCurrentTime(currentTime)

      const now = Date.now()
      const lastUpdateTime = localStorage.getItem("lastUpdateTime")
      if (
        !lastUpdateTime ||
        now - parseInt(lastUpdateTime, 10) >= TIME_UPDATE_LOCALSTORAGE
      ) {
        localStorage.setItem("videoTime", currentTime.toString())
        localStorage.setItem("lastUpdateTime", now.toString())
      }
    }
  }

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      setIsFullScreen(true)
      setShowControls(true)
      if (playerRef.current) {
        playerRef.current.requestFullscreen().catch((err) => {
          console.log(
            "Error attempting to enable full-screen mode:",
            err.message
          )
        })
      }
    } else {
      setIsFullScreen(false)
      document.exitFullscreen()
    }
  }

  const handleMouseMove = () => {
    setShowControls(true)
    setIsCursorVisible(true)
    if (hideTimer) clearTimeout(hideTimer)
    const timer = window.setTimeout(() => {
      setShowControls(false)
      setIsCursorVisible(false)
    }, controlCurosrHideTimout)
    setHideTimer(timer)
  }

  const formatTime = (time: number): string => {
    if (!isNaN(time)) {
      const minutes = Math.floor(time / 60)
      const seconds = Math.floor(time % 60)
      const formattedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`
      return `${minutes}:${formattedSeconds}`
    } else {
      return ""
    }
  }

  return (
    <div
      ref={playerRef}
      className={`relative ${
        !isCursorVisible ? "cursor-none" : "cursor-auto"
      } w-full video-obj`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
    >
      <Video
        videoRef={videoRef}
        videoSource={videoSource}
        togglePlay={togglePlay}
        poster={poster}
        isAutoplay={isAutoplay}
      />
      {isBuffering && <Buffering />}
      {showControls && (
        <Controls
          videoRef={videoRef}
          currentTime={currentTime}
          isPlaying={isPlaying}
          isFullScreen={isFullScreen}
          isMuted={isMuted}
          speed={speed}
          volume={volume}
          toggleMute={toggleMute}
          handleVolumeChange={handleVolumeChange}
          handleSpeedChange={handleSpeedChange}
          toggleFullScreen={toggleFullScreen}
          handleSkip={handleSkip}
          togglePlay={togglePlay}
          handleSeek={handleSeek}
          formatTime={formatTime}
        />
      )}
    </div>
  )
}

export default CustomVideoPlayer
