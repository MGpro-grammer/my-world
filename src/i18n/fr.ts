import type { Translations } from "./Translations.ts";

/** French texts of the site (default language). */
export const fr = {
  common: {
    opensInNewTab: "(s'ouvre dans un nouvel onglet)",
    close: "Fermer",
    socialImageDescription:
      "Georges Mouratidis, développeur d'applications web et mobile : portfolio de projets.",
  },
  intro: {
    welcome: "Bienvenue dans l'univers de",
    skipHint: "Cliquez ou appuyez sur une touche pour entrer",
  },
  home: {
    title: "Portfolio",
    tagline: "Développeur d'applications web et mobile",
    projectsLabel: "Projets",
    listView: "Liste",
    contactSummary: "LinkedIn, GitHub, e-mail, téléphone et CV",
    description:
      "Portfolio de Georges Mouratidis, développeur d'applications web et mobile : sept projets avec leur vidéo de démonstration, et ses coordonnées.",
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
  },
  contact: {
    title: "Contact",
    intro: "Choisissez comment me joindre.",
    back: "Retour à l'accueil",
    description:
      "Contacter Georges Mouratidis, développeur d'applications web et mobile : LinkedIn, GitHub, e-mail, téléphone et CV.",
    channels: {
      linkedin: "LinkedIn",
      github: "GitHub",
      email: "E-mail",
      phone: "Téléphone",
      cv: "CV",
    },
    copy: "Copier",
    copied: "Copié",
    email: {
      message:
        "Je consulte mes e-mails régulièrement et je réponds dans un délai de 5 jours. Inutile de renvoyer votre message avant ce délai : il a bien été reçu.",
      write: "Écrire un e-mail",
    },
    phone: {
      availabilityHeading: "Disponibilités",
      timeZone: "Heure de Belgique",
      call: "Appeler",
    },
    cv: {
      imageDescription: "CV de Georges Mouratidis, développeur d'applications web et mobile.",
      download: "Télécharger le CV (PDF)",
    },
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
        "Plateforme de dossiers médicaux chiffrés de bout en bout : connexion sans mot de passe (WebAuthn), clés de chiffrement dérivées de l'authentificateur de l'utilisateur, et un serveur incapable de lire les dossiers qu'il conserve.",
      role: "Co-développement à deux, rôles partagés, centré sur la sécurité de l'information",
      videoDescription:
        "La vidéo montre un patient fictif qui se connecte avec une clé d'accès Windows, déverrouille ses clés, dépose son dossier médical chiffré puis le relit ; un médecin fictif se connecte ensuite et ouvre le dossier d'un patient qui lui a donné son autorisation.",
    },
    "metre-moi-au-regime": {
      summary: "Suivi nutritionnel avec scan de code-barres",
      description:
        "Application de bureau de suivi nutritionnel développée avec JavaFX : enregistrez vos repas et vos activités, trouvez les produits par nom ou par code-barres grâce à Open Food Facts, et suivez vos objectifs quotidiens en calories et en macronutriments.",
      role: "Base de données et ses tests, vues et contrôleurs JavaFX",
      videoDescription:
        "La vidéo montre l'inscription, le questionnaire qui fixe les objectifs, le tableau de bord des calories et des macronutriments, l'ajout d'un aliment par scan d'une photo de code-barres ou par recherche, puis l'enregistrement d'une activité physique.",
    },
    convertisor: {
      summary: "Vidéo YouTube vers MP3, MP4 ou GIF",
      description:
        "Application de bureau Windows qui télécharge une vidéo YouTube à partir de son adresse, en MP3, en MP4 ou en GIF animé. Un seul installateur, FFmpeg inclus, et une vérification des mises à jour au démarrage.",
      role: "Seul développeur",
      videoDescription:
        "La vidéo montre le téléchargement en MP3 de l'audio d'une vidéo YouTube à partir de son adresse, le fichier obtenu dans l'onglet Fichiers, puis sa lecture dans le lecteur multimédia de Windows.",
    },
    repartitor: {
      summary: "Répartition de textes entre traducteurs",
      description:
        "Application web pour un service de traduction : le répartiteur attribue chaque texte à un traducteur et à un éditeur, puis suit les délais et l'avancement.",
      role: "Backend",
      videoDescription:
        "La vidéo montre l'accueil, le choix d'un rôle (répartiteur ou traducteur), la liste des textes avec leur date limite et l'état de leur traduction et de leur édition, les textes attribués à un traducteur, puis la page de statistiques.",
    },
    "module-odoo-interview": {
      summary: "Gestion de feedbacks intégrée à Odoo",
      description:
        "Module Odoo 18 de feedbacks d'entretiens d'embauche, avec des questions notées par compétence, et un site Django qui filtre les feedbacks par compétence, poste, note et date.",
      role: "Backend",
      videoDescription:
        "La vidéo montre le module dans le catalogue d'applications d'Odoo, les questions d'entretien notées par compétence, puis le site associé où l'on consulte les feedbacks d'entretien filtrés par compétence, poste, score et date.",
    },
    synthesizer: {
      summary: "Synthétiseur C++ à deux oscillateurs",
      description:
        "Petit synthétiseur en C++ : un ou deux oscillateurs (sinus, carré, dent de scie), enveloppe, filtre et écho, joués sur un clavier de 13 touches.",
      role: "Seul développeur",
      videoDescription:
        "La vidéo montre le réglage du synthétiseur : forme d'onde, second oscillateur, attaque et relâchement, fréquence de coupure et résonance du filtre, écho, avec les notes jouées sur ses 13 touches.",
    },
    wordeul: {
      summary: "Wordle en JavaScript pur, avec des mots de 5 à 10 lettres",
      description:
        "Jeu de mots inspiré de Wordle, en JavaScript pur : des mots de 5 à 10 lettres, un mot secret saisi en masqué ou tiré au hasard, et un clavier virtuel qui indique l'état de chaque lettre.",
      role: "Seul développeur",
      videoDescription:
        "La vidéo montre la configuration d'une partie (mot secret saisi en masqué ou tiré au hasard, nombre d'essais), puis des essais colorés lettre par lettre : vert si la lettre est bien placée, jaune si elle est mal placée, rouge si elle est absente ; le clavier virtuel reprend ces couleurs.",
    },
  },
} satisfies Translations;
