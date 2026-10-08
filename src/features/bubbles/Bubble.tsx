import type { LucideIcon } from "lucide-react";
import { useRef, type CSSProperties, type MouseEvent, type PointerEvent } from "react";
import { Link } from "react-router";
import type { BubblePlacement } from "../../core/layout/placeBubbles.ts";
import { useLocalizedPath } from "../../i18n/useLanguage.ts";
import type { BubbleId } from "./bubbleState.ts";
import styles from "./Bubble.module.css";

/** What a bubble shows and the page it opens: a project, or the contact page. */
export interface BubbleItem {
  /** Unique among the bubbles of the field. */
  readonly id: BubbleId;
  /** Name shown in the panel. */
  readonly name: string;
  /** One-line description, already in the visitor's language. */
  readonly summary: string;
  /** Lucide icon shown in the bubble. */
  readonly icon: LucideIcon;
  /** Color of the bubble (at least 7:1 on the background). */
  readonly accentColor: string;
  /** Page it opens, without the language, e.g. `"/projects/wordeul"`. */
  readonly path: string;
  /** Draws a second ring, so that the bubble stands apart from the projects. */
  readonly distinct?: boolean;
}

/** Data and callbacks of one bubble; it knows nothing about the field's state machine. */
interface BubbleProps {
  /** What the bubble shows and opens. */
  readonly item: BubbleItem;
  /** Position of the bubble and opening side of its panel. */
  readonly placement: BubblePlacement;
  /** `true` when the panel is open. */
  readonly expanded: boolean;
  /** Asks to open the panel. */
  readonly onExpand: () => void;
  /** Asks to close the panel. */
  readonly onCollapse: () => void;
  /** Tells that the page of the bubble is being opened. */
  readonly onNavigate: () => void;
}

/**
 * Round bubble of a project or of the contact page: its icon at rest, its
 * name and summary in a panel. The panel opens on hover, keyboard focus or a
 * first tap; a second tap, a click or Enter opens its page. The text stays
 * readable by screen readers even while the panel is closed.
 */
export function Bubble({
  item,
  placement,
  expanded,
  onExpand,
  onCollapse,
  onNavigate,
}: BubbleProps) {
  // Read at pointer down, before focus or click change anything.
  const lastPointerType = useRef("");
  const expandedAtPointerDown = useRef(false);
  const localize = useLocalizedPath();
  const Icon = item.icon;
  // Custom properties are not part of React's CSSProperties type, hence the cast.
  const style = {
    left: placement.x,
    top: placement.y,
    "--accent": item.accentColor,
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
      to={localize(item.path)}
      className={styles.bubble}
      style={style}
      data-bubble=""
      data-distinct={item.distinct === true}
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
        <span className={styles.name}>{item.name}</span>{" "}
        <span className={styles.summary}>{item.summary}</span>
      </span>
    </Link>
  );
}
