import axios from "axios";
import copy from "copy-to-clipboard";
import { Formik } from "formik";
import Head from "next/head";
import queryState from "query-state";
import React, { useCallback, useMemo, useState, useEffect } from "react";
import { useQuery } from "react-query";
import {
  EmailIcon,
  EmailShareButton,
  FacebookIcon,
  FacebookShareButton,
  LinkedinIcon,
  LinkedinShareButton,
  PocketIcon,
  PocketShareButton,
  RedditIcon,
  RedditShareButton,
  TelegramIcon,
  TelegramShareButton,
  TwitterIcon,
  TwitterShareButton,
  WhatsappIcon,
  WhatsappShareButton
} from "react-share";
import { Button, Header, Icon, Input, List, Segment } from "semantic-ui-react";
import { titleCase } from "title-case";

import { useSpring, animated } from "react-spring";

import { format } from 'd3-format';

const thousandFormatter = format(",");

//github.com/nygardk/react-share#share-button-props
// const LAST_UPDATED = "March 28 at 8:00 PM";
const BUTTON_TITLE = "Officially Reported COVID-19 Cases in Texas: Map";
const ALERT_RED = '#e53935';
const BUTTONS = [
  [EmailShareButton, EmailIcon, { subject: BUTTON_TITLE }],
  [
    TwitterShareButton,
    TwitterIcon,
    { hashtags: ["covid19", "socialdistancing"], title: BUTTON_TITLE }
  ],
  [
    LinkedinShareButton,
    LinkedinIcon,
    {
      summary:
        "Texas friends: See how many COVID cases are within driving distance.",
      source: "https://www.f3healthcare.com/",
      title: BUTTON_TITLE
    }
  ],
  [
    FacebookShareButton,
    FacebookIcon,
    {
      quote:
        "Texas friends: See how many COVID cases are within driving distance."
    }
  ],
  [RedditShareButton, RedditIcon, { title: BUTTON_TITLE }],
  [TelegramShareButton, TelegramIcon, { title: BUTTON_TITLE }],
  [PocketShareButton, PocketIcon, { title: BUTTON_TITLE }],
  [WhatsappShareButton, WhatsappIcon, { title: BUTTON_TITLE }]
];

// API Fetching
// const LAMBDA_ID = "cvro944efg";
// const LIVE_URL = `https://${LAMBDA_ID}.execute-api.us-east-1.amazonaws.com/dev`;
const LIVE_URL = "";
// const CLOUDFRONT_ID = "d2y5qgptjywme4"; // previous test
const CLOUDFRONT_ID = "d2dqkecimxx0hj"; // F3 ID
const CACHED_URL = `https://${CLOUDFRONT_ID}.cloudfront.net`;
const USE_CACHE = true;
const LION_BASE_URL = USE_CACHE ? CACHED_URL : LIVE_URL;

const getMapUrl = address => {
  return `${LION_BASE_URL}/lion_map?address=${encodeURIComponent(address)}`;
};

const getSummaryData = async address => {
  const { data } = await axios(`${LION_BASE_URL}/lion_summary`, {
    params: { address }
  });
  return data;
};

const getDataLastUpdated = async address => {
  const { data } = await axios(`${LION_BASE_URL}/lion_data_update`);
  return data;
};

const AddressForm = props => {
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
          props.setAddress(titleCase(values.address.toLowerCase()));
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
              style={{ fontSize: 16 }}
              placeholder={
                "Ex: Houston, TX or 23 Main Street, Abilene, TX Zipcode"
              }
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.address}
              loading={Boolean(props.isLoading)}
              iconPosition="left"
              icon="search"
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
};

const Summary = props => {
  const {
    oneHourDeaths,
    oneHourPositives,
    texasDeaths,
    texasPositives,
    status
  } = props.data;
  const { updateMonth, updateDay, updateHour, updateTimezone } = props;

  const updateTimeMessage = `${updateMonth}/${updateDay} at ${updateHour}:00 ${updateTimezone}`;

  if (status === "notInTexas") {
    return (
      <p style={{ fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif', fontSize: '1.2em' } }>
        102,302 Americans have been infected.{" "}
        <a
          href="https://www.wptv.com/news/local-news/water-cooler/please-stay-home-for-us-nurses-make-plea-for-you-to-stay-home-amid-coronavirus"
          target="_blank"
          style={{ color: ALERT_RED }}
        >
          Protect Texans. Stay home. Stay safe.
        </a>
      </p>
    );
  }

  return (
    <>
      <div id="textDescription">
        <p id="oneHourData">
          Over{" "}
          <span id="oneHourCases" className="calloutNumber">
            {" "}
            {thousandFormatter(oneHourPositives)} confirmed cases
          </span>
          {oneHourDeaths > 0 && (
            <>
              {" "}
              and{" "}
              <span id="oneHourDeaths">
                {thousandFormatter(oneHourDeaths)} Deaths{" "}
              </span>
            </>
          )}{" "}
          are within a roughly 1-hour drive of you.
        </p>
        <p className="texasInfo">
          Texas has had at least{" "}
          <span id="texasCases" className="calloutNumber">
            {thousandFormatter(texasPositives)}
          </span>{" "}
          confirmed cases and{" "}
          <span id="texasDeaths" className="calloutNumber">
            {thousandFormatter(texasDeaths)}
          </span>{" "}
          Deaths so far.
        </p>
        <p className="texasInfo">
          102,302 Americans have been infected.{" "}
          <a
            href="https://www.wptv.com/news/local-news/water-cooler/please-stay-home-for-us-nurses-make-plea-for-you-to-stay-home-amid-coronavirus"
            target="_blank"
          >
            Protect Texans. Stay home. Stay safe.
          </a>
        </p>
        <div id="americanTotal" style={{ paddingBottom: 20, marginTop: 10 }}>
          <a href={"#"} style={{ float: "left" }}>
            Watch a video about how this tool was built and why
          </a>
          <div style={{ float: "right" }}>
            <span className="updateDate"> Updated: {updateTimeMessage} </span>
          </div>
        </div>
      </div>
      <style jsx>{`
        #textDescription p {
          margin: 8px 0 0;
        }

        #oneHourData {
          font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
          font-size: 1.5em;
        }

        #americanTotal {
          font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
          font-size: 1em;
        }

        .texasInfo {
          font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
          font-size: 1.2em;
        }

        .texasInfo a {
          color: ${ALERT_RED};
        }
        #textDescription .calloutNumber {
          font-weight: bold;
        }

        span.updateDate {
          font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
          font-size: 1em;
          color: #333;
        }
      `}</style>
    </>
  );
};

const App = props => {
  const appState = useMemo(() => {
    return queryState({}, { useSearch: true }); // search instead of hash so that servers get it
  }, []);

  const [address, setAddressRaw] = useState(() => {
    return titleCase(props.queryParams.address || "");
  });

  const setAddress = useCallback(
    address => {
      appState.set("address", address);
      setAddressRaw(address);
    },
    [setAddressRaw]
  );

  const normalizedAddress = useMemo(() => {
    // TODO... remove special characters like commas?
    return address
      .trim()
      .split(/\s+/)
      .join(" ")
      .toLowerCase();
  }, [address]);

  const { status, data: summaryData, error, isFetching } = useQuery(
    normalizedAddress,
    getSummaryData
  );

  const { data: updateTimeData } = useQuery('dataLastUpdated', getDataLastUpdated);

  const shouldBeTall =
    (summaryData && summaryData.status !== 'notInTexas') &&
    ((isFetching && status === "loading") ||
    summaryData !== undefined) ;
  console.log({ summaryData, shouldBeTall });
  const animatedProps = useSpring({ minHeight: shouldBeTall ? 180 : 50 });

  return (
    <>
      <div className="container">
        <Header
          as="h1"
          style={{
            paddingTop: `.75em`,
            paddingBottom: "0.2em",
            fontWeight: 700,
            fontSize: "2.5rem"
          }}
        >
          Officially Reported Covid-19 Cases Near You
        </Header>

        <Segment style={{ fontSize: 16 }}>
          {address === "" && (
            <p>
              Enter any Texan City or Address to find nearby COVID-19 cases.
            </p>
          )}
          <animated.div style={animatedProps}>
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
            {!isFetching && summaryData && (
              <Summary data={summaryData} {...updateTimeData} />
            )}
          </animated.div>
        </Segment>

        <iframe
          src={getMapUrl(normalizedAddress)}
          frameBorder={0}
          style={{
            width: "100%",
            height: "420px",
            position: "relative"
          }}
        ></iframe>
        <div style={{  height: 25, marginTop: 10 }}>
          <div style={{ float: "left" }}>
            <img
              src="f3_logo_small.png"
              style={{ width: "20px", height: "20px" }}
            />{" "}
            Feedback?{" "}
            <a href="mailto:alex@f3healthcare.com">Email the F3 Health Team</a>
          </div>
          <div style={{ float: "right" }}>
            data:{" "}
            <a href="https://www.dshs.texas.gov/coronavirus/" target="_blank">
              Texas DSHS
            </a>
          </div>
        </div>
      </div>
      <div className="container">
        <div>
          <List horizontal style={{ display: "flex", alignItems: "center" }}>
            <List.Item key={"clipboardKey"}>
              <Button
                icon
                labelPosition="left"
                onClick={() => {
                  copy(window.location);
                }}
              >
                <Icon name="copy"></Icon>
                Click to copy link to your clipboard
              </Button>
            </List.Item>
            {BUTTONS.map(
              ([ButtonComponent, IconComponent, extraProps = {}], i) => {
                const url = "https://www.lovetexans.org";
                return (
                  <List.Item key={i}>
                    <ButtonComponent url={url} {...extraProps}>
                      <IconComponent size={32} round={true}></IconComponent>
                    </ButtonComponent>
                  </List.Item>
                );
              }
            )}
          </List>
        </div>
      </div>
      <div className="container">
        <p className="texasInfo">
          Learn more about how{" "}
          <a
            href="https://www.hopkinsmedicine.org/health/conditions-and-diseases/coronavirus/coronavirus-social-distancing-and-self-quarantine"
            target="_blank"
            className="alertLink"
          >
            Social Distancing can save Texans' Lives
          </a>
        </p>
        <p className="texasInfo">
          View data for the rest of the state on the{" "}
          <a href="https://txdshs.maps.arcgis.com/apps/opsdashboard/index.html#/ed483ecd702b4298ab01e8b9cafc8b83">
            Texas DSHS Covid Dashboard
          </a>
        </p>

        <div style={{ marginTop: 15, width: "100%" }} className="attributions">
          <p style={{ float: "left" }}>
            Built with care by{" "}
            <a
              href="https://www.linkedin.com/in/alex-rich-940651a8/"
              target="_blank"
            >
              Alex Rich
            </a>{" "}
            and{" "}
            <a href="https://www.serendipidata.com" target="_blank">
              Cameron Yick
            </a>
          </p>
        </div>
      </div>

      <style jsx>{`
        .container {
          width: 85%;
          margin-left: auto;
          margin-right: auto;
          margin-bottom: 15px;
        }

        .texasInfo {
          font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
          font-size: 1.1em;
        }

        .attributions {
          font-size: 1.1em;
        }

        p.texasInfo {
          margin: 5px 0 0;
        }

        .texasInfo a.alertLink {
          color: ${ALERT_RED};
        }
      `}</style>
    </>
  );
};

const Home = props => (
  <div className="container">
    <Head>
      <title>Love Texans: Stay Home</title>
      <link rel="icon" href="/favicon.ico" />
      <meta
        name="viewport"
        content="width=device-width,
                initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
      />
    </Head>
    <App queryParams={props.query} />
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

Home.getInitialProps = ({ query }) => {
  return { query };
};

export default Home;
