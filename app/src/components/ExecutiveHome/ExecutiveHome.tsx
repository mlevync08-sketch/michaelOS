import type { ExecutiveDashboard } from "../../engine/brain"
import type { Project } from "../../types/project"
import ExecutiveBrief from "../ExecutiveBrief/ExecutiveBrief"
import "./ExecutiveHome.css"

type ExecutiveHomeProps = {
  dashboard: ExecutiveDashboard
  projects: Project[]
}

function discoveryTitle(
  title: string,
  projects: Project[]
): string {
  if (!title.startsWith("Project ")) return title

  const projectId = title.replace("Project ", "")
  const project = projects.find(
    (item) => item.id === projectId
  )

  return project?.name ?? "Portfolio Pattern"
}

function priorityLabel(project: Project): string {
  if (project.priority === "critical") return "Critical"
  if (project.priority === "high") return "High Priority"
  if (project.priority === "medium") return "Medium Priority"
  return "Low Priority"
}

export default function ExecutiveHome({
  dashboard,
  projects,
}: ExecutiveHomeProps) {
  const criticalProjects = projects.filter(
    (project) => project.priority === "critical"
  )

  const blockedProjects = projects.filter(
    (project) =>
      Boolean(project.blocker) &&
      project.blocker !== "None"
  )

  const agendaProjects = projects.slice(0, 4)

  return (
    <div className="executive-home">
      <header className="atlas-home-header">
        <div>
          <p className="atlas-overline">
            ATLAS EXECUTIVE INTELLIGENCE
          </p>

          <h1>Good morning, Michael.</h1>

          <p className="atlas-home-subtitle">
            Atlas has one recommendation for you today.
          </p>
        </div>

        <div className="atlas-focus-score">
          <span>Focus Score</span>
          <strong>{dashboard.metrics.focusScore}</strong>
          <small>Executive readiness</small>
        </div>
      </header>

      <div className="atlas-home-grid">
        <main className="atlas-primary">
          <section className="atlas-mission-shell">
            <ExecutiveBrief dashboard={dashboard} />
          </section>

          <section className="atlas-discovery-panel">
            <div className="atlas-section-heading">
              <div>
                <p className="atlas-overline">
                  ATLAS DISCOVERIES
                </p>
                <h2>What you may be missing</h2>
              </div>

              <span>
                {dashboard.discoveries.length} active
              </span>
            </div>

            {dashboard.discoveries.length > 0 ? (
              <div className="atlas-discovery-grid">
                {dashboard.discoveries
                  .slice(0, 3)
                  .map((discovery) => (
                    <article
                      className="atlas-discovery-card"
                      key={`${discovery.title}-${discovery.summary}`}
                    >
                      <div className="atlas-discovery-card-top">
                        <span
                          className={`atlas-insight-badge ${discovery.importance}`}
                        >
                          {discovery.importance}
                        </span>

                        <span className="atlas-confidence">
                          {discovery.confidence}% confidence
                        </span>
                      </div>

                      <h3>
                        {discoveryTitle(
                          discovery.title,
                          projects
                        )}
                      </h3>

                      <p>{discovery.summary}</p>

                      <footer>
                        {discovery.signalCount} supporting signals
                      </footer>
                    </article>
                  ))}
              </div>
            ) : (
              <div className="atlas-empty-state">
                Atlas is watching for emerging patterns.
              </div>
            )}
          </section>

          <section className="atlas-portfolio-panel">
            <div className="atlas-section-heading">
              <div>
                <p className="atlas-overline">
                  ACTIVE PORTFOLIO
                </p>
                <h2>Projects</h2>
              </div>

              <span>{projects.length} active</span>
            </div>

            <div className="atlas-project-grid">
              {projects.slice(0, 6).map((project) => (
                <article
                  className="atlas-project-card"
                  key={project.id}
                >
                  <div className="atlas-project-top">
                    <span
                      className={`atlas-health-dot ${project.health}`}
                    />

                    <span
                      className={`atlas-priority ${project.priority}`}
                    >
                      {priorityLabel(project)}
                    </span>
                  </div>

                  <h3>{project.name}</h3>

                  <p>
                    {project.next_milestone ??
                      project.next_action ??
                      "Advance the next meaningful milestone."}
                  </p>

                  {project.blocker &&
                    project.blocker !== "None" && (
                      <div className="atlas-project-blocker">
                        <span>Blocker</span>
                        <strong>{project.blocker}</strong>
                      </div>
                    )}

                  <footer>
                    <span>{project.owner ?? "Michael"}</span>
                    <span>{project.status}</span>
                  </footer>
                </article>
              ))}
            </div>
          </section>
        </main>

        <aside className="atlas-rail">
          <section className="atlas-rail-card">
            <div className="atlas-rail-heading">
              <div>
                <p className="atlas-overline">
                  TODAY&apos;S FLOW
                </p>
                <h2>Executive Agenda</h2>
              </div>
            </div>

            <div className="atlas-agenda-list">
              {agendaProjects.map((project, index) => (
                <div
                  className="atlas-agenda-item"
                  key={project.id}
                >
                  <span className="atlas-agenda-time">
                    {`${6 + index * 2}:00`}
                  </span>

                  <div>
                    <strong>{project.name}</strong>
                    <p>
                      {project.next_action ??
                        project.next_milestone ??
                        "Strategic review"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="atlas-rail-card">
            <div className="atlas-rail-heading">
              <div>
                <p className="atlas-overline">
                  DECISION QUEUE
                </p>
                <h2>Decisions</h2>
              </div>

              <span>{criticalProjects.length}</span>
            </div>

            {criticalProjects.length > 0 ? (
              <div className="atlas-rail-list">
                {criticalProjects.slice(0, 3).map((project) => (
                  <div
                    className="atlas-rail-item"
                    key={project.id}
                  >
                    <div>
                      <strong>{project.name}</strong>
                      <p>
                        {project.next_action ??
                          "Executive decision required"}
                      </p>
                    </div>

                    <span className="atlas-status critical">
                      Today
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="atlas-muted">
                No critical decisions waiting.
              </p>
            )}
          </section>

          <section className="atlas-rail-card">
            <div className="atlas-rail-heading">
              <div>
                <p className="atlas-overline">WAITING ON</p>
                <h2>Dependencies</h2>
              </div>

              <span>{blockedProjects.length}</span>
            </div>

            {blockedProjects.length > 0 ? (
              <div className="atlas-rail-list">
                {blockedProjects.slice(0, 4).map((project) => (
                  <div
                    className="atlas-rail-item"
                    key={project.id}
                  >
                    <div>
                      <strong>{project.name}</strong>
                      <p>{project.blocker}</p>
                    </div>

                    <span className="atlas-status waiting">
                      Waiting
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="atlas-muted">
                No active dependencies detected.
              </p>
            )}
          </section>

          <section className="atlas-rail-card atlas-capacity-card">
            <div>
              <p className="atlas-overline">
                EXECUTIVE CAPACITY
              </p>
              <h2>Ready to execute</h2>
            </div>

            <div className="atlas-capacity-score">
              <strong>{dashboard.metrics.focusScore}</strong>
              <span>/100</span>
            </div>

            <p>
              Health integration will eventually combine sleep,
              recovery, workload, and calendar intensity.
            </p>
          </section>
        </aside>
      </div>
    </div>
  )
}