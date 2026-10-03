import type { Translations } from "./Translations.ts";

/** French texts of the site (default language). */
export const fr = {
  home: {
    tagline: "Développeur d'applications web et mobile",
    projectsLabel: "Projets",
  },
  projectPage: {
    back: "Retour aux projets",
    roleHeading: "Mon rôle",
    viewOnGitHub: "Voir le projet sur GitHub",
  },
  notFound: {
    title: "Page introuvable",
    message: "Cette adresse ne correspond à aucune page du site.",
    backHome: "Retour à l'accueil",
  },
  projects: {
    "hospital-security": {
      summary: "Dossiers médicaux chiffrés de bout en bout",
      role: "Co-développement à deux, rôles partagés, centré sur la sécurité de l'information",
    },
    "metre-moi-au-regime": {
      summary: "Suivi nutritionnel avec scan de code-barres",
      role: "Base de données et ses tests, vues et contrôleurs JavaFX",
    },
    convertisor: {
      summary: "Vidéo YouTube vers MP3, MP4 ou GIF",
      role: "Seul développeur",
    },
    repartitor: {
      summary: "Répartition de textes entre traducteurs",
      role: "Backend",
    },
    "module-odoo-interview": {
      summary: "Gestion de feedbacks intégrée à Odoo",
      role: "Backend",
    },
    synthesizer: {
      summary: "Synthétiseur C++ à deux oscillateurs",
      role: "Seul développeur",
    },
    wordeul: {
      summary: "Wordle en JavaScript pur, avec des mots de 5 à 10 lettres",
      role: "Seul développeur",
    },
  },
} satisfies Translations;
