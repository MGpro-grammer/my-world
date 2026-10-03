import { Link } from "react-router";
import { AUTHOR_NAME } from "../../data/author.ts";
import { PROJECTS } from "../../data/projects.ts";
import { useTranslations } from "../../i18n/useTranslations.ts";

/**
 * Home page. For now a plain list of links to the projects; the bubbles
 * replace it in step 5.3, and the list itself becomes the fallback view.
 */
export function HomePage() {
  const texts = useTranslations();

  return (
    <main>
      <title>{`${AUTHOR_NAME} — Portfolio`}</title>
      <h1>{AUTHOR_NAME}</h1>
      <p>{texts.home.tagline}</p>
      <nav aria-label={texts.home.projectsLabel}>
        <ul>
          {PROJECTS.map((project) => (
            <li key={project.id}>
              <Link to={`/projects/${project.id}`}>{project.name}</Link>
            </li>
          ))}
        </ul>
      </nav>
    </main>
  );
}
