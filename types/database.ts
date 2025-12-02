export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      groups: {
        Row: {
          id: string
          code: string
          restaurant_name: string | null
          restaurant_id: string | null
          status: 'browsing' | 'checkout' | 'ordered' | 'delivered'
          checkout_user_email: string | null
          venmo_handle: string | null
          venmo_qr_code: string | null
          order_total: number | null
          delivery_eta: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          code: string
          restaurant_name?: string | null
          restaurant_id?: string | null
          status?: 'browsing' | 'checkout' | 'ordered' | 'delivered'
          checkout_user_email?: string | null
          venmo_handle?: string | null
          venmo_qr_code?: string | null
          order_total?: number | null
          delivery_eta?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          code?: string
          restaurant_name?: string | null
          restaurant_id?: string | null
          status?: 'browsing' | 'checkout' | 'ordered' | 'delivered'
          checkout_user_email?: string | null
          venmo_handle?: string | null
          venmo_qr_code?: string | null
          order_total?: number | null
          delivery_eta?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      group_members: {
        Row: {
          id: string
          group_id: string
          email: string
          first_name: string
          joined_at: string
        }
        Insert: {
          id?: string
          group_id: string
          email: string
          first_name: string
          joined_at?: string
        }
        Update: {
          id?: string
          group_id?: string
          email?: string
          first_name?: string
          joined_at?: string
        }
      }
      cart_items: {
        Row: {
          id: string
          group_id: string
          added_by_email: string
          added_by_name: string
          item_name: string
          item_description: string | null
          quantity: number
          price: number
          special_instructions: string | null
          created_at: string
        }
        Insert: {
          id?: string
          group_id: string
          added_by_email: string
          added_by_name: string
          item_name: string
          item_description?: string | null
          quantity: number
          price: number
          special_instructions?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          group_id?: string
          added_by_email?: string
          added_by_name?: string
          item_name?: string
          item_description?: string | null
          quantity?: number
          price?: number
          special_instructions?: string | null
          created_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          group_id: string
          status: 'placed' | 'preparing' | 'in_transit' | 'delivered'
          delivery_eta: string | null
          subtotal: number
          tax_rate: number
          tax_amount: number
          tip_rate: number
          tip_amount: number
          total_amount: number
          ordered_at: string
          invoices_sent: boolean
        }
        Insert: {
          id?: string
          group_id: string
          status?: 'placed' | 'preparing' | 'in_transit' | 'delivered'
          delivery_eta?: string | null
          subtotal: number
          tax_rate: number
          tax_amount: number
          tip_rate: number
          tip_amount: number
          total_amount: number
          ordered_at?: string
          invoices_sent?: boolean
        }
        Update: {
          id?: string
          group_id?: string
          status?: 'placed' | 'preparing' | 'in_transit' | 'delivered'
          delivery_eta?: string | null
          subtotal?: number
          tax_rate?: number
          tax_amount?: number
          tip_rate?: number
          tip_amount?: number
          total_amount?: number
          ordered_at?: string
          invoices_sent?: boolean
        }
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          added_by_email: string
          added_by_name: string
          item_name: string
          quantity: number
          price: number
        }
        Insert: {
          id?: string
          order_id: string
          added_by_email: string
          added_by_name: string
          item_name: string
          quantity: number
          price: number
        }
        Update: {
          id?: string
          order_id?: string
          added_by_email?: string
          added_by_name?: string
          item_name?: string
          quantity?: number
          price?: number
        }
      }
      user_order_summary: {
        Row: {
          id: string
          order_id: string
          user_email: string
          user_name: string
          subtotal: number
          tax_amount: number
          tip_amount: number
          total_amount: number
          invoice_sent: boolean
          invoice_sent_at: string | null
        }
        Insert: {
          id?: string
          order_id: string
          user_email: string
          user_name: string
          subtotal: number
          tax_amount: number
          tip_amount: number
          total_amount: number
          invoice_sent?: boolean
          invoice_sent_at?: string | null
        }
        Update: {
          id?: string
          order_id?: string
          user_email?: string
          user_name?: string
          subtotal?: number
          tax_amount?: number
          tip_amount?: number
          total_amount?: number
          invoice_sent?: boolean
          invoice_sent_at?: string | null
        }
      }
    }
  }
}
