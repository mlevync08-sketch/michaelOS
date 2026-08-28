import { useState } from "react"
import type { ExecutiveState } from "../../types/executiveState"
import type { ExecutiveRecommendationNode } from "../../types/recommendationGraph"
import DetailDrawer from "./DetailDrawer"
import "./ExecutiveHome.css"

type Props = {
  state: ExecutiveState
}

type DrawerContent = {
  eyebrow: string
  title: string
  body: string
}

function ageLabel(date: string | null) {
  if (!date) return "Open"

  const days = Math.max(
    0,
    Math.floor(
      (Date.now() - new Date(date).getTime()) /
        86400000
    )
  )

  if (days === 0) return "Today"

  return `${days} day${days === 1 ? "" : "s"}`
}

function engineLabel(engine: string) {
  return engine
    .replace("_", " ")
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase()
    )
}

function recommendationBody(
  recommendation: ExecutiveRecommendationNode
) {
  const evidence =
    recommendation.evidence.length > 0
      ? recommendation.evidence
          .map(
            (item) =>
              `${item.label}: ${item.detail}`
          )
          .join(" ")
      : "No supporting evidence is currently attached."

  return `${recommendation.why} ${evidence}`
}

export default function ExecutiveHome({
  state,
}: Props) {
  const [drawer, setDrawer] =
    useState<DrawerContent | null>(null)

  const {
    coordinatedMission,
    executiveNarrativeV2,
    executiveCoordinator,
    recommendationGraph,
    capacityIntelligence,
    waitingOn,
    metrics,
  } = state

  const topRecommendations =
    executiveCoordinator.rankedRecommendations
      .filter(
        (item) =>
          item.id !==
          executiveCoordinator.consensus.primary?.id
      )
      .slice(0, 3)

  const supportingEngines =
    coordinatedMission.supportingEngines

  const tradeoff =
    coordinatedMission.tradeoff ??
    executiveCoordinator.tradeoffs[0]?.detail ??
    null

  const focusScore =
    capacityIntelligence.readinessScore

  return (
    <>
      <div className="atlas-shell atlas-home-v2">
        <section className="atlas-hero-grid">
          <article className="atlas-card atlas-mission atlas-mission-v2">
            <div className="atlas-card-inner">
              <div className="atlas-label-row">
                <span className="atlas-section-label">
                  TODAY&apos;S MISSION
                </span>

                <span className="atlas-confidence">
                  CONFIDENCE{" "}
                  <strong>
                    {coordinatedMission.confidence}%
                  </strong>
                </span>
              </div>

              <div className="atlas-consensus-row">
                <span className="atlas-consensus-pill">
                  {supportingEngines.length || 1}{" "}
                  {supportingEngines.length === 1
                    ? "ENGINE"
                    : "ENGINES"}{" "}
                  IN CONSENSUS
                </span>

                <span className="atlas-mission-score">
                  SCORE {coordinatedMission.score}
                </span>
              </div>

              <h2>{coordinatedMission.title}</h2>

              <p className="atlas-lead atlas-narrative-lead">
                {executiveNarrativeV2.brief}
              </p>

              <div className="atlas-next-move-callout">
                <small>ATLAS RECOMMENDS</small>
                <strong>
                  {coordinatedMission.nextMove}
                </strong>
              </div>

              <div className="atlas-reason-grid">
                <button
                  className="atlas-reason-box"
                  onClick={() =>
                    setDrawer({
                      eyebrow: "WHY TODAY",
                      title: coordinatedMission.title,
                      body: coordinatedMission.whyToday,
                    })
                  }
                >
                  <small>WHY TODAY</small>
                  <p>
                    {coordinatedMission.whyToday}
                  </p>
                </button>

                <button
                  className="atlas-reason-box"
                  onClick={() =>
                    setDrawer({
                      eyebrow: "IF IGNORED",
                      title: coordinatedMission.title,
                      body: coordinatedMission.ifIgnored,
                    })
                  }
                >
                  <small>IF IGNORED</small>
                  <p>
                    {coordinatedMission.ifIgnored}
                  </p>
                </button>

                <button
                  className="atlas-reason-box"
                  onClick={() =>
                    setDrawer({
                      eyebrow: "SUCCESS LOOKS LIKE",
                      title: coordinatedMission.title,
                      body:
                        coordinatedMission.successLooksLike,
                    })
                  }
                >
                  <small>SUCCESS LOOKS LIKE</small>
                  <p>
                    {
                      coordinatedMission.successLooksLike
                    }
                  </p>
                </button>
              </div>

              {tradeoff && (
                <button
                  className="atlas-tradeoff-strip"
                  onClick={() =>
                    setDrawer({
                      eyebrow: "EXECUTIVE TRADEOFF",
                      title: "What Atlas is balancing",
                      body: tradeoff,
                    })
                  }
                >
                  <span>TRADEOFF</span>
                  <p>{tradeoff}</p>
                </button>
              )}

              <div className="atlas-action-row">
                <button className="atlas-primary-btn">
                  Mark mission complete
                </button>

                <button
                  className="atlas-secondary-btn"
                  onClick={() =>
                    setDrawer({
                      eyebrow: "ATLAS EVIDENCE",
                      title: "Why Atlas chose this",
                      body:
                        executiveCoordinator.consensus
                          .primary
                          ? recommendationBody(
                              executiveCoordinator
                                .consensus.primary
                            )
                          : coordinatedMission.whyToday,
                    })
                  }
                >
                  Show evidence
                </button>

                <span className="atlas-action-note">
                  Estimated focus block:{" "}
                  {
                    coordinatedMission.estimatedFocusMinutes
                  }{" "}
                  min
                </span>
              </div>
            </div>
          </article>

          <aside className="atlas-card atlas-focus-card atlas-focus-card-v2">
            <span className="atlas-section-label">
              EXECUTIVE READINESS
            </span>

            <div
              className="atlas-score-ring"
              style={{
                background: `conic-gradient(
                  #0aa6a6 0 ${focusScore}%,
                  #e7eff0 ${focusScore}% 100%
                )`,
              }}
            >
              <div className="atlas-score-inner">
                <strong>{focusScore}</strong>
                <span>READINESS</span>
              </div>
            </div>

            <h3>
              {capacityIntelligence.state ===
              "ready"
                ? "Ready for high-leverage depth"
                : capacityIntelligence.state ===
                  "balanced"
                ? "Protect the first focus block"
                : "Narrow the day"}
            </h3>

            <p>
              {
                capacityIntelligence.recommendation
                  .detail
              }
            </p>

            <div className="atlas-engine-consensus">
              <small>SUPPORTING ENGINES</small>

              <div className="atlas-engine-list">
                {supportingEngines.length > 0 ? (
                  supportingEngines.map((engine) => (
                    <span key={engine}>
                      {engineLabel(engine)}
                    </span>
                  ))
                ) : (
                  <span>Executive</span>
                )}
              </div>
            </div>

            <div className="atlas-metric-row">
              <div className="atlas-mini-metric">
                <strong>
                  {
                    executiveCoordinator.stats
                      .recommendations
                  }
                </strong>
                <small>recommendations</small>
              </div>

              <div className="atlas-mini-metric">
                <strong>
                  {
                    executiveCoordinator.stats
                      .conflicts
                  }
                </strong>
                <small>conflicts</small>
              </div>

              <div className="atlas-mini-metric">
                <strong>
                  {
                    executiveCoordinator.stats
                      .enginesRepresented
                  }
                </strong>
                <small>engines live</small>
              </div>
            </div>
          </aside>
        </section>

        <div className="atlas-section-head">
          <div>
            <h3>
              Highest leverage after the mission
            </h3>

            <p>
              Coordinated recommendations ranked
              across every intelligence engine.
            </p>
          </div>

          <span className="atlas-graph-status">
            {recommendationGraph.stats.total} GRAPH
            NODES
          </span>
        </div>

        <section className="atlas-leverage-grid">
          {topRecommendations.map(
            (recommendation, index) => (
              <button
                className="atlas-card atlas-leverage-card atlas-recommendation-card"
                key={recommendation.id}
                onClick={() =>
                  setDrawer({
                    eyebrow:
                      "EXECUTIVE RECOMMENDATION",
                    title: recommendation.title,
                    body:
                      recommendationBody(
                        recommendation
                      ),
                  })
                }
              >
                <div className="atlas-rank">
                  {String(index + 1).padStart(
                    2,
                    "0"
                  )}
                </div>

                <span
                  className={`atlas-project-tag ${recommendation.priority}`}
                >
                  ●{" "}
                  {recommendation.priority.toUpperCase()}
                </span>

                <div className="atlas-card-engine">
                  {recommendation.supportingEngines
                    .map(engineLabel)
                    .join(" + ")}
                </div>

                <h4>{recommendation.title}</h4>

                <p>{recommendation.summary}</p>

                <div className="atlas-recommendation-metrics">
                  <span>
                    Score{" "}
                    <strong>
                      {recommendation.score}
                    </strong>
                  </span>

                  <span>
                    Confidence{" "}
                    <strong>
                      {recommendation.confidence}%
                    </strong>
                  </span>
                </div>

                <div className="atlas-nextline">
                  <strong>Next move:</strong>{" "}
                  {recommendation.nextMove}
                </div>
              </button>
            )
          )}

          {topRecommendations.length === 0 && (
            <div className="atlas-card atlas-empty-recommendations">
              Atlas has no secondary recommendations
              right now. Protect the mission.
            </div>
          )}
        </section>

        <section className="atlas-bottom-grid atlas-bottom-grid-v2">
          <article className="atlas-card atlas-compact-card">
            <div className="atlas-section-head compact">
              <div>
                <h3>Executive judgment</h3>

                <p>
                  What the Coordinator sees across
                  engines.
                </p>
              </div>
            </div>

            <div className="atlas-judgment-block">
              <small>COORDINATOR NARRATIVE</small>

              <strong>
                {
                  executiveCoordinator
                    .coordinatorNarrative.headline
                }
              </strong>

              <p>
                {
                  executiveCoordinator
                    .coordinatorNarrative.summary
                }
              </p>
            </div>

            <div className="atlas-judgment-row">
              <span>NEXT MOVE</span>

              <p>
                {
                  executiveCoordinator
                    .coordinatorNarrative.nextMove
                }
              </p>
            </div>

            <div className="atlas-judgment-row">
              <span>WHY</span>

              <p>
                {
                  executiveCoordinator
                    .coordinatorNarrative.why
                }
              </p>
            </div>
          </article>

          <article className="atlas-card atlas-compact-card">
            <div className="atlas-section-head compact">
              <div>
                <h3>Conflicts & tradeoffs</h3>

                <p>
                  Where Atlas sees competing signals.
                </p>
              </div>
            </div>

            {executiveCoordinator.conflicts.length >
            0 ? (
              executiveCoordinator.conflicts
                .slice(0, 3)
                .map((conflict) => (
                  <button
                    className="atlas-conflict-item"
                    key={conflict.id}
                    onClick={() =>
                      setDrawer({
                        eyebrow:
                          "COORDINATOR CONFLICT",
                        title: conflict.type,
                        body: conflict.description,
                      })
                    }
                  >
                    <div>
                      <span
                        className={`atlas-conflict-dot ${conflict.severity}`}
                      />
                      <strong>
                        {conflict.type.toUpperCase()}
                      </strong>
                    </div>

                    <p>
                      {conflict.description}
                    </p>
                  </button>
                ))
            ) : (
              <div className="atlas-no-conflict">
                <strong>
                  No material conflicts detected.
                </strong>

                <p>
                  The intelligence engines are
                  directionally aligned.
                </p>
              </div>
            )}
          </article>
        </section>

        <section className="atlas-card atlas-dependency-strip">
          <div className="atlas-section-head compact">
            <div>
              <h3>External drag</h3>

              <p>
                Dependencies still capable of changing
                the plan.
              </p>
            </div>

            <span className="atlas-dependency-count">
              {metrics.waitingOn} OPEN
            </span>
          </div>

          {waitingOn.length > 0 ? (
            <div className="atlas-waiting-grid">
              {waitingOn.slice(0, 4).map((item) => (
                <div
                  className="atlas-waiting-item"
                  key={item.id}
                >
                  <div className="atlas-waiting-top">
                    <strong>{item.person}</strong>

                    <span>
                      {ageLabel(item.requested_on)}
                    </span>
                  </div>

                  <p>{item.item}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="atlas-empty">
              No external dependencies are currently
              waiting.
            </div>
          )}
        </section>

        <section className="atlas-live-domain-strip atlas-live-domain-strip-v2">
          <div>
            <span>Graph Nodes</span>
            <strong>
              {recommendationGraph.stats.total}
            </strong>
          </div>

          <div>
            <span>Engines</span>
            <strong>
              {
                recommendationGraph.stats
                  .enginesRepresented
              }
            </strong>
          </div>

          <div>
            <span>Consensus</span>
            <strong>
              {
                executiveCoordinator.consensus
                  .engineCount
              }
            </strong>
          </div>

          <div>
            <span>Conflicts</span>
            <strong>
              {
                executiveCoordinator.stats.conflicts
              }
            </strong>
          </div>

          <div>
            <span>Tradeoffs</span>
            <strong>
              {
                executiveCoordinator.stats.tradeoffs
              }
            </strong>
          </div>

          <div>
            <span>Memories</span>
            <strong>{metrics.memories}</strong>
          </div>
        </section>
      </div>

      <DetailDrawer
        open={drawer !== null}
        eyebrow={drawer?.eyebrow ?? ""}
        title={drawer?.title ?? ""}
        onClose={() => setDrawer(null)}
      >
        <p>{drawer?.body}</p>
      </DetailDrawer>
    </>
  )
}
