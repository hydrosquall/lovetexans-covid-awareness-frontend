import axios from "axios";
import copy from "copy-to-clipboard";

import Head from "next/head";
import queryState from "query-state";
import React, { useCallback, useMemo, useState } from "react";
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

import { ReactSEOMetaTags } from "react-seo-meta-tags";

import {
  Button,
  Header,
  Icon,
  List,
  Segment,
  Modal,
  Embed,
  Image
} from "semantic-ui-react";

import { useSpring, animated } from "react-spring";

import { format } from "d3-format";
import { titleCase } from "title-case";

import { AlgoliaSearch } from "../components/SearchForm/AlgoliaSearch";
import { BasicSearch } from "../components/SearchForm/BasicSearch";

const numberFormatter = format(",");

//github.com/nygardk/react-share#share-button-props
// const LAST_UPDATED = "March 28 at 8:00 PM";
const BUTTON_TITLE = "See the Covid-19 near you. Protect Texans. Stay Home.";
const ALERT_RED = "#e53935";
const BUTTONS = [
  [EmailShareButton, EmailIcon, { subject: BUTTON_TITLE }],
  [
    TwitterShareButton,
    TwitterIcon,
    {
      hashtags: ["COVID19", "FlattenTheCurve", "dataviz", "publichealth"],
      title: BUTTON_TITLE
    }
  ],
  [
    LinkedinShareButton,
    LinkedinIcon,
    {
      summary:
        "Input your address. See the Covid-19 around you. Protect Texans by practicing physical distancing.",
      source: "https://www.f3healthcare.com/",
      title: BUTTON_TITLE
    }
  ],
  [
    FacebookShareButton,
    FacebookIcon,
    {
      quote:
        "Input your address. See the Covid-19 around you. Protect Texans by practicing physical distancing."
    }
  ],
  [RedditShareButton, RedditIcon, { title: BUTTON_TITLE }],
  [TelegramShareButton, TelegramIcon, { title: BUTTON_TITLE }],
  [PocketShareButton, PocketIcon, { title: BUTTON_TITLE }],
  [WhatsappShareButton, WhatsappIcon, { title: BUTTON_TITLE }]
];

// API Fetching
// const LIVE_URL = `https://${LAMBDA_ID}.execute-api.us-east-1.amazonaws.com/dev`;
const LIVE_URL = "";
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

const getDataLastUpdated = async () => {
  const { data } = await axios(`${LION_BASE_URL}/lion_data_update`);
  return data;
};

const getNationalSummary = async () => {
  const { data } = await axios(`${LION_BASE_URL}/national_summary`);
  return data;
};

const VideoModal = props => (
  <Modal basic closeIcon trigger={props.children}>
    <Modal.Header>About this Tool</Modal.Header>
    <Modal.Content>
      <Embed
        id="401929545"
        placeholder="https://i.vimeocdn.com/video/870852202_640.webp"
        source="vimeo"
      />
    </Modal.Content>
  </Modal>
);

const Summary = props => {
  const {
    oneHourDeaths,
    oneHourPositives,
    texasDeaths,
    texasPositives,
    status
  } = props.data;
  const { updateMonth, updateDay, updateHour, updateTimezone } =
    props.updateTimeData || {};
  const { usConfirmed, usDeaths } = props.nationalSummary || {};

  const updateTimeMessage = `${updateMonth}/${updateDay} at ${updateHour}:00 ${updateTimezone}`;
  const nationalMessage = `${numberFormatter(
    usConfirmed
  )} Americans have been infected, ${numberFormatter(usDeaths)} have died.`;

  if (status === "notInTexas") {
    return (
      <p
        style={{
          fontFamily: "Segoe UI, Tahoma, Geneva, Verdana, sans-serif",
          fontSize: "1.2em"
        }}
      >
        {" "}
        {nationalMessage}
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
            {numberFormatter(oneHourPositives)} confirmed cases
          </span>
          {oneHourDeaths > 0 && (
            <>
              {" "}
              and{" "}
              <span id="oneHourDeaths" className="calloutNumber">
                {numberFormatter(oneHourDeaths)} Deaths{" "}
              </span>
            </>
          )}{" "}
          are within a roughly 1-hour drive of you.
        </p>
        <p className="texasInfo">
          Texas has had at least{" "}
          <span id="texasCases" className="calloutNumber">
            {numberFormatter(texasPositives)}
          </span>{" "}
          confirmed cases and{" "}
          <span id="texasDeaths" className="calloutNumber">
            {numberFormatter(texasDeaths)}
          </span>{" "}
          Deaths so far.
        </p>
        <p className="texasInfo">
          {nationalMessage}{" "}
          <a
            href="https://www.wptv.com/news/local-news/water-cooler/please-stay-home-for-us-nurses-make-plea-for-you-to-stay-home-amid-coronavirus"
            target="_blank"
          >
            Protect Texans. Stay home. Stay safe.
          </a>
        </p>
        <div id="videoBlock">
          <VideoModal>
            <a href={"#"} className="video-link">
              Watch a video about how this tool was built and why
            </a>
          </VideoModal>

          <div className="dataSourceLink">
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

        @media (max-width: 501px) {
          #videoBlock {
            height: 30px;
          }
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

        .videoLink {
          float: left;
        }

        .dataSourceLink {
          float: right;
        }
        @media (max-width: 501px) {
          .videoLink {
            margin-top: 15px;
          }
          .dataSourceLink {
            float: left;
            padding-top: 5px;
            height: 20px;
          }
        }
      `}</style>
    </>
  );
};

const formatAddress = address => {
  return titleCase(address.toLowerCase());
};

const App = props => {
  const appState = useMemo(() => {
    return queryState({}, { useSearch: true }); // search instead of hash so that servers get it
  }, []);

  const AddressComponent = useMemo(() => {
    return props.queryParams.basic ? BasicSearch : AlgoliaSearch;
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

  const { data: updateTimeData } = useQuery(
    "dataLastUpdated",
    getDataLastUpdated
  );
  const { data: nationalSummary } = useQuery(
    "nationalSummary",
    getNationalSummary
  );

  const shouldBeTall =
    summaryData &&
    summaryData.status !== "notInTexas" &&
    ((isFetching && status === "loading") || summaryData !== undefined);
  const animatedProps = useSpring({ minHeight: shouldBeTall ? 180 : 50 });

  return (
    <>
      <div className="container">
        <Header
          as="h1"
          style={{
            paddingTop: `.75em`,
            fontWeight: 700,
            fontSize: "2.5rem"
          }}
        >
          See the Covid-19 near you. Protect Texans. Stay Home.
        </Header>

        <Segment style={{ fontSize: 16 }} basic>
          {address === "" && (
            <p>
              Enter any Texan City, Address, or Zipcode to find nearby COVID-19
              cases.
            </p>
          )}
          <animated.div style={animatedProps}>
            <AddressComponent
              setAddress={setAddress}
              initialAddress={formatAddress(address)}
              isLoading={normalizedAddress && isFetching}
            />
            {isFetching && normalizedAddress && (
              <div>
                Submitted! Due to high demand, this may take a few moments to
                load.
              </div>
            )}
            {!isFetching && summaryData && (
              <Summary
                data={summaryData}
                updateTimeData={updateTimeData}
                nationalSummary={nationalSummary}
              />
            )}
            {!summaryData && (
              <>
                <div id="videoBlock" style={{ marginBottom: "10px" }}>
                  <VideoModal>
                    <a href={"#"} className="video-link">
                      Watch a video about how this tool was built and why
                    </a>
                  </VideoModal>
                </div>
                <VideoModal>
                  <Image
                    src="https://i.vimeocdn.com/video/870852202_640.webp"
                    height={150}
                    style={{ cursor: "pointer " }}
                    spaced
                    bordered
                  />
                </VideoModal>
              </>
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
        <div style={{ height: 25, marginTop: 10 }}>
          <div
            style={{ float: "left", display: "flex", alignContent: "center" }}
          >
            <img
              src="f3_logo_small.png"
              style={{ width: "20px", height: "20px", marginRight: "5px" }}
            />{" "}
            Feedback?{"  "}
            <a
              href="mailto:alex@f3healthcare.com"
              style={{ marginLeft: "5px" }}
            >
              Email the F3 Health Team
            </a>
          </div>
          <div
            style={{
              float: "right",
              display: "flex",
              alignContent: "center",
              margin: "0 10px"
            }}
          >
            data:{" "}
            <a
              href="https://www.dshs.texas.gov/coronavirus/"
              target="_blank"
              style={{ marginLeft: "5px" }}
            >
              Texas DSHS
            </a>
            ,{" "}
            <a
              href="https://github.com/CSSEGISandData/COVID-19"
              target="_blank"
              style={{ marginLeft: "5px" }}
            >
              Johns Hopkins CSSE
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

        <div
          style={{
            marginTop: 15,
            width: "100%",
            height: 25,
            marginBottom: "25px"
          }}
          className="attributions"
        >
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
          width: 80%;
          margin-left: auto;
          margin-right: auto;
          margin-bottom: 15px;
        }

        @media (max-width: 501px) {
          .container {
            width: 95% !important;
            margin-left: auto;
            margin-right: auto;
          }
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
    {/* <Head>

    </Head> */}
    <ReactSEOMetaTags
      render={el => (
        <Head>
          <title>Love Texans: Stay home</title>
          <link rel="icon" href="/favicon.ico" />
          <meta
            name="viewport"
            content="width=device-width,
                initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
          />
          {el}
        </Head>
      )}
      website={{
        url: "https://lovetexans.org",
        title: "Love Texans. Stay home.",
        image: "https://lovetexans.org/lovetexans_card.png",
        datePublished: "2020-03-29T13:56:03.123Z",
        language: "en-US",
        author: {
          name: "Cameron Yick"
        },
        description:
          "View COVID-19 cases within driving distance using public data"
      }}
      facebook={{
        title: "Love Texans. Stay home.",
        description:
          "View COVID-19 cases within driving distance using public data",
        image: "https://lovetexans.org/lovetexans_card.png"
      }}
      twitter={{
        twitterUser: "@hydrosquall",
        title: "Love Texans. Stay home.",
        description:
          "View COVID-19 cases within driving distance using public data",
        image: "https://lovetexans.org/lovetexans_card.png"
      }}
    />
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
      .container {
        width: 80%;
        margin-left: auto;
        margin-right: auto;
        margin-bottom: 15px;
      }

      // This is temporarily a global style because width is not exposed
      // as a prop on the semantic-ui
      // API surface area, and class selector specificity wasn't working.
      @media (min-width: 501px) {
        input {
          width: 480px;
        }
      }

      @media (max-width: 501px) {
        .container {
          width: 99% !important;
          margin-left: auto;
          margin-right: auto;
        }
      }

      // Temporary video block
      #videoBlock {
        font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
        font-size: 1em;
        height: 25px;
        margin-top: 10px;
      }
    `}</style>
  </div>
);

Home.getInitialProps = ({ query }) => {
  return { query };
};

export default Home;
