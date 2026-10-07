import type { Translations } from "./Translations.ts";

/** French texts of the site (default language). */
export const fr = {
  intro: {
    welcome: "Bienvenue dans l'univers de",
    skipHint: "Cliquez ou appuyez sur une touche pour entrer",
  },
  home: {
    title: "Portfolio",
    tagline: "Développeur d'applications web et mobile",
    projectsLabel: "Projets",
    listView: "Liste",
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
  languageSwitch: {
    label: "Langue du site",
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
      videoDescription:
        "La vidéo montre un patient fictif qui se connecte avec une clé d'accès Windows, déverrouille ses clés, dépose son dossier médical chiffré puis le relit ; un médecin fictif se connecte ensuite et ouvre le dossier d'un patient qui lui a donné son autorisation.",
    },
    "metre-moi-au-regime": {
      summary: "Suivi nutritionnel avec scan de code-barres",
      description:
        "Application de bureau de suivi nutritionnel développée avec JavaFX : enregistrez vos repas, scannez des produits et suivez vos objectifs quotidiens en calories et en macronutriments.",
      role: "Base de données et ses tests, vues et contrôleurs JavaFX",
      videoDescription:
        "La vidéo montre l'inscription, le questionnaire qui fixe les objectifs, le tableau de bord des calories et des macronutriments, l'ajout d'un aliment par scan d'une photo de code-barres ou par recherche, puis l'enregistrement d'une activité physique.",
    },
    convertisor: {
      summary: "Vidéo YouTube vers MP3, MP4 ou GIF",
      description:
        "Projet dans lequel nous convertissons une vidéo en ligne (via une URL) en fichier .mp3, .mp4 et plus encore.",
      role: "Seul développeur",
      videoDescription:
        "La vidéo montre le téléchargement en MP3 de l'audio d'une vidéo YouTube à partir de son adresse, le fichier obtenu dans l'onglet Fichiers, puis sa lecture dans le lecteur multimédia de Windows.",
    },
    repartitor: {
      summary: "Répartition de textes entre traducteurs",
      description: "Outil de gestion des textes pour un service de traduction.",
      role: "Backend",
      videoDescription:
        "La vidéo montre l'accueil, le choix d'un rôle (répartiteur ou traducteur), la liste des textes avec leur date limite et l'état de leur traduction et de leur édition, les textes attribués à un traducteur, puis la page de statistiques.",
    },
    "module-odoo-interview": {
      summary: "Gestion de feedbacks intégrée à Odoo",
      description:
        "Projet de gestion de feedbacks pour une application web. Le projet permet aux utilisateurs de soumettre, visualiser et gérer des feedbacks sur différents sujets.",
      role: "Backend",
      videoDescription:
        "La vidéo montre le module dans le catalogue d'applications d'Odoo, les questions d'entretien notées par compétence, puis le site associé où l'on consulte les feedbacks d'entretien filtrés par compétence, poste, score et date.",
    },
    synthesizer: {
      summary: "Synthétiseur C++ à deux oscillateurs",
      description: "Ce projet est la réalisation d'un petit synthétiseur basique.",
      role: "Seul développeur",
      videoDescription:
        "La vidéo montre le réglage du synthétiseur : forme d'onde, second oscillateur, attaque et relâchement, fréquence de coupure et résonance du filtre, écho, avec les notes jouées sur ses 13 touches.",
    },
    wordeul: {
      summary: "Wordle en JavaScript pur, avec des mots de 5 à 10 lettres",
      description: "Projet du fameux jeu Wordeul.",
      role: "Seul développeur",
      videoDescription:
        "La vidéo montre la configuration d'une partie (mot secret saisi en masqué ou tiré au hasard, nombre d'essais), puis des essais colorés lettre par lettre : vert si la lettre est bien placée, jaune si elle est mal placée, rouge si elle est absente ; le clavier virtuel reprend ces couleurs.",
    },
  },
} satisfies Translations;
