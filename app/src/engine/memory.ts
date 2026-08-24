import type { MemoryRecord } from "../types/memory"

export function remember(
  memories: MemoryRecord[],
  memory: MemoryRecord
): MemoryRecord[] {
  return [...memories, memory]
}

export function recallByProject(
  memories: MemoryRecord[],
  projectId: string
): MemoryRecord[] {
  return memories.filter(
    (memory) => memory.related_project_id === projectId
  )
}

export function recallImportant(
  memories: MemoryRecord[]
): MemoryRecord[] {
  return memories.filter(
    (memory) =>
      memory.importance === "high" ||
      memory.importance === "critical"
  )
}