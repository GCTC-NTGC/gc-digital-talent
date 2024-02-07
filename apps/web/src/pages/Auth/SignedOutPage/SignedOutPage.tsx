import React from "react";
import { useIntl } from "react-intl";

import {
  AlertDialog,
  Alert,
  Button,
  Heading,
  Link,
} from "@gc-digital-talent/ui";
import { useAuthentication } from "@gc-digital-talent/auth";
import { commonMessages, getLocale } from "@gc-digital-talent/i18n";

import Hero from "~/components/Hero/Hero";
import SEO from "~/components/SEO/SEO";
import useRoutes from "~/hooks/useRoutes";
import useBreadcrumbs from "~/hooks/useBreadcrumbs";
import authMessages from "~/messages/authMessages";

const SignedOutPage = () => {
  const intl = useIntl();
  const locale = getLocale(intl);
  const { loggedIn, logout } = useAuthentication();
  const paths = useRoutes();

  const pageTitle = intl.formatMessage({
    defaultMessage: "See you next time!",
    id: "cZmuts",
    description: "Title for the page users land on after successful logout.",
  });

  const crumbs = useBreadcrumbs([
    {
      label: pageTitle,
      url: paths.loggedOut(),
    },
  ]);

  return (
    <>
      <SEO title={pageTitle} />
      <Hero title={pageTitle} crumbs={crumbs} />
      <div
        data-h2-container="base(center, small, x1) p-tablet(center, small, x2)"
        data-h2-margin="base(x3, 0)"
      >
        <Alert.Root type="success" live={false}>
          <Alert.Title>
            {intl.formatMessage({
              defaultMessage: "You've successfully signed out of the platform",
              id: "F1OHq7",
              description:
                "Title for the alert displayed after a user signs out",
            })}
          </Alert.Title>
          <p>
            {intl.formatMessage({
              defaultMessage:
                "Remember, to sign back in, you'll need to use your GCKey username and password. We hope to see you soon!",
              id: "8M/lmC",
              description: "Message displayed to a user after signing out",
            })}
          </p>
        </Alert.Root>
        <Heading
          data-h2-margin="base(x3, 0, x1, 0)"
          size="h3"
          data-h2-font-weight="base(400)"
        >
          {intl.formatMessage({
            defaultMessage: "Quick Links",
            id: "Igrveg",
            description:
              "Title displayed for helpful links on logged out page.",
          })}
        </Heading>
        <p>
          {intl.formatMessage({
            defaultMessage:
              "Not ready to leave just yet? Head back to the homepage, check out new opportunities, or learn more about some of the research behind this platform.",
            id: "248YQT",
            description:
              "Description of the links presented on the logged out page.",
          })}
        </p>
        <div data-h2-margin="base(x.5, 0, 0, 0)">
          <ul data-h2-padding="base(0, 0, 0, x1)">
            <li>
              <Link href={paths.home()}>
                {intl.formatMessage({
                  defaultMessage: "Return home",
                  id: "Hgd/PL",
                  description: "Link text to return to the home page",
                })}
              </Link>
            </li>
            <li>
              <Link href={paths.browsePools()}>
                {intl.formatMessage({
                  defaultMessage: "View open pools",
                  id: "FtlwFY",
                  description: "Link text to view all open pools",
                })}
              </Link>
            </li>
            <li>
              <Link href={`/${locale}/talent-cloud/report`} external>
                {intl.formatMessage({
                  defaultMessage: "Talent Cloud report",
                  id: "L9mWLV",
                  description: "Link text to read the report on talent cloud",
                })}
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <AlertDialog.Root open={loggedIn}>
        <AlertDialog.Content>
          <AlertDialog.Title>
            {intl.formatMessage(authMessages.signOut)}
          </AlertDialog.Title>
          <p data-h2-font-size="base(h5, 1)">
            {intl.formatMessage({
              defaultMessage: "Are you sure you would like to sign out?",
              id: "mNNgEF",
              description:
                "Question displayed when authenticated user lands on /logged-out.",
            })}
          </p>
          <AlertDialog.Footer>
            <AlertDialog.Cancel>
              <Link
                color="primary"
                mode="inline"
                href={paths.profileAndApplications()}
              >
                {intl.formatMessage(commonMessages.cancel)}
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
                {intl.formatMessage(authMessages.signOut)}
              </Button>
            </AlertDialog.Action>
          </AlertDialog.Footer>
        </AlertDialog.Content>
      </AlertDialog.Root>
    </>
  );
};

export default SignedOutPage;
