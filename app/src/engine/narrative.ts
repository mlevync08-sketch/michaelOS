export type ExecutiveNarrative = {
  headline: string
  summary: string
  recommendation: string
  confidence: number
}

export function buildExecutiveNarrative(input: {
  missionTitle: string
  missionDetail: string
  whyToday: string
  ifIgnored: string
  nextMove: string
  confidence: number
}): ExecutiveNarrative {
  return {
    headline: input.missionTitle,

    summary:
      `${input.missionDetail} ${input.whyToday}`,

    recommendation:
      input.nextMove,

    confidence:
      input.confidence,
  }
}