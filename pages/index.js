import Head from 'next/head'

import React, { useState, useEffect, useMemo } from "react";
import { Formik } from "formik";
import axios from "axios";
import { useQuery } from "react-query";

import { Input } from "semantic-ui-react";

// API Fetching
const LION_BASE_URL = "https://cvro944efg.execute-api.us-east-1.amazonaws.com/dev";
const getMapUrl = (address) => {
  return `${LION_BASE_URL}/lion_map?address=${encodeURIComponent(address)}`
}
const getSummaryUrl = () => {
  return `${LION_BASE_URL}/lion_summary`;
};

const getSummaryData = async (address) => {
  const { data } = await axios(getSummaryUrl(), { params: { address }, crossorigin: true });
  return data;
};


const AddressForm = (props) => {
  return (
    <>
      <Formik
        initialValues={{ address: props.initialAddress }}
        validate={values => {
          const errors = {};
          if (!values.address) {
            errors.address = "Required";
          }

          return errors;
        }}
        onSubmit={(values, { setSubmitting }) => {
          setSubmitting(true);
          props.setAddress(values.address);
          setTimeout(() => {
            setSubmitting(false);
          }, 2000);
        }}
      >
        {({ values, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
          <form onSubmit={handleSubmit} className="form-inline">
              <Input
                action={{
                  content: "Search Cases",
                  onClick: handleSubmit,
                  style: { fontSize: 16 }
                }}
                type="text"
                name="address"
                style={{ width: "700px", fontSize: 16 }}
                placeholder="Type any Texan City or Address to find nearby COVID-19 cases."
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.address}
                disabled={isSubmitting}
              />
          </form>
        )}
      </Formik>

      <style jsx>{`
        .form-inline {
          margin-top: 1em;
          margin-bottom: 1em;
        }
      `}</style>
    </>
  );
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
          <a href={"#"} style={{ float: "left" }}>
            Watch a video about how this tool was built and why
          </a>
          <div style={{ float: "right" }}>
            <span> Updated: March 28 at 12:00 PM </span> CST
          </div>
        </div>
      </div>
      <style jsx>{`
        #textDescription {
          margin-top: 1em;
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
        }

        .texasInfo {
          font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
          font-size: 1.2em;
          padding-top: 10px;
        }
      `}</style>
    </>
  );
}

const App = () => {
  const [address, setAddress] = useState('');
  const cleanAddress = useMemo(() => {
    // Normalization to help with cache busting
    return address.trim().toLowerCase();
  }, [address])

  const { status, data: summaryData, error, isFetching } = useQuery(
    cleanAddress,
    getSummaryData
  );

  return (
    <>
      <div className="container">
        <div id="title">Officially Reported Covid-19 Cases Near You</div>
        <AddressForm setAddress={setAddress} initialAddress={cleanAddress} />

        {!isFetching && summaryData && <Summary data={summaryData} />}
        {isFetching && cleanAddress && (
          <div>
            Submitted! Due to high demand, this may take a few moments to load.
          </div>
        )}

        <iframe src={getMapUrl(cleanAddress)} id="map" frameBorder={0} />

        <div style={{ marginTop: 20}}>
          <div style={{ float: "right" }}>
            data:{" "}
            <a href="https://www.dshs.texas.gov/coronavirus/">Texas DSHS</a>
          </div>
          <div style={{ float: "left"}}>
            <img
              src="f3_logo_small.png"
              style={{ width: "20px", height: "20px" }}
            />{" "}
            Feedback?{" "}
            <a href="mailto:alex@f3healthcare.com">Email the F3 Health Team</a>
          </div>
        </div>
      </div>
      <div className="container">
        <div className="texasInfo">
          Learn more about how{" "}
          <a
            style={{ color: "red" }}
            href="https://www.hopkinsmedicine.org/health/conditions-and-diseases/coronavirus/coronavirus-social-distancing-and-self-quarantine"
          >
            Social Distancing can save Texans' Lives
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
      `}</style>
    </>
  );
}

const Home = () => (
  <div className="container">
    <Head>
      <title>Covid Cases Near You (Texas)</title>
      <link rel="icon" href="/f3_logo_small.png" />
      <meta
        name="viewport"
        content="width=device-width,
                initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
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
