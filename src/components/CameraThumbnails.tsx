'use client'

import { Wifi, WifiOff } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { useSecureSightStore } from '@/store/useSecureSightStore'
import type { Camera } from '@/store/useSecureSightStore'
import Image from 'next/image'

interface CameraThumbnailsProps {
  className?: string
}

export function CameraThumbnails({ className }: CameraThumbnailsProps) {
  const { cameras, selectedCamera, setSelectedCamera } = useSecureSightStore()
  
  // Show first 3 cameras as thumbnails
  const thumbnailCameras = cameras.slice(0, 3)

  return (
    <div className={cn("space-y-4", className)}>
      {thumbnailCameras.map((camera) => (
        <CameraThumbnail
          key={camera.id}
          camera={camera}
          isSelected={selectedCamera?.id === camera.id}
          onClick={() => setSelectedCamera(camera)}
        />
      ))}
    </div>
  )
}

interface CameraThumbnailProps {
  camera: Camera
  isSelected: boolean
  onClick: () => void
}

function CameraThumbnail({ camera, isSelected, onClick }: CameraThumbnailProps) {
  return (
    <Card 
      className={cn(
        "cursor-pointer transition-all duration-200 hover:shadow-md",
        isSelected && "ring-2 ring-primary shadow-lg"
      )}
      onClick={onClick}
    >
      <CardContent className="p-0">
        <div className="relative aspect-video bg-gray-800 rounded-lg overflow-hidden">
          {/* Thumbnail with stock image */}
          <div className="absolute inset-0">
            <Image 
              src="/images/Stock_CCTV_Image_1.jpg" 
              alt={`${camera.name} feed`}
              fill
              className="object-cover"
            />
            {/* Dark overlay for text readability */}
            <div className="absolute inset-0 bg-black/30" />
          </div>
          
          {/* Camera info overlay */}
          <div className="absolute bottom-2 left-2 right-2">
            <div className="text-white text-sm font-medium drop-shadow-lg">
              {camera.name}
            </div>
            <div className="text-gray-200 text-xs drop-shadow-lg">
              {camera.location}
            </div>
          </div>

          {/* Status indicator */}
          <div className="absolute top-2 left-2 flex items-center space-x-1">
            {camera.status === 'active' ? (
              <>
                <Wifi className="h-3 w-3 text-green-400" />
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              </>
            ) : (
              <>
                <WifiOff className="h-3 w-3 text-red-400" />
                <div className="w-2 h-2 bg-red-400 rounded-full" />
              </>
            )}
          </div>

          {/* Camera ID */}
          <div className="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-xs">
            {camera.id}
          </div>

          {/* Selected indicator */}
          {isSelected && (
            <div className="absolute inset-0 bg-primary/10 border-2 border-primary rounded-lg" />
          )}
        </div>

        {/* Camera info */}
        <div className="p-3">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-sm">{camera.name}</h4>
              <p className="text-xs text-muted-foreground">{camera.location}</p>
            </div>
            <div className={cn(
              "text-xs px-2 py-1 rounded-full",
              camera.status === 'active' 
                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
            )}>
              {camera.status}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
