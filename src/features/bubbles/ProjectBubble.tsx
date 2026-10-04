import { useRef, type CSSProperties, type MouseEvent, type PointerEvent } from "react";
import { Link } from "react-router";
import type { BubblePlacement } from "../../core/layout/placeBubbles.ts";
import type { Project } from "../../data/projects.ts";
import styles from "./ProjectBubble.module.css";

/** Data and callbacks of one bubble; it knows nothing about the field's state machine. */
interface ProjectBubbleProps {
  /** Project shown by the bubble. */
  readonly project: Project;
  /** One-line description, already in the visitor's language. */
  readonly summary: string;
  /** Position of the bubble and opening side of its panel. */
  readonly placement: BubblePlacement;
  /** `true` when the panel is open. */
  readonly expanded: boolean;
  /** Asks to open the panel. */
  readonly onExpand: () => void;
  /** Asks to close the panel. */
  readonly onCollapse: () => void;
  /** Tells that the project page is being opened. */
  readonly onNavigate: () => void;
}

/**
 * Round bubble of a project: its icon at rest, its name and summary in a
 * panel. The panel opens on hover, keyboard focus or a first tap; a second
 * tap, a click or Enter opens the project page. The text stays readable by
 * screen readers even while the panel is closed.
 */
export function ProjectBubble({
  project,
  summary,
  placement,
  expanded,
  onExpand,
  onCollapse,
  onNavigate,
}: ProjectBubbleProps) {
  // Read at pointer down, before focus or click change anything.
  const lastPointerType = useRef("");
  const expandedAtPointerDown = useRef(false);
  const Icon = project.icon;
  // Custom properties are not part of React's CSSProperties type, hence the cast.
  const style = {
    left: placement.x,
    top: placement.y,
    "--accent": project.accentColor,
    "--x": `${placement.x}px`,
  } as CSSProperties;

  const handlePointerDown = (event: PointerEvent) => {
    lastPointerType.current = event.pointerType;
    expandedAtPointerDown.current = expanded;
  };

  const handleClick = (event: MouseEvent) => {
    const firstTap = lastPointerType.current === "touch" && !expandedAtPointerDown.current;
    lastPointerType.current = "";
    if (firstTap) {
      // A touch screen has no hover: the first tap only opens the panel.
      event.preventDefault();
      onExpand();
      return;
    }
    onNavigate();
  };

  return (
    <Link
      to={`/projects/${project.id}`}
      className={styles.bubble}
      style={style}
      data-bubble=""
      data-expanded={expanded}
      data-expand-x={placement.expandX}
      data-expand-y={placement.expandY}
      onPointerDown={handlePointerDown}
      onPointerEnter={(event) => event.pointerType !== "touch" && onExpand()}
      onPointerLeave={(event) => event.pointerType !== "touch" && onCollapse()}
      onFocus={onExpand}
      onBlur={onCollapse}
      onKeyDown={(event) => event.key === "Escape" && onCollapse()}
      onClick={handleClick}
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
