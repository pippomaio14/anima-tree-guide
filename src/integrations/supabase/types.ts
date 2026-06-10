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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      adopted_trees: {
        Row: {
          adopter_email: string | null
          adopter_name: string
          adopter_phone: string | null
          adoption_period: string | null
          created_at: string
          dedicated_to: string | null
          dedication_message: string | null
          id: string
          image_url: string | null
          latitude: number | null
          longitude: number | null
          published: boolean | null
          tree_number: string
          tree_species: string | null
          updated_at: string
        }
        Insert: {
          adopter_email?: string | null
          adopter_name: string
          adopter_phone?: string | null
          adoption_period?: string | null
          created_at?: string
          dedicated_to?: string | null
          dedication_message?: string | null
          id?: string
          image_url?: string | null
          latitude?: number | null
          longitude?: number | null
          published?: boolean | null
          tree_number: string
          tree_species?: string | null
          updated_at?: string
        }
        Update: {
          adopter_email?: string | null
          adopter_name?: string
          adopter_phone?: string | null
          adoption_period?: string | null
          created_at?: string
          dedicated_to?: string | null
          dedication_message?: string | null
          id?: string
          image_url?: string | null
          latitude?: number | null
          longitude?: number | null
          published?: boolean | null
          tree_number?: string
          tree_species?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      announcements: {
        Row: {
          content: string | null
          created_at: string
          id: string
          image_url: string | null
          published: boolean | null
          title: string
        }
        Insert: {
          content?: string | null
          created_at?: string
          id?: string
          image_url?: string | null
          published?: boolean | null
          title: string
        }
        Update: {
          content?: string | null
          created_at?: string
          id?: string
          image_url?: string | null
          published?: boolean | null
          title?: string
        }
        Relationships: []
      }
      articles: {
        Row: {
          category: string | null
          content: string | null
          created_at: string
          id: string
          image_url: string | null
          published: boolean | null
          title: string
        }
        Insert: {
          category?: string | null
          content?: string | null
          created_at?: string
          id?: string
          image_url?: string | null
          published?: boolean | null
          title: string
        }
        Update: {
          category?: string | null
          content?: string | null
          created_at?: string
          id?: string
          image_url?: string | null
          published?: boolean | null
          title?: string
        }
        Relationships: []
      }
      dichotomous_key_nodes: {
        Row: {
          characteristics: string[]
          created_at: string
          description: string | null
          hint: string | null
          id: string
          key_type: string
          node_id: string
          node_type: string
          option_a_label: string | null
          option_a_next: string | null
          option_b_label: string | null
          option_b_next: string | null
          question: string | null
          scientific_name: string | null
          species: string | null
          updated_at: string
        }
        Insert: {
          characteristics?: string[]
          created_at?: string
          description?: string | null
          hint?: string | null
          id?: string
          key_type: string
          node_id: string
          node_type: string
          option_a_label?: string | null
          option_a_next?: string | null
          option_b_label?: string | null
          option_b_next?: string | null
          question?: string | null
          scientific_name?: string | null
          species?: string | null
          updated_at?: string
        }
        Update: {
          characteristics?: string[]
          created_at?: string
          description?: string | null
          hint?: string | null
          id?: string
          key_type?: string
          node_id?: string
          node_type?: string
          option_a_label?: string | null
          option_a_next?: string | null
          option_b_label?: string | null
          option_b_next?: string | null
          question?: string | null
          scientific_name?: string | null
          species?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      event_bookings: {
        Row: {
          created_at: string
          event_id: string
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          event_id: string
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string
          event_id?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_bookings_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          booking_enabled: boolean | null
          created_at: string
          description: string | null
          event_date: string
          id: string
          image_url: string | null
          location: string | null
          max_participants: number | null
          published: boolean | null
          title: string
        }
        Insert: {
          booking_enabled?: boolean | null
          created_at?: string
          description?: string | null
          event_date: string
          id?: string
          image_url?: string | null
          location?: string | null
          max_participants?: number | null
          published?: boolean | null
          title: string
        }
        Update: {
          booking_enabled?: boolean | null
          created_at?: string
          description?: string | null
          event_date?: string
          id?: string
          image_url?: string | null
          location?: string | null
          max_participants?: number | null
          published?: boolean | null
          title?: string
        }
        Relationships: []
      }
      legal_pages: {
        Row: {
          content: string
          created_at: string
          id: string
          slug: string
          title: string
          updated_at: string
        }
        Insert: {
          content?: string
          created_at?: string
          id?: string
          slug: string
          title: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          slug?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      missions: {
        Row: {
          created_at: string
          description: string | null
          difficulty: string
          icon: string | null
          id: string
          objective: string | null
          points: number
          published: boolean
          sort_order: number
          tips: string[]
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          difficulty?: string
          icon?: string | null
          id?: string
          objective?: string | null
          points?: number
          published?: boolean
          sort_order?: number
          tips?: string[]
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          difficulty?: string
          icon?: string | null
          id?: string
          objective?: string | null
          points?: number
          published?: boolean
          sort_order?: number
          tips?: string[]
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      park_sections: {
        Row: {
          content: string | null
          created_at: string
          icon: string | null
          id: string
          image_url: string | null
          published: boolean | null
          sort_order: number
          title: string
          updated_at: string
        }
        Insert: {
          content?: string | null
          created_at?: string
          icon?: string | null
          id?: string
          image_url?: string | null
          published?: boolean | null
          sort_order?: number
          title: string
          updated_at?: string
        }
        Update: {
          content?: string | null
          created_at?: string
          icon?: string | null
          id?: string
          image_url?: string | null
          published?: boolean | null
          sort_order?: number
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          is_volunteer: boolean
          phone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          is_volunteer?: boolean
          phone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          is_volunteer?: boolean
          phone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      quiz_categories: {
        Row: {
          color: string | null
          created_at: string
          description: string | null
          icon: string | null
          id: string
          published: boolean
          sort_order: number
          title: string
          updated_at: string
        }
        Insert: {
          color?: string | null
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          published?: boolean
          sort_order?: number
          title: string
          updated_at?: string
        }
        Update: {
          color?: string | null
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          published?: boolean
          sort_order?: number
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      quiz_questions: {
        Row: {
          category_id: string
          correct_index: number
          created_at: string
          explanation: string | null
          id: string
          options: string[]
          question: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          category_id: string
          correct_index?: number
          created_at?: string
          explanation?: string | null
          id?: string
          options?: string[]
          question: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          category_id?: string
          correct_index?: number
          created_at?: string
          explanation?: string | null
          id?: string
          options?: string[]
          question?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "quiz_questions_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "quiz_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      tree_guess_items: {
        Row: {
          created_at: string
          hint: string | null
          id: string
          image_url: string
          published: boolean
          scientific_name: string | null
          sort_order: number
          species_name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          hint?: string | null
          id?: string
          image_url: string
          published?: boolean
          scientific_name?: string | null
          sort_order?: number
          species_name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          hint?: string | null
          id?: string
          image_url?: string
          published?: boolean
          scientific_name?: string | null
          sort_order?: number
          species_name?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      trees_public: {
        Row: {
          adopter_name: string | null
          adoption_period: string | null
          created_at: string | null
          dedicated_to: string | null
          dedication_message: string | null
          id: string | null
          image_url: string | null
          latitude: number | null
          longitude: number | null
          published: boolean | null
          tree_number: string | null
          tree_species: string | null
          updated_at: string | null
        }
        Insert: {
          adopter_name?: string | null
          adoption_period?: string | null
          created_at?: string | null
          dedicated_to?: string | null
          dedication_message?: string | null
          id?: string | null
          image_url?: string | null
          latitude?: never
          longitude?: never
          published?: boolean | null
          tree_number?: string | null
          tree_species?: string | null
          updated_at?: string | null
        }
        Update: {
          adopter_name?: string | null
          adoption_period?: string | null
          created_at?: string | null
          dedicated_to?: string | null
          dedication_message?: string | null
          id?: string | null
          image_url?: string | null
          latitude?: never
          longitude?: never
          published?: boolean | null
          tree_number?: string | null
          tree_species?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
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
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
