import React from "react";
import { useIntl } from "react-intl";

import { Alert, Link } from "@gc-digital-talent/ui";
import { getLocale } from "@gc-digital-talent/i18n";

import Hero from "~/components/Hero/Hero";
import SEO from "~/components/SEO/SEO";
import useRoutes from "~/hooks/useRoutes";
import useBreadcrumbs from "~/hooks/useBreadcrumbs";

const UserDeletedPage = () => {
  const intl = useIntl();
  const locale = getLocale(intl);
  const paths = useRoutes();

  const pageTitle = intl.formatMessage({
    defaultMessage: "Account deleted",
    id: "YUx5ti",
    description:
      "Title for the page users land on if their account was deleted.",
  });

  const crumbs = useBreadcrumbs({
    crumbs: [
      {
        label: pageTitle,
        url: paths.userDeleted(),
      },
    ],
  });

  const inlineLink = (chunks: React.ReactNode) => (
    <Link
      href={paths.support()}
      state={{ referrer: window.location.href }}
      color="black"
    >
      {chunks}
    </Link>
  );

  return (
    <>
      <SEO title={pageTitle} />
      <Hero title={pageTitle} crumbs={crumbs} />
      <div
        data-h2-container="base(center, small, x1) p-tablet(center, small, x2)"
        data-h2-margin="base(x3, 0)"
      >
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
                inlineLink,
              },
            )}
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
          <ul>
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
    </>
  );
};

export default UserDeletedPage;
