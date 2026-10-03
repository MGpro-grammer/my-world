import { Link, useParams } from "react-router";
import { AUTHOR_NAME } from "../../data/author.ts";
import { findProject } from "../../data/projects.ts";
import { useTranslations } from "../../i18n/useTranslations.ts";
import { NotFoundPage } from "../not-found/NotFoundPage.tsx";

/**
 * Page of one project, found from the `projectId` part of the address.
 * Skeleton only: layout, video and styles come in step 5.6.
 */
export function ProjectPage() {
  const { projectId } = useParams();
  const texts = useTranslations();
  const project = findProject(projectId);

  if (project === undefined) {
    return <NotFoundPage />;
  }
  const projectTexts = texts.projects[project.id];

  return (
    <main>
      <title>{`${project.name} — ${AUTHOR_NAME}`}</title>
      <Link to="/">{texts.projectPage.back}</Link>
      <h1>{project.name}</h1>
      <p>{projectTexts.summary}</p>
      <h2>{texts.projectPage.roleHeading}</h2>
      <p>{projectTexts.role}</p>
      <ul>
        {project.technologies.map((technology) => (
          <li key={technology}>{technology}</li>
        ))}
      </ul>
      <a href={project.repositoryUrl} target="_blank" rel="noopener noreferrer">
        {texts.projectPage.viewOnGitHub}
      </a>
    </main>
  );
}
