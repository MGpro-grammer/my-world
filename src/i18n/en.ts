import type { Translations } from "./Translations.ts";

/** English texts of the site. */
export const en = {
  intro: {
    welcome: "Welcome to the world of",
    skipHint: "Click or press any key to enter",
  },
  home: {
    tagline: "Web and mobile application developer",
    projectsLabel: "Projects",
    listView: "List",
  },
  projectPage: {
    back: "Back to projects",
    kind: {
      school: "School project",
      personal: "Personal project",
    },
    roleHeading: "My role",
    technologiesHeading: "Technologies",
    videoHeading: "Video",
    noVideo: "No video for this project yet.",
    viewOnGitHub: "View the project on GitHub",
    opensInNewTab: "(opens in a new tab)",
  },
  languageSwitch: {
    label: "Site language",
  },
  notFound: {
    title: "Page not found",
    message: "This address does not match any page of the site.",
    backHome: "Back to home",
  },
  projects: {
    "hospital-security": {
      summary: "End-to-end encrypted medical records",
      description:
        "The goal of this project is to implement a secure client/server system handling medical records.",
      role: "Co-developed by two, shared roles, focused on information security",
      videoDescription:
        "The video shows a fictitious patient signing in with a Windows passkey, unlocking their keys, uploading their encrypted medical record and reading it back; a fictitious doctor then signs in and opens the record of a patient who authorized them.",
    },
    "metre-moi-au-regime": {
      summary: "Nutrition tracker with barcode scanning",
      description:
        "Desktop nutrition tracker built with JavaFX — log your meals, scan products and follow your daily calorie and macronutrient goals.",
      role: "Database and its tests, JavaFX views and controllers",
      videoDescription:
        "The video shows sign-up, the questionnaire that sets the goals, the calorie and macronutrient dashboard, adding a food by scanning a barcode photo or by searching, then logging a physical activity.",
    },
    convertisor: {
      summary: "YouTube video to MP3, MP4 or GIF",
      description:
        "Project in which we convert an online video (from its URL) into an .mp3 or .mp4 file, and more.",
      role: "Sole developer",
      videoDescription:
        "The video shows the MP3 download of a YouTube video's audio from its address, the resulting file in the Files tab, then its playback in the Windows media player.",
    },
    repartitor: {
      summary: "Distributing texts among translators",
      description: "Text management tool for a translation service.",
      role: "Back end",
      videoDescription:
        "The video shows the home page, choosing a role (dispatcher or translator), the list of texts with their deadline and the status of their translation and editing, the texts assigned to a translator, then the statistics page.",
    },
    "module-odoo-interview": {
      summary: "Feedback management built into Odoo",
      description:
        "Feedback management project for a web application. It lets users submit, view and manage feedback on various topics.",
      role: "Back end",
      videoDescription:
        "The video shows the module in Odoo's app catalog, the interview questions scored by skill, then the companion website where interview feedback is filtered by skill, position, score and date.",
    },
    synthesizer: {
      summary: "Two-oscillator C++ synthesizer",
      description: "This project is the making of a small, basic synthesizer.",
      role: "Sole developer",
      videoDescription:
        "The video shows the synthesizer being tuned: waveform, second oscillator, attack and release, filter cutoff and resonance, delay, with notes played on its 13 keys.",
    },
    wordeul: {
      summary: "Wordle in plain JavaScript, with 5- to 10-letter words",
      description: "Project of the famous game Wordeul.",
      role: "Sole developer",
      videoDescription:
        "The video shows setting up a game (secret word typed hidden or picked at random, number of attempts), then guesses colored letter by letter: green if the letter is in the right place, yellow if it is misplaced, red if it is absent; the on-screen keyboard repeats these colors.",
    },
  },
} satisfies Translations;
