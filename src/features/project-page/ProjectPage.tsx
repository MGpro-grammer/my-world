import { ArrowLeft, ExternalLink, VideoOff } from "lucide-react";
import type { CSSProperties } from "react";
import { Link, useParams } from "react-router";
import { PageHead } from "../../components/PageHead/PageHead.tsx";
import { AUTHOR_NAME } from "../../data/author.ts";
import { findProject } from "../../data/projects.ts";
import { useLocalizedPath } from "../../i18n/useLanguage.ts";
import { useTranslations } from "../../i18n/useTranslations.ts";
import { NotFoundPage } from "../not-found/NotFoundPage.tsx";
import styles from "./ProjectPage.module.css";
import { ProjectVideo } from "./ProjectVideo.tsx";

/**
 * Page of one project, found from the `projectId` part of the address:
 * back link, title, description, role, technologies, video and GitHub link,
 * all accented with the project's color.
 */
export function ProjectPage() {
  const { projectId } = useParams();
  const texts = useTranslations();
  const localize = useLocalizedPath();
  const project = findProject(projectId);

  if (project === undefined) {
    return <NotFoundPage />;
  }
  const pageTexts = texts.projectPage;
  const projectTexts = texts.projects[project.id];
  const Icon = project.icon;
  // Custom properties are not part of React's CSSProperties type, hence the cast.
  const style = { "--accent": project.accentColor } as CSSProperties;

  return (
    <main className={styles.page} style={style}>
      <PageHead
        title={`${project.name} — ${AUTHOR_NAME}`}
        description={projectTexts.description}
        path={`/projects/${project.id}`}
      />
      <article className={styles.card}>
        <Link to={localize("/")} className={styles.back}>
          <ArrowLeft size={18} aria-hidden="true" />
          {pageTexts.back}
        </Link>

        <header className={styles.header}>
          <span className={styles.icon}>
            <Icon size={32} aria-hidden="true" />
          </span>
          <div>
            <h1 className={styles.title}>{project.name}</h1>
            <p className={styles.kind}>{pageTexts.kind[project.kind]}</p>
          </div>
        </header>

        <p className={styles.description}>{projectTexts.description}</p>

        <section className={styles.section}>
          <h2 className={styles.heading}>{pageTexts.roleHeading}</h2>
          <p className={styles.text}>{projectTexts.role}</p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.heading}>{pageTexts.technologiesHeading}</h2>
          <ul className={styles.technologies}>
            {project.technologies.map((technology) => (
              <li key={technology} className={styles.technology}>
                {technology}
              </li>
            ))}
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.heading}>{pageTexts.videoHeading}</h2>
          {project.video === undefined ? (
            <div className={styles.noVideo}>
              <VideoOff size={32} aria-hidden="true" />
              <p className={styles.text}>{pageTexts.noVideo}</p>
            </div>
          ) : (
            <ProjectVideo clip={project.video} description={projectTexts.videoDescription} />
          )}
        </section>

        <a
          href={project.repositoryUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.github}
        >
          {pageTexts.viewOnGitHub}
          <ExternalLink size={18} aria-hidden="true" />
          <span className="visually-hidden">{texts.common.opensInNewTab}</span>
        </a>
      </article>
    </main>
  );
}
