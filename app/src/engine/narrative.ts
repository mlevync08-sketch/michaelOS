import type { ExecutiveNarrative } from "../types/narrative"

export function buildExecutiveNarrative(input: {
  missionTitle: string
  missionDetail: string
  whyToday: string
  recommendation: string
  confidence: number
}): ExecutiveNarrative {
  return {
    headline: input.missionTitle,

    executiveJudgment: `${input.missionDetail}

${input.whyToday}`,

    supportingEvidence: [
      input.whyToday,
    ],

    recommendation: input.recommendation,

    confidence: input.confidence,

    generated_at: new Date().toISOString(),
  }
}