import type {
  ExecutiveCoordinatorOutput,
} from "../types/executiveCoordinator"

import type {
  CoordinatedMission,
  ExecutiveNarrativeV2,
} from "../types/missionSelection"

type Input = {
  coordinator: ExecutiveCoordinatorOutput

  capacity: {
    state: "ready" | "balanced" | "constrained"
    focusCapacityMinutes: number
  }
}

function clamp(value: number) {
  return Math.max(0, Math.min(100, value))
}

function estimateFocusMinutes(
  score: number,
  capacityMinutes: number
) {
  const target =
    score >= 90
      ? 90
      : score >= 75
      ? 75
      : score >= 60
      ? 60
      : 45

  return Math.max(
    30,
    Math.min(
      target,
      capacityMinutes
    )
  )
}

function buildIfIgnored(
  coordinator: ExecutiveCoordinatorOutput
) {
  const primary =
    coordinator.consensus.primary

  if (!primary) {
    return "No major consequence of delay is currently detected."
  }

  const sequenceConflict =
    coordinator.conflicts.find(
      (conflict) =>
        conflict.type === "sequence"
    )

  if (sequenceConflict) {
    return sequenceConflict.description
  }

  const capacityConflict =
    coordinator.conflicts.find(
      (conflict) =>
        conflict.type === "capacity"
    )

  if (capacityConflict) {
    return capacityConflict.description
  }

  if (primary.urgency >= 85) {
    return `Delay increases execution cost because "${primary.title}" is already highly time-sensitive.`
  }

  if (primary.impact >= 85) {
    return `Delay risks losing momentum on a high-impact executive priority.`
  }

  return `Deferring "${primary.title}" may reduce momentum and keep executive attention fragmented.`
}

function buildSuccess(
  coordinator: ExecutiveCoordinatorOutput
) {
  const primary =
    coordinator.consensus.primary

  if (!primary) {
    return "Success means making the next meaningful executive priority explicit."
  }

  if (
    coordinator.tradeoffs.some(
      (tradeoff) =>
        tradeoff.id === "tradeoff-sequence"
    )
  ) {
    return "Success means resolving the underlying decision first, then executing with clear ownership and no sequencing ambiguity."
  }

  return `Success means completing the recommended next move: ${primary.nextMove}`
}

function buildTradeoff(
  coordinator: ExecutiveCoordinatorOutput
) {
  return (
    coordinator.tradeoffs[0]?.detail ??
    null
  )
}

export function selectCoordinatedMission({
  coordinator,
  capacity,
}: Input): {
  mission: CoordinatedMission
  narrative: ExecutiveNarrativeV2
} {
  const primary =
    coordinator.consensus.primary

  const supporting =
    coordinator.consensus.supporting

  if (!primary) {
    const mission: CoordinatedMission = {
      id: "mission-none",
      title:
        "Define today's highest-leverage move.",
      summary:
        "MichaelOS does not yet have enough coordinated evidence to elevate one recommendation above the rest.",
      nextMove:
        "Add or clarify actions, decisions, dependencies, relationships, or memories.",
      whyToday:
        "A fragmented executive state reduces Atlas confidence and makes prioritization less reliable.",
      ifIgnored:
        "The day may default to reactive work rather than deliberate executive focus.",
      successLooksLike:
        "One explicit mission is identified and tied to a clear next move.",
      confidence: 55,
      score: 0,
      estimatedFocusMinutes: 30,
      supportingEngines: [],
      supportingRecommendations: [],
      tradeoff: null,
    }

    const narrative: ExecutiveNarrativeV2 = {
      greeting:
        "Good morning, Michael.",
      headline:
        mission.title,
      brief:
        mission.summary,
      why:
        mission.whyToday,
      nextMove:
        mission.nextMove,
      tradeoff: null,
      confidence:
        mission.confidence,
      engineConsensus: 0,
    }

    return {
      mission,
      narrative,
    }
  }

  const tradeoff =
    buildTradeoff(
      coordinator
    )

  const consensusBoost =
    Math.min(
      10,
      Math.max(
        0,
        coordinator.consensus
          .engineCount - 1
      ) * 3
    )

  const confidence =
    clamp(
      Math.round(
        coordinator.consensus
          .confidence +
          consensusBoost -
          coordinator.conflicts
            .filter(
              (conflict) =>
                conflict.severity ===
                  "critical" ||
                conflict.severity ===
                  "high"
            ).length *
            3
      )
    )

  const mission: CoordinatedMission =
    {
      id: `mission-${primary.id}`,

      title:
        primary.title,

      summary:
        primary.summary,

      nextMove:
        primary.nextMove,

      whyToday:
        coordinator.consensus
          .engineCount > 1
          ? `${coordinator.consensus.engineCount} intelligence engines reinforce this move. ${primary.why}`
          : primary.why,

      ifIgnored:
        buildIfIgnored(
          coordinator
        ),

      successLooksLike:
        buildSuccess(
          coordinator
        ),

      confidence,

      score:
        primary.score,

      estimatedFocusMinutes:
        estimateFocusMinutes(
          primary.score,
          capacity.focusCapacityMinutes
        ),

      supportingEngines:
        coordinator.consensus
          .supportingEngines,

      supportingRecommendations:
        [
          primary,
          ...supporting,
        ],

      tradeoff,
    }

  const engineLabel =
    mission.supportingEngines.length ===
    1
      ? "1 intelligence engine"
      : `${mission.supportingEngines.length} intelligence engines`

  const capacityLine =
    capacity.state === "constrained"
      ? ` Capacity is constrained, so Atlas recommends time-boxing the move to approximately ${mission.estimatedFocusMinutes} minutes.`
      : capacity.state === "balanced"
      ? ` Capacity is balanced; protect approximately ${mission.estimatedFocusMinutes} focused minutes.`
      : ` Capacity supports approximately ${mission.estimatedFocusMinutes} focused minutes.`

  const narrative: ExecutiveNarrativeV2 =
    {
      greeting:
        "Good morning, Michael.",

      headline:
        mission.title,

      brief:
        `${engineLabel} support this as today's highest-leverage move.${capacityLine}`,

      why:
        mission.whyToday,

      nextMove:
        mission.nextMove,

      tradeoff:
        mission.tradeoff,

      confidence:
        mission.confidence,

      engineConsensus:
        mission.supportingEngines
          .length,
    }

  return {
    mission,
    narrative,
  }
}
