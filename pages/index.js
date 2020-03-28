import Head from 'next/head'

import React, { useState, useEffect } from 'react';
import { Formik } from "formik";
import axios from "axios";

import ReactGA from "react-ga";

const ANALYTICS_ID = "UA-134441849-4";
if (window && window.location) {
  ReactGA.initialize(ANALYTICS_ID);
  ReactGA.pageview(window.location.pathname + window.location.search);

}

// API Fetching
const LION_BASE_URL = "https://cvro944efg.execute-api.us-east-1.amazonaws.com/dev";
const getMapUrl = (address) => {
  return `${LION_BASE_URL}/lion_map?address=${encodeURIComponent(address)}`
}
const getSummaryUrl = () => {
  return `${LION_BASE_URL}/lion_summary`;
};

const AddressForm = (props) => {
  return <Formik
    initialValues={{ email: "", password: "" }}
    validate={values => {
      const errors = {};
      if (!values.address) {
        errors.address = "Required";
      }

      return errors;
    }}
    onSubmit={(values, { setSubmitting }) => {
      console.log("submitting");
      setSubmitting(true);
      props.setAddress(values.address);
      setTimeout(() => {
        setSubmitting(false);
      }, 2000)
    }}
  >
    {({
      values,
      handleChange,
      handleBlur,
      handleSubmit,
      isSubmitting
    }) => (
        <form onSubmit={handleSubmit} className="form-inline">
          <div className="form-group mb-2">
            <input
              type="text"
              name="address"
              className="form-control"
              placeholder="101 AnyStreet, AnyCity, TX, ZipCode"
              style={{ width: "300px" }}
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.address}
            />
          </div>
          <div className="form-group mx-sm-3 mb-2"></div>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting}
          >
            Submit
        </button>
          {isSubmitting && <span> Submitted! </span>}
          {/* <button type="submit" className="btn btn-primary" onclick="getLocation()">
        Try Automatic Geolocation
      </button> */}
        </form>
      )}
  </Formik>;
}

const Summary = (props) => {
  const {
    oneHourDeaths,
    oneHourPositives,
    texasDeaths,
    texasPositives
  } = props.data;

  return (
    <>
    <div id="textDescription">
      <div id="oneHourData">
        There are at least{" "}
        <strong>
          <span id="oneHourCases"> {oneHourPositives}</span> confirmed cases
        </strong>{" "}
        and{" "}
        <strong>
          <span id="oneHourDeaths">{oneHourDeaths}</span> Deaths
        </strong>{" "}
        within about a 1-hour drive of you.
      </div>
      <div className="texasInfo">
        Texas has at least{" "}
        <strong>
          <span id="texasCases">{texasPositives}</span> confirmed cases
        </strong>{" "}
        and{" "}
        <strong>
          <span id="texasDeaths">{texasDeaths}</span> Deaths
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
    <style jsx>{`
      .form-inline {
          margin-top: 1em;
          margin-bottom: 1em;
        }

        .btn {
          padding: 10px 15px;
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

const App = () => {
  const [address, setAddress] = useState('N Miller St, Rising Star, TX 76471');
  const [summaryData, setSummaryData] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const url = getSummaryUrl();
      const result = await axios(url, { params: { address }, crossorigin: true });
      setSummaryData(result.data);
    }
    fetchData();
  }, [address]);


  return (
    <>
      <div className="container">
        <div id="title">Officially Reported Covid-19 Cases Near You</div>
        <AddressForm setAddress={setAddress} />

        {summaryData && <Summary data={summaryData} />}
        <iframe src={getMapUrl(address)} id="map" frameBorder={0} />
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
      {/* <link
        rel="stylesheet"
        href="https://maxcdn.bootstrapcdn.com/font-awesome/4.6.3/css/font-awesome.min.css"
      /> */}
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
