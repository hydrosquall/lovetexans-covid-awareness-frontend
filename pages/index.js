import Head from 'next/head'

import React, { useState, useCallback, useMemo } from "react";
import { Formik } from "formik";
import axios from "axios";
import { useQuery } from "react-query";

import { Input, Segment, Button, Header } from "semantic-ui-react";
import queryState from "query-state";
import { titleCase } from "title-case";
import copy from "copy-to-clipboard";


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
                  content: "Search",
                  onClick: handleSubmit,
                  style: { fontSize: 16 }
                }}
                type="text"
                name="address"
                fluid={true}
                style={{  fontSize: 16 }}
                placeholder={"Ex: Houston, TX or 23 Main Street, Abilene, TX Zipcode"}
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.address}
                loading={Boolean(props.isLoading)}
                iconPosition="left"
                icon='search'
              />
          </form>
        )}
      </Formik>

      <style jsx>{`
        .form-inline {
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
          Over{" "}
          <strong>
            <span id="oneHourCases"> {oneHourPositives}</span> confirmed cases
          </strong>{" "}
          and{" "}
          <strong>
            <span id="oneHourDeaths">{oneHourDeaths}</span> Deaths
          </strong>{" "}
          are within a 1-hour drive of you.
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
        <div id="americanTotal" style={{ paddingBottom: 15 }}>
          <a href={"#"} style={{ float: "left" }}>
            Watch a video about how this tool was built and why
          </a>
          <div style={{ float: "right" }}>
            <span> Updated: March 28 at 8:00 PM </span> CST
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
          padding-bottom: 5px;
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

  const appState = useMemo(() => {
    return queryState();
  }, []);

  // Eventual listener
  const [address, setAddressRaw] = useState( titleCase(appState.get("address") || "")
  );
  const setAddress = useCallback((address) => {
    appState.set("address", address);
    setAddressRaw(address);
  }, [setAddressRaw]);

  const normalizedAddress = useMemo(() => {
    // Normalization to help with cache busting
    // Normalize whitespace
    return address
      .trim()
      .split(/\s+/)
      .join(" ")
      .toLowerCase();
  }, [address])

  const { status, data: summaryData, error, isFetching } = useQuery(
    normalizedAddress,
    getSummaryData
  );

  return (
    <>
      <div className="container">
        <Header
          as="h1"
          style={{
            paddingTop: `1em`,
            paddingBottom: "0.5em",
            fontWeight: 700,
            fontSize: "2.5rem"
          }}
        >
          Officially Reported Covid-19 Cases Near You
        </Header>
        <Segment style={{ fontSize: 15 }}>
          {normalizedAddress === "" && (
            <p>
              Enter any Texan City or Address to find nearby COVID-19 cases.
            </p>
          )}
          <div style={{ minHeight: 130 }}>
            <AddressForm
              setAddress={setAddress}
              initialAddress={titleCase(address.toLowerCase())}
              isLoading={normalizedAddress && isFetching}
            />
            {isFetching && normalizedAddress && (
              <div>
                Submitted! Due to high demand, this may take a few moments to
                load.
              </div>
            )}
            {!isFetching && summaryData && <Summary data={summaryData} />}
          </div>
        </Segment>

        <iframe src={getMapUrl(normalizedAddress)} id="map" frameBorder={0} />
        <div style={{ marginTop: 10 }}>
          <div style={{ float: "right" }}>
            data:{" "}
            <a href="https://www.dshs.texas.gov/coronavirus/">Texas DSHS</a>
          </div>
          <div style={{ float: "left" }}>
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
        <div style={{ paddingTop: 15 }}>
          <Button
            onClick={() => {
              copy(window.location);
            }}
          >
            To SHARE this page, click to copy to clipboard
          </Button>
          {/* <span>{process.browser && window.location}</span> */}
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
