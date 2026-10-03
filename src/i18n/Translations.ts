import type { ProjectId } from "../data/projects.ts";

/** Texts of one project in one language. */
export interface ProjectTexts {
  /** One-line description shown in the expanded bubble. */
  readonly summary: string;
  /** What the author did in the project. */
  readonly role: string;
}

/**
 * Every text of the site in one language.
 *
 * Each language file must match this shape exactly: a missing project or
 * text is a compile error, not a blank space found later on the site.
 */
export interface Translations {
  /** Texts of each project, one entry per {@link ProjectId}. */
  readonly projects: Readonly<Record<ProjectId, ProjectTexts>>;
}
