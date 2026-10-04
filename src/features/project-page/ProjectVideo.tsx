import { useEffect, useId, useRef, type CSSProperties } from "react";
import type { VideoClip } from "../../data/projects.ts";
import { useInView } from "../../hooks/useInView.ts";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion.ts";
import styles from "./ProjectVideo.module.css";

/** How far from the screen the video starts loading, so that it is ready when it appears. */
const LOAD_MARGIN = "200px";

interface ProjectVideoProps {
  /** Files and size of the video. */
  readonly clip: VideoClip;
  /** What the video shows, displayed under it and read by screen readers. */
  readonly description: string;
}

/**
 * Demonstration video of a project, with its text description.
 *
 * Virtual proxy: until the video comes near the screen, only its still image
 * stands in for it and the video file is not requested at all. Then it plays
 * muted and in a loop, pauses when it leaves the screen and resumes when it
 * comes back, unless the visitor paused it. When the visitor asked for reduced
 * motion, it never starts by itself: the controls start it.
 */
export function ProjectVideo({ clip, description }: ProjectVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { isInView, hasBeenInView } = useInView(videoRef, LOAD_MARGIN);
  const prefersReducedMotion = usePrefersReducedMotion();
  // Play on first sight; afterwards, only if it was playing when it left the screen.
  const shouldPlayWhenVisible = useRef(true);
  const descriptionId = useId();

  useEffect(() => {
    const video = videoRef.current;
    if (video === null || !hasBeenInView) {
      return;
    }
    if (!isInView) {
      shouldPlayWhenVisible.current = !video.paused;
      video.pause();
    } else if (shouldPlayWhenVisible.current && !prefersReducedMotion) {
      video.play().catch(() => {
        // Autoplay refused by the browser: the visitor can still use the controls.
      });
    }
  }, [isInView, hasBeenInView, prefersReducedMotion]);

  // Custom properties are not part of React's CSSProperties type, hence the cast.
  const style = { "--ratio": clip.width / clip.height } as CSSProperties;

  return (
    <figure className={styles.figure}>
      <video
        ref={videoRef}
        className={styles.video}
        style={style}
        src={hasBeenInView ? clip.source : undefined}
        poster={clip.poster}
        width={clip.width}
        height={clip.height}
        preload="none"
        muted
        loop
        playsInline
        controls
        aria-describedby={descriptionId}
      />
      <figcaption id={descriptionId} className={styles.caption}>
        {description}
      </figcaption>
    </figure>
  );
}
