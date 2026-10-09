import { Download } from "lucide-react";
import { AUTHOR_NAME } from "../../data/author.ts";
import type { CvChannel } from "../../data/contact.ts";
import { useTranslations } from "../../i18n/useTranslations.ts";
import styles from "./ContactDetails.module.css";

interface CvDetailsProps {
  readonly channel: CvChannel;
}

/**
 * Content of the résumé dialog: the résumé shown as a picture, so that
 * nothing is downloaded without the visitor asking, and a link to its PDF
 * for those who want the file. The picture is requested only when the
 * dialog opens.
 */
export function CvDetails({ channel }: CvDetailsProps) {
  const texts = useTranslations();
  // Name of the saved file, instead of the bare "cv-fr.pdf".
  const fileName = `CV ${AUTHOR_NAME}.pdf`;

  return (
    <>
      <a href={channel.pdf} download={fileName} className={styles.action}>
        <Download size={18} aria-hidden="true" />
        {texts.contact.cv.download}
      </a>
      <img
        src={channel.image}
        width={channel.imageWidth}
        height={channel.imageHeight}
        alt={texts.contact.cv.imageDescription}
        decoding="async"
        className={styles.cv}
      />
    </>
  );
}
