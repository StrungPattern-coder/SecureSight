import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

export interface Camera {
  id: number
  name: string
  location: string
  status: 'active' | 'inactive'
  thumbnailUrl: string
  streamUrl: string
  createdAt: string
}

export interface Incident {
  id: number
  cameraId: number
  type: 'intrusion' | 'theft' | 'violence' | 'suspicious_activity'
  description: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  resolved: boolean
  thumbnailUrl: string
  timestamp: string
  createdAt: string
  camera?: Camera
}

interface SecureSightStore {
  // State
  cameras: Camera[]
  incidents: Incident[]
  selectedCamera: Camera | null
  loading: boolean
  timelinePosition: number
  selectedIncident: Incident | null
  
  // Actions
  setCameras: (cameras: Camera[]) => void
  setIncidents: (incidents: Incident[]) => void
  setSelectedCamera: (camera: Camera | null) => void
  setLoading: (loading: boolean) => void
  setTimelinePosition: (position: number) => void
  setSelectedIncident: (incident: Incident | null) => void
  
  // Real-time updates
  addIncident: (incident: Incident) => void
  updateIncident: (incidentId: number, incident: Partial<Incident>) => void
  removeIncident: (incidentId: number) => void
  
  // Optimistic updates
  optimisticallyResolveIncident: (incidentId: number) => void
  rollbackIncidentResolve: (incidentId: number) => void
  
  // Fetch data
  fetchCameras: () => Promise<void>
  fetchIncidents: (resolved?: boolean) => Promise<void>
  resolveIncident: (incidentId: number) => Promise<void>
}

export const useSecureSightStore = create<SecureSightStore>()(
  devtools(
    (set, get) => ({
      // Initial state
      cameras: [],
      incidents: [],
      selectedCamera: null,
      loading: false,
      timelinePosition: 0,
      selectedIncident: null,
      
      // Basic setters
      setCameras: (cameras) => set({ cameras }, false, 'setCameras'),
      setIncidents: (incidents) => set({ incidents }, false, 'setIncidents'),
      setSelectedCamera: (camera) => set({ selectedCamera: camera }, false, 'setSelectedCamera'),
      setLoading: (loading) => set({ loading }, false, 'setLoading'),
      setTimelinePosition: (position) => set({ timelinePosition: position }, false, 'setTimelinePosition'),
      setSelectedIncident: (incident) => set({ selectedIncident: incident }, false, 'setSelectedIncident'),
      
      // Real-time incident updates
      addIncident: (incident) =>
        set((state) => ({
          incidents: [incident, ...state.incidents]
        }), false, 'addIncident'),
      
      updateIncident: (incidentId, updates) =>
        set((state) => ({
          incidents: state.incidents.map((incident) =>
            incident.id === incidentId
              ? { ...incident, ...updates }
              : incident
          )
        }), false, 'updateIncident'),
      
      removeIncident: (incidentId) =>
        set((state) => ({
          incidents: state.incidents.filter((incident) => incident.id !== incidentId)
        }), false, 'removeIncident'),
      
      // Optimistic updates for better UX
      optimisticallyResolveIncident: (incidentId) =>
        set((state) => ({
          incidents: state.incidents.map((incident) =>
            incident.id === incidentId
              ? { ...incident, resolved: true }
              : incident
          )
        }), false, 'optimisticallyResolveIncident'),
      
      rollbackIncidentResolve: (incidentId) =>
        set((state) => ({
          incidents: state.incidents.map((incident) =>
            incident.id === incidentId
              ? { ...incident, resolved: false }
              : incident
          )
        }), false, 'rollbackIncidentResolve'),
      
      // API calls
      fetchCameras: async () => {
        try {
          set({ loading: true })
          const response = await fetch('/api/cameras')
          if (!response.ok) throw new Error('Failed to fetch cameras')
          const cameras = await response.json()
          set({ cameras, loading: false })
        } catch (error) {
          console.error('Failed to fetch cameras:', error)
          set({ loading: false })
        }
      },
      
      fetchIncidents: async (resolved = false) => {
        try {
          set({ loading: true })
          const response = await fetch(`/api/incidents?resolved=${resolved}`)
          if (!response.ok) throw new Error('Failed to fetch incidents')
          const incidents = await response.json()
          set({ incidents, loading: false })
        } catch (error) {
          console.error('Failed to fetch incidents:', error)
          set({ loading: false })
        }
      },
      
      resolveIncident: async (incidentId) => {
        const { optimisticallyResolveIncident, rollbackIncidentResolve } = get()
        
        // Optimistic update
        optimisticallyResolveIncident(incidentId)
        
        try {
          const response = await fetch(`/api/incidents/${incidentId}/resolve`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
          })
          
          if (!response.ok) {
            throw new Error('Failed to resolve incident')
          }
        } catch (error) {
          console.error('Failed to resolve incident:', error)
          // Rollback optimistic update
          rollbackIncidentResolve(incidentId)
        }
      },
    }),
    {
      name: 'securesight-store',
    }
  )
)
