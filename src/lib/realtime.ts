import { supabase } from './supabase'
import { useSecureSightStore } from '@/store/useSecureSightStore'
import type { Incident } from '@/store/useSecureSightStore'

export function setupRealtimeSubscriptions() {
  if (!supabase) {
    console.warn('Supabase not configured, skipping real-time subscriptions')
    return
  }

  // Subscribe to camera changes
  const camerasSubscription = supabase
    .channel('cameras')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'cameras',
      },
      (payload) => {
        console.log('Camera change received!', payload)
        // Refresh cameras data
        useSecureSightStore.getState().fetchCameras()
      }
    )
    .subscribe()

  // Subscribe to incident changes
  const incidentsSubscription = supabase
    .channel('incidents')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'incidents',
      },
      (payload) => {
        console.log('Incident change received!', payload)
        // Handle real-time incident updates
        const { eventType, new: newRecord, old: oldRecord } = payload
        
        if (eventType === 'INSERT' && newRecord) {
          // Add new incident to store (with proper type casting)
          useSecureSightStore.getState().addIncident(newRecord as Incident)
        } else if (eventType === 'UPDATE' && newRecord) {
          // Update existing incident
          useSecureSightStore.getState().updateIncident(newRecord.id as number, newRecord as Partial<Incident>)
        } else if (eventType === 'DELETE' && oldRecord) {
          // Remove incident from store
          useSecureSightStore.getState().removeIncident(oldRecord.id as number)
        }
      }
    )
    .subscribe()

  return {
    camerasSubscription,
    incidentsSubscription,
    cleanup: () => {
      camerasSubscription.unsubscribe()
      incidentsSubscription.unsubscribe()
    }
  }
}
