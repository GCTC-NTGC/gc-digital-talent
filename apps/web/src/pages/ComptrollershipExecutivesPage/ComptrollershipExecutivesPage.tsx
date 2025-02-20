import { defineMessage, useIntl } from "react-intl";
import UserCircleIcon from "@heroicons/react/24/outline/UserCircleIcon";
import ArrowTrendingUpIcon from "@heroicons/react/24/outline/ArrowTrendingUpIcon";
import UserGroupIcon from "@heroicons/react/24/outline/UserGroupIcon";
import BookOpenIcon from "@heroicons/react/24/outline/BookOpenIcon";

import { CardBasic, CardFlat, Heading, Link } from "@gc-digital-talent/ui";
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
      <div data-h2-margin="base(x3 0)">
        <div data-h2-wrapper="base(center, large, x1) p-tablet(center, large, x2)">
          <div
            data-h2-display="base(flex)"
            data-h2-flex-direction="base(column)"
            data-h2-gap="base(x3)"
          >
            <div>
              <Heading
                Icon={UserCircleIcon}
                size="h2"
                color="primary"
                data-h2-margin="base(0 0 x1.5 0)"
                data-h2-font-weight="base(400)"
                data-h2-justify-content="base(center) p-tablet(start)"
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
                    "This page is intended for specific current employees of the Government of Canada",
                  id: "ZBFT4z",
                  description: "About to list employee types",
                })}
                {intl.formatMessage(commonMessages.dividingColon)}
              </p>
              <ul data-h2-margin="base(x.5 0)">
                <li>
                  <span data-h2-font-weight="base(bold)">
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
                <li data-h2-margin="base(x.25 0)">
                  <span data-h2-font-weight="base(bold)">
                    {intl.formatMessage({
                      defaultMessage:
                        "Aspiring financial management executives",
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
                  <span data-h2-font-weight="base(bold)">
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
              </ul>
              <p>
                {intl.formatMessage({
                  defaultMessage:
                    "Additional employee groups working in comptrollership, such as executives currently working in internal audit, procurement, material management, real property, and project management, may be added to the scope of this exercise in the future.",
                  id: "mL1sax",
                  description: "Closing remark about future relevant employees",
                })}
              </p>
            </div>
            <div>
              <Heading
                Icon={ArrowTrendingUpIcon}
                size="h2"
                color="secondary"
                data-h2-margin="base(0 0 x1.5 0)"
                data-h2-font-weight="base(400)"
                data-h2-justify-content="base(center) p-tablet(start)"
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
              <div
                data-h2-display="base(flex) p-tablet(block)"
                data-h2-justify-content="base(center)"
              >
                <Link
                  mode="solid"
                  color="secondary"
                  href={paths.applicantDashboard()}
                  data-h2-margin-top="base(x1.5)"
                >
                  {intl.formatMessage(navigationMessages.createProfile)}
                </Link>
              </div>
            </div>
            <div
              data-h2-display="base(flex)"
              data-h2-flex-direction="base(column)"
              data-h2-gap="base(x1.5)"
            >
              <Heading
                Icon={UserGroupIcon}
                size="h2"
                color="quaternary"
                data-h2-margin="base(0)"
                data-h2-font-weight="base(400)"
                data-h2-justify-content="base(center) p-tablet(start)"
              >
                {intl.formatMessage({
                  defaultMessage: "Shape the future of financial management",
                  id: "7II3VK",
                  description:
                    "Section heading, things you can do now or later",
                })}
              </Heading>
              <div
                data-h2-display="base(grid)"
                data-h2-grid-template-columns="base(1fr) p-tablet(repeat(2, minmax(0, 1fr)))"
                data-h2-gap="base(x2) p-tablet(x3)"
              >
                <CardFlat
                  color="quaternary"
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
                  color="quinary"
                  title={intl.formatMessage({
                    defaultMessage: "Talent mobility",
                    id: "6xQf6q",
                    description: "Card label, for nomination feature",
                  })}
                >
                  <p>
                    {intl.formatMessage({
                      defaultMessage:
                        "Are you a Chief Financial Officer who knows a high-potential leader with the ability to enhance public service to Canadians? Help them progress in their career by nominating them for advancement, lateral movement, or development opportunities.",
                      id: "RDC7fi",
                      description: "card description, for nomination feature",
                    })}
                  </p>
                  <p
                    data-h2-margin-top="base(x.5)"
                    data-h2-font-weight="base(bold)"
                  >
                    {intl.formatMessage({
                      defaultMessage: "Available in April",
                      id: "Wg+Buu",
                      description: "Availability blurb",
                    })}
                  </p>
                </CardFlat>
              </div>
            </div>
            <div
              data-h2-display="base(flex)"
              data-h2-flex-direction="base(column)"
              data-h2-gap="base(x1.5)"
            >
              <Heading
                Icon={BookOpenIcon}
                size="h2"
                color="tertiary"
                data-h2-margin="base(0)"
                data-h2-font-weight="base(400)"
              >
                {intl.formatMessage({
                  defaultMessage: "The Financial Management Community",
                  id: "y5xvLj",
                  description: "Section heading, expand on community aspects",
                })}
              </Heading>
              <div
                data-h2-display="base(grid)"
                data-h2-grid-template-columns="base(1fr) p-tablet(repeat(2, minmax(0, 1fr))) l-tablet(repeat(3, minmax(0, 1fr)))"
                data-h2-gap="base(x1)"
              >
                <CardBasic
                  data-h2-overflow="base(hidden)"
                  data-h2-padding="base(0)"
                  data-h2-display="base(flex)"
                  data-h2-flex-direction="base(column)"
                >
                  <div
                    data-h2-display="base(block) base:children[>span](block)"
                    data-h2-padding="base(x1)"
                  >
                    <Heading
                      level="h3"
                      size="h2"
                      data-h2-font-size="base(h6)"
                      data-h2-margin="base(0 0 x0.25 0)"
                    >
                      {intl.formatMessage({
                        defaultMessage: "The team",
                        id: "tc3sSC",
                        description: "Card title, team",
                      })}
                    </Heading>
                  </div>
                  <div
                    data-h2-display="base(flex)"
                    data-h2-flex-direction="base(column)"
                    data-h2-justify-content="base(space-between)"
                    data-h2-flex-grow="base(1)"
                  >
                    <img src={teamImage} alt="" data-h2-display="base(block)" />
                    <div
                      data-h2-padding="base(x1)"
                      data-h2-flex-grow="base(1)"
                      data-h2-display="base(flex)"
                      data-h2-flex-direction="base(column)"
                      data-h2-gap="base(x1)"
                    >
                      <p>
                        {intl.formatMessage({
                          defaultMessage:
                            "The Financial Management Community Development (FMCD) team within the Office of the Comptroller General at Treasury Board of Canada Secretariat helps federal financial management professionals enhance their skills and grow in their careers through recruitment, development, and networking.",
                          id: "2vdIG6",
                          description: "Card description, team",
                        })}
                      </p>
                    </div>
                    <div data-h2-padding="base(x1)">
                      <Link
                        mode="solid"
                        color="blackFixed"
                        external
                        newTab
                        href={theTeamUrl[locale]}
                        data-h2-justify-content="base(center)"
                        data-h2-display="base(flex) p-tablet(inline-block)"
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
                </CardBasic>
                <CardBasic
                  data-h2-overflow="base(hidden)"
                  data-h2-padding="base(0)"
                  data-h2-display="base(flex)"
                  data-h2-flex-direction="base(column)"
                >
                  <div
                    data-h2-display="base(block) base:children[>span](block)"
                    data-h2-padding="base(x1)"
                  >
                    <Heading
                      level="h3"
                      size="h2"
                      data-h2-font-size="base(h6)"
                      data-h2-margin="base(0 0 x0.25 0)"
                    >
                      {intl.formatMessage({
                        defaultMessage: "Newsletter",
                        id: "6B6xPa",
                        description: "Card title, newsletter",
                      })}
                    </Heading>
                  </div>
                  <div
                    data-h2-display="base(flex)"
                    data-h2-flex-direction="base(column)"
                    data-h2-justify-content="base(space-between)"
                    data-h2-flex-grow="base(1)"
                  >
                    <img
                      src={newsletterImage}
                      alt=""
                      data-h2-display="base(block)"
                    />
                    <div
                      data-h2-padding="base(x1)"
                      data-h2-flex-grow="base(1)"
                      data-h2-display="base(flex)"
                      data-h2-flex-direction="base(column)"
                      data-h2-gap="base(x1)"
                    >
                      <p>
                        {intl.formatMessage({
                          defaultMessage:
                            "Get the latest Financial Management Community updates, resources, and events from the Office of the Comptroller General's Community Development Office, delivered straight to your inbox.",
                          id: "xvPb8Z",
                          description: "Card description, newsletter",
                        })}
                      </p>
                    </div>
                    <div data-h2-padding="base(x1)">
                      <Link
                        mode="solid"
                        color="blackFixed"
                        external
                        newTab
                        href={newsletterUrl[locale]}
                        data-h2-justify-content="base(center)"
                        data-h2-display="base(flex) p-tablet(inline-block)"
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
                </CardBasic>
                <CardBasic
                  data-h2-overflow="base(hidden)"
                  data-h2-padding="base(0)"
                  data-h2-display="base(flex)"
                  data-h2-flex-direction="base(column)"
                >
                  <div
                    data-h2-display="base(block) base:children[>span](block)"
                    data-h2-padding="base(x1)"
                  >
                    <Heading
                      level="h3"
                      size="h2"
                      data-h2-font-size="base(h6)"
                      data-h2-margin="base(0 0 x0.25 0)"
                    >
                      {intl.formatMessage({
                        defaultMessage: "Connect with your peers",
                        id: "Ari7FD",
                        description: "Card title, connect with peers",
                      })}
                    </Heading>
                  </div>
                  <div
                    data-h2-display="base(flex)"
                    data-h2-flex-direction="base(column)"
                    data-h2-justify-content="base(space-between)"
                    data-h2-flex-grow="base(1)"
                  >
                    <img
                      src={connectWithPeersImage}
                      alt=""
                      data-h2-display="base(block)"
                    />
                    <div
                      data-h2-padding="base(x1)"
                      data-h2-flex-grow="base(1)"
                      data-h2-display="base(flex)"
                      data-h2-flex-direction="base(column)"
                      data-h2-gap="base(x1)"
                    >
                      <p>
                        {intl.formatMessage({
                          defaultMessage:
                            "Stay up to date on our external announcements and other exciting news by following our Financial Management Community's LinkedIn page.",
                          id: "YBrlqU",
                          description:
                            "Card description, to connect with peers",
                        })}
                      </p>
                    </div>
                    <div data-h2-padding="base(x1)">
                      <Link
                        mode="solid"
                        color="blackFixed"
                        external
                        newTab
                        href={linkedInUrl}
                        data-h2-justify-content="base(center)"
                        data-h2-display="base(flex) p-tablet(inline-block)"
                      >
                        {intl.formatMessage({
                          defaultMessage: "Join us on LinkedIn",
                          id: "EyhaxU",
                          description: "External button link to LinkedIn",
                        })}
                      </Link>
                    </div>
                  </div>
                </CardBasic>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

Component.displayName = "ComptrollershipExecutivesPage";

export default Component;
