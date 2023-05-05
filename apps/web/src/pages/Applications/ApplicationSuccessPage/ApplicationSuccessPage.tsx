import React from "react";
import { useIntl } from "react-intl";
import RocketLaunchIcon from "@heroicons/react/20/solid/RocketLaunchIcon";

import { Alert, ExternalLink, Link } from "@gc-digital-talent/ui";
import { useFeatureFlags } from "@gc-digital-talent/env";

import useRoutes from "~/hooks/useRoutes";
import { GetPageNavInfo } from "~/types/poolCandidate";
import { useLocale } from "@gc-digital-talent/i18n";
import ApplicationApi, { ApplicationPageProps } from "../ApplicationApi";

export const getPageInfo: GetPageNavInfo = ({ application, paths, intl }) => {
  const path = paths.applicationSuccess(application.id);
  return {
    title: intl.formatMessage({
      defaultMessage: "We successfully received your application",
      id: "79m9jN",
      description: "Page title for the application success page",
    }),
    subtitle: intl.formatMessage({
      defaultMessage:
        "Get a head start on next steps or check out other opportunities.",
      id: "zJdfyv",
      description: "Subtitle for the application success page",
    }),
    icon: RocketLaunchIcon,
    crumbs: [
      {
        url: path,
        label: intl.formatMessage({
          defaultMessage: "Success",
          id: "bQtRF+",
          description: "Breadcrumb link text for the application success page",
        }),
      },
    ],
    link: {
      url: path,
    },
  };
};

const ApplicationSuccess = ({ application }: ApplicationPageProps) => {
  const intl = useIntl();
  const { locale } = useLocale();
  const { applicantDashboard } = useFeatureFlags();
  const paths = useRoutes();
  const pageInfo = getPageInfo({ intl, paths, application });

  return (
    <Alert.Root type="success" live={false}>
      <Alert.Title>{pageInfo.title}</Alert.Title>
      <p data-h2-margin="base(x.5, 0)">
        {intl.formatMessage(
          {
            defaultMessage:
              "Your confirmation number is: <strong>{id}</strong>",
            id: "/uOExm",
            description: "An application confirmation number",
          },
          {
            id: application.id,
          },
        )}
      </p>
      <p data-h2-margin="base(x.5, 0)">
        {intl.formatMessage({
          defaultMessage:
            "We'll be in touch if your application matches the criteria outlined by the opportunity. In the meantime, check out the following resources for further information on what might be next.",
          id: "lE92J0",
          description:
            "Description of review process and next steps for the applicant.",
        })}
      </p>
      <ul data-h2-margin-bottom="base(x1.5)">
        <li data-h2-margin-bottom="base(x.25)">
          <ExternalLink
            newTab
            href={
              locale === "en"
                ? "https://www.tbs-sct.canada.ca/tbsf-fsct/330-60-eng.asp"
                : "https://www.tbs-sct.canada.ca/tbsf-fsct/330-60-fra.asp"
            }
          >
            {intl.formatMessage({
              defaultMessage: "Find and complete security clearance forms.",
              id: "otUMji",
              description:
                "Link text for government of canada security clearance forms",
            })}
          </ExternalLink>
        </li>
        <li data-h2-margin-bottom="base(x.25)">
          <Link href={paths.myProfile()}>
            {intl.formatMessage({
              defaultMessage:
                "Update profile and contact information to ensure you receive notifications.",
              id: "nFO3Ai",
              description:
                "Link text to users profile to update contact information",
            })}
          </Link>
        </li>
        <li data-h2-margin-bottom="base(x.25)">
          <Link href={`${paths.browsePools()}#ongoingRecruitments`}>
            {intl.formatMessage({
              defaultMessage:
                "Submit an application to ongoing recruitment talent pools.",
              id: "ZTnze/",
              description:
                "Link text to the ongoing recruitments section on the browse page",
            })}
          </Link>
        </li>
      </ul>
      {applicantDashboard && (
        <p data-h2-margin="base(x.5, 0)">
          <Link
            type="button"
            href={paths.dashboard()}
            mode="solid"
            color="primary"
          >
            {intl.formatMessage({
              defaultMessage: "Go to my dashboard",
              id: "pKY4PC",
              description: "Link text to navigate to the applicant dashboard",
            })}
          </Link>
        </p>
      )}
      <p data-h2-font-size="base(caption)">
        {intl.formatMessage({
          defaultMessage:
            "* Note that your confirmation number can also be found on your dashboard.",
          id: "PIzMYn",
          description:
            "Note that the application confirmation number is available on the dashboard",
        })}
      </p>
    </Alert.Root>
  );
};

const ApplicationSuccessPage = () => (
  <ApplicationApi PageComponent={ApplicationSuccess} />
);

export default ApplicationSuccessPage;
