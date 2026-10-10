/*
 * Settings of the look of the animated waves, shared by every animated
 * renderer so that they all draw the same picture.
 */

/** Number of distinct dot looks shared by all the dots. */
export const STYLE_LEVELS = 32;

/** Upward shift of a dot, in CSS pixels, per unit of wave height. */
export const LIFT_PER_UNIT = 1.2;

/** Wave height at which a dot reaches its brightest look. */
export const FULL_INTENSITY_HEIGHT = 6;
