export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      audit_log: {
        Row: {
          created_at: string | null
          id: string
          new_data: Json | null
          old_data: Json | null
          operation: string
          table_name: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          new_data?: Json | null
          old_data?: Json | null
          operation: string
          table_name: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          new_data?: Json | null
          old_data?: Json | null
          operation?: string
          table_name?: string
          user_id?: string | null
        }
        Relationships: []
      }
      categories: {
        Row: {
          created_at: string
          descricao: string | null
          id: string
          nome: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          descricao?: string | null
          id?: string
          nome: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          descricao?: string | null
          id?: string
          nome?: string
          updated_at?: string
        }
        Relationships: []
      }
      clients: {
        Row: {
          cnpj: string
          created_at: string
          email: string | null
          estado: string | null
          id: string
          nome_fantasia: string
          razao_social: string
          segmento: string | null
          telefone: string | null
          updated_at: string
        }
        Insert: {
          cnpj: string
          created_at?: string
          email?: string | null
          estado?: string | null
          id?: string
          nome_fantasia: string
          razao_social: string
          segmento?: string | null
          telefone?: string | null
          updated_at?: string
        }
        Update: {
          cnpj?: string
          created_at?: string
          email?: string | null
          estado?: string | null
          id?: string
          nome_fantasia?: string
          razao_social?: string
          segmento?: string | null
          telefone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      commission_rules: {
        Row: {
          base_calculo: string
          categoria_id: string | null
          created_at: string
          id: string
          industria_id: string | null
          new_representante_id: string | null
          percentual_industria: number
          percentual_repasse: number
          representante_id: string
          updated_at: string
        }
        Insert: {
          base_calculo?: string
          categoria_id?: string | null
          created_at?: string
          id?: string
          industria_id?: string | null
          new_representante_id?: string | null
          percentual_industria: number
          percentual_repasse: number
          representante_id: string
          updated_at?: string
        }
        Update: {
          base_calculo?: string
          categoria_id?: string | null
          created_at?: string
          id?: string
          industria_id?: string | null
          new_representante_id?: string | null
          percentual_industria?: number
          percentual_repasse?: number
          representante_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "commission_rules_categoria_id_fkey"
            columns: ["categoria_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "commission_rules_industria_id_fkey"
            columns: ["industria_id"]
            isOneToOne: false
            referencedRelation: "industries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "commission_rules_new_representante_id_fkey"
            columns: ["new_representante_id"]
            isOneToOne: false
            referencedRelation: "representatives"
            referencedColumns: ["id"]
          },
        ]
      }
      industries: {
        Row: {
          cnpj: string
          created_at: string
          estado: string
          grupo: string
          id: string
          nome: string
          updated_at: string
        }
        Insert: {
          cnpj: string
          created_at?: string
          estado: string
          grupo: string
          id?: string
          nome: string
          updated_at?: string
        }
        Update: {
          cnpj?: string
          created_at?: string
          estado?: string
          grupo?: string
          id?: string
          nome?: string
          updated_at?: string
        }
        Relationships: []
      }
      payment_methods: {
        Row: {
          ativo: boolean | null
          created_at: string
          descricao: string | null
          id: string
          nome: string
          parcelas: Json | null
          prazo_dias: number | null
          taxa_fixa: number | null
          taxa_percentual: number | null
          tipo: string
          updated_at: string
        }
        Insert: {
          ativo?: boolean | null
          created_at?: string
          descricao?: string | null
          id?: string
          nome: string
          parcelas?: Json | null
          prazo_dias?: number | null
          taxa_fixa?: number | null
          taxa_percentual?: number | null
          tipo: string
          updated_at?: string
        }
        Update: {
          ativo?: boolean | null
          created_at?: string
          descricao?: string | null
          id?: string
          nome?: string
          parcelas?: Json | null
          prazo_dias?: number | null
          taxa_fixa?: number | null
          taxa_percentual?: number | null
          tipo?: string
          updated_at?: string
        }
        Relationships: []
      }
      products: {
        Row: {
          categoria_id: string | null
          codigo: string
          created_at: string
          ean: string | null
          id: string
          industria_id: string | null
          ncm: string | null
          nome: string
          percentual_ipi: number | null
          preco_base: number | null
          updated_at: string
        }
        Insert: {
          categoria_id?: string | null
          codigo: string
          created_at?: string
          ean?: string | null
          id?: string
          industria_id?: string | null
          ncm?: string | null
          nome: string
          percentual_ipi?: number | null
          preco_base?: number | null
          updated_at?: string
        }
        Update: {
          categoria_id?: string | null
          codigo?: string
          created_at?: string
          ean?: string | null
          id?: string
          industria_id?: string | null
          ncm?: string | null
          nome?: string
          percentual_ipi?: number | null
          preco_base?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "products_categoria_id_fkey"
            columns: ["categoria_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_industria_id_fkey"
            columns: ["industria_id"]
            isOneToOne: false
            referencedRelation: "industries"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      receivables: {
        Row: {
          comissao_industria: number | null
          created_at: string
          data_recebimento: string
          data_vencimento: string | null
          id: string
          nfe: string | null
          pedido: string | null
          representante_id: string
          sale_id: string | null
          status: string | null
          updated_at: string
          valor_recebido: number
        }
        Insert: {
          comissao_industria?: number | null
          created_at?: string
          data_recebimento: string
          data_vencimento?: string | null
          id?: string
          nfe?: string | null
          pedido?: string | null
          representante_id: string
          sale_id?: string | null
          status?: string | null
          updated_at?: string
          valor_recebido: number
        }
        Update: {
          comissao_industria?: number | null
          created_at?: string
          data_recebimento?: string
          data_vencimento?: string | null
          id?: string
          nfe?: string | null
          pedido?: string | null
          representante_id?: string
          sale_id?: string | null
          status?: string | null
          updated_at?: string
          valor_recebido?: number
        }
        Relationships: [
          {
            foreignKeyName: "receivables_sale_id_fkey"
            columns: ["sale_id"]
            isOneToOne: false
            referencedRelation: "sales"
            referencedColumns: ["id"]
          },
        ]
      }
      representatives: {
        Row: {
          created_at: string
          email: string | null
          id: string
          is_master: boolean | null
          nome: string
          telefone: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: string
          is_master?: boolean | null
          nome: string
          telefone?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          is_master?: boolean | null
          nome?: string
          telefone?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      sale_products: {
        Row: {
          codigo: string | null
          comissao: number | null
          created_at: string
          dropped: boolean | null
          id: string
          percentual_ipi: number | null
          preco_unitario: number
          produto_id: string | null
          produto_nome: string
          quantidade: number
          sale_id: string | null
          subtotal: number | null
          total: number
          updated_at: string
          valor_ipi: number | null
        }
        Insert: {
          codigo?: string | null
          comissao?: number | null
          created_at?: string
          dropped?: boolean | null
          id?: string
          percentual_ipi?: number | null
          preco_unitario: number
          produto_id?: string | null
          produto_nome: string
          quantidade: number
          sale_id?: string | null
          subtotal?: number | null
          total: number
          updated_at?: string
          valor_ipi?: number | null
        }
        Update: {
          codigo?: string | null
          comissao?: number | null
          created_at?: string
          dropped?: boolean | null
          id?: string
          percentual_ipi?: number | null
          preco_unitario?: number
          produto_id?: string | null
          produto_nome?: string
          quantidade?: number
          sale_id?: string | null
          subtotal?: number | null
          total?: number
          updated_at?: string
          valor_ipi?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_sale_products_produto"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sale_products_sale_id_fkey"
            columns: ["sale_id"]
            isOneToOne: false
            referencedRelation: "sales"
            referencedColumns: ["id"]
          },
        ]
      }
      sales: {
        Row: {
          cliente_id: string | null
          comissao: number
          condicao_pagamento: string
          created_at: string
          data_emissao: string
          id: string
          industria_id: string | null
          numero_pedido: string | null
          observacao: string | null
          previsao_entrega: string | null
          representante_id: string
          status: string
          tipo_pedido: string
          updated_at: string
          valor: number
        }
        Insert: {
          cliente_id?: string | null
          comissao?: number
          condicao_pagamento: string
          created_at?: string
          data_emissao: string
          id?: string
          industria_id?: string | null
          numero_pedido?: string | null
          observacao?: string | null
          previsao_entrega?: string | null
          representante_id: string
          status?: string
          tipo_pedido: string
          updated_at?: string
          valor?: number
        }
        Update: {
          cliente_id?: string | null
          comissao?: number
          condicao_pagamento?: string
          created_at?: string
          data_emissao?: string
          id?: string
          industria_id?: string | null
          numero_pedido?: string | null
          observacao?: string | null
          previsao_entrega?: string | null
          representante_id?: string
          status?: string
          tipo_pedido?: string
          updated_at?: string
          valor?: number
        }
        Relationships: [
          {
            foreignKeyName: "sales_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sales_industria_id_fkey"
            columns: ["industria_id"]
            isOneToOne: false
            referencedRelation: "industries"
            referencedColumns: ["id"]
          },
        ]
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
