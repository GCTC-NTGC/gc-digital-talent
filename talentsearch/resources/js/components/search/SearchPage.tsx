import { Button } from "@common/components";
import { getLocale } from "@common/helpers/localize";
import { imageUrl } from "@common/helpers/router";
import React from "react";
import { defineMessages, useIntl } from "react-intl";
import { Pool } from "../../api/generated";
import { BASE_URL } from "../../talentSearchConstants";
import EstimatedCandidates from "./EstimatedCandidates";
import SearchForm from "./SearchForm";

const messages = defineMessages({
  pageTitle: {
    defaultMessage: "Search the Digital Talent Pool",
    description: "Title displayed in the hero section of the Search page.",
  },
  pageAboutHeading: {
    defaultMessage: "About the CS - Digital Talent Pool",
    description:
      "Heading displayed in the About area of the hero section of the Search page.",
  },
  pageAboutContent: {
    defaultMessage:
      "This pool is open to most departments and agencies. Candidates in the pool vary from just starting their career to seasoned professionals with several years of work experience. This is an ongoing recruitment pool, which means new candidates are being added every week.",
    description:
      "Content displayed in the About area of the hero section of the Search page.",
  },
  pageHowToHeading: {
    defaultMessage: "How to use this tool",
    description:
      "Heading displayed in the How To area of the hero section of the Search page.",
  },
  pageHowToContent: {
    defaultMessage:
      "Use the filters below to specify your hiring needs. At any time you can look at the results located at the bottom of this page to see how many candidates match the requirements you have entered. When you are comfortable with the filters you have selected, click the Request Candidates button to add more details and submit a request form.",
    description:
      "Content displayed in the How To area of the hero section of the Search page.",
  },
});

export const SearchPage: React.FC = () => {
  const intl = useIntl();
  const locale = getLocale(intl);

  // TODO: Replace fake data with data fetched from api.
  const pool: Pool | null = {
    id: "",
    owner: {
      id: "",
      email: "",
      firstName: "",
      lastName: "",
      telephone: "",
      preferredLang: null,
    },
    name: {
      en: "",
      fr: "",
    },
    description: {
      en: "",
      fr: "",
    },
    classifications: [],
  };
  const totalEstimatedCandidates = 0;

  return (
    <>
      <div
        data-h2-position="b(relative)"
        data-h2-padding="b(bottom, l)"
        data-h2-margin="b(bottom, xxl)"
        style={{
          background: `linear-gradient(70deg, rgba(103, 76, 144, 0.9), rgba(29, 44, 76, 1)), url(${imageUrl(
            BASE_URL,
            "hero-background-search.png",
          )})`,
          backgroundSize: "cover",
          backgroundBlendMode: "multiply",
          minHeight: "15rem",
        }}
      >
        <h1
          data-h2-margin="b(all, none)"
          data-h2-padding="b(top, l) b(right-left, s)"
          data-h2-text-align="b(center)"
          data-h2-font-color="b(white)"
          data-h2-font-weight="b(800)"
          style={{ letterSpacing: "-2px" }}
        >
          {intl.formatMessage(messages.pageTitle)}
        </h1>
        <div
          data-h2-position="b(static) m(absolute)"
          data-h2-bg-color="b(white)"
          data-h2-margin="b(top-bottom, xs) b(right-left, xs) s(right-left, xxl)"
          data-h2-padding="b(top-bottom, m) b(right-left, m) l(top-bottom, l) l(right-left, m)"
          data-h2-radius="b(s)"
          data-h2-shadow="b(s)"
          style={{ bottom: "-5rem" }}
        >
          <h2
            data-h2-font-color="b(black)"
            data-h2-font-weight="b(300)"
            data-h2-margin="b(all, none)"
          >
            {intl.formatMessage(messages.pageAboutHeading)}
          </h2>
          <p>{intl.formatMessage(messages.pageAboutContent)}</p>
        </div>
      </div>
      <div
        data-h2-flex-grid="b(top, contained, flush, xl)"
        data-h2-container="b(center, l)"
      >
        <div data-h2-flex-item="b(1of1) s(2of3)" style={{ paddingBottom: "0" }}>
          <h2
            data-h2-font-color="b(black)"
            data-h2-font-weight="b(300)"
            data-h2-margin="b(all, none)"
          >
            {intl.formatMessage(messages.pageHowToHeading)}
          </h2>
          <p>{intl.formatMessage(messages.pageHowToContent)}</p>
          {/* TODO: Replace component with wrapper component that fetches data from api */}
          <SearchForm
            totalEstimatedCandidates={totalEstimatedCandidates}
            classifications={[]}
            cmoAssets={[]}
            operationalRequirements={[]}
          />
        </div>
        <div
          data-h2-flex-item="b(1of1) s(1of3)"
          data-h2-visibility="b(hidden) s(visible)"
          data-h2-position="b(sticky)"
          style={{ top: "0", right: "0" }}
        >
          <EstimatedCandidates
            totalEstimatedCandidates={totalEstimatedCandidates}
          />
        </div>
        <div data-h2-flex-item="b(1of1)" style={{ paddingTop: "0" }}>
          <div
            data-h2-shadow="b(m)"
            data-h2-padding="b(top-bottom, xs) b(left, s)"
            data-h2-border="b(darkgray, left, solid, l)"
          >
            <p data-h2-margin="b(bottom, none)">
              {intl.formatMessage({
                defaultMessage: "We can still help!",
                description:
                  "Heading for helping user if no candidates matched the filters chosen.",
              })}
            </p>
            <p data-h2-margin="b(top, xxs)" data-h2-font-size="b(caption)">
              {intl.formatMessage(
                {
                  defaultMessage:
                    "If there are no matching candidates <a>Get in touch!</a>",
                  description:
                    "Message for helping user if no candidates matched the filters chosen.",
                },
                {
                  a: (msg: string): JSX.Element => (
                    <a href="/search" data-h2-font-weight="b(700)">
                      {msg}
                    </a>
                  ),
                },
              )}
            </p>
          </div>
          <div
            data-h2-shadow="b(m)"
            data-h2-border="b(lightnavy, left, solid, l)"
            data-h2-margin="b(top, s) b(bottom, m)"
            data-h2-flex-grid="b(middle, contained, flush, xl)"
          >
            <div
              data-h2-flex-item="b(1of1) m(1of2)"
              style={{ padding: "0", paddingLeft: "1rem" }}
            >
              <p data-h2-margin="b(bottom, none)" data-h2-font-weight="b(700)">
                {pool.name?.[locale]
                  ? pool.name?.[locale]
                  : intl.formatMessage({
                      defaultMessage: "N/A",
                      description:
                        "Text shown when the filter was not selected",
                    })}
              </p>
              <p
                data-h2-margin="b(top, xxs) b(bottom, m)"
                data-h2-font-weight="b(100)"
              >
                {intl.formatMessage(
                  {
                    defaultMessage:
                      "There are <span>{totalEstimatedCandidates}</span> matching candidates in this pool",
                    description:
                      "Message for total estimated candidates box next to search form.",
                  },
                  {
                    span: (msg: string): JSX.Element => (
                      <span
                        data-h2-font-weight="b(700)"
                        data-h2-font-color="b(lightpurple)"
                      >
                        {msg}
                      </span>
                    ),
                    totalEstimatedCandidates,
                  },
                )}
              </p>
              <p
                data-h2-margin="b(bottom, none)"
                data-h2-font-size="b(caption)"
              >
                {intl.formatMessage({ defaultMessage: "Pool Owner" })}:{" "}
                {pool.owner?.firstName
                  ? pool.owner?.firstName
                  : intl.formatMessage({
                      defaultMessage: "N/A",
                      description:
                        "Text shown when the filter was not selected",
                    })}{" "}
                {pool.owner?.lastName
                  ? pool.owner?.lastName
                  : intl.formatMessage({
                      defaultMessage: "N/A",
                      description:
                        "Text shown when the filter was not selected",
                    })}
              </p>
              <p data-h2-margin="b(bottom, s)" data-h2-font-size="b(caption)">
                {pool.description?.[locale]
                  ? pool.description?.[locale]
                  : intl.formatMessage({
                      defaultMessage: "N/A",
                      description:
                        "Text shown when the filter was not selected",
                    })}
              </p>
            </div>
            <div
              data-h2-flex-item="b(1of1) m(1of2)"
              data-h2-display="b(flex)"
              data-h2-justify-content="b(center) m(flex-end)"
            >
              <Button color="cta" mode="solid">
                {intl.formatMessage({
                  defaultMessage: "Request Candidates",
                  description:
                    "Button link message on search page that takes user to the request form.",
                })}
              </Button>
            </div>
          </div>
          <a
            href="/search"
            data-h2-font-size="b(caption)"
            data-h2-font-weight="b(700)"
          >
            {intl.formatMessage({
              defaultMessage: "Not what you're looking for? Get in touch!",
              description:
                "Message for helping user if no candidates matched the filters chosen.",
            })}
          </a>
        </div>
      </div>
    </>
  );
};

export default SearchPage;
