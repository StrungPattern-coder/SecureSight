'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Navbar } from '@/components/Navbar'
import { VideoPlayer } from '@/components/VideoPlayer'
import { CameraThumbnails } from '@/components/CameraThumbnails'
import { IncidentList } from '@/components/IncidentList'
import { Timeline } from '@/components/Timeline'
import { Scene3D } from '@/components/Scene3D'
import { useSecureSightStore } from '@/store/useSecureSightStore'
import { setupRealtimeSubscriptions } from '@/lib/realtime'

export default function Dashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { fetchCameras, fetchIncidents, setSelectedCamera, cameras } = useSecureSightStore()
  
  // Video state for timeline sync
  const [videoDuration, setVideoDuration] = useState(0)
  const [videoCurrentTime, setVideoCurrentTime] = useState(0)

  // Redirect to login if not authenticated
  useEffect(() => {
    if (status === 'loading') return // Still loading
    if (!session) {
      router.push('/auth/signin')
      return
    }
  }, [session, status, router])

  useEffect(() => {
    if (!session) return

    // Fetch initial data
    fetchCameras()
    fetchIncidents(false) // Get unresolved incidents
    
    // Set up real-time subscriptions
    const subscriptions = setupRealtimeSubscriptions()
    
    // Fallback polling for non-Supabase setups
    const interval = setInterval(() => {
      fetchIncidents(false)
    }, 30000) // Poll every 30 seconds as fallback

    return () => {
      clearInterval(interval)
      subscriptions?.cleanup()
    }
  }, [fetchCameras, fetchIncidents, session])

  // Video event handlers
  const handleVideoTimeUpdate = (currentTime: number, duration: number) => {
    setVideoCurrentTime(currentTime)
    setVideoDuration(duration)
  }

  const handleTimelineSeek = () => {
    // This will be handled by the Timeline component through the store
    // The VideoPlayer will sync automatically via the timelinePosition from the store
  }

  useEffect(() => {
    // Auto-select first camera when cameras load
    if (cameras.length > 0) {
      setSelectedCamera(cameras[0])
    }
  }, [cameras, setSelectedCamera])

  // Show loading state while checking authentication
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  // Don't render dashboard if not authenticated
  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Navigation */}
      <Navbar />
      
      {/* Main Dashboard Content */}
      <div className="pt-24 lg:pt-28 pb-8">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Left Panel - Video Player and Controls */}
            <div className="lg:col-span-3 space-y-6">
              {/* Main Video Player */}
              <VideoPlayer 
                className="w-full" 
                onTimeUpdate={handleVideoTimeUpdate}
              />
              
              {/* Timeline */}
              <Timeline 
                className="w-full" 
                videoDuration={videoDuration}
                videoCurrentTime={videoCurrentTime}
                onTimelineSeek={handleTimelineSeek}
              />
              
              {/* Camera Thumbnails Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <CameraThumbnails />
              </div>

              {/* 3D Scene (Extra Credit) */}
              <Scene3D className="w-full" />
            </div>

            {/* Right Panel - Incident List */}
            <div className="lg:col-span-1">
              <IncidentList className="h-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
