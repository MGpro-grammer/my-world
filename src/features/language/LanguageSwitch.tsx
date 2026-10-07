import { Check, ChevronDown, Globe } from "lucide-react";
import { useEffect, useId, useRef, useState, type FocusEvent, type KeyboardEvent } from "react";
import { Link, useLocation } from "react-router";
import { pathInLanguage } from "../../i18n/languagePaths.ts";
import { saveLanguage } from "../../i18n/languagePreference.ts";
import { LANGUAGE_NAMES, LANGUAGES } from "../../i18n/languages.ts";
import { useLanguage } from "../../i18n/useLanguage.ts";
import { useTranslations } from "../../i18n/useTranslations.ts";
import styles from "./LanguageSwitch.module.css";

/**
 * Language menu in the top-right corner of every page: a globe button that
 * opens the list of languages, each one a link to the current page in that
 * language. Following one changes the address without reloading the page and
 * remembers the choice for the next visit to the bare address.
 *
 * Disclosure pattern: the button only shows or hides the list, which closes
 * again on Escape, on a click outside or when the focus leaves it.
 */
export function LanguageSwitch() {
  const currentLanguage = useLanguage();
  const texts = useTranslations();
  const { pathname, search } = useLocation();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listId = useId();

  // A click or tap anywhere outside the menu closes it.
  useEffect(() => {
    if (!open) {
      return;
    }
    const handlePointerDown = (event: PointerEvent) => {
      if (!(event.target instanceof Node) || !containerRef.current?.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [open]);

  const closeAndFocusButton = () => {
    setOpen(false);
    buttonRef.current?.focus();
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Escape" && open) {
      closeAndFocusButton();
    }
  };

  const handleBlur = (event: FocusEvent) => {
    if (
      !(event.relatedTarget instanceof Node) ||
      !event.currentTarget.contains(event.relatedTarget)
    ) {
      setOpen(false);
    }
  };

  return (
    <nav
      ref={containerRef}
      className={styles.switch}
      aria-label={texts.languageSwitch.label}
      data-open={open}
      onKeyDown={handleKeyDown}
      onBlur={handleBlur}
    >
      <button
        ref={buttonRef}
        type="button"
        className={styles.button}
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen((wasOpen) => !wasOpen)}
      >
        <Globe size={18} aria-hidden="true" />
        <span aria-hidden="true">{currentLanguage.toUpperCase()}</span>
        <span className="visually-hidden" lang={currentLanguage}>
          {LANGUAGE_NAMES[currentLanguage]}
        </span>
        <ChevronDown size={16} aria-hidden="true" className={styles.chevron} />
      </button>
      <ul id={listId} className={styles.list}>
        {LANGUAGES.map((language) => {
          const isCurrent = language === currentLanguage;
          return (
            <li key={language}>
              <Link
                to={pathInLanguage(pathname, language) + search}
                className={styles.link}
                lang={language}
                hrefLang={language}
                aria-current={isCurrent ? "true" : undefined}
                onClick={() => {
                  saveLanguage(language);
                  closeAndFocusButton();
                }}
              >
                <span className={styles.code} aria-hidden="true">
                  {language.toUpperCase()}
                </span>
                {LANGUAGE_NAMES[language]}
                {isCurrent && <Check size={16} aria-hidden="true" className={styles.check} />}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
