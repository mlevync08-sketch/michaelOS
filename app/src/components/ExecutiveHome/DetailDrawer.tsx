import type { ReactNode } from "react"

type DetailDrawerProps = {
  open: boolean
  title: string
  eyebrow?: string
  children: ReactNode
  onClose: () => void
}

export default function DetailDrawer({
  open,
  title,
  eyebrow,
  children,
  onClose,
}: DetailDrawerProps) {
  if (!open) return null

  return (
    <div
      className="atlas-drawer-backdrop"
      onClick={onClose}
      role="presentation"
    >
      <aside
        className="atlas-detail-drawer"
        onClick={(event) => event.stopPropagation()}
        aria-label={title}
      >
        <header className="atlas-drawer-header">
          <div>
            {eyebrow && (
              <p className="atlas-overline">{eyebrow}</p>
            )}

            <h2>{title}</h2>
          </div>

          <button
            className="atlas-drawer-close"
            type="button"
            onClick={onClose}
            aria-label="Close detail drawer"
          >
            ×
          </button>
        </header>

        <div className="atlas-drawer-body">
          {children}
        </div>
      </aside>
    </div>
  )
}