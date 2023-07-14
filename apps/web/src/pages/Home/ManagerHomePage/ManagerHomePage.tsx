import React from "react";
import { useIntl } from "react-intl";
import MagnifyingGlassCircleIcon from "@heroicons/react/24/outline/MagnifyingGlassCircleIcon";
import MagnifyingGlassIcon from "@heroicons/react/24/outline/MagnifyingGlassIcon";
import BookmarkSquareIcon from "@heroicons/react/24/outline/BookmarkSquareIcon";
import CheckBadgeIcon from "@heroicons/react/24/outline/CheckBadgeIcon";
import SparklesIcon from "@heroicons/react/24/outline/SparklesIcon";
import UserPlusIcon from "@heroicons/react/24/outline/UserPlusIcon";

import { CardFlat, Flourish, Heading, Link } from "@gc-digital-talent/ui";

import SEO from "~/components/SEO/SEO";
import useRoutes from "~/hooks/useRoutes";
import HomeHero from "~/components/Hero/HomeHero";
import SkewedContainer from "~/components/SkewedContainer/SkewedContainer";
import SkewedImageContainer from "~/components/SkewedContainer/SkewedImageContainer";
import FlourishContainer from "~/components/FlourishContainer/FlourishContainer";
import FeatureBlock from "~/components/FeatureBlock/FeatureBlock";

import managerHero from "~/assets/img/manager-hero.jpg";
import managerProfileHero from "~/assets/img/manager-profile-hero.jpg";
import peopleGatheredAroundLaptop from "~/assets/img/people-gathered-around-laptop.jpg";
import peopleSittingOnCouch from "~/assets/img/people-sitting-on-couch-discussing-something.jpg";
import peopleSittingInLine from "~/assets/img/people-sitting-in-a-line-smiling-at-another-person.jpg";

const HomePage = () => {
  const intl = useIntl();
  const paths = useRoutes();

  const pageTitle = intl.formatMessage({
    defaultMessage: "Managers community",
    id: "Izo/vB",
    description: "Page title for the managers homepage",
  });

  return (
    <>
      <SEO title={pageTitle} />
      <HomeHero
        img={{
          src: managerHero,
          alt: "",
        }}
        callToAction={
          <>
            <Link
              color="quaternary"
              mode="cta"
              icon={MagnifyingGlassIcon}
              href={paths.search()}
            >
              {intl.formatMessage({
                defaultMessage: "Find talent",
                id: "sbEk4X",
                description: "Link text for hiring manager call to action",
              })}
            </Link>
            <Link
              color="secondary"
              mode="cta"
              icon={BookmarkSquareIcon}
              href={paths.directive()}
            >
              {intl.formatMessage({
                defaultMessage: "Directive responsibilities",
                id: "304KKb",
                description: "Link text for the directive page call to action",
              })}
            </Link>
          </>
        }
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
            defaultMessage: "Grow your career and find talent for your team.",
            id: "37mBAU",
            description: "Subtitle for the manager homepage",
          })}
        </p>
      </HomeHero>
      <SkewedContainer>
        <Heading
          level="h2"
          Icon={SparklesIcon}
          color="primary"
          data-h2-margin="base(0, 0, x0.5, 0)"
        >
          {intl.formatMessage({
            defaultMessage: "What we can do for you",
            id: "jz/FoH",
            description: "Heading for the manager opportunities",
          })}
        </Heading>
        <div
          data-h2-display="base(grid)"
          data-h2-grid-template-columns="base(1fr) p-tablet(repeat(2, minmax(0, 1fr))) l-tablet(repeat(3, minmax(0, 1fr)))"
          data-h2-gap="base(x2) p-tablet(x3)"
          data-h2-padding="base(x2, 0, 0, 0) p-tablet(x3, 0, 0, 0)"
        >
          <CardFlat
            color="quaternary"
            title={intl.formatMessage({
              defaultMessage: "Find talent",
              id: "93Dk4Q",
              description: "Heading for the digital government talent search",
            })}
            links={[
              {
                href: paths.search(),
                mode: "solid",
                label: intl.formatMessage({
                  defaultMessage: "Find talent",
                  id: "sbEk4X",
                  description: "Link text for hiring manager call to action",
                }),
              },
            ]}
          >
            <p>
              {intl.formatMessage({
                defaultMessage:
                  "Search our database to find fully qualified talent, ready to hire without further competition. Work with our team to finalize your HR documentation so you can make an offer and get talent in place quickly and easily.",
                id: "XJ/xK1",
                description:
                  "Description for the digital government talent search",
              })}
            </p>
          </CardFlat>
          <CardFlat
            color="secondary"
            title={intl.formatMessage({
              defaultMessage: "Run a recruitment process",
              id: "2wzOfY",
              description:
                "Heading for the contact section to run a recruitment process",
            })}
            links={[
              {
                href: `mailto:gctalent-talentgc@support-soutien.gc.ca?subject=${encodeURIComponent(
                  intl.formatMessage({
                    defaultMessage:
                      "I'm interested in running a recruitment process",
                    id: "Vs8wOD",
                    description:
                      "Subject line for contact email to start a recruitment process",
                  }),
                )}`,
                mode: "solid",
                external: true,
                label: intl.formatMessage({
                  defaultMessage: "Contact us",
                  description:
                    "Link text to contact the the team about starting a recruitment process",
                  id: "g0/bWP",
                }),
              },
            ]}
          >
            <p>
              {intl.formatMessage({
                defaultMessage:
                  "Work with our team to run your own recruitment process on the GC Digital Talent platform and take advantage of modern features like our applicant tracking system, skills-based hiring, and equity advancement approaches.",
                id: "Bpr9Cs",
                description: "Description for starting a recruitment process",
              })}
            </p>
          </CardFlat>
          <CardFlat
            color="tertiary"
            title={intl.formatMessage({
              defaultMessage: "Gain data insights",
              id: "3GOVZI",
              description: "Heading for the direct on digital talent section",
            })}
            links={[
              {
                href: paths.directive(),
                mode: "solid",
                label: intl.formatMessage({
                  defaultMessage:
                    "Learn more<hidden> about the directive on digital talent</hidden>",
                  id: "CMxMEW",
                  description:
                    "Link text to the directive on digital talent page",
                }),
              },
            ]}
          >
            <p data-h2-margin-bottom="base(x.5)">
              {intl.formatMessage({
                defaultMessage: "Coming Fall 2023",
                id: "5yYtE6",
                description:
                  "Text displayed for soon to come data talent data portal",
              })}
            </p>
            <p>
              {intl.formatMessage({
                defaultMessage:
                  "Check out our new Digital Talent Data Portal for trends, insights and ideas to strengthen your own talent planning and recruitment strategies.",
                id: "xQfIcL",
                description: "Description for the digital talent data portal",
              })}
            </p>
          </CardFlat>
        </div>
      </SkewedContainer>
      <SkewedImageContainer
        imgSrc={managerProfileHero}
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
              "Your profile is at the heart of the platform. Tell your story, show how you developed your skills, and use your profile to apply for jobs. Whether you’re hunting for a job now or just thinking about the future, a strong profile is your path to new opportunities.",
            id: "aIgx1t",
            description:
              "Description of how application profiles work for managers.",
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
      <FlourishContainer show={["bottom"]} size="sm" skew={false}>
        <Heading
          level="h2"
          data-h2-margin="base(0, 0, x0.5, 0)"
          Icon={CheckBadgeIcon}
          color="quaternary"
        >
          {intl.formatMessage({
            defaultMessage: "Manage your career",
            id: "rhW3iW",
            description: "Heading for featured items on the manager homepage",
          })}
        </Heading>
        <div
          data-h2-display="base(grid)"
          data-h2-grid-template-columns="base(1fr) p-tablet(repeat(3, minmax(0, 1fr)))"
          data-h2-gap="base(x1) p-tablet(x2)"
          data-h2-padding="base(x2, 0, 0, 0)"
        >
          <FeatureBlock
            content={{
              img: { path: peopleGatheredAroundLaptop },
              title: intl.formatMessage({
                defaultMessage: "Get hiring experience",
                id: "azBrrC",
                description:
                  "Title for the feature about getting hiring experience",
              }),
              summary: (
                <>
                  <p data-h2-margin-bottom="base(x.5)">
                    {intl.formatMessage({
                      defaultMessage:
                        "New to being a manager? Looking to gain some experience in hiring and learn more about HR processes?",
                      id: "CwjLDi",
                      description:
                        "Paragraph one, summary on getting hiring experience",
                    })}
                  </p>
                  <p>
                    {intl.formatMessage({
                      defaultMessage:
                        "Put your name forward to spend a few hours participating on an interdepartmental team assessing candidates and running job processes on the GC Digital Talent platform.",
                      id: "BhWVby",
                      description:
                        "Paragraph two, summary on getting hiring experience",
                    })}
                  </p>
                </>
              ),
              link: {
                external: true,
                path: `mailto:gctalent-talentgc@support-soutien.gc.ca?subject=${encodeURIComponent(
                  intl.formatMessage({
                    defaultMessage:
                      "I'm interested in gaining hiring experience",
                    id: "2OTKDd",
                    description: "Subject for email to gain hiring experience",
                  }),
                )}}`,
                label: intl.formatMessage({
                  defaultMessage:
                    "Contact us<hidden> about hiring experience</hidden>",
                  id: "5lHi37",
                  description:
                    "Link text to email about the gaining hiring experience",
                }),
              },
            }}
          />
          <FeatureBlock
            content={{
              img: { path: peopleSittingOnCouch },
              title: intl.formatMessage({
                defaultMessage: "Apply for manager jobs",
                id: "HHtv+9",
                description: "Title for the feature about finding manager jobs",
              }),
              summary: (
                <p>
                  {intl.formatMessage({
                    defaultMessage:
                      "Check out the most recent manager recruitment processes for specific opportunities or apply to ongoing recruitment in any of the IT generic work streams. Check back often for new opportunities.",
                    id: "gURsqG",
                    description:
                      "Summary for the feature about finding manager jobs",
                  })}
                </p>
              ),
              link: {
                path: paths.browsePools(), // Note: Update once we have a manager specific page
                label: intl.formatMessage({
                  defaultMessage: "Browse jobs",
                  id: "NNosUu",
                  description:
                    "Link text for manager jobs in government call to action",
                }),
              },
            }}
          />
          <FeatureBlock
            content={{
              img: { path: peopleSittingInLine },
              title: intl.formatMessage({
                defaultMessage: "Ready for an executive role?",
                id: "7TwG/b",
                description:
                  "Title for the feature about finding executive jobs",
              }),
              summary: (
                <p>
                  {intl.formatMessage({
                    defaultMessage:
                      "Wondering whats next for your career? Interested in being considered for executive opportunities in the GC digital community? The Digital Community Management team does ongoing talent mapping for managers who are ready for the next step. Check out our digital executives page to see what's out there.",
                    id: "yFMCqD",
                    description:
                      "Summary for the feature about finding executive jobs",
                  })}
                </p>
              ),
              link: {
                path: "#", // TO DO: Update once we have a path for the executive home page (#6312)
                label: intl.formatMessage({
                  defaultMessage:
                    "Learn more<hidden> about executive jobs</hidden>",
                  id: "tKtdVT",
                  description:
                    "Link text for executive jobs in government call to action",
                }),
              },
            }}
          />
        </div>
        <Heading
          Icon={MagnifyingGlassCircleIcon}
          color="tertiary"
          data-h2-margin-top="base(x3)"
        >
          {intl.formatMessage({
            defaultMessage: "Directive on Digital Talent",
            id: "xXwUGs",
            description: "Title for the digital talent directive page",
          })}
        </Heading>
        <p data-h2-margin="base(x1 0)">
          {intl.formatMessage({
            defaultMessage:
              "The GC Digital Talent platform offers a handful of helpful resources to make completing your responsibilities under the Directive on Digital Talent as easy as possible. This includes online forms, implementation guidance, and links to the Directive.",
            id: "tSAjnB",
            description: "Summary of the directive on digital talent",
          })}
        </p>
        <Link href={paths.directive()} color="tertiary" mode="solid">
          {intl.formatMessage({
            defaultMessage: "Learn more<hidden> about the directive</hidden>",
            id: "+cqG9n",
            description: "Link text to the directive on digital talent page",
          })}
        </Link>
      </FlourishContainer>
      <Flourish />
    </>
  );
};

export default HomePage;
