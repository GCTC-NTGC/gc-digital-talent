import { useIntl } from "react-intl";
import { ReactNode } from "react";
import { ClientLoaderFunction, redirect } from "react-router";

import {
  AlertDialog,
  Notice,
  Button,
  Heading,
  Link,
  Ul,
  Container,
} from "@gc-digital-talent/ui";
import {
  LOGOUT_REASON_KEY,
  LogoutReason,
  POST_LOGOUT_OVERRIDE_PATH_KEY,
  useAuthentication,
} from "@gc-digital-talent/auth";
import { commonMessages } from "@gc-digital-talent/i18n";
import { getLogger } from "@gc-digital-talent/logger";

import Hero from "~/components/Hero";
import SEO from "~/components/SEO/SEO";
import useRoutes from "~/hooks/useRoutes";
import useBreadcrumbs from "~/hooks/useBreadcrumbs";
import authMessages from "~/messages/authMessages";
import useReturnPath from "~/hooks/useReturnPath";
import { urlMatchesAppHostName } from "~/utils/utils";

const supportLink = (chunks: ReactNode, path: string) => (
  <Link href={path} state={{ referrer: window.location.href }} color="black">
    {chunks}
  </Link>
);

export const clientLoader: ClientLoaderFunction = ({ request }) => {
  const logger = getLogger();
  const url = new URL(request.url);
  const from = url.searchParams.get("from");
  if (from && (urlMatchesAppHostName(from) || from.startsWith("/"))) {
    // eslint-disable-next-line @typescript-eslint/only-throw-error
    throw redirect(from);
  }

  const overridePath = sessionStorage.getItem(POST_LOGOUT_OVERRIDE_PATH_KEY);
  if (overridePath) {
    sessionStorage.removeItem(POST_LOGOUT_OVERRIDE_PATH_KEY);
    if (overridePath.startsWith("/")) {
      window.location.href = overridePath; // do a hard redirect here because redirectUri may exist in another router entrypoint (eg admin)
      return null;
    }
    logger.warning(
      `Retrieved an unsafe uri from POST_LOGOUT_URI: ${overridePath}`,
    );
  }

  return null;
};

export const Component = () => {
  const intl = useIntl();
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
        <Notice.Root color="warning" mode="card">
          <Notice.Title defaultIcon as="h2">
            {intl.formatMessage({
              defaultMessage: "Your session has expired. Please sign in again.",
              id: "qFIyZv",
              description:
                "Title for the alert displayed after a user signs out",
            })}
          </Notice.Title>
          <Notice.Content>
            <p>
              {intl.formatMessage({
                defaultMessage:
                  "To sign back in, you'll need to use your GCKey username and password. We hope to see you soon!",
                id: "NZ3laJ",
                description: "Message displayed to a user after signing out",
              })}
            </p>
          </Notice.Content>
        </Notice.Root>
      );
      break;
    case "user-deleted":
      alert = (
        <Notice.Root color="warning" mode="card">
          <Notice.Title defaultIcon as="h2">
            {intl.formatMessage({
              defaultMessage: "User account deleted",
              id: "eMrYDr",
              description:
                "Title for the alert displayed after a user signs into a deleted account",
            })}
          </Notice.Title>
          <Notice.Content>
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
          </Notice.Content>
        </Notice.Root>
      );
      break;
    default:
      alert = (
        <Notice.Root color="success" mode="card">
          <Notice.Title defaultIcon as="h2">
            {intl.formatMessage({
              defaultMessage: "You've successfully signed out of the platform",
              id: "F1OHq7",
              description:
                "Title for the alert displayed after a user signs out",
            })}
          </Notice.Title>
          <Notice.Content>
            <p>
              {intl.formatMessage({
                defaultMessage:
                  "To sign back in, you'll need to use your GCKey username and password. We hope to see you soon!",
                id: "NZ3laJ",
                description: "Message displayed to a user after signing out",
              })}
            </p>
          </Notice.Content>
        </Notice.Root>
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
      <Container size="sm" className="my-18">
        {alert}
        <Heading size="h3" className="mt-18 mb-6 font-normal">
          {intl.formatMessage({
            defaultMessage: "Quick Links",
            id: "Igrveg",
            description:
              "Title displayed for helpful links on logged out page.",
          })}
        </Heading>
        <p className="mb-3">
          {intl.formatMessage({
            defaultMessage:
              "Not ready to leave just yet? Head back to the homepage, check out new opportunities, or learn more about some of the research behind this platform.",
            id: "248YQT",
            description:
              "Description of the links presented on the logged out page.",
          })}
        </p>
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
            <Link href={paths.jobs()}>
              {intl.formatMessage({
                defaultMessage: "View open pools",
                id: "FtlwFY",
                description: "Link text to view all open pools",
              })}
            </Link>
          </li>
          <li>
            <Link href={paths.tcReport()} external>
              {intl.formatMessage({
                defaultMessage: "Talent Cloud report",
                id: "L9mWLV",
                description: "Link text to read the report on talent cloud",
              })}
            </Link>
          </li>
        </Ul>
      </Container>
      <AlertDialog.Root open={loggedIn}>
        <AlertDialog.Content>
          <AlertDialog.Title>
            {intl.formatMessage(authMessages.signOut)}
          </AlertDialog.Title>
          <AlertDialog.Description>
            <p className="text-xl/[1.1] lg:text-2xl/[1.1]">
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
