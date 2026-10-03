import type { Translations } from "./Translations.ts";

/** French texts of the site (default language). */
export const fr = {
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
