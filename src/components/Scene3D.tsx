'use client'

import { Suspense, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Text, Box, Sphere, PerspectiveCamera } from '@react-three/drei'
import * as THREE from 'three'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { useSecureSightStore, type Camera, type Incident } from '@/store/useSecureSightStore'

interface Scene3DProps {
  className?: string
}

export function Scene3D({ className }: Scene3DProps) {
  const [isActive, setIsActive] = useState(false)
  const { cameras, incidents } = useSecureSightStore()

  return (
    <Card className={cn("h-96", className)}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>3D Security Overview</span>
          <div className="flex items-center space-x-2">
            <Badge variant={isActive ? "default" : "secondary"}>
              {isActive ? "Active" : "Inactive"}
            </Badge>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsActive(!isActive)}
            >
              {isActive ? "Disable" : "Enable"} 3D
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 h-80">
        {isActive ? (
          <Canvas>
            <Suspense fallback={<LoadingFallback />}>
              <SecurityScene cameras={cameras} incidents={incidents} />
            </Suspense>
          </Canvas>
        ) : (
          <div className="h-full flex items-center justify-center bg-gray-50 dark:bg-gray-900">
            <div className="text-center">
              <div className="text-2xl mb-2">🏢</div>
              <p className="text-muted-foreground">Enable 3D view to see security overview</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function LoadingFallback() {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="gray" />
    </mesh>
  )
}

interface SecuritySceneProps {
  cameras: Camera[]
  incidents: Incident[]
}

function SecurityScene({ cameras, incidents }: SecuritySceneProps) {
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <directionalLight position={[5, 5, 5]} intensity={1} />

      {/* Camera */}
      <PerspectiveCamera makeDefault position={[10, 10, 10]} />
      <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />

      {/* Building representation */}
      <Building />

      {/* Camera positions */}
      {cameras.map((camera, index) => (
        <CameraNode
          key={camera.id}
          position={getCameraPosition(index)}
          camera={camera}
        />
      ))}

      {/* Incident markers */}
      {incidents.filter(i => !i.resolved).map((incident, index) => (
        <IncidentNode
          key={incident.id}
          position={getIncidentPosition(index)}
          incident={incident}
        />
      ))}
    </>
  )
}

function Building() {
  const meshRef = useRef<THREE.Mesh>(null)

  return (
    <group>
      {/* Main building */}
      <Box ref={meshRef} args={[8, 4, 6]} position={[0, 2, 0]}>
        <meshStandardMaterial color="#4a5568" />
      </Box>
      
      {/* Ground */}
      <Box args={[20, 0.1, 20]} position={[0, -0.05, 0]}>
        <meshStandardMaterial color="#68d391" />
      </Box>

      {/* Building label */}
      <Text
        position={[0, 5, 0]}
        fontSize={0.5}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        SecureSight Facility
      </Text>
    </group>
  )
}

interface CameraNodeProps {
  position: [number, number, number]
  camera: Camera
}

function CameraNode({ position, camera }: CameraNodeProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const groupRef = useRef<THREE.Group>(null)
  const [hovered, setHovered] = useState(false)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime) * 0.3
    }
    if (groupRef.current && hovered) {
      groupRef.current.scale.setScalar(1.2)
    } else if (groupRef.current) {
      groupRef.current.scale.setScalar(1)
    }
  })

  const isActive = camera.status === 'active'

  return (
    <group
      ref={groupRef}
      position={position}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* Camera body */}
      <Box ref={meshRef} args={[0.3, 0.3, 0.5]}>
        <meshStandardMaterial color={isActive ? "#48bb78" : "#f56565"} />
      </Box>

      {/* Camera lens */}
      <Sphere args={[0.1]} position={[0, 0, 0.3]}>
        <meshStandardMaterial color="#2d3748" />
      </Sphere>

      {/* Status indicator */}
      {isActive && (
        <Sphere args={[0.05]} position={[0.2, 0.2, 0.2]}>
          <meshStandardMaterial 
            color="#68d391" 
            emissive="#68d391" 
            emissiveIntensity={0.5}
          />
        </Sphere>
      )}

      {/* Camera label */}
      <Text
        position={[0, -0.5, 0]}
        fontSize={0.2}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {camera.name}
      </Text>
    </group>
  )
}

interface IncidentNodeProps {
  position: [number, number, number]
  incident: Incident
}

function IncidentNode({ position, incident }: IncidentNodeProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const groupRef = useRef<THREE.Group>(null)
  const [hovered, setHovered] = useState(false)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.2
    }
    if (groupRef.current && hovered) {
      groupRef.current.scale.setScalar(1.3)
    } else if (groupRef.current) {
      groupRef.current.scale.setScalar(1)
    }
  })

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return '#f56565'
      case 'high':
        return '#ed8936'
      case 'medium':
        return '#ecc94b'
      case 'low':
        return '#4299e1'
      default:
        return '#a0aec0'
    }
  }

  return (
    <group
      ref={groupRef}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* Incident marker */}
      <Sphere ref={meshRef} args={[0.3]} position={position}>
        <meshStandardMaterial 
          color={getSeverityColor(incident.severity)}
          emissive={getSeverityColor(incident.severity)}
          emissiveIntensity={0.3}
        />
      </Sphere>

      {/* Pulsing effect for critical incidents */}
      {incident.severity === 'critical' && (
        <Sphere args={[0.4]} position={position}>
          <meshStandardMaterial 
            color="#f56565"
            transparent
            opacity={0.3}
          />
        </Sphere>
      )}

      {/* Incident type label */}
      <Text
        position={[position[0], position[1] - 0.7, position[2]]}
        fontSize={0.15}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {incident.type.replace('_', ' ')}
      </Text>
    </group>
  )
}

// Helper functions to position cameras and incidents in 3D space
function getCameraPosition(index: number): [number, number, number] {
  const positions: [number, number, number][] = [
    [-6, 3, 4],   // Front entrance
    [6, 3, 4],    // Parking lot
    [0, 3, -4],   // Emergency exit
  ]
  return positions[index] || [0, 3, 0]
}

function getIncidentPosition(index: number): [number, number, number] {
  const positions: [number, number, number][] = [
    [-3, 1, 2],   // Near front
    [3, 1, 2],    // Near parking
    [-2, 1, -2],  // Near exit
    [2, 1, -2],   // Other side
    [0, 1, 3],    // Center
  ]
  return positions[index] || [0, 1, 0]
}
