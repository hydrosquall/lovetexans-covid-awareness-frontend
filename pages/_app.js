// CSS
import App from "next/app";

// Alex custom styles
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/css/bootstrap-theme.min.css";

import ReactGA from "react-ga";

// Analytics on clientside only
// https://stackoverflow.com/questions/55151041/window-is-not-defined-in-nextjs-react-app/55151122
const ANALYTICS_ID = "UA-134441849-4";
if (process.browser) {
  ReactGA.initialize(ANALYTICS_ID);
  ReactGA.pageview(window.location.pathname + window.location.search);
  // client-side-only code
}

export default App;
