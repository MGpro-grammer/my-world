import { ContactRound, FileText, Mail, Phone, type LucideIcon } from "lucide-react";
import githubLogo from "../assets/brands/github.svg";
import linkedinLogo from "../assets/brands/linkedin.png";

/** Look of the contact bubble on the home page, which opens the contact page. */
export const CONTACT_BUBBLE = {
  icon: ContactRound,
  /** Color of the bubble (at least 7:1 on the background). */
  accentColor: "#e2e8f0",
} as const;

/** Identifier of a way to reach the author; also the key of its texts. */
export type ContactChannelId = "linkedin" | "github" | "email" | "phone" | "cv";

/**
 * Picture of a channel's bubble: a Lucide icon, or a brand's official logo,
 * shown as downloaded from the brand's website and never redrawn.
 */
export type ChannelIcon =
  | { readonly kind: "lucide"; readonly icon: LucideIcon }
  | { readonly kind: "logo"; readonly src: string };

/** What every channel has. */
interface ChannelBase {
  readonly id: ContactChannelId;
  readonly icon: ChannelIcon;
  /** Color of the bubble (at least 7:1 on the background). */
  readonly accentColor: string;
}

/** Profile on another website, opened in a new tab. */
export interface LinkChannel extends ChannelBase {
  readonly kind: "link";
  readonly url: string;
}

/** E-mail address, shown in a dialog. */
export interface EmailChannel extends ChannelBase {
  readonly kind: "email";
  /** Builds the address; it is never stored whole in the published code. */
  readonly reveal: () => string;
}

/** Phone number and the hours at which to call, shown in a dialog. */
export interface PhoneChannel extends ChannelBase {
  readonly kind: "phone";
  /** Builds the number, international format; it is never stored whole in the published code. */
  readonly reveal: () => string;
  readonly availability: readonly AvailabilityRule[];
}

/** Résumé, shown as a picture in a dialog, with its PDF to download. */
export interface CvChannel extends ChannelBase {
  readonly kind: "cv";
  /** Picture of the résumé page, shown in the dialog. */
  readonly image: string;
  /** Width of the picture, in pixels. With the height, it reserves its space before loading. */
  readonly imageWidth: number;
  /** Height of the picture, in pixels. */
  readonly imageHeight: number;
  /** The same résumé as a PDF file. */
  readonly pdf: string;
}

/**
 * One way to reach the author. The `kind` decides what its bubble does:
 * open a profile, or show a dialog of the matching type.
 */
export type ContactChannel = LinkChannel | EmailChannel | PhoneChannel | CvChannel;

/** Day of the week, ISO 8601 numbering: 1 is Monday, 7 is Sunday. */
export type Weekday = 1 | 2 | 3 | 4 | 5 | 6 | 7;

/** Hours, 24-hour clock, e.g. `"08:00"`. */
export type ClockTime = `${number}${number}:${number}${number}`;

/** Range of hours in a day. */
export interface TimeSlot {
  readonly from: ClockTime;
  readonly to: ClockTime;
}

/** Hours at which the author can be called on some days of the week. */
export interface AvailabilityRule {
  readonly days: readonly Weekday[];
  readonly slots: readonly TimeSlot[];
}

/** Time zone of {@link AvailabilityRule} hours. */
export const AVAILABILITY_TIME_ZONE = "Europe/Brussels";

/*
 * The address and the number are kept in pieces, so that robots reading the
 * public repository or the published code find neither of them whole.
 * This stops ordinary robots, not a determined person.
 */
const EMAIL_PARTS = ["pro.georges.mouratidis", "gmail.com"] as const;
const PHONE_PARTS = ["+32", "490", "22", "29", "53"] as const;

/** Address of the author's résumé files, served from `public/cv/`. */
const CV_PATH = `${import.meta.env.BASE_URL}cv/cv-fr`;

/**
 * Every way to reach the author, in display order on the contact page.
 * Adding one means adding one entry here and its texts in each translation
 * file; no component has to change unless it is a new `kind`.
 */
export const CONTACT_CHANNELS: readonly ContactChannel[] = [
  {
    id: "linkedin",
    kind: "link",
    icon: { kind: "logo", src: linkedinLogo },
    accentColor: "#60a5fa",
    url: "https://www.linkedin.com/in/georges-mouratidis-a0b14a399",
  },
  {
    id: "github",
    kind: "link",
    icon: { kind: "logo", src: githubLogo },
    accentColor: "#cbd5e1",
    url: "https://github.com/MGpro-grammer",
  },
  {
    id: "email",
    kind: "email",
    icon: { kind: "lucide", icon: Mail },
    accentColor: "#38bdf8",
    reveal: () => EMAIL_PARTS.join("@"),
  },
  {
    id: "phone",
    kind: "phone",
    icon: { kind: "lucide", icon: Phone },
    accentColor: "#34d399",
    reveal: () => PHONE_PARTS.join(" "),
    availability: [
      {
        days: [1, 2, 4, 5],
        slots: [
          { from: "08:00", to: "10:00" },
          { from: "18:00", to: "20:00" },
        ],
      },
      {
        days: [3],
        slots: [
          { from: "08:00", to: "14:00" },
          { from: "16:00", to: "20:00" },
        ],
      },
      { days: [6, 7], slots: [{ from: "08:00", to: "20:00" }] },
    ],
  },
  {
    id: "cv",
    kind: "cv",
    icon: { kind: "lucide", icon: FileText },
    accentColor: "#fbbf24",
    image: `${CV_PATH}.webp`,
    imageWidth: 1191,
    imageHeight: 1684,
    pdf: `${CV_PATH}.pdf`,
  },
];
