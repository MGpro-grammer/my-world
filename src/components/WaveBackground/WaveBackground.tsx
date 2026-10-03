import { useEffect, useRef } from "react";
import { createWaveRenderer } from "../../core/wave/createWaveRenderer.ts";
import { AnimationFrameScheduler } from "../../core/wave/FrameScheduler.ts";
import { WaveScene } from "../../core/wave/WaveScene.ts";
import { WaveSimulation } from "../../core/wave/WaveSimulation.ts";
import { useDevicePixelRatio } from "../../hooks/useDevicePixelRatio.ts";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion.ts";
import styles from "./WaveBackground.module.css";

/** Distance between two neighboring dots, in CSS pixels. */
const DOT_SPACING = 20;

/** Fraction of the wave energy kept at each frame. */
const DAMPING = 0.985;

/** Radius, in dots, of the area lifted by the pointer. */
const BRUSH_RADIUS = 2;

/** Height added under the pointer at each move. */
const POINTER_STRENGTH = 4;

/** Height added under a click or a tap: a single, stronger splash. */
const TAP_STRENGTH = 12;

/**
 * Animated sea of dots drawn behind the whole page.
 *
 * The component only talks to {@link WaveScene}: it creates the scene when
 * mounted, forwards size changes, pointer moves and taps to it, and disposes
 * of it when unmounted. When the visitor prefers reduced motion, the dots are
 * drawn once at rest and the pointer is ignored.
 */
export function WaveBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  const pixelRatio = useDevicePixelRatio();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas === null) {
      return;
    }

    const scene = new WaveScene({
      simulation: new WaveSimulation({
        spacing: DOT_SPACING,
        damping: DAMPING,
        brushRadius: BRUSH_RADIUS,
      }),
      renderer: createWaveRenderer(canvas, { prefersReducedMotion }),
      scheduler: new AnimationFrameScheduler(),
    });

    const fitToCanvas = () => {
      scene.resize(canvas.clientWidth, canvas.clientHeight, pixelRatio);
    };
    fitToCanvas();
    const resizeObserver = new ResizeObserver(fitToCanvas);
    resizeObserver.observe(canvas);

    if (prefersReducedMotion) {
      // The static drawing made by resize() is enough: no loop, no pointer.
      return () => {
        resizeObserver.disconnect();
        scene.dispose();
      };
    }

    const handlePointerMove = (event: PointerEvent) => {
      scene.disturb(event.clientX, event.clientY, POINTER_STRENGTH);
    };
    const handlePointerDown = (event: PointerEvent) => {
      scene.disturb(event.clientX, event.clientY, TAP_STRENGTH);
    };
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerdown", handlePointerDown, { passive: true });
    scene.start();

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerdown", handlePointerDown);
      resizeObserver.disconnect();
      scene.dispose();
    };
  }, [prefersReducedMotion, pixelRatio]);

  return <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />;
}
