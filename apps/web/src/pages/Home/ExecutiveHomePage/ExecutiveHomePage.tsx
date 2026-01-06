import { defineMessage, useIntl } from "react-intl";
import RocketLaunchIcon from "@heroicons/react/24/outline/RocketLaunchIcon";
import PuzzlePieceIcon from "@heroicons/react/24/outline/PuzzlePieceIcon";
import UserPlusIcon from "@heroicons/react/24/outline/UserPlusIcon";
import SparklesIcon from "@heroicons/react/24/outline/SparklesIcon";
import { useQuery } from "urql";

import {
  Accordion,
  Card,
  CardFlat,
  Container,
  CTALink,
  Flourish,
  Heading,
  Link,
  Pending,
  Ul,
} from "@gc-digital-talent/ui";
import { nowUTCDateTime } from "@gc-digital-talent/date-helpers";
import { navigationMessages } from "@gc-digital-talent/i18n";
import { ExecutiveHomePageQuery, graphql } from "@gc-digital-talent/graphql";

import SEO from "~/components/SEO/SEO";
import useRoutes from "~/hooks/useRoutes";
import SkewedContainer from "~/components/SkewedContainer/SkewedContainer";
import SkewedImageContainer from "~/components/SkewedContainer/SkewedImageContainer";
import FlourishContainer from "~/components/FlourishContainer/FlourishContainer";
import DirectiveBlock from "~/components/DirectiveBlock/DirectiveBlock";
import PoolCard from "~/components/PoolCard/PoolCard";
import { isExecPool } from "~/utils/poolUtils";
import { TALENTSEARCH_SUPPORT_EMAIL } from "~/constants/talentSearchConstants";
import execHeroSquare from "~/assets/img/exec-hero-square.webp";
import execHeroLandscape from "~/assets/img/exec-hero-landscape.webp";
import execProfileSquare from "~/assets/img/exec-profile-square.webp";
import execProfileLandScape from "~/assets/img/exec-profile-landscape.webp";

import HomeHero from "../components/HomeHero";

const pageTitle = defineMessage({
  defaultMessage: "Welcome executives",
  id: "gtU+9w",
  description: "Page title for the executives homepage",
});
const subTitle = defineMessage({
  defaultMessage:
    "Find and apply to digital executive opportunities in the Government of Canada.",
  id: "AzCfxE",
  description: "Subtitle for the executive homepage",
});

interface HomePageProps {
  pools: ExecutiveHomePageQuery["publishedPools"];
}

export const HomePage = ({ pools }: HomePageProps) => {
  const intl = useIntl();
  const paths = useRoutes();

  return (
    <>
      <SEO
        title={intl.formatMessage(pageTitle)}
        description={intl.formatMessage(subTitle)}
      />
      <HomeHero
        title={intl.formatMessage(pageTitle)}
        subtitle={intl.formatMessage(subTitle)}
        titleSize="h2"
        img={{
          sources: { sm: execHeroSquare },
          src: execHeroLandscape,
          alt: "",
        }}
      />
      <SkewedContainer>
        <Heading
          level="h2"
          size="h3"
          icon={RocketLaunchIcon}
          color="primary"
          className="mt-0 font-normal"
        >
          {intl.formatMessage({
            defaultMessage: "Executive recruitment processes",
            id: "UNMEfB",
            description: "Heading for the executive opportunities",
          })}
        </Heading>
        <p className="my-6">
          {intl.formatMessage({
            defaultMessage:
              "This platform allows you to apply to recruitment processes that make it easy for senior executives and HR recruitment teams to find you. This page offers you a snapshot of our open recruitment processes. Come back and check this page often!",
            description:
              "Summary of the platform for executives and opportunities available",
            id: "FS23BP",
          })}
        </p>
        {pools.length > 0 ? (
          <Ul unStyled className="my-24">
            {pools.map((pool) => (
              <li key={pool.id}>
                <PoolCard poolQuery={pool} />
              </li>
            ))}
          </Ul>
        ) : (
          <Card className="my-6">
            <Heading level="h3" size="h6" className="mt-0">
              {intl.formatMessage({
                defaultMessage: "More opportunities are coming soon!",
                id: "g+JcDC",
                description: "Heading for message about upcoming opportunities",
              })}
            </Heading>
            <p>
              {intl.formatMessage({
                defaultMessage:
                  "New opportunities are posted throughout the year. By starting your profile now, you'll be better positioned to submit a strong application when the time comes.",
                id: "sfyaOe",
                description:
                  "Message displayed when there are no executive opportunities available",
              })}
            </p>
          </Card>
        )}
      </SkewedContainer>
      <div className="relative z-[3] -my-6 border-t border-t-gray-200 bg-gray-100 py-24 sm:-my-18 dark:border-t-gray-600 dark:bg-gray-700">
        <Container>
          <Heading
            level="h2"
            size="h3"
            icon={PuzzlePieceIcon}
            color="warning"
            className="mt-0 font-normal"
          >
            {intl.formatMessage({
              defaultMessage: "What we can do for you",
              id: "5bdLGy",
              description: "Heading for the executive opportunities",
            })}
          </Heading>
          <div className="grid gap-12 pt-12 pb-18 xs:grid-cols-2 xs:gap-18 sm:grid-cols-3">
            <CardFlat
              color="error"
              title={intl.formatMessage({
                defaultMessage: "Find pre-qualified executive talent",
                id: "1R3SYH",
                description:
                  "Heading for the digital government executive talent search",
              })}
              links={[
                {
                  href: `mailto:${TALENTSEARCH_SUPPORT_EMAIL}?subject=${encodeURIComponent(
                    intl.formatMessage({
                      defaultMessage:
                        "I'm looking for pre-qualified executive talent",
                      id: "BGC19+",
                      description:
                        "Subject line for contact email to find pre-qualified executive talent",
                    }),
                  )}`,
                  mode: "solid",
                  external: true,
                  label: intl.formatMessage({
                    defaultMessage: "Contact us",
                    id: "RIi/3q",
                    description: "Title for Contact us action",
                  }),
                },
              ]}
            >
              <p>
                {intl.formatMessage({
                  defaultMessage:
                    "If you're a senior leader in the GC Digital Community and you're looking for executive talent, reach out to our team for recommendations and a list of pre-qualified candidates along with their profiles.",
                  id: "H/aUwM",
                  description:
                    "Description for the digital government executive talent search",
                })}
              </p>
            </CardFlat>
            <CardFlat
              color="warning"
              title={intl.formatMessage({
                defaultMessage: "Manage your career",
                id: "kK1Z9U",
                description: "Heading for the browse executive jobs section",
              })}
              links={[
                {
                  href: paths.jobs(),
                  mode: "solid",
                  label: intl.formatMessage(navigationMessages.browseJobs),
                },
              ]}
            >
              <p>
                {intl.formatMessage({
                  defaultMessage:
                    "Check out our job opportunities to find a manager position that inspires you. Apply to play a key role in one of the IT teams at the Government of Canada and make a meaningful impact.",
                  id: "LQbKTy",
                  description:
                    "Summary for the feature about finding manager jobs",
                })}
              </p>
            </CardFlat>
            <CardFlat
              color="primary"
              title={intl.formatMessage({
                defaultMessage: "Get hiring experience",
                id: "SfhT1q",
                description: "Title to get hiring experience",
              })}
              links={[
                {
                  href: `mailto:${TALENTSEARCH_SUPPORT_EMAIL}?subject=${encodeURIComponent(
                    intl.formatMessage({
                      defaultMessage:
                        "I'm interested in gaining hiring experience",
                      id: "2OTKDd",
                      description:
                        "Subject for email to gain hiring experience",
                    }),
                  )}`,
                  mode: "solid",
                  external: true,
                  label: intl.formatMessage({
                    defaultMessage: "Contact us",
                    description: "Title for Contact us action",
                    id: "RIi/3q",
                  }),
                },
              ]}
            >
              <p>
                {intl.formatMessage({
                  defaultMessage:
                    "Not all executives have had the chance to run their own staffing processes. If this is an area of development for you, consider gaining experience by volunteering on an interdepartmental team running a process on the platform.",
                  id: "ZA20CY",
                  description: "Text displayed for gaining hiring experience",
                })}
              </p>
            </CardFlat>
          </div>
        </Container>
      </div>
      <SkewedImageContainer
        img={{ src: execProfileLandScape, sources: { sm: execProfileSquare } }}
      >
        <p className="mb-12 text-lg lg:text-xl">
          {intl.formatMessage({
            defaultMessage:
              "Your profile is at the heart of the platform. Tell your story, show how you developed your skills, and use your profile to apply for jobs. Whether you're hunting for a job or just thinking about the future, a strong profile is your path to new job opportunities.",
            id: "JEKihk",
            description:
              "Description of how application profiles works for managers/executives.",
          })}
        </p>
        <CTALink color="success" href={paths.profile()} icon={UserPlusIcon}>
          {intl.formatMessage(navigationMessages.createProfile)}
        </CTALink>
      </SkewedImageContainer>
      <FlourishContainer
        show={["bottom"]}
        skew={false}
        size="sm"
        className="-mt-20 bg-gray-100 pt-20 dark:bg-gray-700"
      >
        <Heading
          level="h2"
          size="h3"
          className="mt-0 mb-3 font-normal"
          icon={SparklesIcon}
          color="secondary"
        >
          {intl.formatMessage({
            defaultMessage: "EXposition",
            id: "7tv7ct",
            description:
              "Heading for exposition section on the executive homepage",
          })}
        </Heading>
        <Heading level="h3" size="h6" className="mt-12 mb-3 font-bold">
          {intl.formatMessage({
            defaultMessage: "Who is EXposition for?",
            id: "XoGKAf",
            description: "Heading for EXposition eligibility",
          })}
        </Heading>
        <p className="my-3">
          {intl.formatMessage({
            defaultMessage:
              "Are you a leader looking to attract or promote high-potential talent within the digital (IM, IT or data fields) community? Do you have talented employees to nominate at the EX minus one to the EX-03 group and level? Are you from the human resources community and interested in interdepartmental opportunities for your digital workforce?",
            description: "Paragraph one, about who is eligible for exposition",
            id: "hml0gm",
          })}
        </p>
        <p className="my-3">
          {intl.formatMessage({
            defaultMessage:
              "If your answer is yes to one or several of the previous questions, we have the solution you are looking for. Since 2019, we have built trust with hundreds of digital leaders from dozens of organizations across the Government of Canada to help talented employees optimize their skills, achieve their potential, develop new experiences, and engage in the succession planning process.",
            description: "Paragraph two, about who is eligible for exposition",
            id: "80WTKY",
          })}
        </p>
        <Heading level="h3" size="h6" className="mt-12 mb-3 font-bold">
          {intl.formatMessage({
            defaultMessage:
              "Learn more about our four services and discover how we can help you achieve your goals!",
            id: "ZaCyXP",
            description: "Heading for EXposition services",
          })}
        </Heading>
        <Accordion.Root
          type="single"
          mode="card"
          size="sm"
          collapsible
          className="my-6"
        >
          <Accordion.Item value="digital-community-support">
            <Accordion.Trigger as="h4">
              {intl.formatMessage({
                defaultMessage: "Digital community support",
                id: "pHIcBU",
                description:
                  "Button text to open section describing digital community support",
              })}
            </Accordion.Trigger>
            <Accordion.Content>
              <p>
                {intl.formatMessage({
                  defaultMessage:
                    "Conducted 573 personalized 1:1 career management and support meetings with aspiring executives and executives in the 2022-2023 fiscal year.",
                  id: "DsUtfO",
                  description: "Description of digital community support",
                })}
              </p>
            </Accordion.Content>
          </Accordion.Item>
          <Accordion.Item value="id-digital-talents">
            <Accordion.Trigger as="h4">
              {intl.formatMessage({
                defaultMessage:
                  "Identification of digital talents - Talent management roundtable discussions",
                id: "vJ/8Mk",
                description:
                  "Button text to open section describing identification of digital talents",
              })}
            </Accordion.Trigger>
            <Accordion.Content>
              <p>
                {intl.formatMessage({
                  defaultMessage:
                    "Over the years, hundreds of nominees at different groups and levels (EXposition focuses on EX while EXtend EXposition focuses on the non-EX groups and levels) have been brought forward and their nominations are compiled in the Digital Talent Management Repository. This talent management repository is the primary data source when organizations are required to obtain referrals throughout the year.",
                  id: "s/BI/4",
                  description: "Description of identifying digital talents",
                })}
              </p>
            </Accordion.Content>
          </Accordion.Item>
          <Accordion.Item value="referral-services">
            <Accordion.Trigger as="h4">
              {intl.formatMessage({
                defaultMessage: "Referrals services",
                id: "9Vzxgu",
                description:
                  "Button text to open section describing referrals services",
              })}
            </Accordion.Trigger>
            <Accordion.Content>
              <p>
                {intl.formatMessage({
                  defaultMessage:
                    "Completed 42 placements of C-suite and other leadership positions this fiscal year promoting digital talent management which doubled the placements in 2022-2023 previous fiscal year. Note that the digital talents are identified at the interdepartmental annual talent management roundtable discussions.",
                  id: "lKoKu0",
                  description: "Description of executive referral services",
                })}
              </p>
            </Accordion.Content>
          </Accordion.Item>
          <Accordion.Item value="digital-community-mentorship-program">
            <Accordion.Trigger as="h4">
              {intl.formatMessage({
                defaultMessage: "Digital Community Mentorship Program",
                id: "c+P41C",
                description:
                  "Button text to open section describing mentorship program",
              })}
            </Accordion.Trigger>
            <Accordion.Content>
              <p>
                {intl.formatMessage({
                  defaultMessage:
                    "Launched the third cohort of the Digital Community Mentorship Program for members of Employment Equity groups.",
                  id: "3HKoKM",
                  description: "Description of the mentorship program",
                })}
              </p>
            </Accordion.Content>
          </Accordion.Item>
        </Accordion.Root>
        <p className="mb-18">
          <Link
            external
            mode="solid"
            color="secondary"
            href={`mailto:${TALENTSEARCH_SUPPORT_EMAIL}?subject=${encodeURIComponent(
              intl.formatMessage({
                defaultMessage: "EXposition",
                id: "vPPz4w",
                description: "Subject line for contact email for EXposition",
              }),
            )}`}
          >
            {intl.formatMessage({
              defaultMessage: "Contact us<hidden> about EXposition</hidden>",
              id: "rE/TUL",
              description: "Link text to email the team about EXposition",
            })}
          </Link>
        </p>
        <DirectiveBlock />
      </FlourishContainer>
      <Flourish className="relative z-40" />
    </>
  );
};

const ExecutiveHomePage_Query = graphql(/* GraphQL */ `
  query ExecutiveHomePage($closingAfter: DateTime) {
    publishedPools(closingAfter: $closingAfter) {
      id
      publishingGroup {
        value
        label {
          en
          fr
        }
      }
      ...PoolCard
    }
  }
`);

const now = nowUTCDateTime();

export const Component = () => {
  const [{ data, fetching, error }] = useQuery({
    query: ExecutiveHomePage_Query,
    variables: { closingAfter: now }, // pass current dateTime into query argument
  });

  const filteredPools =
    data?.publishedPools.filter(
      (pool) =>
        typeof pool !== `undefined` &&
        !!pool &&
        isExecPool(pool.publishingGroup?.value),
    ) ?? [];

  return (
    <Pending fetching={fetching} error={error}>
      <HomePage pools={filteredPools} />
    </Pending>
  );
};

Component.displayName = "ExecutiveHomePage";

export default Component;
