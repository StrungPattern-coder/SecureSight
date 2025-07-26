import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      cameras: {
        Row: {
          id: number
          name: string
          location: string
          status: 'active' | 'inactive'
          thumbnail_url: string
          stream_url: string
          created_at: string
        }
        Insert: {
          id?: number
          name: string
          location: string
          status?: 'active' | 'inactive'
          thumbnail_url: string
          stream_url: string
          created_at?: string
        }
        Update: {
          id?: number
          name?: string
          location?: string
          status?: 'active' | 'inactive'
          thumbnail_url?: string
          stream_url?: string
          created_at?: string
        }
      }
      incidents: {
        Row: {
          id: number
          camera_id: number
          type: 'intrusion' | 'theft' | 'violence' | 'suspicious_activity'
          description: string
          severity: 'low' | 'medium' | 'high' | 'critical'
          resolved: boolean
          thumbnail_url: string
          timestamp: string
          created_at: string
        }
        Insert: {
          id?: number
          camera_id: number
          type: 'intrusion' | 'theft' | 'violence' | 'suspicious_activity'
          description: string
          severity?: 'low' | 'medium' | 'high' | 'critical'
          resolved?: boolean
          thumbnail_url: string
          timestamp: string
          created_at?: string
        }
        Update: {
          id?: number
          camera_id?: number
          type?: 'intrusion' | 'theft' | 'violence' | 'suspicious_activity'
          description?: string
          severity?: 'low' | 'medium' | 'high' | 'critical'
          resolved?: boolean
          thumbnail_url?: string
          timestamp?: string
          created_at?: string
        }
      }
    }
  }
}
