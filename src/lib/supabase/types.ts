export interface Database {
  public: {
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
    Tables: {
      patterns: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          code: string;
          mode: "autopilot" | "manual";
          is_public: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          code: string;
          mode?: "autopilot" | "manual";
          is_public?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          code?: string;
          mode?: "autopilot" | "manual";
          is_public?: boolean;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "patterns_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      profiles: {
        Row: {
          id: string;
          username: string | null;
          display_name: string | null;
          avatar_url: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          username?: string | null;
          display_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
        };
        Update: {
          username?: string | null;
          display_name?: string | null;
          avatar_url?: string | null;
        };
        Relationships: [];
      };
    };
  };
}

// Convenience types
export type Pattern = Database["public"]["Tables"]["patterns"]["Row"];
export type PatternInsert = Database["public"]["Tables"]["patterns"]["Insert"];
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
