import type { Translations } from "./Translations.ts";

/** Dutch texts of the site. */
export const nl = {
  common: {
    opensInNewTab: "(opent in een nieuw tabblad)",
    close: "Sluiten",
    socialImageDescription:
      "Georges Mouratidis, ontwikkelaar van web- en mobiele applicaties: portfolio van projecten.",
  },
  intro: {
    welcome: "Welkom in de wereld van",
    skipHint: "Klik of druk op een toets om binnen te gaan",
  },
  home: {
    title: "Portfolio",
    tagline: "Ontwikkelaar van web- en mobiele applicaties",
    projectsLabel: "Projecten",
    listView: "Lijst",
    contactSummary: "LinkedIn, GitHub, e-mail, telefoon en cv",
    description:
      "Portfolio van Georges Mouratidis, ontwikkelaar van web- en mobiele applicaties: acht projecten met hun demovideo, en zijn contactgegevens.",
  },
  projectPage: {
    back: "Terug naar de projecten",
    kind: {
      school: "Schoolproject",
      personal: "Persoonlijk project",
    },
    roleHeading: "Mijn rol",
    technologiesHeading: "Technologieën",
    videoHeading: "Video",
    noVideo: "Nog geen video voor dit project.",
    viewOnGitHub: "Bekijk het project op GitHub",
  },
  contact: {
    title: "Contact",
    intro: "Kies hoe u mij wilt bereiken.",
    back: "Terug naar de startpagina",
    description:
      "Neem contact op met Georges Mouratidis, ontwikkelaar van web- en mobiele applicaties: LinkedIn, GitHub, e-mail, telefoon en cv.",
    channels: {
      linkedin: "LinkedIn",
      github: "GitHub",
      email: "E-mail",
      phone: "Telefoon",
      cv: "Cv",
    },
    copy: "Kopiëren",
    copied: "Gekopieerd",
    email: {
      message:
        "Ik lees mijn e-mails regelmatig en antwoord binnen 5 dagen. U hoeft uw bericht niet opnieuw te sturen voor die termijn: het is goed ontvangen.",
      write: "Een e-mail schrijven",
    },
    phone: {
      availabilityHeading: "Beschikbaarheid",
      timeZone: "Belgische tijd",
      call: "Bellen",
    },
    cv: {
      imageDescription: "Cv van Georges Mouratidis, ontwikkelaar van web- en mobiele applicaties.",
      download: "Cv downloaden (pdf)",
    },
  },
  languageSwitch: {
    label: "Taal van de site",
  },
  notFound: {
    title: "Pagina niet gevonden",
    message: "Dit adres komt met geen enkele pagina van de site overeen.",
    backHome: "Terug naar de startpagina",
  },
  projects: {
    "hospital-security": {
      summary: "End-to-end versleutelde medische dossiers",
      description:
        "Platform voor end-to-end versleutelde medische dossiers: aanmelden zonder wachtwoord met WebAuthn, versleutelingssleutels afgeleid van de authenticator van de gebruiker, en een server die de dossiers die hij bewaart niet kan lezen.",
      role: "Met twee ontwikkeld, gedeelde rollen, gericht op informatiebeveiliging",
      videoDescription:
        "De video toont een fictieve patiënt die zich aanmeldt met een Windows-toegangssleutel, zijn sleutels ontgrendelt, zijn versleutelde medisch dossier uploadt en het opnieuw leest; daarna meldt een fictieve arts zich aan en opent het dossier van een patiënt die hem toestemming heeft gegeven.",
    },
    "metre-moi-au-regime": {
      summary: "Voedingsdagboek met barcodescanner",
      description:
        "Desktopapplicatie om de voeding op te volgen, gebouwd met JavaFX: maaltijden en activiteiten registreren, producten zoeken op naam of barcode via Open Food Facts, en de dagelijkse doelen voor calorieën en macronutriënten opvolgen.",
      role: "Database en de tests ervan, JavaFX-views en -controllers",
      videoDescription:
        "De video toont de registratie, de vragenlijst die de doelen bepaalt, het overzicht van calorieën en macronutriënten, het toevoegen van een voedingsmiddel door een foto van een barcode te scannen of door te zoeken, en daarna het registreren van een fysieke activiteit.",
    },
    convertisor: {
      summary: "YouTube-video naar MP3, MP4 of GIF",
      description:
        "Windows-desktopapplicatie die een YouTube-video via de URL downloadt als MP3, MP4 of geanimeerde GIF. Eén installatieprogramma met FFmpeg inbegrepen, dat bij het opstarten controleert op updates.",
      role: "Enige ontwikkelaar",
      videoDescription:
        "De video toont het downloaden van de audio van een YouTube-video als MP3 via het adres, het resulterende bestand in het tabblad Bestanden, en het afspelen ervan in de mediaspeler van Windows.",
    },
    repartitor: {
      summary: "Teksten verdelen onder vertalers",
      description:
        "Webapplicatie voor een vertaaldienst: de dispatcher wijst elke tekst toe aan een vertaler en een redacteur, en volgt daarna de deadlines en de voortgang.",
      role: "Back-end",
      videoDescription:
        "De video toont de startpagina, de keuze van een rol (dispatcher of vertaler), de lijst van teksten met hun deadline en de stand van hun vertaling en redactie, de teksten die aan een vertaler zijn toegewezen, en daarna de statistiekenpagina.",
    },
    "module-odoo-interview": {
      summary: "Feedbackbeheer geïntegreerd in Odoo",
      description:
        "Odoo 18-module voor feedback op sollicitatiegesprekken, met vragen gescoord per vaardigheid, en een Django-website die de feedback filtert op vaardigheid, functie, score en datum.",
      role: "Back-end",
      videoDescription:
        "De video toont de module in de app-catalogus van Odoo, de interviewvragen gescoord per vaardigheid, en daarna de bijbehorende website waar de feedback van sollicitatiegesprekken wordt gefilterd op vaardigheid, functie, score en datum.",
    },
    oxono: {
      summary: "Strategisch bordspel Oxono, tegen de computer",
      description:
        "Desktopversie van het strategische bordspel Oxono, in Java 21 en JavaFX, tegen de computer: elke beurt verplaatst een speler een X- of O-totem en legt er een fiche naast; wie als eerste 4 fiches van dezelfde kleur of met hetzelfde symbool op een rij heeft, wint. Instelbare bordgrootte, elke actie ongedaan maken en opnieuw uitvoeren.",
      role: "Enige ontwikkelaar",
      videoDescription:
        "De video toont het instellen van een spel (niveau van de computer, grootte van het bord), en daarna beurten tegen de computer: een totem verplaatsen, een fiche leggen waarbij het vak groen kleurt als de zet toegestaan is en rood als dat niet zo is, een zet ongedaan maken, tot de roze speler wint met 4 X-fiches op een rij.",
    },
    synthesizer: {
      summary: "C++-synthesizer met twee oscillatoren",
      description:
        "Kleine synthesizer in C++: één of twee oscillatoren (sinus, blok, zaagtand), envelope, filter en delay, bespeeld op een klavier met 13 toetsen.",
      role: "Enige ontwikkelaar",
      videoDescription:
        "De video toont het instellen van de synthesizer: golfvorm, tweede oscillator, attack en release, afsnijfrequentie en resonantie van de filter, delay, met noten gespeeld op de 13 toetsen.",
    },
    wordeul: {
      summary: "Wordle in puur JavaScript, met woorden van 5 tot 10 letters",
      description:
        "Woordspel in de stijl van Wordle, in puur JavaScript: woorden van 5 tot 10 letters, een geheim woord dat verborgen wordt ingetypt of willekeurig gekozen, en een virtueel toetsenbord dat de status van elke letter toont.",
      role: "Enige ontwikkelaar",
      videoDescription:
        "De video toont het instellen van een spel (geheim woord verborgen ingetypt of willekeurig gekozen, aantal pogingen), en daarna pogingen die letter per letter gekleurd worden: groen als de letter op de juiste plaats staat, geel als ze op de verkeerde plaats staat, rood als ze ontbreekt; het virtuele toetsenbord neemt die kleuren over.",
    },
  },
} satisfies Translations;
