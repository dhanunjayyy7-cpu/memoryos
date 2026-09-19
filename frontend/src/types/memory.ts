export type MemoryType = "knowledge" | "idea" | "decision" | "work_context" | "unresolved"

export interface Memory {
  memoryId: string
  userId: string
  projectId: string
  type: MemoryType
  title: string
  summary: string
  content: string
  source: string
  sourceUrl: string
  s3Key: string
  createdAt: string
  importance: number
}

export interface MemoryContext {
  id: string
  name: string
  memoryCount: number
}

export interface ConnectedSource {
  id: string
  name: string
}

export interface ActivityItem {
  id: string
  label: string
  timestamp: string
}
