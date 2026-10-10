import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import "@fontsource-variable/outfit";
import "./styles/global.css";
import { routes } from "./routes.ts";

const router = createBrowserRouter(routes);
const container = document.getElementById("root")!;
const app = (
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);

// A prerendered page already holds its HTML: React takes it over instead of
// drawing it again. The bare address and the "page not found" page come empty.
if (container.hasChildNodes()) {
  hydrateRoot(container, app);
} else {
  createRoot(container).render(app);
}
