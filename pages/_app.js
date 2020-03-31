// CSS
import App from "next/app";

import "semantic-ui-css/semantic.min.css";
import ReactGA from "react-ga";
import { datadogRum } from "@datadog/browser-rum";

// Analytics on clientside only
// https://stackoverflow.com/questions/55151041/window-is-not-defined-in-nextjs-react-app/55151122
const ANALYTICS_ID = "UA-134441849-4";
if (process.browser && process.NODE_ENV !== 'development') {
  ReactGA.initialize(ANALYTICS_ID);
  ReactGA.pageview(window.location.pathname + window.location.search);

  datadogRum.init({
    clientToken: "pub135234c64a0ef4da1367a965b5cf2baa",
    applicationId: "da0319ea-a96e-4d30-adf8-68e72b0b7a36"
  });
}

export default App;
