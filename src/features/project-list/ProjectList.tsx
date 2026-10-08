import type { CSSProperties } from "react";
import { Link } from "react-router";
import { CONTACT_BUBBLE } from "../../data/contact.ts";
import { PROJECTS } from "../../data/projects.ts";
import { useLocalizedPath } from "../../i18n/useLanguage.ts";
import { useTranslations } from "../../i18n/useTranslations.ts";
import styles from "./ProjectList.module.css";

/**
 * Plain list of the projects, then the contact card: the fallback view of
 * the home page, for visitors who prefer a simple, scannable layout to the
 * bubbles.
 */
export function ProjectList() {
  const texts = useTranslations();
  const localize = useLocalizedPath();
  const ContactIcon = CONTACT_BUBBLE.icon;
  // Custom properties are not part of React's CSSProperties type, hence the cast.
  const contactStyle = { "--accent": CONTACT_BUBBLE.accentColor } as CSSProperties;

  return (
    <div className={styles.container}>
      <nav aria-label={texts.home.projectsLabel}>
        <ul className={styles.list}>
          {PROJECTS.map((project) => {
            const Icon = project.icon;
            // Custom properties are not part of React's CSSProperties type, hence the cast.
            const style = { "--accent": project.accentColor } as CSSProperties;
            return (
              <li key={project.id}>
                <Link
                  to={localize(`/projects/${project.id}`)}
                  className={styles.item}
                  style={style}
                >
                  <span className={styles.icon}>
                    <Icon size={24} aria-hidden="true" />
                  </span>
                  <span className={styles.text}>
                    <span className={styles.name}>{project.name}</span>{" "}
                    <span className={styles.summary}>{texts.projects[project.id].summary}</span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className={`${styles.list} ${styles.contact}`}>
        <Link to={localize("/contact")} className={styles.item} style={contactStyle}>
          <span className={styles.icon}>
            <ContactIcon size={24} aria-hidden="true" />
          </span>
          <span className={styles.text}>
            <span className={styles.name}>{texts.contact.title}</span>{" "}
            <span className={styles.summary}>{texts.home.contactSummary}</span>
          </span>
        </Link>
      </div>
    </div>
  );
}
