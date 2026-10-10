import type { ContactChannelId } from "../data/contact.ts";
import type { ProjectId, ProjectKind } from "../data/projects.ts";

/** Texts of one project in one language. */
export interface ProjectTexts {
  /** One-line description shown in the expanded bubble. */
  readonly summary: string;
  /**
   * Description shown on the project page and given to search engines and
   * shared links. Kept in line with the "About" description of the repository.
   */
  readonly description: string;
  /** What the author did in the project. */
  readonly role: string;
  /**
   * What the video shows, for visitors who cannot watch it.
   * Not shown when the project has no video.
   */
  readonly videoDescription: string;
}

/**
 * Every text of the site in one language.
 *
 * Each language file must match this shape exactly: a missing project or
 * text is a compile error, not a blank space found later on the site.
 */
export interface Translations {
  /** Texts used on several pages. */
  readonly common: {
    /** Read only by screen readers after a link that opens a new tab. */
    readonly opensInNewTab: string;
    /** Button that closes a dialog. */
    readonly close: string;
    /** Text alternative of the picture shown when a link to the site is shared. */
    readonly socialImageDescription: string;
  };
  /** Welcome screen shown once per visit. */
  readonly intro: {
    /** Line shown above the author's name. */
    readonly welcome: string;
    /** How to skip the welcome screen. */
    readonly skipHint: string;
  };
  /** Home page. */
  readonly home: {
    /** Second part of the browser tab title, after the author's name. */
    readonly title: string;
    /** Line shown under the author's name. */
    readonly tagline: string;
    /** Accessible name of the list of projects. */
    readonly projectsLabel: string;
    /** Button that switches between the bubbles and the plain list. */
    readonly listView: string;
    /** One-line description of the contact bubble, under its name. */
    readonly contactSummary: string;
    /** Summary of the home page for search engines and shared links (about 150 characters). */
    readonly description: string;
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
  };
  /** Contact page and its dialogs. */
  readonly contact: {
    /** Name of the contact bubble and title of the contact page. */
    readonly title: string;
    /** Line shown under the title of the contact page. */
    readonly intro: string;
    /** Link back to the home page. */
    readonly back: string;
    /** Summary of the contact page for search engines and shared links. */
    readonly description: string;
    /** Name of each way to reach the author, shown on its bubble. */
    readonly channels: Readonly<Record<ContactChannelId, string>>;
    /** Button that copies the address or the number. */
    readonly copy: string;
    /** Shown for a moment once the copy is done. */
    readonly copied: string;
    /** E-mail dialog. */
    readonly email: {
      /** When the author answers. */
      readonly message: string;
      /** Button that opens the visitor's e-mail application. */
      readonly write: string;
    };
    /** Phone dialog. */
    readonly phone: {
      /** Heading of the hours at which to call. */
      readonly availabilityHeading: string;
      /** Time zone of the hours. */
      readonly timeZone: string;
      /** Button that starts a call. */
      readonly call: string;
    };
    /** Résumé dialog. */
    readonly cv: {
      /** Text alternative of the résumé picture. */
      readonly imageDescription: string;
      /** Link to the PDF file; the text names its type, so the download is no surprise. */
      readonly download: string;
    };
  };
  /** Language switch shown on every page. */
  readonly languageSwitch: {
    /** Accessible name of the switch. */
    readonly label: string;
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
