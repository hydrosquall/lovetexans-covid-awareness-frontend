// CSS
import App from "next/app";

// Alex custom styles
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/css/bootstrap-theme.min.css";
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
    clientToken: "pub50cd0786e6da033ae81f65e910f2baa7",
    applicationId: "bc89c30a-e7c7-4b39-b829-b7682f14d269",
    datacenter: "us",
    resourceSampleRate: 100,
    sampleRate: 100
  });
}

export default App;
