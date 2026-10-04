import { useEffect, useReducer, useRef } from "react";
import { placeBubbles, type Rect } from "../../core/layout/placeBubbles.ts";
import { PROJECTS } from "../../data/projects.ts";
import { useElementSize } from "../../hooks/useElementSize.ts";
import { useTranslations } from "../../i18n/useTranslations.ts";
import { bubbleReducer, INITIAL_BUBBLE_STATE, isExpanded } from "./bubbleState.ts";
import { ProjectBubble } from "./ProjectBubble.tsx";
import styles from "./BubbleField.module.css";

/** Radius of a bubble at rest, in CSS pixels; matches `--size` in ProjectBubble.module.css. */
const BUBBLE_RADIUS = 32;

/** Smallest distance between a bubble and the edges of the field, in CSS pixels. */
const FIELD_MARGIN = 24;

/** Fixed seed: the bubbles keep the same places from one visit to the next. */
const LAYOUT_SEED = 2026;

/** From this width, the middle of the screen is kept free of bubbles. */
const WIDE_SCREEN_MIN_WIDTH = 768;

/** Share of the width and height of the free middle area on wide screens. */
const FREE_CENTER_RATIO = 0.36;

/**
 * Area that holds one bubble per project, spread without overlap and placed
 * again whenever the area changes size. It owns the state machine that
 * decides which bubble is open, and is a navigation list for assistive
 * technologies.
 */
export function BubbleField() {
  const fieldRef = useRef<HTMLElement>(null);
  const { width, height } = useElementSize(fieldRef);
  const texts = useTranslations();
  const [state, dispatch] = useReducer(bubbleReducer, INITIAL_BUBBLE_STATE);

  // A tap anywhere outside the bubbles closes the open one.
  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (!(event.target instanceof Element) || event.target.closest("[data-bubble]") === null) {
        dispatch({ type: "collapseAll" });
      }
    };
    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, []);

  const placements = placeBubbles({
    width,
    height,
    count: PROJECTS.length,
    radius: BUBBLE_RADIUS,
    margin: FIELD_MARGIN,
    exclusions: freeAreas(width, height),
    seed: LAYOUT_SEED,
  });

  return (
    <nav ref={fieldRef} className={styles.field} aria-label={texts.home.projectsLabel}>
      {width > 0 && (
        <ul className={styles.list}>
          {PROJECTS.map((project, index) => (
            <li key={project.id}>
              <ProjectBubble
                project={project}
                summary={texts.projects[project.id].summary}
                placement={placements[index]}
                expanded={isExpanded(state, project.id)}
                onExpand={() => dispatch({ type: "expand", projectId: project.id })}
                onCollapse={() => dispatch({ type: "collapse", projectId: project.id })}
                onNavigate={() => dispatch({ type: "navigate", projectId: project.id })}
              />
            </li>
          ))}
        </ul>
      )}
    </nav>
  );
}

/**
 * Areas of the field kept free of bubbles.
 * @param width - Width of the field, in CSS pixels.
 * @param height - Height of the field, in CSS pixels.
 * @returns The middle of the field on wide screens; nothing on small ones.
 */
function freeAreas(width: number, height: number): Rect[] {
  if (width < WIDE_SCREEN_MIN_WIDTH) {
    return [];
  }
  const freeWidth = width * FREE_CENTER_RATIO;
  const freeHeight = height * FREE_CENTER_RATIO;
  return [
    {
      left: (width - freeWidth) / 2,
      top: (height - freeHeight) / 2,
      right: (width + freeWidth) / 2,
      bottom: (height + freeHeight) / 2,
    },
  ];
}
