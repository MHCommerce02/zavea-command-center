// AUTO-GENERATED from the live Supabase project (Zavea-Command-Center,
// xvvrrprigmhayyeglizg) via the Supabase MCP `generate_typescript_types`
// tool. Do not hand-edit — regenerate after any schema migration.

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      agent_runs: {
        Row: {
          agent_name: string
          completed_at: string | null
          error: string | null
          id: string
          input_context: Json
          output: Json | null
          started_at: string
          status: string
          workspace_id: string
        }
        Insert: {
          agent_name: string
          completed_at?: string | null
          error?: string | null
          id?: string
          input_context?: Json
          output?: Json | null
          started_at?: string
          status?: string
          workspace_id: string
        }
        Update: {
          agent_name?: string
          completed_at?: string | null
          error?: string | null
          id?: string
          input_context?: Json
          output?: Json | null
          started_at?: string
          status?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "agent_runs_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_conversations: {
        Row: {
          id: string
          started_at: string
          title: string | null
          user_id: string
          workspace_id: string
        }
        Insert: {
          id?: string
          started_at?: string
          title?: string | null
          user_id: string
          workspace_id: string
        }
        Update: {
          id?: string
          started_at?: string
          title?: string | null
          user_id?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_conversations_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_message_references: {
        Row: {
          message_id: string
          reference_id: string
          reference_type: string
          workspace_id: string
        }
        Insert: {
          message_id: string
          reference_id: string
          reference_type: string
          workspace_id: string
        }
        Update: {
          message_id?: string
          reference_id?: string
          reference_type?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_message_references_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "ai_messages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_message_references_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_messages: {
        Row: {
          content: string
          context_used: Json | null
          conversation_id: string
          created_at: string
          id: string
          role: string
          workspace_id: string
        }
        Insert: {
          content: string
          context_used?: Json | null
          conversation_id: string
          created_at?: string
          id?: string
          role: string
          workspace_id: string
        }
        Update: {
          content?: string
          context_used?: Json | null
          conversation_id?: string
          created_at?: string
          id?: string
          role?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "ai_conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_messages_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      business_events: {
        Row: {
          description: string
          detected_at: string
          entity_id: string | null
          id: string
          severity: string
          source_id: string
          status: string
          type: string
          workspace_id: string
        }
        Insert: {
          description: string
          detected_at?: string
          entity_id?: string | null
          id?: string
          severity: string
          source_id: string
          status?: string
          type: string
          workspace_id: string
        }
        Update: {
          description?: string
          detected_at?: string
          entity_id?: string | null
          id?: string
          severity?: string
          source_id?: string
          status?: string
          type?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "business_events_entity_id_fkey"
            columns: ["entity_id"]
            isOneToOne: false
            referencedRelation: "entities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "business_events_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "business_sources"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "business_events_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      business_sources: {
        Row: {
          config: Json
          connected_at: string | null
          created_at: string
          id: string
          name: string
          provider: string | null
          status: string
          workspace_id: string
        }
        Insert: {
          config?: Json
          connected_at?: string | null
          created_at?: string
          id?: string
          name: string
          provider?: string | null
          status?: string
          workspace_id: string
        }
        Update: {
          config?: Json
          connected_at?: string | null
          created_at?: string
          id?: string
          name?: string
          provider?: string | null
          status?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "business_sources_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      decision_entities: {
        Row: {
          decision_id: string
          entity_id: string
          workspace_id: string
        }
        Insert: {
          decision_id: string
          entity_id: string
          workspace_id: string
        }
        Update: {
          decision_id?: string
          entity_id?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "decision_entities_decision_id_fkey"
            columns: ["decision_id"]
            isOneToOne: false
            referencedRelation: "decisions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "decision_entities_entity_id_fkey"
            columns: ["entity_id"]
            isOneToOne: false
            referencedRelation: "entities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "decision_entities_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      decision_outcomes: {
        Row: {
          actual_outcome: string
          decision_id: string
          evaluation: string
          id: string
          notes: string | null
          outcome_metric_snapshot_id: string | null
          recorded_at: string
          workspace_id: string
        }
        Insert: {
          actual_outcome: string
          decision_id: string
          evaluation: string
          id?: string
          notes?: string | null
          outcome_metric_snapshot_id?: string | null
          recorded_at?: string
          workspace_id: string
        }
        Update: {
          actual_outcome?: string
          decision_id?: string
          evaluation?: string
          id?: string
          notes?: string | null
          outcome_metric_snapshot_id?: string | null
          recorded_at?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "decision_outcomes_decision_id_fkey"
            columns: ["decision_id"]
            isOneToOne: false
            referencedRelation: "decisions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "decision_outcomes_outcome_metric_snapshot_id_fkey"
            columns: ["outcome_metric_snapshot_id"]
            isOneToOne: false
            referencedRelation: "metric_snapshots"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "decision_outcomes_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      decision_tasks: {
        Row: {
          decision_id: string
          task_id: string
          workspace_id: string
        }
        Insert: {
          decision_id: string
          task_id: string
          workspace_id: string
        }
        Update: {
          decision_id?: string
          task_id?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "decision_tasks_decision_id_fkey"
            columns: ["decision_id"]
            isOneToOne: false
            referencedRelation: "decisions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "decision_tasks_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "decision_tasks_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      decisions: {
        Row: {
          decision_type: string
          description: string | null
          expected_outcome: string | null
          id: string
          made_at: string
          made_by: string
          reasoning: string
          recommendation_id: string | null
          title: string
          workspace_id: string
        }
        Insert: {
          decision_type: string
          description?: string | null
          expected_outcome?: string | null
          id?: string
          made_at?: string
          made_by: string
          reasoning: string
          recommendation_id?: string | null
          title: string
          workspace_id: string
        }
        Update: {
          decision_type?: string
          description?: string | null
          expected_outcome?: string | null
          id?: string
          made_at?: string
          made_by?: string
          reasoning?: string
          recommendation_id?: string | null
          title?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "decisions_recommendation_id_fkey"
            columns: ["recommendation_id"]
            isOneToOne: false
            referencedRelation: "recommendations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "decisions_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      entities: {
        Row: {
          created_at: string
          entity_type: string
          external_id: string | null
          id: string
          metadata: Json
          name: string
          source_id: string
          workspace_id: string
        }
        Insert: {
          created_at?: string
          entity_type: string
          external_id?: string | null
          id?: string
          metadata?: Json
          name: string
          source_id: string
          workspace_id: string
        }
        Update: {
          created_at?: string
          entity_type?: string
          external_id?: string | null
          id?: string
          metadata?: Json
          name?: string
          source_id?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "entities_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "business_sources"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "entities_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      event_evidence: {
        Row: {
          event_id: string
          metric_snapshot_id: string
          role: string
          workspace_id: string
        }
        Insert: {
          event_id: string
          metric_snapshot_id: string
          role?: string
          workspace_id: string
        }
        Update: {
          event_id?: string
          metric_snapshot_id?: string
          role?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_evidence_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "business_events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_evidence_metric_snapshot_id_fkey"
            columns: ["metric_snapshot_id"]
            isOneToOne: false
            referencedRelation: "metric_snapshots"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_evidence_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      fixed_calendar_events: {
        Row: {
          calendar_id: string | null
          end_time: string
          external_event_id: string | null
          id: string
          last_synced_at: string | null
          locked: boolean
          source_id: string
          start_time: string
          timezone: string
          title: string
          workspace_id: string
        }
        Insert: {
          calendar_id?: string | null
          end_time: string
          external_event_id?: string | null
          id?: string
          last_synced_at?: string | null
          locked?: boolean
          source_id: string
          start_time: string
          timezone?: string
          title: string
          workspace_id: string
        }
        Update: {
          calendar_id?: string | null
          end_time?: string
          external_event_id?: string | null
          id?: string
          last_synced_at?: string | null
          locked?: boolean
          source_id?: string
          start_time?: string
          timezone?: string
          title?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fixed_calendar_events_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "business_sources"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fixed_calendar_events_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      metric_definitions: {
        Row: {
          aggregation: string
          created_at: string
          display_name: string
          id: string
          key: string
          unit: string
          workspace_id: string
        }
        Insert: {
          aggregation: string
          created_at?: string
          display_name: string
          id?: string
          key: string
          unit: string
          workspace_id: string
        }
        Update: {
          aggregation?: string
          created_at?: string
          display_name?: string
          id?: string
          key?: string
          unit?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "metric_definitions_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      metric_snapshots: {
        Row: {
          entity_id: string
          granularity: string
          id: string
          metric_definition_id: string
          period_end: string
          period_start: string
          recorded_at: string
          source_id: string
          value: number
          workspace_id: string
        }
        Insert: {
          entity_id: string
          granularity: string
          id?: string
          metric_definition_id: string
          period_end: string
          period_start: string
          recorded_at?: string
          source_id: string
          value: number
          workspace_id: string
        }
        Update: {
          entity_id?: string
          granularity?: string
          id?: string
          metric_definition_id?: string
          period_end?: string
          period_start?: string
          recorded_at?: string
          source_id?: string
          value?: number
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "metric_snapshots_entity_id_fkey"
            columns: ["entity_id"]
            isOneToOne: false
            referencedRelation: "entities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "metric_snapshots_metric_definition_id_fkey"
            columns: ["metric_definition_id"]
            isOneToOne: false
            referencedRelation: "metric_definitions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "metric_snapshots_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "business_sources"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "metric_snapshots_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      provider_raw_payloads: {
        Row: {
          entity_id: string | null
          external_id: string | null
          id: string
          payload_type: string
          processed: boolean
          processed_at: string | null
          raw_payload: Json
          received_at: string
          source_id: string
          workspace_id: string
        }
        Insert: {
          entity_id?: string | null
          external_id?: string | null
          id?: string
          payload_type: string
          processed?: boolean
          processed_at?: string | null
          raw_payload: Json
          received_at?: string
          source_id: string
          workspace_id: string
        }
        Update: {
          entity_id?: string | null
          external_id?: string | null
          id?: string
          payload_type?: string
          processed?: boolean
          processed_at?: string | null
          raw_payload?: Json
          received_at?: string
          source_id?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "provider_raw_payloads_entity_id_fkey"
            columns: ["entity_id"]
            isOneToOne: false
            referencedRelation: "entities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "provider_raw_payloads_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "business_sources"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "provider_raw_payloads_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      recommendation_evidence: {
        Row: {
          metric_snapshot_id: string
          recommendation_id: string
          workspace_id: string
        }
        Insert: {
          metric_snapshot_id: string
          recommendation_id: string
          workspace_id: string
        }
        Update: {
          metric_snapshot_id?: string
          recommendation_id?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "recommendation_evidence_metric_snapshot_id_fkey"
            columns: ["metric_snapshot_id"]
            isOneToOne: false
            referencedRelation: "metric_snapshots"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recommendation_evidence_recommendation_id_fkey"
            columns: ["recommendation_id"]
            isOneToOne: false
            referencedRelation: "recommendations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recommendation_evidence_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      recommendations: {
        Row: {
          agent_run_id: string | null
          business_impact: number
          category: string
          confidence: number
          created_at: string
          data_quality: number
          estimated_duration_minutes: number
          event_id: string
          expected_impact: string | null
          id: string
          priority_score: number
          reasoning: string
          recommended_action: string
          severity: string
          status: string
          supersedes_id: string | null
          title: string
          urgency: number
          workspace_id: string
        }
        Insert: {
          agent_run_id?: string | null
          business_impact: number
          category: string
          confidence: number
          created_at?: string
          data_quality: number
          estimated_duration_minutes: number
          event_id: string
          expected_impact?: string | null
          id?: string
          priority_score: number
          reasoning: string
          recommended_action: string
          severity: string
          status?: string
          supersedes_id?: string | null
          title: string
          urgency: number
          workspace_id: string
        }
        Update: {
          agent_run_id?: string | null
          business_impact?: number
          category?: string
          confidence?: number
          created_at?: string
          data_quality?: number
          estimated_duration_minutes?: number
          event_id?: string
          expected_impact?: string | null
          id?: string
          priority_score?: number
          reasoning?: string
          recommended_action?: string
          severity?: string
          status?: string
          supersedes_id?: string | null
          title?: string
          urgency?: number
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "recommendations_agent_run_fk"
            columns: ["agent_run_id"]
            isOneToOne: false
            referencedRelation: "agent_runs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recommendations_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "business_events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recommendations_supersedes_id_fkey"
            columns: ["supersedes_id"]
            isOneToOne: false
            referencedRelation: "recommendations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recommendations_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      schedule_blocks: {
        Row: {
          block_type: string
          created_at: string
          fixed_calendar_event_id: string | null
          id: string
          period: unknown
          scheduled_task_id: string | null
          workspace_id: string
        }
        Insert: {
          block_type: string
          created_at?: string
          fixed_calendar_event_id?: string | null
          id?: string
          period: unknown
          scheduled_task_id?: string | null
          workspace_id: string
        }
        Update: {
          block_type?: string
          created_at?: string
          fixed_calendar_event_id?: string | null
          id?: string
          period?: unknown
          scheduled_task_id?: string | null
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "schedule_blocks_fixed_calendar_event_id_fkey"
            columns: ["fixed_calendar_event_id"]
            isOneToOne: false
            referencedRelation: "fixed_calendar_events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "schedule_blocks_scheduled_task_id_fkey"
            columns: ["scheduled_task_id"]
            isOneToOne: false
            referencedRelation: "scheduled_tasks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "schedule_blocks_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      schedule_runs: {
        Row: {
          created_at: string
          id: string
          run_date: string
          trigger_reason: string | null
          triggered_by: string
          workspace_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          run_date: string
          trigger_reason?: string | null
          triggered_by: string
          workspace_id: string
        }
        Update: {
          created_at?: string
          id?: string
          run_date?: string
          trigger_reason?: string | null
          triggered_by?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "schedule_runs_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      scheduled_tasks: {
        Row: {
          created_at: string
          end_time: string
          id: string
          schedule_run_id: string
          scheduled_by: string
          scheduling_reason: string | null
          start_time: string
          status: string
          task_id: string
          workspace_id: string
        }
        Insert: {
          created_at?: string
          end_time: string
          id?: string
          schedule_run_id: string
          scheduled_by: string
          scheduling_reason?: string | null
          start_time: string
          status?: string
          task_id: string
          workspace_id: string
        }
        Update: {
          created_at?: string
          end_time?: string
          id?: string
          schedule_run_id?: string
          scheduled_by?: string
          scheduling_reason?: string | null
          start_time?: string
          status?: string
          task_id?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "scheduled_tasks_schedule_run_id_fkey"
            columns: ["schedule_run_id"]
            isOneToOne: false
            referencedRelation: "schedule_runs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "scheduled_tasks_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "scheduled_tasks_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      task_dependencies: {
        Row: {
          dependency_type: string
          depends_on_task_id: string
          task_id: string
          workspace_id: string
        }
        Insert: {
          dependency_type?: string
          depends_on_task_id: string
          task_id: string
          workspace_id: string
        }
        Update: {
          dependency_type?: string
          depends_on_task_id?: string
          task_id?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "task_dependencies_depends_on_task_id_fkey"
            columns: ["depends_on_task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "task_dependencies_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "task_dependencies_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      task_status_history: {
        Row: {
          agent_run_id: string | null
          changed_at: string
          changed_by_type: string
          id: string
          new_status: Database["public"]["Enums"]["task_status"]
          old_status: Database["public"]["Enums"]["task_status"] | null
          reason: string | null
          task_id: string
          user_id: string | null
          workspace_id: string
        }
        Insert: {
          agent_run_id?: string | null
          changed_at?: string
          changed_by_type: string
          id?: string
          new_status: Database["public"]["Enums"]["task_status"]
          old_status?: Database["public"]["Enums"]["task_status"] | null
          reason?: string | null
          task_id: string
          user_id?: string | null
          workspace_id: string
        }
        Update: {
          agent_run_id?: string | null
          changed_at?: string
          changed_by_type?: string
          id?: string
          new_status?: Database["public"]["Enums"]["task_status"]
          old_status?: Database["public"]["Enums"]["task_status"] | null
          reason?: string | null
          task_id?: string
          user_id?: string | null
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "task_status_history_agent_run_fk"
            columns: ["agent_run_id"]
            isOneToOne: false
            referencedRelation: "agent_runs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "task_status_history_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "task_status_history_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      tasks: {
        Row: {
          accepted_at: string | null
          completed_at: string | null
          created_at: string
          description: string | null
          dismissed_at: string | null
          due_date: string | null
          estimated_duration_minutes: number
          id: string
          priority_score: number
          recommendation_id: string | null
          source: string
          status: Database["public"]["Enums"]["task_status"]
          title: string
          workspace_id: string
        }
        Insert: {
          accepted_at?: string | null
          completed_at?: string | null
          created_at?: string
          description?: string | null
          dismissed_at?: string | null
          due_date?: string | null
          estimated_duration_minutes: number
          id?: string
          priority_score: number
          recommendation_id?: string | null
          source: string
          status?: Database["public"]["Enums"]["task_status"]
          title: string
          workspace_id: string
        }
        Update: {
          accepted_at?: string | null
          completed_at?: string | null
          created_at?: string
          description?: string | null
          dismissed_at?: string | null
          due_date?: string | null
          estimated_duration_minutes?: number
          id?: string
          priority_score?: number
          recommendation_id?: string | null
          source?: string
          status?: Database["public"]["Enums"]["task_status"]
          title?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tasks_recommendation_id_fkey"
            columns: ["recommendation_id"]
            isOneToOne: false
            referencedRelation: "recommendations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      workspace_members: {
        Row: {
          created_at: string
          role: string
          user_id: string
          workspace_id: string
        }
        Insert: {
          created_at?: string
          role?: string
          user_id: string
          workspace_id: string
        }
        Update: {
          created_at?: string
          role?: string
          user_id?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "workspace_members_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      workspaces: {
        Row: {
          created_at: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_workspace_member: {
        Args: { p_workspace_id: string }
        Returns: boolean
      }
      update_task_status: {
        Args: { p_task_id: string; p_new_status: Database["public"]["Enums"]["task_status"]; p_reason?: string }
        Returns: Database["public"]["Tables"]["tasks"]["Row"]
      }
    }
    Enums: {
      task_status:
        | "recommended"
        | "accepted"
        | "scheduled"
        | "in_progress"
        | "completed"
        | "dismissed"
        | "blocked"
        | "deferred"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database["public"]

export type Tables<T extends keyof DefaultSchema["Tables"]> = DefaultSchema["Tables"][T]["Row"]
export type TablesInsert<T extends keyof DefaultSchema["Tables"]> = DefaultSchema["Tables"][T]["Insert"]
export type TablesUpdate<T extends keyof DefaultSchema["Tables"]> = DefaultSchema["Tables"][T]["Update"]
export type Enums<T extends keyof DefaultSchema["Enums"]> = DefaultSchema["Enums"][T]
