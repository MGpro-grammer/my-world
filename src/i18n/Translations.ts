import type { ProjectId, ProjectKind } from "../data/projects.ts";
/** Texts of one project in one language. */
export interface ProjectTexts {
  /** One-line description shown in the expanded bubble. */
  readonly summary: string;
  /** Longer description shown on the project page, based on the repository description. */
  readonly description: string;
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
  /** Welcome screen shown once per visit. */
  readonly intro: {
    /** Line shown above the author's name. */
    readonly welcome: string;
    /** How to skip the welcome screen. */
    readonly skipHint: string;
  };
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
    /** Label of each kind of project. */
    readonly kind: Readonly<Record<ProjectKind, string>>;
    /** Heading of the author's role. */
    readonly roleHeading: string;
    /** Heading of the list of technologies. */
    readonly technologiesHeading: string;
    /** Heading of the video. */
    readonly videoHeading: string;
    /** Shown instead of the video when the project has none. */
    readonly noVideo: string;
    /** Link to the GitHub repository. */
    readonly viewOnGitHub: string;
    /** Read only by screen readers after a link that opens a new tab. */
    readonly opensInNewTab: string;
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
