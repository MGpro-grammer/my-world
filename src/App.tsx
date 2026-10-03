import { Outlet } from "react-router";
import { WaveBackground } from "./components/WaveBackground/WaveBackground.tsx";

/**
 * Layout shared by every page: the wave background, with the current page
 * drawn on top of it. The background is never unmounted when the page
 * changes, so the waves keep running.
 */
function App() {
  return (
    <>
      <WaveBackground />
      <Outlet />
    </>
  );
}

export default App;
