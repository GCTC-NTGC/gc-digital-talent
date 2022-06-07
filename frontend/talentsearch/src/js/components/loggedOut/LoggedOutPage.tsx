import React from "react";
import { useIntl } from "react-intl";

import TileLink from "@common/components/TileLink";
import { imageUrl } from "@common/helpers/router";
import { useApiRoutes } from "@common/hooks/useApiRoutes";
import { useDirectIntakeRoutes } from "../../directIntakeRoutes";
import { useTalentSearchRoutes } from "../../talentSearchRoutes";

import TALENTSEARCH_APP_DIR from "../../talentSearchConstants";

const LoggedOutPage: React.FC = () => {
  const intl = useIntl();
  const apiPaths = useApiRoutes();
  const directIntakePaths = useDirectIntakeRoutes();
  const talentPaths = useTalentSearchRoutes();

  /**
   * TO DO:
   *    - Check if user logged in and display logout modal if true
   *    - Add alert component once created in /create-account
   *    - Use auth routes created in register page
   */

  return (
    <>
      <div
        data-h2-padding="b(top-bottom, m) b(right-left, s)"
        data-h2-font-color="b(white)"
        data-h2-text-align="b(center)"
        style={{
          background: `url(${imageUrl(
            TALENTSEARCH_APP_DIR,
            "applicant-profile-banner.png",
          )})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <h1 data-h2-margin="b(top-bottom, l)">
          {intl.formatMessage({
            defaultMessage: "See you next time!",
            description:
              "Title for the page users land on after successful logout.",
          })}
        </h1>
      </div>
      <div data-h2-container="b(center, s)" data-h2-margin="b(top-bottom, xl)">
        {/** TO DO: Add alert here */}
        <h2>
          {intl.formatMessage({
            defaultMessage: "Quick Links",
            description:
              "Title displayed for helpful links on logged out page.",
          })}
        </h2>
        <p>
          {intl.formatMessage({
            defaultMessage:
              "Not ready to leave just yet? Head back to the homepage, check out new opportunities, or learn more about some of the research behind this platform.",
            description:
              "Description of the links presented on the logged out page.",
          })}
        </p>
        <div data-h2-flex-grid="b(normal, contained, flush, m)">
          <div data-h2-flex-item="b(1of1) m(1of3)">
            <TileLink href={talentPaths.home()} color="primary">
              {intl.formatMessage({
                defaultMessage: "Return home",
                description: "Link text to return to the home page",
              })}
            </TileLink>
          </div>
          <div data-h2-flex-item="b(1of1) m(1of3)">
            <TileLink href={directIntakePaths.allPools()} color="primary">
              {intl.formatMessage({
                defaultMessage: "View open pools",
                description: "Link text to view all open pools",
              })}
            </TileLink>
          </div>
          <div data-h2-flex-item="b(1of1) m(1of3)">
            <TileLink href="/talent-cloud/report" color="primary" external>
              {intl.formatMessage({
                defaultMessage: "Talent Cloud report",
                description: "Link text to read the report on talent cloud",
              })}
            </TileLink>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoggedOutPage;
