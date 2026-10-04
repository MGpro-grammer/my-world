import type { CSSProperties } from "react";
import { Link } from "react-router";
import type { BubblePlacement } from "../../core/layout/placeBubbles.ts";
import type { Project } from "../../data/projects.ts";
import styles from "./ProjectBubble.module.css";

/** Data needed to draw one bubble; nothing more, so the component stays reusable. */
interface ProjectBubbleProps {
  /** Project shown by the bubble. */
  readonly project: Project;
  /** One-line description, already in the visitor's language. */
  readonly summary: string;
  /** Position of the bubble and opening side of its panel. */
  readonly placement: BubblePlacement;
}

/**
 * Round bubble of a project: its icon at rest, its name and summary in a
 * panel that opens on hover or keyboard focus. The whole bubble is a link to
 * the project page, and its text stays readable by screen readers even
 * while the panel is closed.
 */
export function ProjectBubble({ project, summary, placement }: ProjectBubbleProps) {
  const Icon = project.icon;
  // Custom properties are not part of React's CSSProperties type, hence the cast.
  const style = {
    left: placement.x,
    top: placement.y,
    "--accent": project.accentColor,
    "--x": `${placement.x}px`,
  } as CSSProperties;

  return (
    <Link
      to={`/projects/${project.id}`}
      className={styles.bubble}
      style={style}
      data-expand-x={placement.expandX}
      data-expand-y={placement.expandY}
    >
      <span className={styles.icon}>
        <Icon size={28} aria-hidden="true" />
      </span>
      <span className={styles.panel}>
        <span className={styles.name}>{project.name}</span>{" "}
        <span className={styles.summary}>{summary}</span>
      </span>
    </Link>
  );
}
