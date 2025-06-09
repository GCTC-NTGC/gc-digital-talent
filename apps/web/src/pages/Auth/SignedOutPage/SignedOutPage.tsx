import { useIntl } from "react-intl";
import { ReactNode } from "react";

import {
  AlertDialog,
  Alert,
  Button,
  Heading,
  Link,
  Ul,
} from "@gc-digital-talent/ui";
import {
  LOGOUT_REASON_KEY,
  LogoutReason,
  useAuthentication,
} from "@gc-digital-talent/auth";
import { commonMessages, getLocale } from "@gc-digital-talent/i18n";

import Hero from "~/components/Hero";
import SEO from "~/components/SEO/SEO";
import useRoutes from "~/hooks/useRoutes";
import useBreadcrumbs from "~/hooks/useBreadcrumbs";
import authMessages from "~/messages/authMessages";
import useReturnPath from "~/hooks/useReturnPath";

const supportLink = (chunks: ReactNode, path: string) => (
  <Link href={path} state={{ referrer: window.location.href }} color="black">
    {chunks}
  </Link>
);

export const Component = () => {
  const intl = useIntl();
  const locale = getLocale(intl);
  const { loggedIn, logout } = useAuthentication();
  const paths = useRoutes();
  const returnPath = useReturnPath(paths.applicantDashboard());

  const logoutReason = localStorage.getItem(
    LOGOUT_REASON_KEY,
  ) as LogoutReason | null; // no way to make compile time guarantees on this

  let alert;
  switch (logoutReason) {
    case "session-expired":
      alert = (
        <Alert.Root type="warning" live={false}>
          <Alert.Title>
            {intl.formatMessage({
              defaultMessage: "Your session has expired. Please sign in again.",
              id: "qFIyZv",
              description:
                "Title for the alert displayed after a user signs out",
            })}
          </Alert.Title>
          <p>
            {intl.formatMessage({
              defaultMessage:
                "To sign back in, you'll need to use your GCKey username and password. We hope to see you soon!",
              id: "NZ3laJ",
              description: "Message displayed to a user after signing out",
            })}
          </p>
        </Alert.Root>
      );
      break;
    case "user-deleted":
      alert = (
        <Alert.Root type="warning" live={false}>
          <Alert.Title>
            {intl.formatMessage({
              defaultMessage: "User account deleted",
              id: "eMrYDr",
              description:
                "Title for the alert displayed after a user signs into a deleted account",
            })}
          </Alert.Title>
          <p>
            {intl.formatMessage(
              {
                defaultMessage:
                  "This user account has been deleted. Please <inlineLink>contact us</inlineLink> if you have any questions.",
                id: "DZfLMk",
                description:
                  "Message displayed to a user after signing into a deleted account",
              },
              {
                inlineLink: (chunks: ReactNode) =>
                  supportLink(chunks, paths.support()),
              },
            )}
          </p>
        </Alert.Root>
      );
      break;
    default:
      alert = (
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
                "To sign back in, you'll need to use your GCKey username and password. We hope to see you soon!",
              id: "NZ3laJ",
              description: "Message displayed to a user after signing out",
            })}
          </p>
        </Alert.Root>
      );
  }

  const pageTitle = intl.formatMessage({
    defaultMessage: "See you next time!",
    id: "cZmuts",
    description: "Title for the page users land on after successful logout.",
  });

  const crumbs = useBreadcrumbs({
    crumbs: [
      {
        label: pageTitle,
        url: paths.loggedOut(),
      },
    ],
  });

  return (
    <>
      <SEO title={pageTitle} />
      <Hero title={pageTitle} crumbs={crumbs} />
      <div
        data-h2-wrapper="base(center, small, x1) p-tablet(center, small, x2)"
        data-h2-margin="base(x3, 0)"
      >
        {alert}
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
          <Ul>
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
          </Ul>
        </div>
      </div>
      <AlertDialog.Root open={loggedIn}>
        <AlertDialog.Content>
          <AlertDialog.Title>
            {intl.formatMessage(authMessages.signOut)}
          </AlertDialog.Title>
          <AlertDialog.Description>
            <p data-h2-font-size="base(h5, 1)">
              {intl.formatMessage({
                defaultMessage: "Are you sure you would like to sign out?",
                id: "mNNgEF",
                description:
                  "Question displayed when authenticated user lands on /logged-out.",
              })}
            </p>
          </AlertDialog.Description>
          <AlertDialog.Footer>
            <AlertDialog.Action>
              <Button
                color="primary"
                type="button"
                onClick={() => {
                  logout();
                }}
              >
                {intl.formatMessage(authMessages.signOut)}
              </Button>
            </AlertDialog.Action>
            <AlertDialog.Cancel>
              <Link color="warning" mode="inline" href={returnPath}>
                {intl.formatMessage(commonMessages.cancel)}
              </Link>
            </AlertDialog.Cancel>
          </AlertDialog.Footer>
        </AlertDialog.Content>
      </AlertDialog.Root>
    </>
  );
};

Component.displayName = "SignedOutPage";

export default Component;
