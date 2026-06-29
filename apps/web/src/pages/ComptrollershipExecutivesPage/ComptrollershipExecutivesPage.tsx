import { defineMessage, useIntl } from "react-intl";
import UserCircleIcon from "@heroicons/react/24/outline/UserCircleIcon";
import ArrowTrendingUpIcon from "@heroicons/react/24/outline/ArrowTrendingUpIcon";
import UserGroupIcon from "@heroicons/react/24/outline/UserGroupIcon";
import BookOpenIcon from "@heroicons/react/24/outline/BookOpenIcon";
import BriefcaseIcon from "@heroicons/react/24/outline/BriefcaseIcon";

import {
  Card,
  CardFlat,
  Container,
  Heading,
  Image,
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
import financialManagementTeamImage from "~/assets/img/person-smiling-holding-pen.webp";
import financialManagementNewsletterImage from "~/assets/img/person-looking-at-tablet-in-thought.webp";
import financialManagementConnectWithPeersImage from "~/assets/img/people-with-glasses-high-fiving.webp";
import procurementTeamImage from "~/assets/img/people-sitting-chairs-discussing-something.webp";
import procurementNewsletterImage from "~/assets/img/person-looking-at-laptop-smiling.webp";
import procurementConnectWithPeersImage from "~/assets/img/people-standing-semicircle-shaking-hands.webp";
import SEO from "~/components/SEO/SEO";

const pageTitle = defineMessage({
  defaultMessage: "Comptrollership executives talent management",
  id: "nmokFS",
  description:
    "Title for the comptrollership executives talent management page",
});

const pageSubtitle = defineMessage({
  defaultMessage:
    "Assist the Office of the Comptroller General in gathering key insights on the financial management and procurement executive workforce to shape strategic programming, support succession planning, and strengthen our communities.",
  id: "VF2HCh",
  description:
    "Page subtitle for the comptrollership executives talent management page",
});

const financialManagementTeamUrl = {
  en: "https://www.canada.ca/en/treasury-board-secretariat/services/professional-development/financial-management-community-development-office.html",
  fr: "https://www.canada.ca/fr/secretariat-conseil-tresor/services/perfectionnement-professionnel/bureau-du-developpement-collectivite-gestion-financiere.html",
} as const;

const financialManagementNewsletterUrl = {
  en: "https://forms-formulaires.alpha.canada.ca/en/id/cm6k7jkk9006px5694mnkatr4",
  fr: "https://forms-formulaires.alpha.canada.ca/fr/id/cm6k7jkk9006px5694mnkatr4",
} as const;

const financialManagementSharePointUrl = {
  en: "https://gcxgce.SharePoint.com/teams/1000131/SitePages/homepage-en.aspx",
  fr: "https://gcxgce.SharePoint.com/teams/1000131/SitePages/homepage-fr.aspx",
} as const;

const procurementTeamUrl = {
  en: "https://www.canada.ca/en/treasury-board-secretariat/services/professional-development/investment-management-communities.html",
  fr: "https://www.canada.ca/fr/secretariat-conseil-tresor/services/perfectionnement-professionnel/collectivites-gestion-investissements.html",
} as const;

const procurementNewsletterUrl = {
  en: "https://forms.office.com/pages/responsepage.aspx?id=EN-XY5VFR0CcTwMxEoIVK_0S_kAqpy1Bj_ZNwj0Z7qVUMEEyUVJSMVo2MVZGT0ZYQzdXOExINzdPMiQlQCN0PWcu&route=shorturl&lang=en-us",
  fr: "https://forms.office.com/pages/responsepage.aspx?id=EN-XY5VFR0CcTwMxEoIVK_0S_kAqpy1Bj_ZNwj0Z7qVUMEEyUVJSMVo2MVZGT0ZYQzdXOExINzdPMiQlQCN0PWcu&route=shorturl&lang=fr-ca",
} as const;

const procurementSharePointUrl = {
  en: "https://gcxgce.sharepoint.com/teams/1000442/SitePages/Home-en.aspx",
  fr: "https://gcxgce.sharepoint.com/teams/1000442/SitePages/Home-fr.aspx",
} as const;

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
              "This page is intended for specific current employees of the Government of Canada.",
            id: "KvwEUd",
            description: "About to list employee types",
          })}
        </p>
        <Heading level="h3">
          {intl.formatMessage({
            defaultMessage: "Financial Management",
            id: "6VIiEh",
            description: "Heading financial management",
          })}
        </Heading>
        <Ul className="my-3">
          <li>
            <span className="font-bold">
              {intl.formatMessage({
                defaultMessage: "Current financial management executives",
                id: "UorO2U",
                description: "List item one financial management label",
              })}
            </span>
            {intl.formatMessage(commonMessages.dividingColon)}
            {intl.formatMessage({
              defaultMessage:
                "Participation in the talent management process is mandatory for all financial management executives and all Chief Financial Officers and Deputy Chief Financial Officers who occupy a position at a group and level other than EX.",
              id: "cqqrXH",
              description: "List item one financial management content",
            })}
          </li>
          <li>
            <span className="font-bold">
              {intl.formatMessage({
                defaultMessage: "Aspiring financial management executives",
                id: "UsVDrx",
                description: "List item two financial management label",
              })}
            </span>
            {intl.formatMessage(commonMessages.dividingColon)}
            {intl.formatMessage({
              defaultMessage:
                "CT-FIN-04 classified employees who have been nominated for talent management must create a profile.",
              id: "9axruf",
              description: "List item two financial management content",
            })}
          </li>
        </Ul>
        <Heading level="h3">
          {intl.formatMessage({
            defaultMessage: "Procurement",
            id: "qKk7Eh",
            description: "Heading procurement",
          })}
        </Heading>
        <Ul className="my-3">
          <li>
            <span className="font-bold">
              {intl.formatMessage({
                defaultMessage: "Current procurement executives",
                id: "PakJF8",
                description: "List item one procurement label",
              })}
            </span>
            {intl.formatMessage(commonMessages.dividingColon)}
            {intl.formatMessage({
              defaultMessage:
                "Participation in the talent management process is mandatory for all procurement executives, including all Senior Designated Officials (SDOs) for Procurement.",
              id: "mN+Yf6",
              description: "List item one procurement content",
            })}
          </li>
        </Ul>
        <Heading level="h3">
          {intl.formatMessage({
            defaultMessage: "Other Members of the Comptrollership Community",
            id: "Muhu3E",
            description: "Heading other members comptrollership community",
          })}
        </Heading>
        <Ul className="my-3">
          <li>
            <span className="font-bold">
              {intl.formatMessage({
                defaultMessage: "Current executives in other fields",
                id: "HD9HS1",
                description: "List item one other label",
              })}
            </span>
            {intl.formatMessage(commonMessages.dividingColon)}
            {intl.formatMessage({
              defaultMessage:
                "Government of Canada executives in comptrollership or other fields interested in a career in financial management or procurement are invited to create a profile.",
              id: "yD4M6c",
              description: "List item one other content",
            })}
          </li>
          <li>
            {intl.formatMessage({
              defaultMessage:
                "Additional employee groups working in comptrollership, such as executives currently working in internal audit, material management, real property, and project management, may be added to the scope of this exercise in the future.",
              id: "QVG8Bz",
              description: "List item two other",
            })}
          </li>
        </Ul>
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
        <p className="mb-6">
          {intl.formatMessage({
            defaultMessage:
              "Your profile is at the heart of the platform. Tell us your story by highlighting your career growth and showcasing your skills. Your profile will inform talent management decisions and strategic planning related to recruitment, succession planning, and the development of our financial management and procurement executives.",
            id: "Qhq+Yg",
            description: "Explanation about profile 1",
          })}
        </p>
        <p>
          {intl.formatMessage({
            defaultMessage:
              "Executives in both communities are encouraged to always keep their profiles up to date to reflect their current experience, interests, and openness to development or mobility opportunities.",
            id: "0NlEg9",
            description: "Explanation about profile 2",
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
            color="secondary"
            center
            className="mt-18 mb-0 font-normal xs:justify-start xs:text-left"
          >
            {intl.formatMessage({
              defaultMessage:
                "Shape the future of financial management and procurement",
              id: "ffD1LF",
              description: "Section heading, things you can do now or later",
            })}
          </Heading>
          <div className="grid gap-12 xs:grid-cols-2 xs:gap-18">
            <CardFlat
              color="secondary"
              title={intl.formatMessage({
                defaultMessage: "Talent mobility",
                id: "6xQf6q",
                description: "Card label, for nomination feature",
              })}
            >
              <p className="mb-3">
                {intl.formatMessage({
                  defaultMessage:
                    "Are you a Chief Financial Officer or Senior Designated Official (SDO) for Procurement who knows a high-potential leader with the ability to enhance public service to Canadians? Help them progress in their career by nominating them for advancement, lateral movement, or development opportunities.",
                  id: "8dqqBT",
                  description: "card description, for nomination feature",
                })}
              </p>
              <p>
                <Link
                  mode="solid"
                  color="secondary"
                  href={paths.talentManagementEvents()}
                >
                  {intl.formatMessage({
                    defaultMessage: "Nominate talent",
                    id: "yVf0d/",
                    description:
                      "Link text to navigate to talent nomination events list",
                  })}
                </Link>
              </p>
            </CardFlat>
            <CardFlat
              color="primary"
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
          </div>
        </div>
        <div className="flex flex-col gap-9">
          <Heading
            icon={BookOpenIcon}
            size="h2"
            color="primary"
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
                <Image
                  loading="lazy"
                  width={400}
                  height={300}
                  src={financialManagementTeamImage}
                  alt=""
                  className="block h-auto object-cover object-[50%_10%] sm:h-60"
                />
                <div className="flex grow flex-col gap-6 p-6">
                  <p>
                    {intl.formatMessage({
                      defaultMessage:
                        "The Comptrollership Community Development Office (CCDO) within the Office of the Comptroller General at Treasury Board of Canada Secretariat helps federal financial management professionals enhance their skills and grow in their careers through recruitment, development, and networking.",
                      id: "RPn+oy",
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
                    href={financialManagementTeamUrl[locale]}
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
                <Image
                  loading="lazy"
                  width={400}
                  height={300}
                  src={financialManagementNewsletterImage}
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
                    href={financialManagementNewsletterUrl[locale]}
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
                <Image
                  loading="lazy"
                  width={400}
                  height={300}
                  src={financialManagementConnectWithPeersImage}
                  alt=""
                  className="block h-auto object-cover object-[50%_10%] sm:h-60"
                />
                <div className="flex grow flex-col gap-6 p-6">
                  <p>
                    {intl.formatMessage({
                      defaultMessage:
                        "Stay up to date on our internal announcements, events and other exciting news by becoming a member of the Financial Management Community's GCXchange page.",
                      id: "EqQwt5",
                      description: "Card description, to connect with peers",
                    })}
                  </p>
                  <p className="text-gray-500 dark:text-gray-200">
                    {intl.formatMessage({
                      defaultMessage:
                        "Only available to Government of Canada employees.",
                      id: "pVhFZt",
                      description:
                        "Card description, to connect with peers notice",
                    })}
                  </p>
                </div>
                <div className="p-6">
                  <Link
                    mode="solid"
                    color="black"
                    external
                    newTab
                    href={financialManagementSharePointUrl[locale]}
                    className="flex w-full justify-center xs:inline-flex xs:w-auto"
                    aria-label={intl.formatMessage({
                      defaultMessage:
                        "Join the financial management community on GCxchange",
                      id: "yg1DyS",
                      description:
                        "External button link to GCXchange label for financial management",
                    })}
                  >
                    {intl.formatMessage({
                      defaultMessage: "Join us on GCXchange",
                      id: "HspPlQ",
                      description: "External button link to GCXchange",
                    })}
                  </Link>
                </div>
              </div>
            </Card>
          </div>
        </div>
        <div className="flex flex-col gap-9">
          <Heading
            icon={BriefcaseIcon}
            size="h2"
            color="secondary"
            className="mt-18 mb-0 font-normal"
          >
            {intl.formatMessage({
              defaultMessage: "The Procurement Community",
              id: "Tc/pf5",
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
                <Image
                  loading="lazy"
                  width={400}
                  height={300}
                  src={procurementTeamImage}
                  alt=""
                  className="block h-auto object-cover object-[50%_10%] sm:h-60"
                />
                <div className="flex grow flex-col gap-6 p-6">
                  <p>
                    {intl.formatMessage({
                      defaultMessage:
                        "The Comptrollership Community Development Office (CCDO) within the Office of the Comptroller General at Treasury Board of Canada Secretariat helps federal procurement professionals enhance their skills and grow in their careers through recruitment, development, and networking.",
                      id: "NitW+s",
                      description: "Card description, team, procurement",
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
                    href={procurementTeamUrl[locale]}
                  >
                    {intl.formatMessage({
                      defaultMessage:
                        "Learn more<hidden> about the Procurement Community Development team</hidden>",
                      id: "i+wcDH",
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
                <Image
                  loading="lazy"
                  width={400}
                  height={300}
                  src={procurementNewsletterImage}
                  alt=""
                  className="block h-auto object-cover object-[50%_10%] sm:h-60"
                />
                <div className="flex grow flex-col gap-6 p-6">
                  <p>
                    {intl.formatMessage({
                      defaultMessage:
                        "Get the latest Procurement Community updates, resources, and events from the Office of the Comptroller General's Community Development Office, delivered straight to your inbox.",
                      id: "UrU9Kt",
                      description: "Card description, newsletter, procurement",
                    })}
                  </p>
                </div>
                <div className="p-6">
                  <Link
                    mode="solid"
                    color="black"
                    external
                    newTab
                    href={procurementNewsletterUrl[locale]}
                    className="flex w-full justify-center xs:inline-flex xs:w-auto"
                  >
                    {intl.formatMessage({
                      defaultMessage:
                        "Subscribe<hidden> to the Procurement Community newsletter</hidden>",
                      id: "9zzr+g",
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
                <Image
                  loading="lazy"
                  width={400}
                  height={300}
                  src={procurementConnectWithPeersImage}
                  alt=""
                  className="block h-auto object-cover object-[50%_10%] sm:h-60"
                />
                <div className="flex grow flex-col gap-6 p-6">
                  <p>
                    {intl.formatMessage({
                      defaultMessage:
                        "Stay up to date on our internal announcements, events and other exciting news by becoming a member of the Investment Management Community's GCXchange page.",
                      id: "VoaVjp",
                      description:
                        "Card description, to connect with peers, procurement",
                    })}
                  </p>
                  <p className="text-gray-500 dark:text-gray-200">
                    {intl.formatMessage({
                      defaultMessage:
                        "Only available to Government of Canada employees.",
                      id: "pVhFZt",
                      description:
                        "Card description, to connect with peers notice",
                    })}
                  </p>
                </div>
                <div className="p-6">
                  <Link
                    mode="solid"
                    color="black"
                    external
                    newTab
                    href={procurementSharePointUrl[locale]}
                    className="flex w-full justify-center xs:inline-flex xs:w-auto"
                    aria-label={intl.formatMessage({
                      defaultMessage:
                        "Join the investment management community on GCXchange",
                      id: "Ia4l5G",
                      description:
                        "External button link to GCXchange label for procurement",
                    })}
                  >
                    {intl.formatMessage({
                      defaultMessage: "Join us on GCXchange",
                      id: "HspPlQ",
                      description: "External button link to GCXchange",
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
