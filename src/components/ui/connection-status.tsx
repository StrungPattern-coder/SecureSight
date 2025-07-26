'use client'

import { useEffect, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { supabase } from '@/lib/supabase'

export function ConnectionStatus() {
  const [isConnected, setIsConnected] = useState(false)
  const [isSupabaseEnabled, setIsSupabaseEnabled] = useState(false)

  useEffect(() => {
    // Check if Supabase is properly configured
    if (supabase) {
      setIsSupabaseEnabled(true)
      
      // Monitor connection status
      const channel = supabase.channel('connection-test')
      
      channel
        .on('presence', { event: 'sync' }, () => {
          setIsConnected(true)
        })
        .subscribe((status) => {
          setIsConnected(status === 'SUBSCRIBED')
        })

      return () => {
        channel.unsubscribe()
      }
    } else {
      setIsSupabaseEnabled(false)
      setIsConnected(false)
    }
  }, [])

  if (!isSupabaseEnabled) {
    return (
      <Badge variant="secondary" className="text-xs">
        🔧 Mock Mode
      </Badge>
    )
  }

  return (
    <Badge 
      variant={isConnected ? "default" : "destructive"} 
      className="text-xs"
    >
      {isConnected ? (
        <>🟢 Real-time</>
      ) : (
        <>🔴 Offline</>
      )}
    </Badge>
  )
}
