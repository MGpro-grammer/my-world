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
  /** Home page. */
  readonly home: {
    /** Line shown under the author's name. */
    readonly tagline: string;
    /** Accessible name of the list of projects. */
    readonly projectsLabel: string;
  };
  /** Page of one project. */
  readonly projectPage: {
    /** Link back to the home page. */
    readonly back: string;
    /** Heading of the author's role. */
    readonly roleHeading: string;
    /** Link to the GitHub repository. */
    readonly viewOnGitHub: string;
  };
  /** Page shown for an unknown address. */
  readonly notFound: {
    readonly title: string;
    readonly message: string;
    /** Link back to the home page. */
    readonly backHome: string;
  };
  /** Texts of each project, one entry per {@link ProjectId}. */
  readonly projects: Readonly<Record<ProjectId, ProjectTexts>>;
}
