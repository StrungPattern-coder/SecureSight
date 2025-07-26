'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Navbar } from '@/components/Navbar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useSecureSightStore } from '@/store/useSecureSightStore'
import { 
  AlertTriangle, 
  Shield, 
  Clock, 
  CheckCircle,
  Search,
  User,
  Flame,
  ShieldX,
  Wrench,
  Camera,
  Eye
} from 'lucide-react'
import { cn } from '@/lib/utils'

export default function IncidentsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { incidents, fetchIncidents, resolveIncident } = useSecureSightStore()
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterSeverity, setFilterSeverity] = useState('all')

  useEffect(() => {
    if (status === 'loading') return
    if (!session) {
      router.push('/auth/signin')
      return
    }
  }, [session, status, router])

  useEffect(() => {
    if (session) {
      fetchIncidents(true) // Get all incidents
    }
  }, [session, fetchIncidents])

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

  // Filter incidents based on search and filters
  const filteredIncidents = incidents.filter(incident => {
    const matchesSearch = incident.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         incident.type.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'active' && !incident.resolved) ||
                         (filterStatus === 'resolved' && incident.resolved)
    
    const matchesSeverity = filterSeverity === 'all' || 
                           incident.severity.toLowerCase() === filterSeverity

    return matchesSearch && matchesStatus && matchesSeverity
  })

  const unresolvedIncidents = incidents.filter(i => !i.resolved)
  const resolvedIncidents = incidents.filter(i => i.resolved)
  const criticalIncidents = incidents.filter(i => i.severity.toLowerCase() === 'critical')

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <Navbar />
      
      <div className="pt-24 lg:pt-28 pb-8">
        <div className="container mx-auto px-4 lg:px-6">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Security Incidents</h1>
            <p className="text-muted-foreground">Monitor, investigate, and resolve security incidents across all facilities</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Incidents</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{incidents.length}</div>
                <p className="text-xs text-muted-foreground">All time incidents</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Incidents</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">
                  {unresolvedIncidents.length}
                </div>
                <p className="text-xs text-muted-foreground">Require attention</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Critical Incidents</CardTitle>
                <Shield className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  {criticalIncidents.length}
                </div>
                <p className="text-xs text-muted-foreground">High priority alerts</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Resolved Today</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {resolvedIncidents.length}
                </div>
                <p className="text-xs text-muted-foreground">Successfully handled</p>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search incidents..."
                      value={searchTerm}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filterSeverity} onValueChange={setFilterSeverity}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Filter by severity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Severity</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Incidents List */}
          <div className="space-y-4">
            {filteredIncidents.map((incident) => (
              <IncidentRow key={incident.id} incident={incident} onResolve={resolveIncident} />
            ))}
            
            {filteredIncidents.length === 0 && (
              <Card>
                <CardContent className="p-12 text-center">
                  <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No incidents found</h3>
                  <p className="text-muted-foreground">No incidents match your current filters.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

interface IncidentRowProps {
  incident: {
    id: number
    type: string
    description: string
    severity: string
    resolved: boolean
    timestamp: string
    cameraId: number
    thumbnailUrl?: string
  }
  onResolve: (id: number) => void
}

function IncidentRow({ incident, onResolve }: IncidentRowProps) {
  const getIncidentIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'intrusion':
      case 'perimeter_breach':
        return <Shield className="h-5 w-5" />
      case 'theft':
        return <AlertTriangle className="h-5 w-5" />
      case 'violence':
      case 'gun_threat':
        return <AlertTriangle className="h-5 w-5" />
      case 'suspicious_activity':
      case 'loitering':
      case 'crowd_formation':
        return <User className="h-5 w-5" />
      case 'face_recognised':
        return <Camera className="h-5 w-5" />
      case 'fire_hazard':
        return <Flame className="h-5 w-5" />
      case 'vandalism':
        return <AlertTriangle className="h-5 w-5" />
      case 'unauthorised_access':
      case 'access_violation':
        return <ShieldX className="h-5 w-5" />
      case 'equipment_malfunction':
        return <Wrench className="h-5 w-5" />
      default:
        return <AlertTriangle className="h-5 w-5" />
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'critical':
        return 'bg-red-500 text-white'
      case 'high':
        return 'bg-orange-500 text-white'
      case 'medium':
        return 'bg-yellow-500 text-white'
      case 'low':
        return 'bg-green-500 text-white'
      default:
        return 'bg-gray-500 text-white'
    }
  }

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const handleResolve = (e: React.MouseEvent) => {
    e.stopPropagation()
    onResolve(incident.id)
  }

  return (
    <Card className={cn(
      "transition-all duration-200 hover:shadow-md",
      incident.resolved && "opacity-60"
    )}>
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          {/* Icon and Severity */}
          <div className="flex flex-col items-center space-y-2">
            <div className={cn(
              "p-2 rounded-full",
              getSeverityColor(incident.severity)
            )}>
              {getIncidentIcon(incident.type)}
            </div>
            <Badge variant="outline" className="text-xs">
              Camera {incident.cameraId}
            </Badge>
          </div>

          {/* Incident Details */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <h3 className="font-semibold text-lg">
                    {incident.type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </h3>
                  <Badge 
                    className={cn(
                      "text-xs",
                      getSeverityColor(incident.severity)
                    )}
                  >
                    {incident.severity.toUpperCase()}
                  </Badge>
                  {incident.resolved && (
                    <Badge variant="outline" className="text-green-600 border-green-600">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Resolved
                    </Badge>
                  )}
                </div>
                
                <p className="text-muted-foreground line-clamp-2">
                  {incident.description}
                </p>
                
                <div className="flex items-center text-sm text-muted-foreground">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>{formatTime(incident.timestamp)}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm">
                  <Eye className="h-4 w-4 mr-1" />
                  View Details
                </Button>
                
                {!incident.resolved && (
                  <Button onClick={handleResolve} size="sm" variant="outline">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Resolve
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
