'use client'

import { 
  AlertTriangle, 
  Shield, 
  Clock, 
  CheckCircle, 
  User, 
  Flame, 
  ShieldX, 
  Wrench,
  Camera
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { useSecureSightStore } from '@/store/useSecureSightStore'
import type { Incident } from '@/store/useSecureSightStore'

interface IncidentListProps {
  className?: string
}

export function IncidentList({ className }: IncidentListProps) {
  const { incidents, loading } = useSecureSightStore()
  
  // Filter to show only unresolved incidents
  const unresolvedIncidents = incidents.filter(incident => !incident.resolved)

  return (
    <Card className={cn("h-full", className)}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Active Incidents</span>
          <Badge variant="destructive" className="text-xs">
            {unresolvedIncidents.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="max-h-[600px] overflow-y-auto custom-scrollbar">
          {loading ? (
            <div className="p-6 text-center text-muted-foreground">
              <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
              <p>Loading incidents...</p>
            </div>
          ) : unresolvedIncidents.length === 0 ? (
            <div className="p-6 text-center text-muted-foreground">
              <Shield className="h-12 w-12 mx-auto mb-4 text-green-500" />
              <p className="font-medium">All Clear</p>
              <p className="text-sm">No active incidents detected</p>
            </div>
          ) : (
            <div className="space-y-3 p-3">
              {unresolvedIncidents.map((incident) => (
                <IncidentCard key={incident.id} incident={incident} />
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

interface IncidentCardProps {
  incident: Incident
}

function IncidentCard({ incident }: IncidentCardProps) {
  const { resolveIncident } = useSecureSightStore()

  const getIncidentIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'intrusion':
      case 'perimeter_breach':
        return <Shield className="h-4 w-4" />
      case 'theft':
        return <AlertTriangle className="h-4 w-4" />
      case 'violence':
      case 'gun_threat':
        return <AlertTriangle className="h-4 w-4" />
      case 'suspicious_activity':
      case 'loitering':
      case 'crowd_formation':
        return <User className="h-4 w-4" />
      case 'face_recognised':
        return <Camera className="h-4 w-4" />
      case 'fire_hazard':
        return <Flame className="h-4 w-4" />
      case 'vandalism':
        return <AlertTriangle className="h-4 w-4" />
      case 'unauthorised_access':
      case 'access_violation':
        return <ShieldX className="h-4 w-4" />
      case 'equipment_malfunction':
        return <Wrench className="h-4 w-4" />
      default:
        return <AlertTriangle className="h-4 w-4" />
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'critical':
        return 'bg-security-critical'
      case 'high':
        return 'bg-security-high'
      case 'medium':
        return 'bg-security-medium'
      case 'low':
        return 'bg-security-low'
      default:
        return 'bg-gray-500'
    }
  }

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    })
  }

  const handleResolve = (e: React.MouseEvent) => {
    e.stopPropagation()
    resolveIncident(incident.id)
  }

  return (
    <Card 
      className={cn(
        "cursor-pointer transition-all duration-200 hover:shadow-md",
        incident.resolved && "opacity-50 animate-out fade-out-50 duration-500"
      )}
    >
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          {/* Thumbnail */}
          <div className="flex-shrink-0">
            <div className="w-16 h-12 bg-gray-800 rounded-lg flex items-center justify-center relative overflow-hidden">
              <div className="text-gray-400 text-xs">IMG</div>
              {/* Severity indicator */}
              <div className={cn(
                "absolute top-1 left-1 w-2 h-2 rounded-full",
                getSeverityColor(incident.severity)
              )} />
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-2 mb-1">
                <div className={cn(
                  "text-white p-1 rounded",
                  incident.type === 'intrusion' && "bg-red-500",
                  incident.type === 'theft' && "bg-orange-500",
                  incident.type === 'violence' && "bg-red-600",
                  incident.type === 'suspicious_activity' && "bg-yellow-500"
                )}>
                  {getIncidentIcon(incident.type)}
                </div>
                <Badge variant="outline" className="text-xs">
                  {incident.type.replace('_', ' ')}
                </Badge>
              </div>
              
              <div className="text-right">
                <div className="text-xs text-muted-foreground flex items-center space-x-1">
                  <Clock className="h-3 w-3" />
                  <span>{formatTime(incident.timestamp)}</span>
                </div>
                <div className="text-xs text-muted-foreground">
                  {formatDate(incident.timestamp)}
                </div>
              </div>
            </div>

            <p className="text-sm font-medium mb-2 line-clamp-2">
              {incident.description}
            </p>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Badge 
                  variant={incident.severity === 'critical' || incident.severity === 'high' ? 'destructive' : 'secondary'}
                  className="text-xs"
                >
                  {incident.severity}
                </Badge>
                {incident.camera && (
                  <span className="text-xs text-muted-foreground">
                    Camera {incident.camera.id}
                  </span>
                )}
              </div>

              <Button
                size="sm"
                variant="outline"
                className="h-7 text-xs"
                onClick={handleResolve}
                disabled={incident.resolved}
              >
                {incident.resolved ? (
                  <>
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Resolved
                  </>
                ) : (
                  'Resolve'
                )}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
