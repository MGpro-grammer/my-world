import type { CSSProperties } from "react";
import { Link } from "react-router";
import { PROJECTS } from "../../data/projects.ts";
import { useTranslations } from "../../i18n/useTranslations.ts";
import styles from "./ProjectList.module.css";

/**
 * Plain list of the projects: the fallback view of the home page, for
 * visitors who prefer a simple, scannable layout to the bubbles.
 */
export function ProjectList() {
  const texts = useTranslations();

  return (
    <nav aria-label={texts.home.projectsLabel} className={styles.container}>
      <ul className={styles.list}>
        {PROJECTS.map((project) => {
          const Icon = project.icon;
          // Custom properties are not part of React's CSSProperties type, hence the cast.
          const style = { "--accent": project.accentColor } as CSSProperties;
          return (
            <li key={project.id}>
              <Link to={`/projects/${project.id}`} className={styles.item} style={style}>
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
  );
}
