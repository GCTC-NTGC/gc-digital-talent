import { defineMessage, useIntl } from "react-intl";
import MagnifyingGlassIcon from "@heroicons/react/24/outline/MagnifyingGlassIcon";
import BookmarkSquareIcon from "@heroicons/react/24/outline/BookmarkSquareIcon";
import CheckBadgeIcon from "@heroicons/react/24/outline/CheckBadgeIcon";
import SparklesIcon from "@heroicons/react/24/outline/SparklesIcon";
import UserPlusIcon from "@heroicons/react/24/outline/UserPlusIcon";

import { CardFlat, Flourish, Heading, CTALink } from "@gc-digital-talent/ui";
import { navigationMessages } from "@gc-digital-talent/i18n";

import SEO from "~/components/SEO/SEO";
import useRoutes from "~/hooks/useRoutes";
import SkewedContainer from "~/components/SkewedContainer/SkewedContainer";
import SkewedImageContainer from "~/components/SkewedContainer/SkewedImageContainer";
import FlourishContainer from "~/components/FlourishContainer/FlourishContainer";
import FeatureBlock from "~/components/FeatureBlock/FeatureBlock";
import managerHeroSquare from "~/assets/img/manager-hero-square.webp";
import managerHeroLandscape from "~/assets/img/manager-hero-landscape.webp";
import managerProfileSquare from "~/assets/img/manager-profile-square.webp";
import managerProfileLandscape from "~/assets/img/manager-profile-landscape.webp";
import peopleGatheredAroundLaptop from "~/assets/img/people-gathered-around-laptop.webp";
import peopleSittingOnCouch from "~/assets/img/people-sitting-on-couch-discussing-something.webp";
import peopleSittingInLine from "~/assets/img/people-sitting-in-a-line-smiling-at-another-person.webp";
import { TALENTSEARCH_SUPPORT_EMAIL } from "~/constants/talentSearchConstants";
import DirectiveBlock from "~/components/DirectiveBlock/DirectiveBlock";

import HomeHero from "../components/HomeHero";

const pageTitle = defineMessage({
  defaultMessage: "Managers community",
  id: "l75mNg",
  description: "Title for Managers community",
});

const pageSubtitle = defineMessage({
  defaultMessage: "Grow your career and find talent for your team.",
  id: "37mBAU",
  description: "Subtitle for the manager homepage",
});

const ManagerHomePage = () => {
  const intl = useIntl();
  const paths = useRoutes();
  const commonFeatureImgProps = {
    height: 300,
    loading: "lazy",
    width: 400,
  };

  return (
    <>
      <SEO
        title={intl.formatMessage(pageTitle)}
        description={intl.formatMessage(pageSubtitle)}
      />
      <HomeHero
        title={intl.formatMessage(pageTitle)}
        titleSize="h2"
        subtitle={intl.formatMessage(pageSubtitle)}
        img={{
          sources: { sm: managerHeroSquare },
          src: managerHeroLandscape,
          alt: "",
        }}
        callToAction={
          <>
            <CTALink
              color="warning"
              icon={MagnifyingGlassIcon}
              href={paths.search()}
            >
              {intl.formatMessage(navigationMessages.findTalent)}
            </CTALink>
            <CTALink
              color="primary"
              icon={BookmarkSquareIcon}
              href={paths.directive()}
            >
              {intl.formatMessage({
                defaultMessage: "Directive responsibilities",
                id: "304KKb",
                description: "Link text for the directive page call to action",
              })}
            </CTALink>
          </>
        }
      />
      <SkewedContainer>
        <Heading
          level="h2"
          size="h3"
          icon={SparklesIcon}
          color="secondary"
          className="mt-0 font-normal"
        >
          {intl.formatMessage({
            defaultMessage: "What we can do for you",
            id: "jz/FoH",
            description: "Heading for the manager opportunities",
          })}
        </Heading>
        <div className="grid gap-12 pt-12 xs:grid-cols-2 xs:gap-18 sm:grid-cols-3">
          <CardFlat
            color="warning"
            title={intl.formatMessage(navigationMessages.findTalent)}
            links={[
              {
                href: paths.search(),
                mode: "solid",
                label: intl.formatMessage(navigationMessages.findTalent),
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
            color="primary"
            title={intl.formatMessage({
              defaultMessage: "Run a recruitment process",
              id: "2wzOfY",
              description:
                "Heading for the contact section to run a recruitment process",
            })}
            links={[
              {
                href: `mailto:${TALENTSEARCH_SUPPORT_EMAIL}?subject=${encodeURIComponent(
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
                  description: "Title for Contact us action",
                  id: "RIi/3q",
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
            color="error"
            title={intl.formatMessage({
              defaultMessage: "Hire Indigenous talent",
              id: "IDhld2",
              description:
                "Heading for the IT Apprenticeship Program for Indigenous Peoples section",
            })}
            links={[
              {
                href: paths.iapManager(),
                mode: "solid",
                label: intl.formatMessage({
                  defaultMessage: "Hire an IT apprentice",
                  id: "TjvnvR",
                  description:
                    "Link text to the IT Apprenticeship Program for Indigenous Peoples page",
                }),
              },
            ]}
          >
            <p>
              {intl.formatMessage({
                defaultMessage:
                  "Support career pathways for First Nations, Inuit and Métis apprentices with a passion for IT and help create a more diverse, equitable and inclusive public service. Hire through the IT Apprenticeship Program for Indigenous Peoples.",
                id: "1ru8HO",
                description:
                  "Description for the IT Apprenticeship Program for Indigenous Peoples",
              })}
            </p>
          </CardFlat>
        </div>
      </SkewedContainer>
      <SkewedImageContainer
        img={{
          src: managerProfileLandscape,
          sources: { sm: managerProfileSquare },
        }}
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
        size="sm"
        skew={false}
        className="-mt-20 bg-gray-100 pt-20 dark:bg-gray-700"
      >
        <Heading
          level="h2"
          size="h3"
          className="mt-0 mb-3 font-normal"
          icon={CheckBadgeIcon}
          color="warning"
        >
          {intl.formatMessage({
            defaultMessage: "Manage your career",
            id: "rhW3iW",
            description: "Heading for featured items on the manager homepage",
          })}
        </Heading>
        <div className="mt-12 grid gap-6 xs:grid-cols-3">
          <FeatureBlock
            content={{
              img: {
                path: peopleGatheredAroundLaptop,
                ...commonFeatureImgProps,
              },
              title: intl.formatMessage({
                defaultMessage: "Get hiring experience",
                id: "SfhT1q",
                description: "Title to get hiring experience",
              }),
              summary: (
                <>
                  <p className="mb-3">
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
                path: `mailto:${TALENTSEARCH_SUPPORT_EMAIL}?subject=${encodeURIComponent(
                  intl.formatMessage({
                    defaultMessage:
                      "I'm interested in gaining hiring experience",
                    id: "2OTKDd",
                    description: "Subject for email to gain hiring experience",
                  }),
                )}`,
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
              img: { path: peopleSittingOnCouch, ...commonFeatureImgProps },
              title: intl.formatMessage({
                defaultMessage: "Apply for manager jobs",
                id: "HHtv+9",
                description: "Title for the feature about finding manager jobs",
              }),
              summary: (
                <p>
                  {intl.formatMessage({
                    defaultMessage:
                      "Check out our job opportunities to find a manager position that inspires you. Apply to play a key role in one of the IT teams at the Government of Canada and make a meaningful impact.",
                    id: "LQbKTy",
                    description:
                      "Summary for the feature about finding manager jobs",
                  })}
                </p>
              ),
              link: {
                path: paths.jobs(), // Note: Update once we have a manager specific page
                label: intl.formatMessage(navigationMessages.browseJobs),
              },
            }}
          />
          <FeatureBlock
            content={{
              img: { path: peopleSittingInLine, ...commonFeatureImgProps },
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
                path: paths.executive(),
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
        <DirectiveBlock />
      </FlourishContainer>
      <Flourish className="relative z-40" />
    </>
  );
};

export const Component = () => <ManagerHomePage />;

Component.displayName = "ManagerHomePage";

export default ManagerHomePage;
