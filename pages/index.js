import Head from 'next/head'


const App = () => {

  return (
    <>
      <div className="container">
        <div id="title">Officially Reported Covid-19 Cases Near You</div>
        <form className="form-inline">
          <div className="form-group mb-2">
            <input
              type="text"
              className="form-control"
              id="inputAddress"
              placeholder="101 this street, thisCity, TX, zip"
              style={{ width: "300px" }}
            />
          </div>
          <div className="form-group mx-sm-3 mb-2"></div>
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
          <span> or </span>
          <button
            type="submit"
            className="btn btn-primary"
            onclick="getLocation()"
          >
            Try Automatic Geolocation
          </button>
        </form>
        <div id="textDescription">
          <div id="oneHourData">
            There are at least{" "}
            <strong>
              <span id="oneHourCases" /> confirmed cases
            </strong>{" "}
            and{" "}
            <strong>
              <span id="oneHourDeaths" /> Deaths
            </strong>{" "}
            within about a 1-hour drive of you.
          </div>
          <div className="texasInfo">
            Texas has at least{" "}
            <strong>
              <span id="texasCases" /> confirmed cases
            </strong>{" "}
            and{" "}
            <strong>
              <span id="texasDeaths" /> Deaths
            </strong>{" "}
            so far.
          </div>
          <div className="texasInfo">
            102,302 Americans have been infected.{" "}
            <strong>
              <a
                style={{ color: "red" }}
                href="https://www.wptv.com/news/local-news/water-cooler/please-stay-home-for-us-nurses-make-plea-for-you-to-stay-home-amid-coronavirus"
              >
                Please stay home. Stay safe.{" "}
              </a>
            </strong>
          </div>
          <div id="americanTotal">
            <a href style={{ float: "left" }}>
              Watch a video about how this tool was built and why
            </a>
            <div style={{ float: "right" }}>
              Updated: <span id="updatedMonth" />/<span id="updatedDay" /> at{" "}
              <span id="updatedHour" /> CST
            </div>
          </div>
        </div>
        <iframe
          src="https://cvro944efg.execute-api.us-east-1.amazonaws.com/dev/lion_map?address=3214+Durango+Dr%2C+Pearland%2C+TX+77581"
          id="map"
          frameBorder={0}
        />
        <div style={{ float: "right" }}>
          data: <a href="https://www.dshs.texas.gov/coronavirus/">Texas DSHS</a>
        </div>
        <div style={{ float: "left" }}>
          <img
            src="F3_Logo small.png"
            style={{ width: "50px", height: "10px" }}
          />
          Feedback?{" "}
          <a href="mailto:alex@f3healthcare.com">Email the F3 Health Team</a>
        </div>
      </div>
      <div className="container">
        <div className="texasInfo">
          Learn more about how{" "}
          <a
            style={{ color: "red" }}
            href="https://www.hopkinsmedicine.org/health/conditions-and-diseases/coronavirus/coronavirus-social-distancing-and-self-quarantine"
          >
            Social Distancing can save Texan's Lives
          </a>
        </div>
        <div className="texasInfo">
          Look at the data for the rest of the state on the{" "}
          <a href="https://txdshs.maps.arcgis.com/apps/opsdashboard/index.html#/ed483ecd702b4298ab01e8b9cafc8b83">
            Texas DSHS Covid Dashboard
          </a>
        </div>
      </div>
      <style jsx>{`
        #map {
          position: relative;
          width: 100%;
          height: 420px;
          left: 0%;
          top: 0%;
        }

        .container {
          width: 80%;
          margin-left: auto;
          margin-right: auto;
          margin-bottom: 25px;
        }
        #title {
          font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
          font-size: 2.5em;
          padding-top: 1em;
          padding-bottom: 0.7em;
          font-weight: 700;
        }
        .texasInfo {
          font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
          font-size: 1.2em;
          padding-top: 10px;
        }

        #oneHourData {
          font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
          font-size: 1.5em;
          padding-top: 10px;
        }

        #americanTotal {
          font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
          font-size: 1em;
          padding-top: 10px;
          /* padding-bottom: 1em; */
        }

        #textDescription {
          margin-top: 1em;
        }

        #addressBox {
          display: inline-block;
        }

        .form-inline {
          margin-top: 1em;
          margin-bottom: 1em;
        }

        .btn {
          padding: 10px 15;
          border: 0 none;
          font-weight: 300;
          letter-spacing: 1px;
        }

        .btn:focus,
        .btn:active:focus,
        .btn.active:focus {
          outline: 0 none;
        }

        .btn-primary {
          background: #aab2b4;
          color: #ffffff;
        }

        .btn-primary:hover,
        .btn-primary:focus,
        .btn-primary:active,
        .btn-primary.active,
        .open > .dropdown-toggle.btn-primary {
          background: #94b4be;
        }

        .btn-primary:active,
        .btn-primary.active {
          background: #007299;
          box-shadow: none;
        }
      `}</style>
    </>
  );
}


const Home = () => (
  <div className="container">
    <Head>
      <title>Create Next App</title>
      <link rel="icon" href="/favicon.ico" />
      <meta
        name="viewport"
        content="width=device-width,
                initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
      />
      <link
        rel="stylesheet"
        href="https://maxcdn.bootstrapcdn.com/bootstrap/3.2.0/css/bootstrap.min.css"
      />
      <link
        rel="stylesheet"
        href="https://maxcdn.bootstrapcdn.com/bootstrap/3.2.0/css/bootstrap-theme.min.css"
      />
      <link
        rel="stylesheet"
        href="https://maxcdn.bootstrapcdn.com/font-awesome/4.6.3/css/font-awesome.min.css"
      />
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/leaflet@1.4.0/dist/leaflet.css"
      />
      <link
        rel="stylesheet"
        href="https://rawcdn.githack.com/python-visualization/folium/master/folium/templates/leaflet.awesome.rotate.css"
      />
    </Head>

    <App />

    <style jsx global>{`
      html,
      body {
        width: 100%;
        height: 100%;
        padding: 0;
        margin: 0;
        font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,
          Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
      }
      * {
        box-sizing: border-box;
      }
    `}</style>
  </div>
);

export default Home
