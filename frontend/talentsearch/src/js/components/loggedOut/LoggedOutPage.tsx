import React from "react";
import { useIntl } from "react-intl";

import TileLink from "@common/components/TileLink";
import imageUrl from "@common/helpers/imageUrl";
import AlertDialog from "@common/components/AlertDialog";
import SEO from "@common/components/SEO/SEO";
import { Alert, Button, Link } from "@common/components";
import { AuthenticationContext } from "@common/components/Auth";
import { getLocale } from "@common/helpers/localize";

import TALENTSEARCH_APP_DIR from "../../talentSearchConstants";
import useRoutes from "../../hooks/useRoutes";

const LoggedOutPage: React.FC = () => {
  const intl = useIntl();
  const locale = getLocale(intl);
  const { loggedIn, logout } = React.useContext(AuthenticationContext);
  const paths = useRoutes();

  const pageTitle = intl.formatMessage({
    defaultMessage: "See you next time!",
    id: "cZmuts",
    description: "Title for the page users land on after successful logout.",
  });

  return (
    <>
      <SEO title={pageTitle} />
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
        <h1 data-h2-margin="base(x2, 0)">{pageTitle}</h1>
      </div>
      <div
        data-h2-container="base(center, small, x1) p-tablet(center, small, x2)"
        data-h2-margin="base(x3, 0)"
      >
        <Alert.Root type="success" live={false}>
          <Alert.Title>
            {intl.formatMessage({
              defaultMessage: "You've successfully logged out of the platform",
              id: "NamQ1+",
              description:
                "Title for the alert displayed after a user logs out",
            })}
          </Alert.Title>
          <p>
            {intl.formatMessage({
              defaultMessage:
                "Remember, to sign back in, you'll need to use your GC Key username and password. We hope to see you soon!",
              id: "6UCzgs",
              description: "Message displayed to a user after logging out.",
            })}
          </p>
        </Alert.Root>
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
            data-h2-flex-grid="base(normal, x.5)"
            style={{ margin: "0 -0.5rem" }}
          >
            <div data-h2-flex-item="base(1of1) l-tablet(1of3)">
              <TileLink href={paths.home()} color="primary">
                {intl.formatMessage({
                  defaultMessage: "Return home",
                  id: "Hgd/PL",
                  description: "Link text to return to the home page",
                })}
              </TileLink>
            </div>
            <div data-h2-flex-item="base(1of1) l-tablet(1of3)">
              <TileLink href={paths.allPools()} color="primary">
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
      <AlertDialog.Root open={loggedIn}>
        <AlertDialog.Content>
          <AlertDialog.Title>
            {intl.formatMessage({
              defaultMessage: "Logout",
              id: "Hiv/2m",
              description:
                "Title for the modal that appears when an authenticated user lands on /logged-out.",
            })}
          </AlertDialog.Title>
          <p data-h2-font-size="base(h5, 1)">
            {intl.formatMessage({
              defaultMessage: "Are you sure you would like to logout?",
              id: "Zx3BVC",
              description:
                "Question displayed when authenticated user lands on /logged-out.",
            })}
          </p>
          <AlertDialog.Footer>
            <AlertDialog.Cancel>
              <Link
                mode="outline"
                color="primary"
                type="button"
                href={paths.myProfile()}
              >
                {intl.formatMessage({
                  defaultMessage: "Cancel",
                  id: "AhNR6n",
                  description: "Link text to cancel logging out.",
                })}
              </Link>
            </AlertDialog.Cancel>
            <AlertDialog.Action>
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
            </AlertDialog.Action>
          </AlertDialog.Footer>
        </AlertDialog.Content>
      </AlertDialog.Root>
    </>
  );
};

export default LoggedOutPage;
