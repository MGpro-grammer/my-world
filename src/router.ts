import { createBrowserRouter } from "react-router";
import App from "./App.tsx";
import { HomePage } from "./features/home/HomePage.tsx";
import { NotFoundPage } from "./features/not-found/NotFoundPage.tsx";
import { ProjectPage } from "./features/project-page/ProjectPage.tsx";

/**
 * Every page of the site and its address.
 * `App` is the shared layout: its wave background stays in place while the
 * pages change inside it.
 */
export const router = createBrowserRouter([
  {
    path: "/",
    Component: App,
    children: [
      { index: true, Component: HomePage },
      { path: "projects/:projectId", Component: ProjectPage },
      { path: "*", Component: NotFoundPage },
    ],
  },
]);
