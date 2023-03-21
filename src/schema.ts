export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      expenses: {
        Row: {
          cents: number
          created_at: string
          date: string
          group_id: number
          id: number
          name: string
          paid_by: number
          paid_to: Json[]
        }
        Insert: {
          cents: number
          created_at?: string
          date: string
          group_id: number
          id?: number
          name: string
          paid_by: number
          paid_to: Json[]
        }
        Update: {
          cents?: number
          created_at?: string
          date?: string
          group_id?: number
          id?: number
          name?: string
          paid_by?: number
          paid_to?: Json[]
        }
      }
      groups: {
        Row: {
          created_at: string | null
          description: string | null
          id: number
          name: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: number
          name: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: number
          name?: string
        }
      }
      members: {
        Row: {
          alias: string
          created_at: string
          group_id: number
          id: number
          is_admin: boolean
        }
        Insert: {
          alias: string
          created_at?: string
          group_id: number
          id?: number
          is_admin?: boolean
        }
        Update: {
          alias?: string
          created_at?: string
          group_id?: number
          id?: number
          is_admin?: boolean
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

