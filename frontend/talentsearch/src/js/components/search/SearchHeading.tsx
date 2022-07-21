import * as React from "react";
import { imageUrl } from "@common/helpers/router";
import { useIntl } from "react-intl";
import { useTalentSearchRoutes } from "../../talentSearchRoutes";

const SearchHeading: React.FunctionComponent = () => {
  const intl = useIntl();
  const paths = useTalentSearchRoutes();
  return (
    <header data-h2-background-color="base(dt-gray.15)">
      <div
        data-h2-padding="base(x2.5, 0, x4, 0) p-tablet(x4, 0, x6, 0)"
        style={{
          background: `linear-gradient(70deg, rgba(103, 76, 144, 0.9), rgba(29, 44, 76, 1)), url(${imageUrl(
            paths.home(),
            "hero-background-search.png",
          )})`,
          backgroundSize: "cover",
          backgroundBlendMode: "multiply",
        }}
      >
        <div data-h2-container="base(center, medium, x1) p-tablet(center, medium, x2)">
          <h1
            data-h2-font-size="base(h1, 1)"
            data-h2-text-align="base(center)"
            data-h2-color="base(dt-white)"
            data-h2-font-weight="base(700)"
            style={{ letterSpacing: "-2px" }}
          >
            {intl.formatMessage({
              defaultMessage: "Search the Digital Talent Pool",
              description:
                "Title displayed in the hero section of the Search page.",
            })}
          </h1>
        </div>
      </div>
      <div data-h2-margin="base(-x2, 0, 0, 0) p-tablet(-x4, 0, 0, 0)">
        <div data-h2-container="base(center, medium, x1) p-tablet(center, medium, x2)">
          <div
            data-h2-background-color="base(dt-white)"
            data-h2-padding="base(x1) p-tablet(x3)"
            data-h2-radius="base(s)"
            data-h2-text-align="base(center)"
            data-h2-shadow="base(s)"
          >
            <h2
              data-h2-color="base(dt-black)"
              data-h2-margin="base(0, 0, x1, 0)"
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
      </div>
    </header>
  );
};

export default SearchHeading;
