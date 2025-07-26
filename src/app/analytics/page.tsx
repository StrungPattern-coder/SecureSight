'use client'

import { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Navbar } from '@/components/Navbar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useSecureSightStore } from '@/store/useSecureSightStore'
import { 
  Activity, 
  TrendingUp, 
  TrendingDown,
  Clock,
  Shield,
  AlertTriangle,
  BarChart3,
  PieChart,
  Calendar,
  MapPin
} from 'lucide-react'
import { cn } from '@/lib/utils'

export default function AnalyticsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { incidents, cameras, fetchIncidents, fetchCameras } = useSecureSightStore()

  useEffect(() => {
    if (status === 'loading') return
    if (!session) {
      router.push('/auth/signin')
      return
    }
  }, [session, status, router])

  useEffect(() => {
    if (session) {
      fetchIncidents(true)
      fetchCameras()
    }
  }, [session, fetchIncidents, fetchCameras])

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

  // Calculate analytics data
  const totalIncidents = incidents.length
  const todayIncidents = incidents.filter(i => {
    const today = new Date().toDateString()
    return new Date(i.timestamp).toDateString() === today
  }).length
  
  const criticalIncidents = incidents.filter(i => i.severity.toLowerCase() === 'critical').length
  const resolvedIncidents = incidents.filter(i => i.resolved).length
  const resolutionRate = totalIncidents > 0 ? (resolvedIncidents / totalIncidents * 100).toFixed(1) : '0'

  // Incident types breakdown
  const incidentTypes = incidents.reduce((acc, incident) => {
    const type = incident.type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
    acc[type] = (acc[type] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  // Severity breakdown
  const severityBreakdown = incidents.reduce((acc, incident) => {
    acc[incident.severity] = (acc[incident.severity] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  // Hourly incident distribution
  const hourlyData = Array.from({ length: 24 }, (_, i) => {
    const hour = i
    const count = incidents.filter(incident => {
      return new Date(incident.timestamp).getHours() === hour
    }).length
    return { hour, count }
  })

  const peakHour = hourlyData.reduce((max, curr) => curr.count > max.count ? curr : max, { hour: 0, count: 0 })

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <Navbar />
      
      <div className="pt-24 lg:pt-28 pb-8">
        <div className="container mx-auto px-4 lg:px-6">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Security Analytics</h1>
            <p className="text-muted-foreground">Comprehensive insights and trends across your security infrastructure</p>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Incidents</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalIncidents}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600 flex items-center">
                    <TrendingDown className="h-3 w-3 mr-1" />
                    12% from last month
                  </span>
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Today&apos;s Incidents</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{todayIncidents}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-orange-600 flex items-center">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    3 more than yesterday
                  </span>
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Resolution Rate</CardTitle>
                <Shield className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{resolutionRate}%</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600 flex items-center">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +5% improvement
                  </span>
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Critical Alerts</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{criticalIncidents}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-red-600 flex items-center">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    2 require attention
                  </span>
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Charts and Breakdowns */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
            {/* Incident Types */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <PieChart className="h-5 w-5 mr-2" />
                  Incident Types
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(incidentTypes)
                    .sort(([,a], [,b]) => b - a)
                    .slice(0, 6)
                    .map(([type, count]) => (
                    <div key={type} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full bg-primary"></div>
                        <span className="text-sm font-medium">{type}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-muted-foreground">{count}</span>
                        <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary rounded-full"
                            style={{ width: `${(count / totalIncidents) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Severity Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="h-5 w-5 mr-2" />
                  Severity Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(severityBreakdown).map(([severity, count]) => {
                    const percentage = totalIncidents > 0 ? (count / totalIncidents * 100).toFixed(1) : '0'
                    const color = severity.toLowerCase() === 'critical' ? 'bg-red-500' :
                                 severity.toLowerCase() === 'high' ? 'bg-orange-500' :
                                 severity.toLowerCase() === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                    
                    return (
                      <div key={severity} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className={cn("w-3 h-3 rounded-full", color)}></div>
                          <span className="text-sm font-medium capitalize">{severity}</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className="text-sm text-muted-foreground">{count} ({percentage}%)</span>
                          <Badge variant="outline" className="text-xs">
                            {count}
                          </Badge>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Time-based Analytics */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                24-Hour Activity Pattern
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Peak Activity Hour:</span>
                  <Badge variant="outline">
                    {peakHour.hour.toString().padStart(2, '0')}:00 ({peakHour.count} incidents)
                  </Badge>
                </div>
                
                {/* Simple hourly visualization */}
                <div className="grid grid-cols-12 gap-1 mt-4">
                  {hourlyData.map(({ hour, count }) => (
                    <div key={hour} className="text-center">
                      <div 
                        className="bg-primary/20 hover:bg-primary/40 transition-colors rounded-t"
                        style={{ 
                          height: `${Math.max(8, (count / Math.max(...hourlyData.map(h => h.count))) * 60)}px` 
                        }}
                        title={`${hour.toString().padStart(2, '0')}:00 - ${count} incidents`}
                      ></div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {hour % 6 === 0 ? hour.toString().padStart(2, '0') : ''}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Camera Performance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                Camera Performance Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                {cameras.map((camera) => {
                  const cameraIncidents = incidents.filter(i => i.cameraId === camera.id).length
                  const isActive = camera.status === 'active'
                  
                  return (
                    <div key={camera.id} className="p-4 rounded-lg border bg-card">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">Camera {camera.id}</span>
                        <Badge variant={isActive ? 'default' : 'destructive'} className="text-xs">
                          {isActive ? 'Active' : 'Offline'}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground mb-1">
                        📍 {camera.location}
                      </div>
                      <div className="text-sm">
                        <span className="font-semibold">{cameraIncidents}</span> incidents detected
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
