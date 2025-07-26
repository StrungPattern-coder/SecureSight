'use client'

import { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Navbar } from '@/components/Navbar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useSecureSightStore } from '@/store/useSecureSightStore'
import { Camera, MapPin, Activity, Settings, Power } from 'lucide-react'
import { cn } from '@/lib/utils'
import Image from 'next/image'

export default function CamerasPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { cameras, fetchCameras, selectedCamera, setSelectedCamera } = useSecureSightStore()

  useEffect(() => {
    if (status === 'loading') return
    if (!session) {
      router.push('/auth/signin')
      return
    }
  }, [session, status, router])

  useEffect(() => {
    if (session) {
      fetchCameras()
    }
  }, [session, fetchCameras])

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

  if (!session) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <Navbar />
      
      <div className="pt-24 lg:pt-28 pb-8">
        <div className="container mx-auto px-4 lg:px-6">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Camera Management</h1>
            <p className="text-muted-foreground">Monitor and manage all security cameras across your facilities</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Cameras</CardTitle>
                <Camera className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{cameras.length}</div>
                <p className="text-xs text-muted-foreground">Active monitoring points</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Cameras</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {cameras.filter(c => c.status === 'active').length}
                </div>
                <p className="text-xs text-muted-foreground">Currently recording</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Offline Cameras</CardTitle>
                <Power className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  {cameras.filter(c => c.status !== 'active').length}
                </div>
                <p className="text-xs text-muted-foreground">Needs attention</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Coverage Areas</CardTitle>
                <MapPin className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">4</div>
                <p className="text-xs text-muted-foreground">Security zones</p>
              </CardContent>
            </Card>
          </div>

          {/* Camera Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {cameras.map((camera) => (
              <CameraCard 
                key={camera.id} 
                camera={camera} 
                isSelected={selectedCamera?.id === camera.id}
                onSelect={() => setSelectedCamera(camera)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

interface CameraCardProps {
  camera: {
    id: number
    name: string
    location: string
    status: 'active' | 'inactive'
  }
  isSelected: boolean
  onSelect: () => void
}

function CameraCard({ camera, isSelected, onSelect }: CameraCardProps) {
  return (
    <Card 
      className={cn(
        "cursor-pointer transition-all duration-200 hover:shadow-lg card-hover",
        isSelected && "ring-2 ring-primary shadow-lg"
      )}
      onClick={onSelect}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">
            Camera {camera.id}
          </CardTitle>
          <Badge 
            variant={camera.status === 'active' ? 'default' : 'destructive'}
            className="text-xs"
          >
            {camera.status === 'active' ? '🟢 Live' : '🔴 Offline'}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        {/* Video Preview */}
        <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden mb-4">
          <Image 
            src="/images/Stock_CCTV_Image_1.jpg" 
            alt={`${camera.name} feed`}
            fill
            className="object-cover"
          />
          {/* Dark overlay for text readability */}
          <div className="absolute inset-0 bg-black/20" />
          
          {camera.status === 'active' && (
            <div className="absolute top-3 left-3 bg-red-600 text-white px-2 py-1 rounded text-xs font-medium flex items-center space-x-1">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
              <span>LIVE</span>
            </div>
          )}
          
          {camera.status !== 'active' && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <div className="text-center">
                <Camera className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-200 text-sm">Camera Offline</p>
              </div>
            </div>
          )}
        </div>

        {/* Camera Info */}
        <div className="space-y-3">
          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 mr-2" />
            <span>{camera.location}</span>
          </div>
          
          <div className="flex items-center text-sm text-muted-foreground">
            <Camera className="h-4 w-4 mr-2" />
            <span>1080p • 30fps</span>
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-sm text-muted-foreground">
              Last updated: 2 min ago
            </span>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
