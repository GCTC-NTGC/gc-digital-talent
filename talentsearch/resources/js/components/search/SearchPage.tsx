import React from "react";
import { imageUrl } from "@common/helpers/router";
import { useIntl } from "react-intl";
import { BASE_URL } from "../../talentSearchConstants";
import { SearchFormApi } from "./SearchForm";

export const SearchPage: React.FC = () => {
  const intl = useIntl();

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
          {intl.formatMessage({
            defaultMessage: "Search the Digital Talent Pool",
            description:
              "Title displayed in the hero section of the Search page.",
          })}
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
            {intl.formatMessage({
              defaultMessage: "About the CS - Digital Talent Pool",
              description:
                "Heading displayed in the About area of the hero section of the Search page.",
            })}
          </h2>
          <p>
            {intl.formatMessage({
              defaultMessage:
                "This pool is open to most departments and agencies. Candidates in the pool vary from just starting their career to seasoned professionals with several years of work experience. This is an ongoing recruitment pool, which means new candidates are being added every week.",
              description:
                "Content displayed in the About area of the hero section of the Search page.",
            })}
          </p>
        </div>
      </div>
      <SearchFormApi />
    </>
  );
};

export default SearchPage;
