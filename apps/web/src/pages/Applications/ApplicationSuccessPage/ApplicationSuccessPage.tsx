import { useIntl } from "react-intl";

import { Alert, Link } from "@gc-digital-talent/ui";
import { getLocale } from "@gc-digital-talent/i18n";

import useRoutes from "~/hooks/useRoutes";
import { GetPageNavInfo } from "~/types/applicationStep";

import ApplicationApi, { ApplicationPageProps } from "../ApplicationApi";
import { useApplicationContext } from "../ApplicationContext";

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
  const locale = getLocale(intl);
  const paths = useRoutes();
  const { currentStepOrdinal, isIAP } = useApplicationContext();
  const pageInfo = getPageInfo({
    intl,
    paths,
    application,
    stepOrdinal: currentStepOrdinal,
  });

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
        {isIAP
          ? intl.formatMessage({
              defaultMessage:
                "Thank you for your interest in becoming an IT apprentice with the Government of Canada. Your lived experience, skills, passion and interests are warmly received and acknowledged. A member of the Office of Indigenous Initiatives team will contact you within the next three to five business days to discuss your application.",
              id: "cTCdw5",
              description:
                "Description of review process and next steps for the IAP applicant.",
            })
          : intl.formatMessage({
              defaultMessage:
                "We'll be in touch if your application matches the criteria outlined by the opportunity. In the meantime, check out the following resources for further information on what might be next.",
              id: "lE92J0",
              description:
                "Description of review process and next steps for the applicant.",
            })}
      </p>
      <ul data-h2-margin-bottom="base(x1.5)">
        {!isIAP && (
          <li data-h2-margin-bottom="base(x.25)">
            <Link
              newTab
              external
              href={
                locale === "en"
                  ? "https://www.tbs-sct.canada.ca/tbsf-fsct/330-60-eng.asp"
                  : "https://www.tbs-sct.canada.ca/tbsf-fsct/330-60-fra.asp"
              }
              data-h2-display="base(inline-block)"
              data-h2-text-align="base(left)"
              data-h2-vertical-align="base(top)"
            >
              {intl.formatMessage({
                defaultMessage: "Complete a security clearance application",
                id: "l5R6Nc",
                description:
                  "Link text for government of canada security clearance forms",
              })}
            </Link>
          </li>
        )}
        <li data-h2-margin-bottom="base(x.25)">
          <Link
            href={paths.profile()}
            data-h2-display="base(inline-block)"
            data-h2-text-align="base(left)"
            data-h2-vertical-align="base(top)"
          >
            {intl.formatMessage({
              defaultMessage: "Update your profile information",
              id: "ytHyUL",
              description:
                "Link text to users profile to update contact information",
            })}
          </Link>
        </li>
        {!isIAP && (
          <li data-h2-margin-bottom="base(x.25)">
            <Link
              href={paths.browsePools()}
              data-h2-display="base(inline-block)"
              data-h2-text-align="base(left)"
              data-h2-vertical-align="base(top)"
            >
              {intl.formatMessage({
                defaultMessage: "Browse for other opportunities",
                id: "M+5+nP",
                description: "Link text for browse jobs page",
              })}
            </Link>
          </li>
        )}
      </ul>
      <p
        data-h2-margin="base(x.5, 0)"
        data-h2-display="base(flex)"
        data-h2-flex-wrap="base(wrap)"
        data-h2-gap="base(x1)"
        data-h2-align-items="base(center)"
      >
        <Link
          href={
            locale === "fr"
              ? "https://forms-formulaires.alpha.canada.ca/fr/id/clxdlhisr00c89erejoc7purn"
              : "https://forms-formulaires.alpha.canada.ca/en/id/clxdlhisr00c89erejoc7purn"
          }
          color="secondary"
          mode="solid"
          external
          newTab
        >
          {intl.formatMessage({
            defaultMessage: "Tell us about your experience",
            id: "k5bZg7",
            description: "Link text for application survey",
          })}
        </Link>
        <Link
          href={paths.profileAndApplications({ fromIapSuccess: isIAP })}
          mode="inline"
          color="secondary"
        >
          {intl.formatMessage({
            defaultMessage: "Return to your dashboard",
            id: "htxH4r",
            description:
              "Link text to navigate to the profile and applications page",
          })}
        </Link>
      </p>
      <Alert.Footer>
        {intl.formatMessage({
          defaultMessage:
            "* Note that your confirmation number can also be found in the Track your applications section on your Profile and applications page.",
          id: "lxDgNf",
          description:
            "Note that the application confirmation number is available on the profile and applications page",
        })}
      </Alert.Footer>
    </Alert.Root>
  );
};

export const Component = () => (
  <ApplicationApi PageComponent={ApplicationSuccess} />
);

Component.displayName = "ApplicationSuccessPage";
