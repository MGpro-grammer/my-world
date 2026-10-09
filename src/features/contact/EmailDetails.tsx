import { Send } from "lucide-react";
import type { EmailChannel } from "../../data/contact.ts";
import { useTranslations } from "../../i18n/useTranslations.ts";
import styles from "./ContactDetails.module.css";
import { CopyField } from "./CopyField.tsx";

interface EmailDetailsProps {
  readonly channel: EmailChannel;
}

/**
 * Content of the e-mail dialog: the address, built only now that the dialog
 * is open, the response time, and a link that opens the visitor's e-mail
 * application.
 */
export function EmailDetails({ channel }: EmailDetailsProps) {
  const texts = useTranslations();
  const address = channel.reveal();

  return (
    <>
      <CopyField value={address} />
      <p className={styles.text}>{texts.contact.email.message}</p>
      <a href={`mailto:${address}`} className={styles.action}>
        <Send size={18} aria-hidden="true" />
        {texts.contact.email.write}
      </a>
    </>
  );
}
