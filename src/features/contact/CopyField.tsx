import { Check, Copy } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useTranslations } from "../../i18n/useTranslations.ts";
import styles from "./CopyField.module.css";

/** How long "Copied" stays shown, in milliseconds. */
const COPIED_DURATION_MS = 2000;

interface CopyFieldProps {
  /** Text shown and copied, e.g. an e-mail address. */
  readonly value: string;
}

/**
 * A value shown large, with a button that copies it to the clipboard and says
 * so for a moment. Screen readers hear the confirmation too.
 *
 * If the browser refuses the copy, the value is selected instead, so that the
 * visitor only has to press Ctrl+C (or use the menu of a phone).
 */
export function CopyField({ value }: CopyFieldProps) {
  const texts = useTranslations();
  const valueRef = useRef<HTMLParagraphElement>(null);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    if (!isCopied) {
      return;
    }
    const timer = window.setTimeout(() => setIsCopied(false), COPIED_DURATION_MS);
    return () => window.clearTimeout(timer);
  }, [isCopied]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setIsCopied(true);
    } catch {
      selectValue(valueRef.current);
    }
  };

  return (
    <div className={styles.field}>
      <p ref={valueRef} className={styles.value} translate="no">
        {value}
      </p>
      <button type="button" className={styles.copy} onClick={() => void handleCopy()}>
        {isCopied ? <Check size={18} aria-hidden="true" /> : <Copy size={18} aria-hidden="true" />}
        {isCopied ? texts.contact.copied : texts.contact.copy}
      </button>
      <span role="status" className="visually-hidden">
        {isCopied ? texts.contact.copied : ""}
      </span>
    </div>
  );
}

/**
 * Selects the whole text of an element, as a fallback when copying fails.
 * @param element - Element whose text to select; nothing happens if `null`.
 */
function selectValue(element: HTMLElement | null): void {
  const selection = window.getSelection();
  if (element === null || selection === null) {
    return;
  }
  const range = document.createRange();
  range.selectNodeContents(element);
  selection.removeAllRanges();
  selection.addRange(range);
}
