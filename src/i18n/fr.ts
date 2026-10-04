import type { Translations } from "./Translations.ts";

/** French texts of the site (default language). */
export const fr = {
  intro: {
    welcome: "Bienvenue dans l'univers de",
    skipHint: "Cliquez ou appuyez sur une touche pour entrer",
  },
  home: {
    tagline: "Développeur d'applications web et mobile",
    projectsLabel: "Projets",
  },
  projectPage: {
    back: "Retour aux projets",
    kind: {
      school: "Projet scolaire",
      personal: "Projet personnel",
    },
    roleHeading: "Mon rôle",
    technologiesHeading: "Technologies",
    videoHeading: "Vidéo",
    noVideo: "Pas encore de vidéo pour ce projet.",
    viewOnGitHub: "Voir le projet sur GitHub",
    opensInNewTab: "(s'ouvre dans un nouvel onglet)",
  },
  notFound: {
    title: "Page introuvable",
    message: "Cette adresse ne correspond à aucune page du site.",
    backHome: "Retour à l'accueil",
  },
  projects: {
    "hospital-security": {
      summary: "Dossiers médicaux chiffrés de bout en bout",
      description:
        "L'objectif de ce projet est de mettre en place un système client/serveur sécurisé de gestion de dossiers médicaux.",
      role: "Co-développement à deux, rôles partagés, centré sur la sécurité de l'information",
    },
    "metre-moi-au-regime": {
      summary: "Suivi nutritionnel avec scan de code-barres",
      description:
        "Application de bureau de suivi nutritionnel développée avec JavaFX : enregistrez vos repas, scannez des produits et suivez vos objectifs quotidiens en calories et en macronutriments.",
      role: "Base de données et ses tests, vues et contrôleurs JavaFX",
    },
    convertisor: {
      summary: "Vidéo YouTube vers MP3, MP4 ou GIF",
      description:
        "Projet dans lequel nous convertissons une vidéo en ligne (via une URL) en fichier .mp3, .mp4 et plus encore.",
      role: "Seul développeur",
    },
    repartitor: {
      summary: "Répartition de textes entre traducteurs",
      description: "Outil de gestion des textes pour un service de traduction.",
      role: "Backend",
    },
    "module-odoo-interview": {
      summary: "Gestion de feedbacks intégrée à Odoo",
      description:
        "Projet de gestion de feedbacks pour une application web. Le projet permet aux utilisateurs de soumettre, visualiser et gérer des feedbacks sur différents sujets.",
      role: "Backend",
    },
    synthesizer: {
      summary: "Synthétiseur C++ à deux oscillateurs",
      description: "Ce projet est la réalisation d'un petit synthétiseur basique.",
      role: "Seul développeur",
    },
    wordeul: {
      summary: "Wordle en JavaScript pur, avec des mots de 5 à 10 lettres",
      description: "Projet du fameux jeu Wordeul.",
      role: "Seul développeur",
    },
  },
} satisfies Translations;
