import { Phone } from "lucide-react";
import { useId } from "react";
import type { PhoneChannel } from "../../data/contact.ts";
import { useLanguage } from "../../i18n/useLanguage.ts";
import { useTranslations } from "../../i18n/useTranslations.ts";
import { describeAvailability } from "./availability.ts";
import styles from "./ContactDetails.module.css";
import { CopyField } from "./CopyField.tsx";

interface PhoneDetailsProps {
  readonly channel: PhoneChannel;
}

/**
 * Content of the phone dialog: the number, built only now that the dialog is
 * open, the hours at which to call, written in the page language, and a link
 * that starts a call.
 */
export function PhoneDetails({ channel }: PhoneDetailsProps) {
  const texts = useTranslations();
  const language = useLanguage();
  const headingId = useId();
  const number = channel.reveal();
  const lines = describeAvailability(channel.availability, language);

  return (
    <>
      <CopyField value={number} />
      <section aria-labelledby={headingId} className={styles.section}>
        <h3 id={headingId} className={styles.heading}>
          {texts.contact.phone.availabilityHeading}
        </h3>
        <dl className={styles.schedule}>
          {lines.map((line) => (
            <div key={line.days} className={styles.row}>
              <dt>{line.days}</dt>
              <dd>{line.hours}</dd>
            </div>
          ))}
        </dl>
        <p className={styles.note}>{texts.contact.phone.timeZone}</p>
      </section>
      {/* The tel: address has no spaces, whatever the display format. */}
      <a href={`tel:${number.replaceAll(" ", "")}`} className={styles.action}>
        <Phone size={18} aria-hidden="true" />
        {texts.contact.phone.call}
      </a>
    </>
  );
}
