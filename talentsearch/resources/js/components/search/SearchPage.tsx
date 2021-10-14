import { imageUrl } from "@common/helpers/router";
import React from "react";
import { defineMessages, useIntl } from "react-intl";
import { BASE_URL } from "../../talentSearchConstants";

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
  return (
    <>
      <div
        data-h2-position="b(relative)"
        data-h2-padding="b(bottom, l) l(bottom, none)"
        className="hero"
        style={{
          background: `linear-gradient(70deg, rgba(103, 76, 144, 0.9), rgba(29, 44, 76, 1)), url(${imageUrl(
            BASE_URL,
            "hero-background-search.png",
          )})`,
          backgroundSize: "cover",
          backgroundBlendMode: "multiply",
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
          data-h2-position="b(relative) s(relative) m(relative) l(absolute)"
          data-h2-bg-color="b(white)"
          data-h2-margin="b(top-bottom, xs) b(right-left, xs) l(right-left, xxl)"
          data-h2-padding="b(top-bottom, m) b(right-left, m) l(top-bottom, l) l(right-left, m)"
          data-h2-radius="b(s)"
          data-h2-shadow="b(s)"
          className="hero-sub"
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
        data-h2-margin="b(right-left, s)"
        data-h2-padding="b(top, xl) b(bottom, s) b(right-left, s) l(top, xxl) l(bottom, l) l(right-left, xl)"
      >
        <h2
          data-h2-font-color="b(black)"
          data-h2-font-weight="b(300)"
          data-h2-margin="b(all, none)"
        >
          {intl.formatMessage(messages.pageHowToHeading)}
        </h2>
        <p>{intl.formatMessage(messages.pageHowToContent)}</p>
      </div>
    </>
  );
};

export default SearchPage;
