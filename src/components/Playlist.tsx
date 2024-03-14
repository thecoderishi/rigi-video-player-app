import React, { useRef } from "react"
import { VideoInterface } from "../App"
import { Icon } from "@iconify/react" 

interface Props {
  videos: VideoInterface[]
  selectedVideo: VideoInterface
  handleSelectVideoFromPlaylist: (selectedVideo: VideoInterface) => void
  updateVideoList: (videos: VideoInterface[]) => void
}

const Playlist: React.FC<Props> = ({
  videos,
  selectedVideo,
  handleSelectVideoFromPlaylist,
  updateVideoList,
}) => {

  const drag = useRef<number>(0)
  const draggedOver = useRef<number>(0)

  const handleReorder = () => {
    const videosTemp: VideoInterface[] = [...videos]
    const draggedVideo: VideoInterface = videosTemp.splice(drag.current, 1)[0]
    videosTemp.splice(draggedOver.current, 0, draggedVideo)
    updateVideoList(videosTemp)
  }

  return (
    <>
      <ul className="gap-2">
        {videos.map((video: VideoInterface, index: number) => {
          return (
            <li
              key={video.id}
              className={`p-4 flex gap-2 ${
                selectedVideo.title === video.title
                  ? "border-white border-2"
                  : "bg-transparent"
              } text-black rounded-lg`}
              draggable
              onDragStart={() => (drag.current = index)}
              onDragEnter={() => (draggedOver.current = index)}
              onDragEnd={handleReorder}
              onDragOver={(e) => e.preventDefault()}
            >
              <div className="max-w-10 cursor-grab flex items-center text-white">
                <Icon icon="oui:grab" width={25} />
              </div>
              <div
                className="cursor-pointer flex gap-2"
                onClick={() => handleSelectVideoFromPlaylist(video)}
              >
                <img
                  src={video.thumb}
                  alt={video.title}
                  className="rounded-lg"
                  width="200px"
                  height="180px"
                />
                <div className="gap-2">
                  <h1 className="text-lg text-white">{video.title}</h1>
                  <h1 className="text-xs text-neutral-200 line-clamp-5 mt-3">
                    {video.description}
                  </h1>
                </div>
              </div>
            </li>
          )
        })}
      </ul>
    </>
  )
}

export default Playlist
