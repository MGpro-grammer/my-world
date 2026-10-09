import { X } from "lucide-react";
import { useEffect, useId, useRef, type CSSProperties, type MouseEvent } from "react";
import type { ContactChannel } from "../../data/contact.ts";
import { useTranslations } from "../../i18n/useTranslations.ts";
import styles from "./ContactDialog.module.css";
import { CvDetails } from "./CvDetails.tsx";
import { EmailDetails } from "./EmailDetails.tsx";
import { PhoneDetails } from "./PhoneDetails.tsx";

/** A channel shown in a dialog: every kind but `link`. */
export type DialogChannel = Exclude<ContactChannel, { kind: "link" }>;

interface ContactDialogProps {
  /** Channel to show, or `null` while the dialog is closed. */
  readonly channel: DialogChannel | null;
  /** Called once the dialog has closed, whatever closed it. */
  readonly onClose: () => void;
}

/**
 * Modal dialog of a contact channel, built on the native `<dialog>` element:
 * the browser keeps the keyboard focus inside it, makes the page behind it
 * inert, closes it on Escape and gives the focus back to the bubble that
 * opened it. A click on the dimmed background or on the close button closes
 * it too.
 */
export function ContactDialog({ channel, onClose }: ContactDialogProps) {
  const texts = useTranslations();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog === null) {
      return;
    }
    if (channel !== null && !dialog.open) {
      dialog.showModal();
    } else if (channel === null && dialog.open) {
      dialog.close();
    }
  }, [channel]);

  // The content fills the dialog, so a click that reaches the dialog itself was on the background.
  const handleClick = (event: MouseEvent<HTMLDialogElement>) => {
    if (event.target === event.currentTarget) {
      event.currentTarget.close();
    }
  };

  return (
    <dialog
      ref={dialogRef}
      className={styles.dialog}
      aria-labelledby={titleId}
      // Lets the style give each kind of channel its own width (the résumé needs more room).
      data-kind={channel?.kind}
      onClose={onClose}
      onClick={handleClick}
    >
      {channel !== null && (
        <div
          className={styles.content}
          // Custom properties are not part of React's CSSProperties type, hence the cast.
          style={{ "--accent": channel.accentColor } as CSSProperties}
        >
          <header className={styles.header}>
            <h2 id={titleId} className={styles.title}>
              {texts.contact.channels[channel.id]}
            </h2>
            <button
              type="button"
              className={styles.close}
              onClick={() => dialogRef.current?.close()}
            >
              <X size={20} aria-hidden="true" />
              <span className="visually-hidden">{texts.common.close}</span>
            </button>
          </header>
          <div className={styles.body}>
            <DialogDetails channel={channel} />
          </div>
        </div>
      )}
    </dialog>
  );
}

/**
 * Picks the content of the dialog from the kind of channel. Every kind must
 * be handled: a new kind of channel is a compile error here until it is.
 */
function DialogDetails({ channel }: { readonly channel: DialogChannel }) {
  switch (channel.kind) {
    case "email":
      return <EmailDetails channel={channel} />;
    case "phone":
      return <PhoneDetails channel={channel} />;
    case "cv":
      return <CvDetails channel={channel} />;
    default:
      return channel satisfies never;
  }
}
