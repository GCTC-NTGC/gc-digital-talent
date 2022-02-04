import * as React from "react";
import { imageUrl } from "@common/helpers/router";
import { useIntl } from "react-intl";
import { useTalentSearchRoutes } from "../../talentSearchRoutes";

const SearchHeading: React.FunctionComponent = () => {
  const intl = useIntl();
  const paths = useTalentSearchRoutes();
  return (
    <header>
      <div
        data-h2-position="b(relative)"
        data-h2-padding="b(bottom, l)"
        data-h2-margin="b(bottom, xxl)"
        style={{
          background: `linear-gradient(70deg, rgba(103, 76, 144, 0.9), rgba(29, 44, 76, 1)), url(${imageUrl(
            paths.home(),
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
          {intl.formatMessage({
            defaultMessage: "Search the Digital Talent Pool",
            description:
              "Title displayed in the hero section of the Search page.",
          })}
        </h1>
        <div
          data-h2-bg-color="b(white)"
          data-h2-margin="b(top, xs) b(bottom, -xxl) b(right-left, xs) s(right-left, xxl)"
          data-h2-padding="b(top, m) b(bottom, s) b(right-left, m)"
          data-h2-radius="b(s)"
          data-h2-shadow="b(s)"
        >
          <h2
            data-h2-font-color="b(black)"
            data-h2-font-weight="b(300)"
            data-h2-margin="b(all, none)"
          >
            {intl.formatMessage({
              defaultMessage: "About the Digital Talent Pool",
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
    </header>
  );
};

export default SearchHeading;
