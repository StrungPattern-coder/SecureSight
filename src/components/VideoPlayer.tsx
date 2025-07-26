'use client'

import { useState, useEffect, useRef } from 'react'
import { Play, Pause, Volume2, VolumeX, Maximize, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { useSecureSightStore } from '@/store/useSecureSightStore'

interface VideoPlayerProps {
  className?: string
  onTimeUpdate?: (currentTime: number, duration: number) => void
}

export function VideoPlayer({ className, onTimeUpdate }: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const videoRef = useRef<HTMLVideoElement>(null)
  const { selectedCamera, timelinePosition } = useSecureSightStore()

  // Auto-hide controls
  useEffect(() => {
    let timeout: NodeJS.Timeout
    if (showControls && isPlaying) {
      timeout = setTimeout(() => setShowControls(false), 3000)
    }
    return () => clearTimeout(timeout)
  }, [showControls, isPlaying])

  // Video event handlers
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleTimeUpdate = () => {
      const currentTime = video.currentTime
      const duration = video.duration
      setCurrentTime(currentTime)
      setDuration(duration)
      onTimeUpdate?.(currentTime, duration)
    }

    const handleLoadedMetadata = () => {
      setDuration(video.duration)
    }

    const handlePlay = () => setIsPlaying(true)
    const handlePause = () => setIsPlaying(false)

    video.addEventListener('timeupdate', handleTimeUpdate)
    video.addEventListener('loadedmetadata', handleLoadedMetadata)
    video.addEventListener('play', handlePlay)
    video.addEventListener('pause', handlePause)

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate)
      video.removeEventListener('loadedmetadata', handleLoadedMetadata)
      video.removeEventListener('play', handlePlay)
      video.removeEventListener('pause', handlePause)
    }
  }, [onTimeUpdate])

  // Sync with timeline position
  useEffect(() => {
    const video = videoRef.current
    if (!video || !duration || timelinePosition === undefined) return
    
    const targetTime = (timelinePosition / 100) * duration
    if (Math.abs(video.currentTime - targetTime) > 0.5) {
      video.currentTime = targetTime
      setCurrentTime(targetTime)
    }
  }, [timelinePosition, duration])

  const togglePlay = () => {
    const video = videoRef.current
    if (!video) return

    if (isPlaying) {
      video.pause()
    } else {
      video.play().catch(console.error)
    }
  }

  const toggleMute = () => {
    const video = videoRef.current
    if (!video) return

    const newMuted = !isMuted
    video.muted = newMuted
    setIsMuted(newMuted)
  }

  const handleReplay = () => {
    const video = videoRef.current
    if (!video) return
    
    video.currentTime = 0
    video.play().catch(console.error)
  }

  const handleFullscreen = () => {
    const video = videoRef.current
    if (!video) return

    if (video.requestFullscreen) {
      video.requestFullscreen().catch(console.error)
    }
  }

  // Get video source based on selected camera
  const getVideoSource = () => {
    if (!selectedCamera) return null
    
    // For now, use the same video for all cameras
    // You can extend this to have different videos per camera
    return '/videos/Stock_CCTV_footage_1.mp4'
  }

  const videoSource = getVideoSource()

  // Helper function to format time
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  return (
    <Card className={cn("relative overflow-hidden", className)}>
      <CardContent className="p-0">
        <div 
          className="relative aspect-video bg-gray-900 flex items-center justify-center cursor-pointer"
          onMouseEnter={() => setShowControls(true)}
          onMouseLeave={() => setShowControls(false)}
          onClick={togglePlay}
        >
          {/* Video Element */}
          {videoSource ? (
            <video
              ref={videoRef}
              className="absolute inset-0 w-full h-full object-cover"
              muted={isMuted}
              loop
              playsInline
              preload="metadata"
            >
              <source src={videoSource} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
              <div className="text-center">
                <div className="text-white text-lg font-medium mb-2">
                  No Camera Selected
                </div>
                <div className="text-gray-400 text-sm">
                  Select a camera to view feed
                </div>
              </div>
            </div>
          )}

          {/* Live indicator */}
          {selectedCamera && videoSource && (
            <div className="absolute top-4 left-4 bg-red-600 text-white px-2 py-1 rounded text-xs font-medium flex items-center space-x-1 z-10">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
              <span>RECORDED</span>
            </div>
          )}

          {/* Camera info */}
          {selectedCamera && (
            <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded text-xs z-10">
              Camera {selectedCamera.id} - {selectedCamera.name}
            </div>
          )}

          {/* Play button overlay */}
          {!isPlaying && videoSource && (
            <div className="absolute inset-0 flex items-center justify-center z-20">
              <Button
                size="icon"
                variant="secondary"
                className="h-16 w-16 rounded-full bg-white/20 hover:bg-white/30 border-2 border-white/50"
                onClick={(e) => {
                  e.stopPropagation()
                  togglePlay()
                }}
              >
                <Play className="h-8 w-8 text-white ml-1" />
              </Button>
            </div>
          )}

          {/* Controls */}
          {showControls && videoSource && (
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 z-10">
              {/* Progress bar */}
              {duration > 0 && (
                <div className="mb-3">
                  <div 
                    className="w-full bg-white/20 rounded-full h-1 cursor-pointer relative"
                    onClick={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect()
                      const clickX = e.clientX - rect.left
                      const percentage = (clickX / rect.width) * 100
                      const targetTime = (percentage / 100) * duration
                      
                      if (videoRef.current) {
                        videoRef.current.currentTime = targetTime
                        setCurrentTime(targetTime)
                      }
                    }}
                  >
                    <div 
                      className="bg-red-600 h-1 rounded-full transition-all duration-200"
                      style={{ width: `${(currentTime / duration) * 100}%` }}
                    />
                    {/* Hover indicator */}
                    <div 
                      className="absolute top-0 w-3 h-3 bg-red-600 rounded-full -mt-1 -ml-1.5 opacity-0 hover:opacity-100 transition-opacity"
                      style={{ left: `${(currentTime / duration) * 100}%` }}
                    />
                  </div>
                </div>
              )}
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="text-white hover:bg-white/20"
                    onClick={(e) => {
                      e.stopPropagation()
                      togglePlay()
                    }}
                  >
                    {isPlaying ? (
                      <Pause className="h-4 w-4" />
                    ) : (
                      <Play className="h-4 w-4 ml-0.5" />
                    )}
                  </Button>
                  
                  <Button
                    size="icon"
                    variant="ghost"
                    className="text-white hover:bg-white/20"
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleMute()
                    }}
                  >
                    {isMuted ? (
                      <VolumeX className="h-4 w-4" />
                    ) : (
                      <Volume2 className="h-4 w-4" />
                    )}
                  </Button>

                  {/* Time display */}
                  {duration > 0 && (
                    <span className="text-white text-xs">
                      {formatTime(currentTime)} / {formatTime(duration)}
                    </span>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="text-white hover:bg-white/20"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleReplay()
                    }}
                  >
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                  
                  <Button
                    size="icon"
                    variant="ghost"
                    className="text-white hover:bg-white/20"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleFullscreen()
                    }}
                  >
                    <Maximize className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
