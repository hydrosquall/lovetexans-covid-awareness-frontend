import { shuffle } from "@algolia/client-common";
import algoliasearch from "algoliasearch/lite";
import { Formik } from "formik";
import React, { useState, useMemo, useCallback } from "react";
import { Search } from "semantic-ui-react";

import { titleCase } from "title-case";

const TEXAS_CENTROID = "31.000000,-100.000000";

// Via v3 => v4 migration guide
const places = (appId = "", apiKey = "", options) => {
  const placesClient = algoliasearch(appId, apiKey, {
    hosts: [{ url: "places-dsn.algolia.net" }].concat(
      shuffle([
        { url: "places-1.algolia.net" },
        { url: "places-2.algolia.net" },
        { url: "places-3.algolia.net" }
      ])
    ),
    ...options
  });
  return (query, requestOptions) => {
    return placesClient.transporter.read(
      {
        method: "POST",
        path: "1/places/query",
        data: {
          query
        },
        cacheable: true
      },
      requestOptions
    );
  };
};

const formatAddress = address => {
  return titleCase(address.toLowerCase());
};

export const AlgoliaSearch = props => {
  const [algoliaResults, setAlgoliaResults] = useState([]);
  const searchClient = useMemo(
    () => places("plRIQRLSXSFF", "f5eedaa965332ff27a6230e6cfa5b479"),
    []
  );

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
        onSubmit={values => {
          props.setAddress(formatAddress(values.address));
        }}
      >
        {({ values, handleChange, handleSubmit, setValues, handleBlur }) => {
          const handleSearchChange = useCallback((e, { value }) => {
            handleChange(e);
            searchClient(value, {
              language: "en",
              type: "city",
              countries: ["us"],
              aroundLatLng: TEXAS_CENTROID,
              hitsPerPage: 10
            }).then(results => {
              if (results.hits[0]) {
                setAlgoliaResults(
                  results.hits
                    .filter(hit => hit.administrative[0] === "Texas")
                    .map((hit, i) => {
                      return {
                        title: `${hit.locale_names[0]}, Texas`,
                        description: `${hit.county[0]}`,
                        key: `${hit.objectID}`
                      };
                    })
                );
              }
            });
          }, []);

          const handleSearchSubmit = useCallback((e, { value, result }) => {
            setValues({ address: result.title });
            handleSubmit(e);
          }, []);

          return (
            <form onSubmit={handleSubmit} className="inputForm">
              <Search
                name="address"
                minCharacters={1}
                loading={Boolean(props.isLoading)}
                onResultSelect={handleSearchSubmit}
                onSearchChange={handleSearchChange}
                onBlur={handleBlur}
                selectFirstResult={true}
                placeholder={"Search any Texan City, Zipcode, or Address"}
                className="searchInput"
                fluid
                results={algoliaResults}
                value={values.address}
                noResultsMessage="City not found, but you can still search zipcodes or addresses"
              />
            </form>
          );
        }}
      </Formik>
      <style jsx>
        {`
          .inputForm {
            margin-bottom: 1.3rem;
          }
        `}
      </style>
    </>
  );
};
