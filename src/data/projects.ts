import {
  FileVideoCamera,
  Languages,
  MessagesSquare,
  Piano,
  Salad,
  ShieldCheck,
  WholeWord,
  type LucideIcon,
} from "lucide-react";

/** Identifier of a project: its GitHub repository name, also used in its URL. */
export type ProjectId =
  | "hospital-security"
  | "metre-moi-au-regime"
  | "convertisor"
  | "repartitor"
  | "module-odoo-interview"
  | "synthesizer"
  | "wordeul";

/** Context in which a project was made. */
export type ProjectKind = "school" | "personal";

/**
 * Language-independent data of a project shown as a bubble.
 * Texts that change with the language live in the translation files.
 */
export interface Project {
  /** Unique identifier, also the repository name. */
  readonly id: ProjectId;
  /** Display name; a proper noun, the same in every language. */
  readonly name: string;
  /** School or personal project. */
  readonly kind: ProjectKind;
  /** Number of people who built it. */
  readonly teamSize: number;
  /** Lucide icon shown in the bubble. */
  readonly icon: LucideIcon;
  /** Color of the bubble and of the project page accents (at least 7:1 on the background). */
  readonly accentColor: string;
  /** Main technologies, in order of importance. */
  readonly technologies: readonly string[];
  /** Public GitHub repository. */
  readonly repositoryUrl: string;
  /** Recorded demonstration, if the project has one. */
  readonly video?: VideoClip;
}

/** Recorded demonstration of a project, served from `public/videos/`. */
export interface VideoClip {
  /** Address of the MP4 (H.264) file. */
  readonly source: string;
  /** Address of the still image shown until the video plays. */
  readonly poster: string;
  /** Width of the video, in pixels. With the height, it reserves the player's space before loading. */
  readonly width: number;
  /** Height of the video, in pixels. */
  readonly height: number;
}

/** Base address of the author's GitHub repositories. */
const GITHUB_BASE_URL = "https://github.com/MGpro-grammer";

/**
 * Describes the video of a project. Its files are named after the project:
 * `public/videos/<id>.mp4` and `public/videos/<id>.webp`.
 * @param id - Identifier of the project.
 * @param width - Width of the video, in pixels.
 * @param height - Height of the video, in pixels.
 * @returns Addresses and size of the video.
 */
function videoOf(id: ProjectId, width: number, height: number): VideoClip {
  const path = `${import.meta.env.BASE_URL}videos/${id}`;
  return { source: `${path}.mp4`, poster: `${path}.webp`, width, height };
}

/**
 * Every project shown on the site, in display order.
 * Adding a project means adding one entry here and its texts in each
 * translation file; no component has to change.
 */
export const PROJECTS: readonly Project[] = [
  {
    id: "hospital-security",
    name: "Hospital Security",
    kind: "school",
    teamSize: 2,
    icon: ShieldCheck,
    accentColor: "#fb7185",
    technologies: ["Python", "Django", "Vue", "Keycloak", "Docker"],
    repositoryUrl: `${GITHUB_BASE_URL}/hospital-security`,
    video: videoOf("hospital-security", 1280, 580),
  },
  {
    id: "metre-moi-au-regime",
    name: "Mètre-moi au régime",
    kind: "school",
    teamSize: 2,
    icon: Salad,
    accentColor: "#4ade80",
    technologies: ["Java 21", "JavaFX", "SQLite"],
    repositoryUrl: `${GITHUB_BASE_URL}/metre-moi-au-regime`,
    video: videoOf("metre-moi-au-regime", 1280, 720),
  },
  {
    id: "convertisor",
    name: "Convertisor",
    kind: "personal",
    teamSize: 1,
    icon: FileVideoCamera,
    accentColor: "#fb923c",
    technologies: ["Python", "CustomTkinter", "yt-dlp", "FFmpeg"],
    repositoryUrl: `${GITHUB_BASE_URL}/convertisor`,
    video: videoOf("convertisor", 596, 720),
  },
  {
    id: "repartitor",
    name: "Repartitor",
    kind: "school",
    teamSize: 2,
    icon: Languages,
    accentColor: "#a78bfa",
    technologies: ["Vue", "Pinia", "Supabase", "Google OAuth"],
    repositoryUrl: `${GITHUB_BASE_URL}/repartitor`,
    video: videoOf("repartitor", 1280, 572),
  },
  {
    id: "module-odoo-interview",
    name: "Module Odoo Interview",
    kind: "school",
    teamSize: 2,
    icon: MessagesSquare,
    accentColor: "#f472b6",
    technologies: ["Python", "Django", "Odoo", "Docker"],
    repositoryUrl: `${GITHUB_BASE_URL}/module-odoo-interview`,
    video: videoOf("module-odoo-interview", 1280, 580),
  },
  {
    id: "synthesizer",
    name: "Synthesizer",
    kind: "school",
    teamSize: 1,
    icon: Piano,
    accentColor: "#2dd4bf",
    technologies: ["C++23", "CMake"],
    repositoryUrl: `${GITHUB_BASE_URL}/synthesizer`,
    video: videoOf("synthesizer", 890, 596),
  },
  {
    id: "wordeul",
    name: "Wordeul",
    kind: "school",
    teamSize: 1,
    icon: WholeWord,
    accentColor: "#facc15",
    technologies: ["JavaScript", "HTML", "CSS"],
    repositoryUrl: `${GITHUB_BASE_URL}/wordeul`,
    video: videoOf("wordeul", 1280, 566),
  },
];

/**
 * Finds a project from an identifier read in the URL.
 * @param id - Identifier to look for; may be anything typed in the address bar.
 * @returns The matching project, or `undefined` if no project has this identifier.
 */
export function findProject(id: string | undefined): Project | undefined {
  return PROJECTS.find((project) => project.id === id);
}
