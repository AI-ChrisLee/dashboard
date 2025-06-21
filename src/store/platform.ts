import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

// Types for our platform modules
interface Idea {
  id: string
  content: string
  category?: string
  tags?: string[]
  createdAt: Date
}

interface Script {
  id: string
  title: string
  content: string
  status: 'draft' | 'in_progress' | 'completed' | 'archived'
  version: number
  wordCount: number
  estimatedDuration?: number
  createdAt: Date
  updatedAt: Date
}

interface Project {
  id: string
  title: string
  description?: string
  scriptId?: string
  status: 'planning' | 'filming' | 'editing' | 'published'
  youtubeVideoId?: string
  createdAt: Date
  updatedAt: Date
}

interface PlatformState {
  // Current active items
  currentIdea: Idea | null
  currentScript: Script | null
  currentProject: Project | null
  
  // Module states
  discoverySearch: string
  discoveryFilters: any
  
  // Actions
  setCurrentIdea: (idea: Idea | null) => void
  setCurrentScript: (script: Script | null) => void
  setCurrentProject: (project: Project | null) => void
  setDiscoverySearch: (search: string) => void
  setDiscoveryFilters: (filters: any) => void
  
  // Workflow state
  workflowStep: 'discovery' | 'scripting' | 'editing' | 'analyze'
  setWorkflowStep: (step: 'discovery' | 'scripting' | 'editing' | 'analyze') => void
  
  // User preferences
  preferences: {
    autoSaveInterval: number
    emailNotifications: {
      performanceAlerts: boolean
      weeklySummary: boolean
      milestoneAchievements: boolean
    }
  }
  updatePreferences: (prefs: Partial<PlatformState['preferences']>) => void
}

export const usePlatformStore = create<PlatformState>()(
  persist(
    (set) => ({
      // Initial state
      currentIdea: null,
      currentScript: null,
      currentProject: null,
      discoverySearch: '',
      discoveryFilters: {},
      workflowStep: 'discovery',
      preferences: {
        autoSaveInterval: 30,
        emailNotifications: {
          performanceAlerts: true,
          weeklySummary: true,
          milestoneAchievements: true,
        },
      },
      
      // Actions
      setCurrentIdea: (idea) => set({ currentIdea: idea }),
      setCurrentScript: (script) => set({ currentScript: script }),
      setCurrentProject: (project) => set({ currentProject: project }),
      setDiscoverySearch: (search) => set({ discoverySearch: search }),
      setDiscoveryFilters: (filters) => set({ discoveryFilters: filters }),
      setWorkflowStep: (step) => set({ workflowStep: step }),
      updatePreferences: (prefs) =>
        set((state) => ({
          preferences: {
            ...state.preferences,
            ...prefs,
            emailNotifications: {
              ...state.preferences.emailNotifications,
              ...(prefs.emailNotifications || {}),
            },
          },
        })),
    }),
    {
      name: 'youtube-platform-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        // Only persist certain parts of the state
        discoverySearch: state.discoverySearch,
        discoveryFilters: state.discoveryFilters,
        preferences: state.preferences,
        workflowStep: state.workflowStep,
      }),
    }
  )
)