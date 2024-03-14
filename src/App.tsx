import { useState } from 'react'
import './App.css'
import { mediaJSON } from './data';
import CustomVideoPlayer from "./components/VideoPlayer"
import Playlist from './components/Playlist';
import { Icon } from '@iconify/react/dist/iconify.js';
export interface VideoInterface {
  description: string
  sources: string[]
  subtitle: string
  thumb: string
  title: string
  id:number
}

function App() {
  const [selectedVideo, setselectedVideo] = useState<VideoInterface>(
    mediaJSON.videos[0]
  )

  const [videos, setVideos] = useState<VideoInterface[]>(mediaJSON.videos)

  const handleSelectVideoFromPlaylist = (selectedVideo: VideoInterface) => {
    setselectedVideo(selectedVideo)
  }

  const updateVideoList = (videos: VideoInterface[]) => {
    setVideos(videos)
  }

  return (
    <div className="bg-neutral-700 text-white min-h-[100vh] p-10">
      <div className="flex items-center rounded-lg ml-5 p-3 border-white border-2 w-fit">
        <Icon icon="tdesign:giggle" className="text-red-500" height={35} />
        <h1 className="text-4xl ml-5 ">GiggleFlix</h1>
      </div>
      <div className="m-4 gap-4 grid grid-cols-1 lg:grid-cols-12 ">
        <div className="sm:col-span-7">
          <div className="min-h-[200px] md:min-h-[400px]">
            <CustomVideoPlayer
              videoSource={selectedVideo.sources[0]}
              poster={selectedVideo.thumb}
            />
          </div>
          <div className="mt-2">
            <h1 className="text-xl font-bold">{selectedVideo.title}</h1>
            <h1 className="text-sm font-extralight">
              {selectedVideo.description}
            </h1>
          </div>
        </div>
        <div className="rounded-sm bg-transparent sm:col-span-5 w-full">
          <Playlist
            handleSelectVideoFromPlaylist={handleSelectVideoFromPlaylist}
            selectedVideo={selectedVideo}
            videos={videos}
            updateVideoList={updateVideoList}
          />
        </div>
      </div>
    </div>
  )
}

export default App
