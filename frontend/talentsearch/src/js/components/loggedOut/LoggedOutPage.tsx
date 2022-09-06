import React from "react";
import { useIntl } from "react-intl";

import TileLink from "@common/components/TileLink";
import { imageUrl, navigate } from "@common/helpers/router";
import Dialog from "@common/components/Dialog";
import { Alert, Button, Link } from "@common/components";
import { AuthenticationContext } from "@common/components/Auth";
import { BellIcon } from "@heroicons/react/outline";
import { getLocale } from "@common/helpers/localize";
import { useDirectIntakeRoutes } from "../../directIntakeRoutes";
import { useTalentSearchRoutes } from "../../talentSearchRoutes";

import TALENTSEARCH_APP_DIR from "../../talentSearchConstants";
import { useApplicantProfileRoutes } from "../../applicantProfileRoutes";

const LoggedOutPage: React.FC = () => {
  const intl = useIntl();
  const locale = getLocale(intl);
  const { loggedIn, logout } = React.useContext(AuthenticationContext);
  const directIntakePaths = useDirectIntakeRoutes();
  const talentPaths = useTalentSearchRoutes();
  const profilePaths = useApplicantProfileRoutes();

  return (
    <>
      <div
        data-h2-padding="base(x1, x.5)"
        data-h2-color="base(dt-white)"
        data-h2-text-align="base(center)"
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
        <h1 data-h2-margin="base(x2, 0)">
          {intl.formatMessage({
            defaultMessage: "See you next time!",
            id: "cZmuts",
            description:
              "Title for the page users land on after successful logout.",
          })}
        </h1>
      </div>
      <div
        data-h2-container="base(center, small, x1) p-tablet(center, small, x2)"
        data-h2-margin="base(x3, 0)"
      >
        <Alert
          type="success"
          icon={<BellIcon style={{ width: "1rem" }} />}
          title={intl.formatMessage({
            defaultMessage: "You've successfully logged out of the platform",
            id: "NamQ1+",
            description: "Title for the alert displayed after a user logs out",
          })}
          message={intl.formatMessage({
            defaultMessage:
              "Remember, to sign back in, you'll need to use your GC Key username and password. We hope to see you soon!",
            id: "6UCzgs",
            description: "Message displayed to a user after logging out.",
          })}
        />
        <h2 data-h2-margin="base(x3, 0, x1, 0)">
          {intl.formatMessage({
            defaultMessage: "Quick Links",
            id: "Igrveg",
            description:
              "Title displayed for helpful links on logged out page.",
          })}
        </h2>
        <p>
          {intl.formatMessage({
            defaultMessage:
              "Not ready to leave just yet? Head back to the homepage, check out new opportunities, or learn more about some of the research behind this platform.",
            id: "248YQT",
            description:
              "Description of the links presented on the logged out page.",
          })}
        </p>
        <div data-h2-margin="base(x1, 0, 0, 0)">
          <div
            data-h2-flex-grid="base(normal, 0, x.5)"
            style={{ margin: "0 -0.5rem" }}
          >
            <div data-h2-flex-item="base(1of1) l-tablet(1of3)">
              <TileLink href={talentPaths.home()} color="primary">
                {intl.formatMessage({
                  defaultMessage: "Return home",
                  id: "Hgd/PL",
                  description: "Link text to return to the home page",
                })}
              </TileLink>
            </div>
            <div data-h2-flex-item="base(1of1) l-tablet(1of3)">
              <TileLink href={directIntakePaths.allPools()} color="primary">
                {intl.formatMessage({
                  defaultMessage: "View open pools",
                  id: "FtlwFY",
                  description: "Link text to view all open pools",
                })}
              </TileLink>
            </div>
            <div data-h2-flex-item="base(1of1) l-tablet(1of3)">
              <TileLink
                href={`/${locale}/talent-cloud/report`}
                color="primary"
                external
              >
                {intl.formatMessage({
                  defaultMessage: "Talent Cloud report",
                  id: "L9mWLV",
                  description: "Link text to read the report on talent cloud",
                })}
              </TileLink>
            </div>
          </div>
        </div>
      </div>
      <Dialog
        confirmation
        centered
        isOpen={loggedIn}
        onDismiss={() => {
          navigate(profilePaths.myProfile());
        }}
        title={intl.formatMessage({
          defaultMessage: "Logout",
          id: "Hiv/2m",
          description:
            "Title for the modal that appears when an authenticated user lands on /logged-out.",
        })}
      >
        <p data-h2-font-size="base(h5, 1)">
          {intl.formatMessage({
            defaultMessage: "Are you sure you would like to logout?",
            id: "Zx3BVC",
            description:
              "Question displayed when authenticated user lands on /logged-out.",
          })}
        </p>
        <Dialog.Footer>
          <div
            data-h2-display="base(flex)"
            data-h2-align-items="base(center)"
            data-h2-justify-content="base(flex-end)"
          >
            <Link
              mode="outline"
              color="primary"
              type="button"
              href={profilePaths.myProfile()}
              external
            >
              {intl.formatMessage({
                defaultMessage: "Cancel",
                id: "AhNR6n",
                description: "Link text to cancel logging out.",
              })}
            </Link>
            <span data-h2-margin="base(0, 0, 0, x.5)">
              <Button
                mode="solid"
                color="primary"
                type="button"
                onClick={() => {
                  logout();
                }}
              >
                {intl.formatMessage({
                  defaultMessage: "Logout",
                  id: "6rhyxk",
                  description: "Link text to logout.",
                })}
              </Button>
            </span>
          </div>
        </Dialog.Footer>
      </Dialog>
    </>
  );
};

export default LoggedOutPage;
