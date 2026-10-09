import type { CSSProperties } from "react";
import type { ContactChannel } from "../../data/contact.ts";
import { useTranslations } from "../../i18n/useTranslations.ts";
import styles from "./ContactBubble.module.css";

interface ContactBubbleProps {
  /** Way to reach the author shown by the bubble. */
  readonly channel: ContactChannel;
  /** Asks to show the dialog of a channel that has one (every kind but `link`). */
  readonly onOpenDialog: () => void;
}

/**
 * Round bubble of one way to reach the author, with its name always shown
 * under it. A profile opens in a new tab; every other channel opens its
 * dialog on the same page.
 */
export function ContactBubble({ channel, onOpenDialog }: ContactBubbleProps) {
  const texts = useTranslations();
  const name = texts.contact.channels[channel.id];
  // Custom properties are not part of React's CSSProperties type, hence the cast.
  const style = { "--accent": channel.accentColor } as CSSProperties;
  const picture =
    channel.icon.kind === "lucide" ? (
      <channel.icon.icon size={28} aria-hidden="true" />
    ) : (
      <img src={channel.icon.src} alt="" className={styles.logo} />
    );
  const content = (
    <>
      <span className={styles.circle}>{picture}</span>
      <span className={styles.name}>{name}</span>
    </>
  );

  if (channel.kind === "link") {
    return (
      <a
        href={channel.url}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.bubble}
        style={style}
      >
        {content}
        <span className="visually-hidden">{texts.common.opensInNewTab}</span>
      </a>
    );
  }
  return (
    <button
      type="button"
      className={styles.bubble}
      style={style}
      aria-haspopup="dialog"
      onClick={onOpenDialog}
    >
      {content}
    </button>
  );
}
