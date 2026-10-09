import { ArrowLeft } from "lucide-react";
import { useState, type CSSProperties } from "react";
import { Link } from "react-router";
import { AUTHOR_NAME } from "../../data/author.ts";
import { CONTACT_CHANNELS } from "../../data/contact.ts";
import { useLocalizedPath } from "../../i18n/useLanguage.ts";
import { useTranslations } from "../../i18n/useTranslations.ts";
import { ContactBubble } from "./ContactBubble.tsx";
import { ContactDialog, type DialogChannel } from "./ContactDialog.tsx";
import styles from "./ContactPage.module.css";

/** Angle of the first bubble: straight above the title. */
const FIRST_ANGLE_DEG = -90;

/**
 * Contact page: the ways to reach the author as bubbles spread evenly on a
 * ring around the page title. Profiles open in a new tab; the other channels
 * open their dialog.
 */
export function ContactPage() {
  const texts = useTranslations();
  const localize = useLocalizedPath();
  const [openChannel, setOpenChannel] = useState<DialogChannel | null>(null);
  const step = 360 / CONTACT_CHANNELS.length;

  return (
    <main className={styles.page}>
      <title>{`${texts.contact.title} — ${AUTHOR_NAME}`}</title>
      <Link to={localize("/")} className={styles.back}>
        <ArrowLeft size={18} aria-hidden="true" />
        {texts.contact.back}
      </Link>
      <div className={styles.ring}>
        <div className={styles.center}>
          <h1 className={styles.title}>{texts.contact.title}</h1>
          <p className={styles.intro}>{texts.contact.intro}</p>
        </div>
        <ul className={styles.channels}>
          {CONTACT_CHANNELS.map((channel, index) => {
            // Custom properties are not part of React's CSSProperties type, hence the cast.
            const style = { "--angle": `${FIRST_ANGLE_DEG + index * step}deg` } as CSSProperties;
            return (
              <li key={channel.id} className={styles.place} style={style}>
                <ContactBubble
                  channel={channel}
                  onOpenDialog={() => {
                    if (channel.kind !== "link") {
                      setOpenChannel(channel);
                    }
                  }}
                />
              </li>
            );
          })}
        </ul>
      </div>
      <ContactDialog channel={openChannel} onClose={() => setOpenChannel(null)} />
    </main>
  );
}
