import React from 'react'

interface Props {
  videoRef: React.RefObject<HTMLVideoElement>
  videoSource: string
  togglePlay: () => void
  poster: string
  isAutoplay: boolean
}

const Video: React.FC<Props> = ({
  videoRef,
  videoSource,
  togglePlay,
  poster,
  isAutoplay,
}) => {
  return (
    <div className='video-container'>
      <video
        style={{objectFit:'contain'}}
        ref={videoRef}
        src={videoSource}
        className="w-full rounded-lg"
        preload="metadata"
        onClick={togglePlay}
        poster={poster}
        autoPlay={isAutoplay}
      />
    </div>
  )
}
export default Video
