// CSS
import App from "next/app";

import "semantic-ui-css/semantic.min.css";
import ReactGA from "react-ga";
import { datadogRum } from "@datadog/browser-rum";

// Analytics on clientside only
// https://stackoverflow.com/questions/55151041/window-is-not-defined-in-nextjs-react-app/55151122
const ANALYTICS_ID = "UA-134441849-4";
if (process.browser) {
  ReactGA.initialize(ANALYTICS_ID);
  ReactGA.pageview(window.location.pathname + window.location.search);

  datadogRum.init({
    clientToken: "pubec0cd7c11ee53d65f9469cefba029553",
    applicationId: "48ad9f71-e441-4f15-9047-a0a8a65c5b49"
  });
}

export default App;
