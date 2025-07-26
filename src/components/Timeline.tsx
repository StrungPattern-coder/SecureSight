'use client'

import { useState, useEffect, useRef } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useSecureSightStore } from '@/store/useSecureSightStore'

interface TimelineProps {
  className?: string
  videoDuration?: number
  videoCurrentTime?: number
  onTimelineSeek?: (percentage: number) => void
}

export function Timeline({ className, videoDuration, videoCurrentTime, onTimelineSeek }: TimelineProps) {
  const [currentTime, setCurrentTime] = useState<Date | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [scrubberPosition, setScrubberPosition] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const timelineRef = useRef<SVGSVGElement>(null)
  const { incidents, setTimelinePosition } = useSecureSightStore()

  // Update scrubber position based on video time
  useEffect(() => {
    if (videoDuration && videoCurrentTime !== undefined && !isDragging) {
      const percentage = (videoCurrentTime / videoDuration) * 100
      setScrubberPosition(percentage)
    }
  }, [videoCurrentTime, videoDuration, isDragging])

  // Initialize current time on client only to avoid hydration issues
  useEffect(() => {
    setCurrentTime(new Date())
    const interval = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  // Generate time markers based on video duration or 24-hour timeline
  const generateTimeMarkers = () => {
    const markers = []
    
    if (videoDuration && videoDuration > 0) {
      // Video-based timeline: divide into 10 segments
      const segments = 10
      for (let i = 0; i <= segments; i++) {
        const timeInSeconds = (i / segments) * videoDuration
        const minutes = Math.floor(timeInSeconds / 60)
        const seconds = Math.floor(timeInSeconds % 60)
        
        markers.push({
          time: i,
          position: (i / segments) * 100,
          label: `${minutes}:${seconds.toString().padStart(2, '0')}`
        })
      }
    } else {
      // 24-hour timeline fallback
      for (let i = 0; i < 24; i++) {
        markers.push({
          time: i,
          position: (i / 24) * 100,
          label: `${i.toString().padStart(2, '0')}:00`
        })
      }
    }
    
    return markers
  }

  // Map incidents to timeline positions
  const getIncidentMarkers = () => {
    const today = new Date()
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate())
    
    return incidents.map(incident => {
      const incidentTime = new Date(incident.timestamp)
      const hoursFromStart = (incidentTime.getTime() - startOfDay.getTime()) / (1000 * 60 * 60)
      const position = Math.max(0, Math.min(100, (hoursFromStart / 24) * 100))
      
      return {
        ...incident,
        position,
        time: incidentTime.toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit' 
        })
      }
    })
  }

  // Get current time position on timeline
  const getCurrentTimePosition = () => {
    if (!currentTime) return 0
    const now = currentTime
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const hoursFromStart = (now.getTime() - startOfDay.getTime()) / (1000 * 60 * 60)
    return (hoursFromStart / 24) * 100
  }

  const handleTimelineClick = (e: React.MouseEvent) => {
    if (!timelineRef.current) return
    
    const rect = timelineRef.current.getBoundingClientRect()
    const clickX = e.clientX - rect.left
    const percentage = (clickX / rect.width) * 100
    
    setScrubberPosition(percentage)
    setTimelinePosition(percentage)
    onTimelineSeek?.(percentage)
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    handleTimelineClick(e)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return
    handleTimelineClick(e)
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const timeMarkers = generateTimeMarkers()
  const incidentMarkers = getIncidentMarkers()
  const currentTimePosition = getCurrentTimePosition()

  return (
    <Card className={cn("", className)}>
      <CardContent className="p-4">
        {/* Controls */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setScrubberPosition(Math.max(0, scrubberPosition - (100/24)))}
            >
              <SkipBack className="h-4 w-4" />
            </Button>
            
            <Button
              size="sm"
              onClick={() => setIsPlaying(!isPlaying)}
            >
              {isPlaying ? (
                <Pause className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4" />
              )}
            </Button>
            
            <Button
              size="sm"
              variant="outline"
              onClick={() => setScrubberPosition(Math.min(100, scrubberPosition + (100/24)))}
            >
              <SkipForward className="h-4 w-4" />
            </Button>
          </div>

          <div className="text-sm text-muted-foreground">
            {videoDuration && videoDuration > 0 
              ? `Video Timeline: ${Math.floor(videoDuration / 60)}:${Math.floor(videoDuration % 60).toString().padStart(2, '0')} duration`
              : `Timeline: ${currentTime?.toLocaleDateString() || 'Loading...'}`
            }
          </div>
        </div>

        {/* Timeline SVG */}
        <div className="relative">
          <svg
            ref={timelineRef}
            className="w-full h-20 cursor-pointer"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            {/* Background line */}
            <line
              x1="0"
              y1="40"
              x2="100%"
              y2="40"
              stroke="hsl(var(--border))"
              strokeWidth="2"
            />

            {/* Time markers */}
            {timeMarkers.map((marker) => (
              <g key={marker.time}>
                <line
                  x1={`${marker.position}%`}
                  y1="30"
                  x2={`${marker.position}%`}
                  y2="50"
                  stroke="hsl(var(--muted-foreground))"
                  strokeWidth="1"
                />
                <text
                  x={`${marker.position}%`}
                  y="25"
                  textAnchor="middle"
                  className="fill-muted-foreground text-xs"
                >
                  {videoDuration ? marker.label : (marker.time % 6 === 0 ? marker.label : marker.time.toString().padStart(2, '0'))}
                </text>
              </g>
            ))}

            {/* Incident markers */}
            {incidentMarkers.map((incident) => (
              <g key={incident.id}>
                <circle
                  cx={`${incident.position}%`}
                  cy="40"
                  r="6"
                  className={cn(
                    "cursor-pointer",
                    incident.severity === 'critical' && "fill-red-500",
                    incident.severity === 'high' && "fill-orange-500", 
                    incident.severity === 'medium' && "fill-yellow-500",
                    incident.severity === 'low' && "fill-blue-500"
                  )}
                  onClick={(e) => {
                    e.stopPropagation()
                    setScrubberPosition(incident.position)
                    setTimelinePosition(incident.position)
                  }}
                />
                <text
                  x={`${incident.position}%`}
                  y="65"
                  textAnchor="middle"
                  className="fill-foreground text-xs font-medium"
                >
                  {incident.time}
                </text>
              </g>
            ))}

            {/* Current time indicator */}
            <line
              x1={`${currentTimePosition}%`}
              y1="20"
              x2={`${currentTimePosition}%`}
              y2="60"
              stroke="hsl(var(--primary))"
              strokeWidth="2"
              strokeDasharray="4,2"
            />

            {/* Scrubber */}
            <g>
              <line
                x1={`${scrubberPosition}%`}
                y1="20"
                x2={`${scrubberPosition}%`}
                y2="60"
                stroke="hsl(var(--foreground))"
                strokeWidth="3"
              />
              <circle
                cx={`${scrubberPosition}%`}
                cy="40"
                r="8"
                className="fill-background stroke-foreground"
                strokeWidth="2"
              />
            </g>
          </svg>

          {/* Legend */}
          <div className="flex items-center justify-center space-x-4 mt-2 text-xs">
            <div className="flex items-center space-x-1">
              <div className="w-3 h-0.5 bg-primary" />
              <span>Current Time</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-red-500 rounded-full" />
              <span>Critical</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-orange-500 rounded-full" />
              <span>High</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-yellow-500 rounded-full" />
              <span>Medium</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-blue-500 rounded-full" />
              <span>Low</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
