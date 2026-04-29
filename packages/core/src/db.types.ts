export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  estacion33: {
    Tables: {
      addresses: {
        Row: {
          city: string
          created_at: string
          id: string
          is_default: boolean
          label: string | null
          lat: number | null
          line1: string
          line2: string | null
          lng: number | null
          notes: string | null
          user_id: string
        }
        Insert: {
          city?: string
          created_at?: string
          id?: string
          is_default?: boolean
          label?: string | null
          lat?: number | null
          line1: string
          line2?: string | null
          lng?: number | null
          notes?: string | null
          user_id: string
        }
        Update: {
          city?: string
          created_at?: string
          id?: string
          is_default?: boolean
          label?: string | null
          lat?: number | null
          line1?: string
          line2?: string | null
          lng?: number | null
          notes?: string | null
          user_id?: string
        }
        Relationships: []
      }
      categories: {
        Row: {
          created_at: string
          id: string
          name: string
          slug: string
          sort_order: number
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          slug: string
          sort_order?: number
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          slug?: string
          sort_order?: number
        }
        Relationships: []
      }
      delivery_locations: {
        Row: {
          accuracy_m: number | null
          driver_id: string
          id: string
          lat: number
          lng: number
          order_id: string
          recorded_at: string
        }
        Insert: {
          accuracy_m?: number | null
          driver_id: string
          id?: string
          lat: number
          lng: number
          order_id: string
          recorded_at?: string
        }
        Update: {
          accuracy_m?: number | null
          driver_id?: string
          id?: string
          lat?: number
          lng?: number
          order_id?: string
          recorded_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "delivery_locations_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      repartidor_push_subs: {
        Row: {
          auth: string
          created_at: string
          driver_id: string
          endpoint: string
          id: string
          last_used_at: string | null
          p256dh: string
          user_agent: string | null
        }
        Insert: {
          auth: string
          created_at?: string
          driver_id: string
          endpoint: string
          id?: string
          last_used_at?: string | null
          p256dh: string
          user_agent?: string | null
        }
        Update: {
          auth?: string
          created_at?: string
          driver_id?: string
          endpoint?: string
          id?: string
          last_used_at?: string | null
          p256dh?: string
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "repartidor_push_subs_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      customer_push_subs: {
        Row: {
          auth: string
          created_at: string
          endpoint: string
          id: string
          last_used_at: string | null
          p256dh: string
          user_agent: string | null
          user_id: string
        }
        Insert: {
          auth: string
          created_at?: string
          endpoint: string
          id?: string
          last_used_at?: string | null
          p256dh: string
          user_agent?: string | null
          user_id: string
        }
        Update: {
          auth?: string
          created_at?: string
          endpoint?: string
          id?: string
          last_used_at?: string | null
          p256dh?: string
          user_agent?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "customer_push_subs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      loyalty_points: {
        Row: {
          created_at: string
          id: string
          order_id: string | null
          points: number
          source: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          order_id?: string | null
          points: number
          source: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          order_id?: string | null
          points?: number
          source?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "loyalty_points_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      option_values: {
        Row: {
          id: string
          name: string
          option_id: string
          price_delta_cents: number
          sort_order: number
        }
        Insert: {
          id?: string
          name: string
          option_id: string
          price_delta_cents?: number
          sort_order?: number
        }
        Update: {
          id?: string
          name?: string
          option_id?: string
          price_delta_cents?: number
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "option_values_option_id_fkey"
            columns: ["option_id"]
            isOneToOne: false
            referencedRelation: "product_options"
            referencedColumns: ["id"]
          },
        ]
      }
      order_items: {
        Row: {
          created_at: string
          id: string
          order_id: string
          product_id: string
          qty: number
          selected_options: Json
          unit_price_cents: number
        }
        Insert: {
          created_at?: string
          id?: string
          order_id: string
          product_id: string
          qty: number
          selected_options?: Json
          unit_price_cents: number
        }
        Update: {
          created_at?: string
          id?: string
          order_id?: string
          product_id?: string
          qty?: number
          selected_options?: Json
          unit_price_cents?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          address_id: string | null
          archived_at: string | null
          cash_collected: boolean
          created_at: string
          delivery_completed_at: string | null
          delivery_driver_id: string | null
          delivery_fee_cents: number
          delivery_proof_path: string | null
          delivery_started_at: string | null
          fulfillment: Database["estacion33"]["Enums"]["fulfillment_type"]
          id: string
          mp_payment_id: string | null
          mp_preference_id: string | null
          notes: string | null
          payment_status: Database["estacion33"]["Enums"]["payment_status"]
          scheduled_for: string
          status: Database["estacion33"]["Enums"]["order_status"]
          subtotal_cents: number
          total_cents: number
          updated_at: string
          user_id: string | null
        }
        Insert: {
          address_id?: string | null
          archived_at?: string | null
          cash_collected?: boolean
          created_at?: string
          delivery_completed_at?: string | null
          delivery_driver_id?: string | null
          delivery_fee_cents?: number
          delivery_proof_path?: string | null
          delivery_started_at?: string | null
          fulfillment: Database["estacion33"]["Enums"]["fulfillment_type"]
          id?: string
          mp_payment_id?: string | null
          mp_preference_id?: string | null
          notes?: string | null
          payment_status?: Database["estacion33"]["Enums"]["payment_status"]
          scheduled_for: string
          status?: Database["estacion33"]["Enums"]["order_status"]
          subtotal_cents: number
          total_cents: number
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          address_id?: string | null
          archived_at?: string | null
          cash_collected?: boolean
          created_at?: string
          delivery_completed_at?: string | null
          delivery_driver_id?: string | null
          delivery_fee_cents?: number
          delivery_proof_path?: string | null
          delivery_started_at?: string | null
          fulfillment?: Database["estacion33"]["Enums"]["fulfillment_type"]
          id?: string
          mp_payment_id?: string | null
          mp_preference_id?: string | null
          notes?: string | null
          payment_status?: Database["estacion33"]["Enums"]["payment_status"]
          scheduled_for?: string
          status?: Database["estacion33"]["Enums"]["order_status"]
          subtotal_cents?: number
          total_cents?: number
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_address_id_fkey"
            columns: ["address_id"]
            isOneToOne: false
            referencedRelation: "addresses"
            referencedColumns: ["id"]
          },
        ]
      }
      product_options: {
        Row: {
          id: string
          multi: boolean
          name: string
          product_id: string
          required: boolean
          sort_order: number
        }
        Insert: {
          id?: string
          multi?: boolean
          name: string
          product_id: string
          required?: boolean
          sort_order?: number
        }
        Update: {
          id?: string
          multi?: boolean
          name?: string
          product_id?: string
          required?: boolean
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "product_options_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          available: boolean
          base_price_cents: number
          category_id: string
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          name: string
          slug: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          available?: boolean
          base_price_cents: number
          category_id: string
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          name: string
          slug: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          available?: boolean
          base_price_cents?: number
          category_id?: string
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          name?: string
          slug?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          always_on_gps: boolean
          created_at: string
          full_name: string | null
          id: string
          is_admin: boolean
          is_repartidor: boolean
          locale: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          always_on_gps?: boolean
          created_at?: string
          full_name?: string | null
          id: string
          is_admin?: boolean
          is_repartidor?: boolean
          locale?: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          always_on_gps?: boolean
          created_at?: string
          full_name?: string | null
          id?: string
          is_admin?: boolean
          is_repartidor?: boolean
          locale?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      reservations: {
        Row: {
          created_at: string
          guest_name: string
          id: string
          notes: string | null
          party_size: number
          phone: string
          slot_at: string
          status: Database["estacion33"]["Enums"]["reservation_status"]
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          guest_name: string
          id?: string
          notes?: string | null
          party_size: number
          phone: string
          slot_at: string
          status?: Database["estacion33"]["Enums"]["reservation_status"]
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          guest_name?: string
          id?: string
          notes?: string | null
          party_size?: number
          phone?: string
          slot_at?: string
          status?: Database["estacion33"]["Enums"]["reservation_status"]
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      service_windows: {
        Row: {
          active: boolean
          closes: string
          created_at: string
          dow: number
          id: string
          opens: string
        }
        Insert: {
          active?: boolean
          closes: string
          created_at?: string
          dow: number
          id?: string
          opens: string
        }
        Update: {
          active?: boolean
          closes?: string
          created_at?: string
          dow?: number
          id?: string
          opens?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: { Args: never; Returns: boolean }
    }
    Enums: {
      fulfillment_type: "delivery" | "pickup"
      order_status:
        | "pending"
        | "paid"
        | "preparing"
        | "ready"
        | "out_for_delivery"
        | "delivered"
        | "cancelled"
      payment_status: "pending" | "paid" | "failed" | "refunded"
      reservation_status: "pending" | "confirmed" | "cancelled" | "no_show"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  estacion33: {
    Enums: {
      fulfillment_type: ["delivery", "pickup"],
      order_status: [
        "pending",
        "paid",
        "preparing",
        "ready",
        "out_for_delivery",
        "delivered",
        "cancelled",
      ],
      payment_status: ["pending", "paid", "failed", "refunded"],
      reservation_status: ["pending", "confirmed", "cancelled", "no_show"],
    },
  },
} as const
