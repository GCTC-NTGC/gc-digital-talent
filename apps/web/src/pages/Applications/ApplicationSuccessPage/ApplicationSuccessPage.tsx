import { useIntl } from "react-intl";

import { Alert, Link, Ul } from "@gc-digital-talent/ui";
import { getLocale, navigationMessages } from "@gc-digital-talent/i18n";

import useRoutes from "~/hooks/useRoutes";
import { GetPageNavInfo } from "~/types/applicationStep";

import ApplicationApi, { ApplicationPageProps } from "../ApplicationApi";
import { useApplicationContext } from "../ApplicationContext";

export const getPageInfo: GetPageNavInfo = ({ application, paths, intl }) => {
  const path = paths.applicationSuccess(application.id);
  return {
    title: intl.formatMessage({
      defaultMessage: "We've successfully received your application",
      id: "Rped43",
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
      <p className="my-3">
        {intl.formatMessage(
          {
            defaultMessage: "Your application ID is: <strong>{id}</strong>",
            id: "C2urGD",
            description: "An application confirmation number",
          },
          {
            id: application.id,
          },
        )}
      </p>
      {isIAP ? (
        <p className="mt-3 mb-9">
          {intl.formatMessage({
            defaultMessage:
              "Thank you for your interest in becoming an IT apprentice with the Government of Canada. Your lived experience, skills, passion and interests are warmly received and acknowledged. A member of the Office of Indigenous Initiatives team will contact you within the next three to five business days to discuss your application.",
            id: "cTCdw5",
            description:
              "Description of review process and next steps for the IAP applicant.",
          })}
        </p>
      ) : (
        <>
          <p className="my-3">
            {intl.formatMessage({
              defaultMessage:
                "We'll be in touch if your application matches the criteria outlined in the job advertisement. In the meantime, check out the following resources for further information on what might be next.",
              id: "cXuiuN",
              description:
                "Description of review process and next steps for the applicant.",
            })}
          </p>
          <Ul className="mb-9" space="md">
            <li>
              <Link
                newTab
                external
                href={
                  locale === "en"
                    ? "https://www.canada.ca/en/public-service-commission/services/second-language-testing-public-service.html"
                    : "https://www.canada.ca/fr/commission-fonction-publique/services/evaluation-langue-seconde.html"
                }
                className="inline-block text-left align-top"
              >
                {intl.formatMessage({
                  defaultMessage: "Second language evaluation",
                  id: "E2uEWk",
                  description:
                    "Link text for government of canada second language evaluation",
                })}
              </Link>
            </li>
            <li>
              <Link
                newTab
                external
                href={
                  locale === "en"
                    ? "https://www.tbs-sct.canada.ca/tbsf-fsct/ssac-cdfs-eng.asp"
                    : "https://www.tbs-sct.canada.ca/tbsf-fsct/ssac-cdfs-fra.asp"
                }
                className="inline-block text-left align-top"
              >
                {intl.formatMessage({
                  defaultMessage:
                    "Security screening application and consent form",
                  id: "1cCjc/",
                  description:
                    "Link text for government of canada security screening application and consent form",
                })}
              </Link>
            </li>
          </Ul>
        </>
      )}
      <p className="my-3 flex flex-wrap items-center gap-6">
        <Link
          href={
            locale === "fr"
              ? "https://forms-formulaires.alpha.canada.ca/fr/id/cmcc1uqjs009zxd01bx4jw8un"
              : "https://forms-formulaires.alpha.canada.ca/en/id/cmcc1uqjs009zxd01bx4jw8un"
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
          {intl.formatMessage(navigationMessages.returnToDashboard)}
        </Link>
      </p>
      <Alert.Footer>
        {intl.formatMessage({
          defaultMessage:
            "Your application ID can also be found in the applications on your applicant dashboard.",
          id: "j4rest",
          description: "Note where the application ID is available",
        })}
      </Alert.Footer>
    </Alert.Root>
  );
};

export const Component = () => (
  <ApplicationApi PageComponent={ApplicationSuccess} />
);

Component.displayName = "ApplicationSuccessPage";
