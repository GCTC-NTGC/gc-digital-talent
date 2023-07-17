import React from "react";
import { useIntl } from "react-intl";
import RocketLaunchIcon from "@heroicons/react/24/outline/RocketLaunchIcon";
import PuzzlePieceIcon from "@heroicons/react/24/outline/PuzzlePieceIcon";
import UserPlusIcon from "@heroicons/react/24/outline/UserPlusIcon";
import SparklesIcon from "@heroicons/react/24/outline/SparklesIcon";

import {
  Accordion,
  CardFlat,
  Flourish,
  Heading,
  Link,
  Pending,
  StandardAccordionHeader,
} from "@gc-digital-talent/ui";
import { nowUTCDateTime } from "@gc-digital-talent/date-helpers";

import SEO from "~/components/SEO/SEO";
import useRoutes from "~/hooks/useRoutes";
import HomeHero from "~/components/Hero/HomeHero";
import SkewedContainer from "~/components/SkewedContainer/SkewedContainer";
import SkewedImageContainer from "~/components/SkewedContainer/SkewedImageContainer";
import FlourishContainer from "~/components/FlourishContainer/FlourishContainer";
import DirectiveBlock from "~/components/DirectiveBlock/DirectiveBlock";
import PoolCard from "~/components/PoolCard/PoolCard";
import { Pool, useBrowsePoolsQuery } from "~/api/generated";
import { isExecPool } from "~/utils/poolUtils";

import executiveHero from "~/assets/img/people-sitting-in-line-shaking-hands.jpg";
import executiveProfileHero from "~/assets/img/person-with-hand-to-chin-looking-at-laptop.jpg";

interface HomePageProps {
  pools: Pool[];
}

export const HomePage = ({ pools }: HomePageProps) => {
  const intl = useIntl();
  const paths = useRoutes();

  const pageTitle = intl.formatMessage({
    defaultMessage: "Welcome executives",
    id: "gtU+9w",
    description: "Page title for the executives homepage",
  });

  return (
    <>
      <SEO title={pageTitle} />
      <HomeHero
        img={{
          src: executiveHero,
          alt: "",
        }}
      >
        <Heading level="h1" size="h2" data-h2-margin="base(0, 0, x0.5, 0)">
          {pageTitle}
        </Heading>
        <p
          data-h2-font-size="base(h6, 1.4)"
          data-h2-font-weight="base(300)"
          data-h2-margin="base(x1, 0, x2, 0)"
          data-h2-max-width="p-tablet(50%)"
        >
          {intl.formatMessage({
            defaultMessage:
              "Find and apply to digital executive opportunities in the Government of Canada.",
            id: "AzCfxE",
            description: "Subtitle for the executive homepage",
          })}
        </p>
      </HomeHero>
      <SkewedContainer>
        <Heading
          level="h2"
          Icon={RocketLaunchIcon}
          color="secondary"
          data-h2-margin="base(0, 0, x0.5, 0)"
        >
          {intl.formatMessage({
            defaultMessage: "Executive recruitment processes",
            id: "UNMEfB",
            description: "Heading for the executive opportunities",
          })}
        </Heading>
        <p data-h2-margin="base(x1)">
          {intl.formatMessage({
            defaultMessage:
              "This platform allows you to apply to recruitment processes that make it easy for senior executives and HR recruitment teams to find you. This page offers you a snapshot of our open recruitment processes. Come back and check this page often!",
            description:
              "Summary of the platform for executives and opportunities available",
            id: "FS23BP",
          })}
        </p>
        {pools.length > 0 ? (
          <div data-h2-padding="base(x2, 0, 0, 0) p-tablet(x3, 0, 0, 0)">
            <ul
              data-h2-margin="base(0)"
              data-h2-padding="base(0)"
              data-h2-list-style="base(none)"
            >
              {pools.map((pool) => (
                <li key={pool.id}>
                  <PoolCard pool={pool} />
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div
            data-h2-padding="base(x1)"
            data-h2-radius="base(s)"
            data-h2-shadow="base(medium)"
            data-h2-background="base(foreground)"
          >
            <Heading level="h3" size="h6" data-h2-margin-top="base(0)">
              {intl.formatMessage({
                defaultMessage: "More opportunities are coming soon!",
                id: "Cia2li",
                description:
                  "Heading for message when there are no executive opportunities available",
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
          </div>
        )}
      </SkewedContainer>
      <div
        data-h2-background="base(white) base:dark(black.light)"
        data-h2-padding="base(x3 0)"
        data-h2-border-top="base(solid 1px gray.lighter)"
        data-h2-margin-top="base(-x1) l-tablet(-x3)"
        data-h2-position="base(relative)"
        data-h2-z-index="base(3)"
      >
        <div data-h2-container="base(center, large, x1) p-tablet(center, large, x2)">
          <Heading
            level="h2"
            Icon={PuzzlePieceIcon}
            color="quaternary"
            data-h2-margin-top="base(0)"
          >
            {intl.formatMessage({
              defaultMessage: "What we can do for you",
              id: "5bdLGy",
              description: "Heading for the executive opportunities",
            })}
          </Heading>
          <div
            data-h2-display="base(grid)"
            data-h2-grid-template-columns="base(1fr) p-tablet(repeat(2, minmax(0, 1fr))) l-tablet(repeat(3, minmax(0, 1fr)))"
            data-h2-gap="base(x2) p-tablet(x3)"
            data-h2-padding="base(x2, 0, 0, 0) p-tablet(x3, 0, 0, 0)"
          >
            <CardFlat
              color="tertiary"
              title={intl.formatMessage({
                defaultMessage: "Find pre-qualified executive talent",
                id: "1R3SYH",
                description:
                  "Heading for the digital government executive talent search",
              })}
              links={[
                {
                  href: `mailto:gctalent-talentgc@support-soutien.gc.ca?subject=${encodeURIComponent(
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
                    id: "eAQwAl",
                    description: "Link text for hiring manager call to action",
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
              color="quaternary"
              title={intl.formatMessage({
                defaultMessage: "Manage your career",
                id: "kK1Z9U",
                description: "Heading for the browse executive jobs section",
              })}
              links={[
                {
                  href: paths.browsePools(),
                  mode: "solid",
                  label: intl.formatMessage({
                    defaultMessage: "Browse jobs",
                    id: "VK/lwK",
                    description:
                      "Link text for executive jobs in government call to action",
                  }),
                },
              ]}
            >
              <p>
                {intl.formatMessage({
                  defaultMessage:
                    "Check out the most recent manager recruitment processes for specific opportunities or apply to ongoing recruitment in any of the IT generic work streams. Check back often for new opportunities.",
                  id: "4iWzFv",
                  description:
                    "Description for browsing executive recruitment processes",
                })}
              </p>
            </CardFlat>
            <CardFlat
              color="secondary"
              title={intl.formatMessage({
                defaultMessage: "Get hiring experience",
                id: "UPtqUI",
                description: "Heading for the direct on digital talent section",
              })}
              links={[
                {
                  href: `mailto:gctalent-talentgc@support-soutien.gc.ca?subject=${encodeURIComponent(
                    intl.formatMessage({
                      defaultMessage:
                        "I'm interested in gaining hiring experience",
                      id: "dk+1RB",
                      description:
                        "Subject line for contact email to gain hiring experience",
                    }),
                  )}`,
                  mode: "solid",
                  external: true,
                  label: intl.formatMessage({
                    defaultMessage: "Contact us",
                    description:
                      "Link text to contact the the team about gaining hiring experience",
                    id: "Mozx6m",
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
        </div>
      </div>
      <SkewedImageContainer
        imgSrc={executiveProfileHero}
        imgProps={{
          "data-h2-background-position":
            "base(80% 110%) l-tablet(60% 50%) desktop(right 50%)",
        }}
      >
        <p
          data-h2-font-size="base(h6, 1.4)"
          data-h2-font-weight="base(300)"
          data-h2-color="base(white)"
          data-h2-margin="base(0, 0, x2, 0)"
          data-h2-max-width="p-tablet(50%)"
        >
          {intl.formatMessage({
            defaultMessage:
              "Your profile is at the heart of the platform. Tell your story, show how you developed your skills, and use your profile to apply for jobs. Whether you're hunting for a job now or just thinking about the future, a strong profile is your path to new opportunities.",
            id: "naE1xF",
            description:
              "Description of how application profiles works for managers/executives.",
          })}
        </p>
        <div
          data-h2-display="base(flex)"
          data-h2-gap="base(x1)"
          data-h2-justify-content="base(flex-start)"
        >
          <Link
            color="quinary"
            mode="cta"
            href={paths.myProfile()}
            icon={UserPlusIcon}
          >
            {intl.formatMessage({
              defaultMessage: "Create a profile",
              id: "7hUWc+",
              description: "Link text for users to create a profile",
            })}
          </Link>
        </div>
      </SkewedImageContainer>
      <FlourishContainer show={["bottom"]} skew={false} size="sm">
        <Heading
          level="h2"
          data-h2-margin="base(0, 0, x0.5, 0)"
          Icon={SparklesIcon}
          color="primary"
        >
          {intl.formatMessage({
            defaultMessage: "EXposition",
            id: "7tv7ct",
            description:
              "Heading for exposition section on the executive homepage",
          })}
        </Heading>
        <Heading level="h3">
          {intl.formatMessage({
            defaultMessage: "Who is EXposition for?",
            id: "VKE4nf",
            description: "Heading for exposition eligibility",
          })}
        </Heading>
        <p data-h2-margin="base(x1 0)">
          {intl.formatMessage({
            defaultMessage:
              "Are you a leader looking to attract or promote high-potential talent within the digital (IM, IT or Data fields) community? Do you have talented employees to nominate at the EX minus one to the EX-03 group and level? Are you from the human resources community and interested in interdepartmental opportunities for your digital workforce?",
            description: "Paragraph one, about who is eligible for exposition",
            id: "psqrZz",
          })}
        </p>
        <p data-h2-margin="base(x1 0)">
          {intl.formatMessage({
            defaultMessage:
              "If your answer is yes to one or several of the questions above, we have the solution you are looking for. Since 2019, we have built trust with hundreds of digital leaders from dozens of organizations across the GC to help talented employees optimize their skills, achieve their potential, develop new experiences, and engage in the succession planning process.",
            description: "Paragraph two, about who is eligible for exposition",
            id: "oQR/Ac",
          })}
        </p>
        <Heading level="h3">
          {intl.formatMessage({
            defaultMessage:
              "Learn more about our 4 services and discover how we can help you achieve your goals!",
            id: "02DYRh",
            description: "Heading for exposition services",
          })}
        </Heading>
        <Accordion.Root
          mode="simple"
          type="single"
          collapsible
          data-h2-margin="base(x1 0)"
          data-h2-display="base(flex)"
          data-h2-flex-direction="base(column)"
          data-h2-gap="base(x1 0)"
        >
          <Accordion.Item
            data-h2-radius="base(s)"
            data-h2-shadow="base(medium)"
            value="digital-community-support"
          >
            <StandardAccordionHeader
              headingAs="h4"
              data-h2-padding="base(x.5 x.25)"
            >
              {intl.formatMessage({
                defaultMessage: "Digital community support",
                id: "pHIcBU",
                description:
                  "Button text to open section describing digital community support",
              })}
            </StandardAccordionHeader>
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
          <Accordion.Item
            data-h2-radius="base(s)"
            data-h2-shadow="base(medium)"
            value="id-digital-talents"
          >
            <StandardAccordionHeader
              headingAs="h4"
              data-h2-padding="base(x.5 x.25)"
            >
              {intl.formatMessage({
                defaultMessage:
                  "Identification of digital talents - Talent management round table discussions",
                id: "BJFLx/",
                description:
                  "Button text to open section describing identification of digital talents",
              })}
            </StandardAccordionHeader>
            <Accordion.Content>
              <p>
                {intl.formatMessage({
                  defaultMessage:
                    "Across the years, hundreds of nominees at different groups and levels (EXposition focus on EX while EXtend EXposition focus on the non-EX groups and levels) have been brought forward and their nominations are compiled in the Digital Talent Management Repository. This Talent Management repository is the primary data source when organizations require to obtain Referrals throughout the year.",
                  id: "M9pEkI",
                  description: "Description of identifying digital talents",
                })}
              </p>
            </Accordion.Content>
          </Accordion.Item>
          <Accordion.Item
            data-h2-radius="base(s)"
            data-h2-shadow="base(medium)"
            value="referral-services"
          >
            <StandardAccordionHeader
              headingAs="h4"
              data-h2-padding="base(x.5 x.25)"
            >
              {intl.formatMessage({
                defaultMessage: "Referrals Services",
                id: "AQCee5",
                description:
                  "Button text to open section describing referrals services",
              })}
            </StandardAccordionHeader>
            <Accordion.Content>
              <p>
                {intl.formatMessage({
                  defaultMessage:
                    "Completed 42 placements of C-Suite and other leadership positions this fiscal year promoting digital talent management which doubled the placements in 2022-2023 previous fiscal year. Note that the digital talents are identified at the interdepartmental annual talent management roundtable discussions.",
                  id: "dc6gqR",
                  description: "Description of executive referral services",
                })}
              </p>
            </Accordion.Content>
          </Accordion.Item>
          <Accordion.Item
            data-h2-radius="base(s)"
            data-h2-shadow="base(medium)"
            value="digital-community-mentorship-program"
          >
            <StandardAccordionHeader
              headingAs="h4"
              data-h2-padding="base(x.5 x.25)"
            >
              {intl.formatMessage({
                defaultMessage: "Digital Community Mentorship Program",
                id: "c+P41C",
                description:
                  "Button text to open section describing mentorship program",
              })}
            </StandardAccordionHeader>
            <Accordion.Content>
              <p>
                {intl.formatMessage({
                  defaultMessage:
                    "Launched the third cohort of the Digital Community Mentorship Program for members of an Employment Equity groups.",
                  id: "83ynuC",
                  description: "Description of the mentorship program",
                })}
              </p>
            </Accordion.Content>
          </Accordion.Item>
        </Accordion.Root>
        <p data-h2-margin-bottom="base(x3)">
          <Link
            external
            mode="solid"
            color="primary"
            href={`mailto:gctalent-talentgc@support-soutien.gc.ca?subject=${encodeURIComponent(
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
      <Flourish />
    </>
  );
};

const now = nowUTCDateTime();

const HomePageApi = () => {
  const [{ data, fetching, error }] = useBrowsePoolsQuery({
    variables: { closingAfter: now }, // pass current dateTime into query argument
  });

  const filteredPools = data?.publishedPools.filter(
    (pool) => typeof pool !== undefined && !!pool && isExecPool(pool),
  ) as Pool[];

  return (
    <Pending fetching={fetching} error={error}>
      <HomePage pools={filteredPools} />
    </Pending>
  );
};

export default HomePageApi;
