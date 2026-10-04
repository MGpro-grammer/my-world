import type { CSSProperties } from "react";
import { AUTHOR_NAME } from "../../data/author.ts";
import { useTranslations } from "../../i18n/useTranslations.ts";
import { INTRO_APPEAR_MS, INTRO_FADE_MS, type IntroStatus } from "./introState.ts";
import styles from "./IntroOverlay.module.css";

/** Props of the welcome screen while it is visible. */
interface IntroOverlayProps {
  /** `intro` while shown, `revealing` while fading out. */
  readonly status: Exclude<IntroStatus, "ready">;
  /** Called when the visitor clicks or taps to skip it. */
  readonly onSkip: () => void;
}

/**
 * Full-screen welcome text drawn over the home page. Purely visual: it is
 * hidden from screen readers, which get the page content right away.
 */
export function IntroOverlay({ status, onSkip }: IntroOverlayProps) {
  const texts = useTranslations();
  // Custom properties are not part of React's CSSProperties type, hence the cast.
  const style = {
    "--appear-duration": `${INTRO_APPEAR_MS}ms`,
    "--fade-duration": `${INTRO_FADE_MS}ms`,
  } as CSSProperties;

  return (
    <div
      className={styles.overlay}
      style={style}
      data-status={status}
      onPointerDown={onSkip}
      aria-hidden="true"
    >
      <p className={styles.welcome}>{texts.intro.welcome}</p>
      <p className={styles.name}>{AUTHOR_NAME}</p>
      <p className={styles.hint}>{texts.intro.skipHint}</p>
    </div>
  );
}
