import type { Signal } from "../types/signal"

export type SignalCluster = {
  key: string
  title: string
  signals: Signal[]
  signalCount: number
  highestImportance: Signal["importance"]
  averageConfidence: number
}

const importanceWeight: Record<Signal["importance"], number> = {
  low: 1,
  medium: 2,
  high: 3,
  critical: 4,
}

function getHighestImportance(
  signals: Signal[]
): Signal["importance"] {
  return [...signals]
    .sort(
      (a, b) =>
        importanceWeight[b.importance] -
        importanceWeight[a.importance]
    )[0]?.importance ?? "low"
}

function getAverageConfidence(
  signals: Signal[]
): number {
  if (signals.length === 0) return 0

  const total = signals.reduce(
    (sum, signal) => sum + signal.confidence,
    0
  )

  return Math.round(total / signals.length)
}

export function groupSignalsByProject(
  signals: Signal[]
): SignalCluster[] {
  const grouped = new Map<string, Signal[]>()

  signals.forEach((signal) => {
    if (!signal.related_project_id) return

    const existing =
      grouped.get(signal.related_project_id) ?? []

    grouped.set(signal.related_project_id, [
      ...existing,
      signal,
    ])
  })

  return Array.from(grouped.entries()).map(
    ([projectId, projectSignals]) => ({
      key: projectId,
      title: `Project ${projectId}`,
      signals: projectSignals,
      signalCount: projectSignals.length,
      highestImportance:
        getHighestImportance(projectSignals),
      averageConfidence:
        getAverageConfidence(projectSignals),
    })
  )
}

export function groupSignalsByPerson(
  signals: Signal[]
): SignalCluster[] {
  const grouped = new Map<string, Signal[]>()

  signals.forEach((signal) => {
    if (!signal.related_person) return

    const existing =
      grouped.get(signal.related_person) ?? []

    grouped.set(signal.related_person, [
      ...existing,
      signal,
    ])
  })

  return Array.from(grouped.entries()).map(
    ([person, personSignals]) => ({
      key: person,
      title: person,
      signals: personSignals,
      signalCount: personSignals.length,
      highestImportance:
        getHighestImportance(personSignals),
      averageConfidence:
        getAverageConfidence(personSignals),
    })
  )
}

export function discoverPatterns(
  signals: Signal[]
): SignalCluster[] {
  return [
    ...groupSignalsByProject(signals),
    ...groupSignalsByPerson(signals),
  ].sort((a, b) => {
    const importanceDifference =
      importanceWeight[b.highestImportance] -
      importanceWeight[a.highestImportance]

    if (importanceDifference !== 0) {
      return importanceDifference
    }

    return b.signalCount - a.signalCount
  })
}