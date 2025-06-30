import { defineMessage, useIntl } from "react-intl";
import UserCircleIcon from "@heroicons/react/24/outline/UserCircleIcon";
import ArrowTrendingUpIcon from "@heroicons/react/24/outline/ArrowTrendingUpIcon";
import UserGroupIcon from "@heroicons/react/24/outline/UserGroupIcon";
import BookOpenIcon from "@heroicons/react/24/outline/BookOpenIcon";

import {
  Card,
  CardFlat,
  Container,
  Heading,
  Link,
  Ul,
} from "@gc-digital-talent/ui";
import {
  commonMessages,
  getLocale,
  navigationMessages,
} from "@gc-digital-talent/i18n";

import Hero from "~/components/Hero";
import useRoutes from "~/hooks/useRoutes";
import teamImage from "~/assets/img/comptrollership-the-team.webp";
import newsletterImage from "~/assets/img/comptrollership-newsletter.webp";
import connectWithPeersImage from "~/assets/img/comptrollership-connect-with-peers.webp";
import SEO from "~/components/SEO/SEO";

const pageTitle = defineMessage({
  defaultMessage: "Comptrollership executives talent management",
  id: "nmokFS",
  description:
    "Title for the comptrollership executives talent management page",
});

const pageSubtitle = defineMessage({
  defaultMessage:
    "Assist the Office of the Comptroller General in gathering key insights on the financial management executive workforce to shape strategic programming, support succession planning, and strengthen our community.",
  id: "M2MQu7",
  description:
    "Page subtitle for the comptrollership executives talent management page",
});

const theTeamUrl = {
  en: "https://www.canada.ca/en/treasury-board-secretariat/corporate/organization/financial-management-community-development.html",
  fr: "https://www.canada.ca/fr/secretariat-conseil-tresor/organisation/organisation/developpement-collectivite-gestion-financiere.html",
} as const;

const newsletterUrl = {
  en: "https://forms-formulaires.alpha.canada.ca/en/id/cm6k7jkk9006px5694mnkatr4",
  fr: "https://forms-formulaires.alpha.canada.ca/fr/id/cm6k7jkk9006px5694mnkatr4",
} as const;

const linkedInUrl = "https://www.linkedin.com/company/fmcd-dcgf/";

export const Component = () => {
  const intl = useIntl();
  const locale = getLocale(intl);
  const paths = useRoutes();

  return (
    <>
      <SEO
        title={intl.formatMessage(pageTitle)}
        description={intl.formatMessage(pageSubtitle)}
      />
      <Hero
        title={intl.formatMessage(pageTitle)}
        subtitle={intl.formatMessage(pageSubtitle)}
      />
      <Container className="my-18">
        <Heading
          icon={UserCircleIcon}
          size="h2"
          color="secondary"
          center
          className="mt-0 mb-9 font-normal xs:justify-start xs:text-left"
        >
          {intl.formatMessage({
            defaultMessage: "Who is this for?",
            id: "45ber4",
            description: "Section heading, explain audience",
          })}
        </Heading>
        <p>
          {intl.formatMessage({
            defaultMessage:
              "This page is intended for specific current employees of the Government of Canada:",
            id: "3u7nGm",
            description: "About to list employee types",
          })}
        </p>
        <Ul className="my-3">
          <li>
            <span className="font-bold">
              {intl.formatMessage({
                defaultMessage: "Current financial management executives",
                id: "EBFgMS",
                description: "Employee group list item label",
              })}
            </span>
            {intl.formatMessage(commonMessages.dividingColon)}
            <span>
              {intl.formatMessage({
                defaultMessage:
                  "Participation in the talent management process is <strong>mandatory</strong> for all financial management executives and all Chief Financial Officers and Deputy Chief Financial Officers who occupy a position at a group and level other than EX",
                id: "14ZYuD",
                description: "Employee group list item description",
              })}
            </span>
          </li>
          <li>
            <span className="font-bold">
              {intl.formatMessage({
                defaultMessage: "Aspiring financial management executives",
                id: "WrTLaB",
                description: "Employee group list item label",
              })}
            </span>
            {intl.formatMessage(commonMessages.dividingColon)}
            <span>
              {intl.formatMessage({
                defaultMessage:
                  "CT-FIN-04 classified employees who have been nominated for talent management must create a profile",
                id: "WVf1Wr",
                description: "Employee group list item descriptions",
              })}
            </span>
          </li>
          <li>
            <span className="font-bold">
              {intl.formatMessage({
                defaultMessage: "Current executives in other fields",
                id: "vSr72F",
                description: "Employee group list item label",
              })}
            </span>
            {intl.formatMessage(commonMessages.dividingColon)}
            <span>
              {intl.formatMessage({
                defaultMessage:
                  "Government of Canada executives in comptrollership or other fields interested in a career in financial management are invited to create a profile",
                id: "PWqSgG",
                description: "Employee group list item description",
              })}
            </span>
          </li>
        </Ul>
        <p>
          {intl.formatMessage({
            defaultMessage:
              "Additional employee groups working in comptrollership, such as executives currently working in internal audit, procurement, material management, real property, and project management, may be added to the scope of this exercise in the future.",
            id: "mL1sax",
            description: "Closing remark about future relevant employees",
          })}
        </p>
        <Heading
          icon={ArrowTrendingUpIcon}
          size="h2"
          color="primary"
          center
          className="mt-18 mb-9 font-normal xs:justify-start xs:text-left"
        >
          {intl.formatMessage({
            defaultMessage: "Manage your career",
            id: "yFOAEj",
            description: "Section heading, explain profile's purpose",
          })}
        </Heading>
        <p>
          {intl.formatMessage({
            defaultMessage:
              "Your profile is at the heart of the platform. Tell us your story by highlighting your career growth and showcasing your skills. Your profile will inform talent management decisions and strategic planning related to recruitment, succession planning, and the development of our financial management executives.",
            id: "T4LCrR",
            description: "Explanation about profile",
          })}
        </p>
        <div className="flex justify-center xs:block">
          <Link
            mode="solid"
            color="primary"
            href={paths.applicantDashboard()}
            className="mt-9"
          >
            {intl.formatMessage(navigationMessages.createProfile)}
          </Link>
        </div>
        <div className="flex flex-col gap-9">
          <Heading
            icon={UserGroupIcon}
            size="h2"
            color="warning"
            center
            className="mt-18 mb-0 font-normal xs:justify-start xs:text-left"
          >
            {intl.formatMessage({
              defaultMessage: "Shape the future of financial management",
              id: "7II3VK",
              description: "Section heading, things you can do now or later",
            })}
          </Heading>
          <div className="grid gap-12 xs:grid-cols-2 xs:gap-18">
            <CardFlat
              color="warning"
              title={intl.formatMessage({
                defaultMessage: "Executive talent management process",
                id: "fJmRpp",
                description: "Card label, process",
              })}
            >
              <p>
                {intl.formatMessage({
                  defaultMessage:
                    "Through this annual process, departments and agencies share information about the career aspirations and potential of their financial leaders. This ensures that we have the right talent ready to step into executive roles as they become available.",
                  id: "L9Tc5u",
                  description: "Card description, for process",
                })}
              </p>
            </CardFlat>
            <CardFlat
              color="success"
              title={intl.formatMessage({
                defaultMessage: "Talent mobility",
                id: "6xQf6q",
                description: "Card label, for nomination feature",
              })}
            >
              <p className="mb-3">
                {intl.formatMessage({
                  defaultMessage:
                    "Are you a Chief Financial Officer who knows a high-potential leader with the ability to enhance public service to Canadians? Help them progress in their career by nominating them for advancement, lateral movement, or development opportunities.",
                  id: "RDC7fi",
                  description: "card description, for nomination feature",
                })}
              </p>
              <p>
                <Link mode="inline" href={paths.talentManagementEvents()}>
                  {intl.formatMessage({
                    defaultMessage: "Nominate talent",
                    id: "yVf0d/",
                    description:
                      "Link text to navigate to talent nomination events list",
                  })}
                </Link>
              </p>
            </CardFlat>
          </div>
        </div>
        <div className="flex flex-col gap-9">
          <Heading
            icon={BookOpenIcon}
            size="h2"
            color="error"
            className="mt-18 mb-0 font-normal"
          >
            {intl.formatMessage({
              defaultMessage: "The Financial Management Community",
              id: "y5xvLj",
              description: "Section heading, expand on community aspects",
            })}
          </Heading>
          <div className="grid gap-6 xs:grid-cols-2 sm:grid-cols-3">
            <Card className="flex flex-col overflow-hidden p-0">
              <div className="block p-6 [&>span]:block">
                <Heading level="h3" size="h6" className="my-0">
                  {intl.formatMessage({
                    defaultMessage: "The team",
                    id: "tc3sSC",
                    description: "Card title, team",
                  })}
                </Heading>
              </div>
              <div className="flex grow flex-col justify-between">
                <img
                  src={teamImage}
                  alt=""
                  className="block h-auto object-cover object-[50%_10%] sm:h-60"
                />
                <div className="flex grow flex-col gap-6 p-6">
                  <p>
                    {intl.formatMessage({
                      defaultMessage:
                        "The Financial Management Community Development (FMCD) team within the Office of the Comptroller General at Treasury Board of Canada Secretariat helps federal financial management professionals enhance their skills and grow in their careers through recruitment, development, and networking.",
                      id: "2vdIG6",
                      description: "Card description, team",
                    })}
                  </p>
                </div>
                <div className="p-6">
                  <Link
                    mode="solid"
                    color="black"
                    external
                    newTab
                    className="flex w-full justify-center xs:inline-flex xs:w-auto"
                    href={theTeamUrl[locale]}
                  >
                    {intl.formatMessage({
                      defaultMessage:
                        "Learn more<hidden> about the Financial Management Community Development team</hidden>",
                      id: "C0M2h9",
                      description:
                        "External link button, learn more about the named team",
                    })}
                  </Link>
                </div>
              </div>
            </Card>
            <Card className="flex flex-col overflow-hidden p-0">
              <div className="block p-6 [&>span]:block">
                <Heading level="h3" size="h6" className="my-0">
                  {intl.formatMessage({
                    defaultMessage: "Newsletter",
                    id: "6B6xPa",
                    description: "Card title, newsletter",
                  })}
                </Heading>
              </div>
              <div className="flex grow flex-col justify-between">
                <img
                  src={newsletterImage}
                  alt=""
                  className="block h-auto object-cover object-[50%_10%] sm:h-60"
                />
                <div className="flex grow flex-col gap-6 p-6">
                  <p>
                    {intl.formatMessage({
                      defaultMessage:
                        "Get the latest Financial Management Community updates, resources, and events from the Office of the Comptroller General's Community Development Office, delivered straight to your inbox.",
                      id: "xvPb8Z",
                      description: "Card description, newsletter",
                    })}
                  </p>
                </div>
                <div className="p-6">
                  <Link
                    mode="solid"
                    color="black"
                    external
                    newTab
                    href={newsletterUrl[locale]}
                    className="flex w-full justify-center xs:inline-flex xs:w-auto"
                  >
                    {intl.formatMessage({
                      defaultMessage:
                        "Subscribe<hidden> to the Financial Management Community newsletter</hidden>",
                      id: "cAowoI",
                      description:
                        "External button link to subscribe to a newsletter",
                    })}
                  </Link>
                </div>
              </div>
            </Card>
            <Card className="flex flex-col overflow-hidden p-0">
              <div className="block p-6 [&>span]:block">
                <Heading level="h3" size="h6" className="my-0">
                  {intl.formatMessage({
                    defaultMessage: "Connect with your peers",
                    id: "Ari7FD",
                    description: "Card title, connect with peers",
                  })}
                </Heading>
              </div>
              <div className="flex grow flex-col justify-between">
                <img
                  src={connectWithPeersImage}
                  alt=""
                  className="block h-auto object-cover object-[50%_10%] sm:h-60"
                />
                <div className="flex grow flex-col gap-6 p-6">
                  <p>
                    {intl.formatMessage({
                      defaultMessage:
                        "Stay up to date on our external announcements and other exciting news by following our Financial Management Community's LinkedIn page.",
                      id: "YBrlqU",
                      description: "Card description, to connect with peers",
                    })}
                  </p>
                </div>
                <div className="p-6">
                  <Link
                    mode="solid"
                    color="black"
                    external
                    newTab
                    href={linkedInUrl}
                    className="flex w-full justify-center xs:inline-flex xs:w-auto"
                  >
                    {intl.formatMessage({
                      defaultMessage: "Join us on LinkedIn",
                      id: "EyhaxU",
                      description: "External button link to LinkedIn",
                    })}
                  </Link>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </Container>
    </>
  );
};

Component.displayName = "ComptrollershipExecutivesPage";

export default Component;
