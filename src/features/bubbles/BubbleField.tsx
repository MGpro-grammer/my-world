import { useEffect, useReducer, useRef } from "react";
import { placeBubbles, type Rect } from "../../core/layout/placeBubbles.ts";
import { CONTACT_BUBBLE } from "../../data/contact.ts";
import { PROJECTS } from "../../data/projects.ts";
import { useElementSize } from "../../hooks/useElementSize.ts";
import { useTranslations } from "../../i18n/useTranslations.ts";
import { bubbleReducer, INITIAL_BUBBLE_STATE, isExpanded } from "./bubbleState.ts";
import { Bubble, type BubbleItem } from "./Bubble.tsx";
import styles from "./BubbleField.module.css";

/** Radius of a bubble at rest, in CSS pixels; matches `--size` in Bubble.module.css. */
const BUBBLE_RADIUS = 32;

/** Smallest distance between a bubble and the edges of the field, in CSS pixels. */
const FIELD_MARGIN = 24;

/** Fixed seed: the bubbles keep the same places from one visit to the next. */
const LAYOUT_SEED = 2026;

/** From this width, the middle of the screen is kept free of bubbles. */
const WIDE_SCREEN_MIN_WIDTH = 768;

/** Share of the width and height of the free middle area on wide screens. */
const FREE_CENTER_RATIO = 0.36;

/** Corner kept free for the list button of the home page, in CSS pixels. */
const TOGGLE_AREA = { width: 180, height: 88 };

/**
 * Area that holds one bubble per project plus the contact bubble, spread
 * without overlap and placed again whenever the area changes size. It owns
 * the state machine that decides which bubble is open. For assistive
 * technologies, the projects form a navigation list and the contact bubble
 * follows it.
 */
export function BubbleField() {
  const fieldRef = useRef<HTMLDivElement>(null);
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

  const projectItems: BubbleItem[] = PROJECTS.map((project) => ({
    id: project.id,
    name: project.name,
    summary: texts.projects[project.id].summary,
    icon: project.icon,
    accentColor: project.accentColor,
    path: `/projects/${project.id}`,
  }));
  const contactItem: BubbleItem = {
    id: "contact",
    name: texts.contact.title,
    summary: texts.home.contactSummary,
    ...CONTACT_BUBBLE,
    path: "/contact",
    distinct: true,
  };

  const placements = placeBubbles({
    width,
    height,
    count: projectItems.length + 1,
    radius: BUBBLE_RADIUS,
    margin: FIELD_MARGIN,
    exclusions: freeAreas(width, height),
    seed: LAYOUT_SEED,
  });

  const renderBubble = (item: BubbleItem, index: number) => (
    <Bubble
      item={item}
      placement={placements[index]}
      expanded={isExpanded(state, item.id)}
      onExpand={() => dispatch({ type: "expand", bubbleId: item.id })}
      onCollapse={() => dispatch({ type: "collapse", bubbleId: item.id })}
      onNavigate={() => dispatch({ type: "navigate", bubbleId: item.id })}
    />
  );

  return (
    <div ref={fieldRef} className={styles.field}>
      {width > 0 && (
        <>
          <nav aria-label={texts.home.projectsLabel}>
            <ul className={styles.list}>
              {projectItems.map((item, index) => (
                <li key={item.id}>{renderBubble(item, index)}</li>
              ))}
            </ul>
          </nav>
          {renderBubble(contactItem, projectItems.length)}
        </>
      )}
    </div>
  );
}

/**
 * Areas of the field kept free of bubbles.
 * @param width - Width of the field, in CSS pixels.
 * @param height - Height of the field, in CSS pixels.
 * @returns The bottom-left corner of the list button, plus the middle of the
 * field on wide screens.
 */
function freeAreas(width: number, height: number): Rect[] {
  const toggleCorner: Rect = {
    left: 0,
    top: height - TOGGLE_AREA.height,
    right: TOGGLE_AREA.width,
    bottom: height,
  };
  if (width < WIDE_SCREEN_MIN_WIDTH) {
    return [toggleCorner];
  }
  const freeWidth = width * FREE_CENTER_RATIO;
  const freeHeight = height * FREE_CENTER_RATIO;
  return [
    toggleCorner,
    {
      left: (width - freeWidth) / 2,
      top: (height - freeHeight) / 2,
      right: (width + freeWidth) / 2,
      bottom: (height + freeHeight) / 2,
    },
  ];
}
