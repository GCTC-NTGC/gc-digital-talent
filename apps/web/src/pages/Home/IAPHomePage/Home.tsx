import { useIntl } from "react-intl";
import { m } from "framer-motion";
import orderBy from "lodash/orderBy";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "urql";
import { ReactNode } from "react";

import { Link, Pending, cn } from "@gc-digital-talent/ui";
import { nowUTCDateTime } from "@gc-digital-talent/date-helpers";
import {
  graphql,
  PublishingGroup,
  FragmentType,
  getFragment,
} from "@gc-digital-talent/graphql";

import useQuote from "~/hooks/useQuote";
import iapHeroImg from "~/assets/img/iap-hero.webp";
import logoImg from "~/assets/img/iap-logo.svg";
import womanSmiling from "~/assets/img/indigenous-woman-smiling.webp";
import feathers from "~/assets/img/feathers.webp";
import manOnComputer from "~/assets/img/man-on-computer.webp";
import gloves from "~/assets/img/gloves.webp";
import applicant from "~/assets/img/applicant.webp";
import ulu from "~/assets/img/ulu.webp";
import quoteBg from "~/assets/img/quote-bg.webp";
import sash from "~/assets/img/sash.webp";
import lowerBack from "~/assets/img/lower-back.webp";
import iconWatermark from "~/assets/img/icon-watermark.svg";
import indigenousWoman from "~/assets/img/indigenous-woman.webp";

import Banner from "./components/Banner";
import Card from "./components/Card";
import CTAButtons from "./components/CTAButtons";
import { ApplyDialog, RequirementDialog } from "./components/Dialog";
import Heading from "./components/Heading";
import LanguageSelector from "./components/LanguageSelector";
import Step from "./components/Step";
import Quote from "./components/Quote";
import ApplyLink from "./components/ApplyLink";
import {
  BarChart,
  Calendar,
  People,
  RadiatingCircles,
  ThickCircle,
  TrendingUp,
  Triangle,
} from "./components/Svg";
import AccommodationsDialog from "./components/Dialog/AccommodationsDialog";

const mailLink = (chunks: ReactNode) => (
  <Link external href="mailto:edsc.pda-iap.esdc@hrsdc-rhdcc.gc.ca">
    {chunks}
  </Link>
);

export const IAPHome_PoolFragment = graphql(/* GraphQL */ `
  fragment IAPHome_PoolFragment on Pool {
    id
  }
`);

interface HomeProps {
  query?: FragmentType<typeof IAPHome_PoolFragment>;
}

export const Home = ({ query }: HomeProps) => {
  const intl = useIntl();
  const quote = useQuote();
  const [searchParams] = useSearchParams();
  const locale = searchParams.get("locale");
  const latestPool = getFragment(IAPHome_PoolFragment, query);
  /**
   * Language swapping is a little rough here,
   * m.div adds a fade to smooth things out a bit
   */
  return (
    <m.div
      data-h2-background="base(white) base:dark(background)"
      className="overflow-x-hidden overflow-y-visible"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <LanguageSelector />
      <div
        {...(locale && {
          lang: locale,
        })}
      >
        <div className="relative flex w-full flex-col">
          <img
            className="relative z-10 order-2 block w-full"
            src={iapHeroImg}
            alt={intl.formatMessage({
              defaultMessage:
                "Group of Indigenous people standing with a painted hand drum.",
              id: "71+GZq",
              description:
                "Indigenous Apprenticeship hero image text alternative",
            })}
          />
          <div
            data-h2-background="base(linear-gradient(#46032c, #46032c 90%, transparent)) p-tablet(linear-gradient(#46032c, #46032c 60%, transparent)) l-tablet(linear-gradient(#46032c, #46032c 30%, transparent)) laptop(transparent)"
            className={cn(
              "relative z-20 max-w-full lg:h-0 lg:overflow-visible",
              "-mb-12 px-12 pb-20 pt-7",
              "sm:-mb-28 sm:p-12 sm:pb-6",
              "md:-mb-36 md:px-20 md:pb-0 md:pt-20",
              "lg:mb-0 lg:p-0",
            )}
          >
            <div className="mx-auto max-w-[34rem] sm:flex sm:items-center sm:gap-6 sm:pl-6 lg:max-w-[48rem] lg:pt-12">
              <img
                src={logoImg}
                alt=""
                className="mx-auto mb-3 mt-0 block w-24 max-w-full lg:w-48"
              />
              <div
                className="text-center sm:text-left"
                data-h2-color="base:all(white)"
              >
                <h1 data-h2-font-size="base(h3, 1.2)" className="font-bold">
                  {intl.formatMessage({
                    defaultMessage:
                      "IT Apprenticeship Program for Indigenous Peoples",
                    id: "gj0bQO",
                    description:
                      "Homepage title for IT Apprenticeship Program for Indigenous Peoples",
                  })}
                </h1>
                <p data-h2-font-size="base(caption)" className="mt-3 font-bold">
                  {intl.formatMessage({
                    defaultMessage:
                      "Apply today to get started on your IT career journey.",
                    id: "nn9B4R",
                    description:
                      "Homepage subtitle for IT Apprenticeship Program for Indigenous Peoples",
                  })}
                </p>
              </div>
            </div>
          </div>
          <div className="relative z-10 order-3 my-6 min-w-80 px-12 sm:absolute sm:bottom-[20%] sm:left-1/2 sm:z-20 sm:-translate-x-1/2">
            {latestPool ? <ApplyLink id={latestPool.id} /> : <ApplyDialog />}
          </div>
        </div>
        {/* About section */}
        <div className="relative z-10">
          <div
            className="relative"
            data-h2-container="base(center, iap-home, x1) l-tablet(center, iap-home, x2)"
          >
            <div className="relative sm:-top-20 md:-top-24">
              <div
                className="rounded-3xl sm:p-12 md:p-20"
                data-h2-background-color="base(white) base:dark(background)"
              >
                <div className="grid gap-20 sm:grid-cols-7">
                  <div className="sm:col-span-3">
                    <div className="relative sm:h-full sm:w-full">
                      <div
                        data-h2-radius="base(100rem)"
                        data-h2-height="base(x8)"
                        data-h2-width="base(x8)"
                        data-h2-background-color="base(primary.1) base:dark(primary.light.3)"
                        data-h2-position="base(absolute)"
                        data-h2-location="base(-x1.5, -x1, auto, auto)"
                      />
                      <div
                        data-h2-radius="base(100rem)"
                        data-h2-height="base(x15)"
                        data-h2-width="base(x15)"
                        data-h2-background-color="base(secondary.1) base:dark(secondary.light.3)"
                        data-h2-position="base(absolute)"
                        data-h2-location="base(auto, auto, -x3, -x5.5)"
                      />
                      <img
                        src={womanSmiling}
                        alt={intl.formatMessage({
                          defaultMessage:
                            "Indigenous woman wearing a jean jacket which contains several different pins.",
                          id: "cErFoy",
                          description:
                            "Indigenous Apprenticeship woman smiling image text alternative",
                        })}
                        data-h2-min-height="base(60vh) p-tablet(initial)"
                        data-h2-height="p-tablet(100%)"
                        data-h2-width="p-tablet(100%)"
                        data-h2-position="base(relative)"
                        style={{
                          objectFit: "cover",
                        }}
                      />
                      <img
                        src={feathers}
                        alt={intl.formatMessage({
                          defaultMessage: "Two feathers tied together.",
                          id: "0D8Efk",
                          description:
                            "Indigenous Apprenticeship feathers image text alternative",
                        })}
                        data-h2-position="base(absolute)"
                        data-h2-width="base(150%)"
                        data-h2-location="base(auto, -15%, 0, auto)"
                        style={{
                          maxWidth: "initial",
                          transform: "translate(0, 60%)",
                        }}
                      />
                    </div>
                  </div>
                  <div className="sm:col-span-4">
                    <Heading
                      data-h2-font-size="base(h3, 1)"
                      className="relative z-10 mb-12 mt-36 text-center sm:mt-6 sm:text-left"
                    >
                      {intl.formatMessage({
                        defaultMessage: "About the program",
                        id: "hyJz3G",
                        description: "Program information section title",
                      })}
                    </Heading>
                    <p className="mb-6 mt-12">
                      {intl.formatMessage({
                        defaultMessage:
                          "The IT Apprenticeship Program for Indigenous Peoples is a Government of Canada initiative specifically for First Nations, Inuit, and Métis peoples. It is pathway to employment in the federal public service for Indigenous peoples who have a passion for Information Technology (IT).",
                        id: "pWoAv0",
                        description: "First paragraph about the program",
                      })}
                    </p>
                    <p className="my-6">
                      {intl.formatMessage({
                        defaultMessage:
                          "By valuing and focusing on a person’s potential, rather than on their educational attainment level, the program removes one of the biggest barriers that exists when it comes to employment within the digital economy. The program has been developed by, with, and for Indigenous peoples from across Canada. Its design incorporates the preferences and needs of Indigenous learners while recognizing the importance of community.",
                        id: "wNJSJ7",
                        description: "Second paragraph about the program",
                      })}
                    </p>
                    <p className="my-6">
                      {intl.formatMessage({
                        defaultMessage:
                          "Apprentices who are involved in the program say that it is “life-changing”, that it represents “a chance to have a better life through technology”, and that “there are no barriers to succeeding in this program”.",
                        id: "cYq1Dp",
                        description: "Third paragraph about the program",
                      })}
                    </p>
                    <div className="mt-12">
                      <CTAButtons latestPoolId={latestPool?.id} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Learn section */}
        <div>
          <div
            className="relative"
            data-h2-container="base(center, iap-home, x1) l-tablet(center, iap-home, x2)"
          >
            <div className="p-12 md:p-20">
              <div className="grid gap-20 sm:grid-cols-7 sm:gap-12 md:gap-20">
                <div className="sm:order-2 sm:col-span-3">
                  <div className="relative sm:h-full sm:w-full">
                    <RadiatingCircles
                      className="absolute -right-72 -top-12 w-[110%]"
                      data-h2-color="base(secondary.light.5) base:dark(secondary.light)"
                    />
                    <img
                      src={manOnComputer}
                      alt={intl.formatMessage({
                        defaultMessage: "Indigenous man working at a computer.",
                        id: "XDgkwV",
                        description:
                          "Indigenous Apprenticeship man on computer image text alternative",
                      })}
                      className="relative min-h-[60vh] object-cover sm:h-full sm:min-h-0 sm:w-full"
                    />
                    <img
                      src={gloves}
                      alt={intl.formatMessage({
                        defaultMessage:
                          "Métis style gloves with floral beading.",
                        id: "aPLL9Z",
                        description:
                          "Indigenous Apprenticeship gloves image text alternative",
                      })}
                      className="absolute -bottom-32 -right-24 w-[140%] md:-bottom-60 md:-right-52"
                    />
                  </div>
                </div>
                <div className="sm:order-1 sm:col-span-4">
                  <Heading
                    data-h2-font-size="base(h3, 1)"
                    className="mb-12 mt-20 text-center sm:mt-12 sm:text-left"
                  >
                    {intl.formatMessage({
                      defaultMessage:
                        "What will I learn in this apprenticeship?",
                      id: "fvsYkj",
                      description:
                        "What applicants will learn sections heading",
                    })}
                  </Heading>
                  <p className="mb-6 mt-12">
                    {intl.formatMessage({
                      defaultMessage:
                        "Apprentices follow a 24-month structured program consisting of a mix of on-the-job learning and formal training.",
                      id: "dDHy5d",
                      description:
                        "First paragraph what will you learn at the program",
                    })}
                  </p>
                  <p className="my-6">
                    {intl.formatMessage({
                      defaultMessage:
                        "Apprentices will be partnered with a peer to facilitate job shadowing and supervised work, and they are assigned a mentor who provides experienced counsel and guidance over the course of the program.",
                      id: "nzcwrW",
                      description:
                        "First paragraph what will you learn at the program",
                    })}
                  </p>
                  <p className="my-6">
                    {intl.formatMessage({
                      defaultMessage:
                        "At the end of their 24-month term, apprentices will have marketable and in-demand certifications and skills, as well as the confidence necessary to contribute as part of Canada’s digital workforce, both within and outside the federal public service.",
                      id: "b09U1u",
                      description:
                        "First paragraph what will you learn at the program",
                    })}
                  </p>
                  <div className="md:sr-only">
                    <CTAButtons latestPoolId={latestPool?.id} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Who section */}
        <div className="relative z-20 mt-12">
          <div
            className="relative"
            data-h2-container="base(center, iap-home, x1) l-tablet(center, iap-home, x2)"
          >
            <div className="p-12 md:p-20">
              <div className="grid gap-20 sm:grid-cols-7 sm:gap-12 md:gap-20">
                <div className="sm:col-span-3">
                  <div className="relative sm:h-full sm:w-full">
                    <Triangle
                      className="absolute -left-8 -top-8 w-[120%] sm:-left-12 sm:-top-12"
                      data-h2-color="base(secondary) base:dark(secondary.light)"
                    />
                    <img
                      src={applicant}
                      alt={intl.formatMessage({
                        defaultMessage:
                          "Indigenous woman smiling, wearing a brown sweater and glasses.",
                        id: "X6+rc1",
                        description:
                          "Indigenous Apprenticeship applicant image text alternative",
                      })}
                      className="relative min-h-[60vh] object-cover sm:h-full sm:min-h-0 sm:w-full"
                    />
                    <img
                      src={ulu}
                      alt={intl.formatMessage({
                        defaultMessage:
                          "Ulu, an Inuit tool used by Inuit women.",
                        id: "IIZNzj",
                        description:
                          "Indigenous Apprenticeship ulu image text alternative",
                      })}
                      className="absolute -right-1/3 bottom-[-10%] block w-[34rem] sm:hidden"
                    />
                  </div>
                </div>
                <div className="relative sm:col-span-4">
                  <Heading
                    data-h2-font-size="base(h3, 1)"
                    className="my-12 text-center sm:mt-6 sm:text-left"
                  >
                    {intl.formatMessage({
                      defaultMessage: "Who is the program for?",
                      id: "O0z6Ym",
                      description:
                        "Heading for section about who the program is for",
                    })}
                  </Heading>
                  <p className="mb-6 mt-12">
                    {intl.formatMessage({
                      defaultMessage:
                        "The program is for First Nations, Inuit, and Métis peoples. If you are First Nations, an Inuk, or Métis, and if you have a passion for technology, then this program is for you!",
                      id: "f/yvXg",
                      description:
                        "First paragraph about who the program is for",
                    })}
                  </p>
                  <p className="my-6">
                    {intl.formatMessage(
                      {
                        defaultMessage:
                          "If you are not sure if this program is right for you, please <mailLink>contact us</mailLink> and a member of our team will be happy to meet with you to answer any questions you may have.",
                        id: "kspVvy",
                        description:
                          "Second paragraph about who the program is for",
                      },
                      {
                        mailLink,
                      },
                    )}
                  </p>
                  <img
                    src={ulu}
                    alt={intl.formatMessage({
                      defaultMessage: "Ulu, an Inuit tool used by Inuit women.",
                      id: "IIZNzj",
                      description:
                        "Indigenous Apprenticeship ulu image text alternative",
                    })}
                    className="absolute right-[-40%] hidden w-[34rem] sm:block md:-right-1/3"
                  />
                  <div className="relative mb-6 mt-12 min-h-12 min-w-20 sm:w-1/2">
                    <RequirementDialog />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Testimonial section */}
        <div
          className="relative z-10 mt-12 bg-cover bg-[right_10%_center] pb-[20px] pt-20 md:py-32"
          style={{
            backgroundImage: `url(${quoteBg})`,
          }}
        >
          <div data-h2-container="base(center, medium, x1) l-tablet(center, medium, x2)">
            <Heading
              light
              data-h2-color="base:all(white)"
              className="text-center"
            >
              {intl.formatMessage({
                defaultMessage: "What We’re Hearing",
                id: "PvH5lJ",
                description: "Heading for the quotes sections",
              })}
            </Heading>
            <Quote {...quote} />
          </div>
        </div>
        {/* Application call to action section */}
        <div
          className="bg-cover bg-[top_center] pb-28 pt-12 sm:pb-52 sm:pt-36 md:pb-60 md:pt-40"
          style={{
            backgroundImage: `url(${sash})`,
          }}
        >
          <div data-h2-container="base(center, iap-home, x1) p-tablet(center, iap-home, x2)">
            <div>
              <div className="grid grid-rows-2 shadow-lg sm:grid-cols-3  sm:grid-rows-1 md:grid-cols-2 xl:grid-cols-7">
                <div className="relative xl:col-span-4">
                  <img
                    src={lowerBack}
                    alt={intl.formatMessage({
                      defaultMessage: "Male Traditional dancer in regalia.",
                      id: "9VPBwR",
                      description:
                        "Indigenous Apprenticeship lower back image text alternative",
                    })}
                    className="absolute inset-0 h-full w-full object-cover object-center"
                  />
                </div>
                <div className="sm:col-span-2 md:col-span-1 xl:col-span-3">
                  <div
                    className="min-h-full p-12 text-center sm:p-20 sm:text-left"
                    data-h2-background-color="base(secondary.light)"
                  >
                    <Heading
                      light
                      data-h2-color="base:all(white)"
                      data-h2-font-size="base(h3, 1)"
                    >
                      <span className="block">
                        {intl.formatMessage({
                          defaultMessage:
                            "Is the IT Apprenticeship Program right for you?",
                          id: "DgMIfz",
                          description: "Application box heading part one",
                        })}
                      </span>
                      <span>
                        {intl.formatMessage({
                          defaultMessage: "Apply today!",
                          id: "NaF4Iu",
                          description: "Application box heading part two",
                        })}
                      </span>
                    </Heading>
                    <p data-h2-color="base:all(white)" className="my-6">
                      {intl.formatMessage({
                        defaultMessage:
                          "Apply today to start your journey to a career in Information Technology.",
                        id: "p19YJ2",
                        description: "Application box content",
                      })}
                    </p>
                    {latestPool ? (
                      <ApplyLink id={latestPool.id} />
                    ) : (
                      <ApplyDialog />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Coming soon section */}
        <div
          data-h2-background-color="base(secondary)"
          className="relative sm:pr-6 md:pb-28"
        >
          <div className="absolute left-0 top-0 h-full w-full overflow-hidden">
            <RadiatingCircles
              className="absolute left-[-10%] top-72 w-1/2"
              data-h2-color="base(primary)"
            />
            <ThickCircle className="absolute bottom-[60rem] right-[-10%] w-[35%]" />
          </div>
          <div
            className="relative"
            data-h2-container="base(center, iap-home, x1) p-tablet(center, iap-home, x2)"
          >
            <div className="mb-20 text-center">
              <Banner>
                <Heading
                  data-h2-color="base:all(white)"
                  data-h2-font-size="base(h3)"
                >
                  {intl.formatMessage({
                    defaultMessage: "Coming Soon!",
                    id: "q5FQbu",
                    description: "Heading for a coming soon section",
                  })}
                </Heading>
              </Banner>
              <Heading
                light
                data-h2-color="base:all(white)"
                className="mb-20 mt-0 text-5xl sm:my-20"
              >
                {intl.formatMessage({
                  defaultMessage:
                    "IT Apprenticeship Program for Indigenous Peoples + The Indigenous Talent Portal",
                  id: "osGGIt",
                  description: "heading for indigenous talent portal section",
                })}
              </Heading>
              <Heading
                as="h3"
                data-h2-color="base:all(white)"
                className="text-4xl"
              >
                {intl.formatMessage({
                  defaultMessage: "How it Will Work",
                  id: "U8bLT7",
                  description:
                    "heading for how the indigenous talent portal will work",
                })}
              </Heading>
              <p className="mx-w-[38rem] mx-auto mt-6">
                {intl.formatMessage({
                  defaultMessage:
                    "Soon, applicants will be able to apply using an online, interactive tool that will be available on this website. Here’s what we’re working on:",
                  id: "UDHGGA",
                  description:
                    "Description of how the indigenous talent portal will work",
                })}
              </p>
            </div>
            <div className="grid gap-20 md:grid-cols-3">
              <div>
                <Step
                  position="1"
                  title={intl.formatMessage({
                    defaultMessage:
                      "Complete the Community Indigenous Peoples Self-Declaration Form",
                    id: "1pFMSH",
                    description: "How it works, step 1 heading",
                  })}
                >
                  <p className="mt-6">
                    {intl.formatMessage({
                      defaultMessage:
                        "The program was designed to respond to reconciliation and the building of a renewed relationship based on recognition of rights, respect, cooperation and partnership with Indigenous peoples.",
                      id: "J9HjFN",
                      description: "How it works, step 1 content paragraph 1",
                    })}
                  </p>
                  <p className="mt-6">
                    {intl.formatMessage({
                      defaultMessage:
                        "There are three distinct groups of Indigenous peoples recognized in the Canadian constitution. You will be asked to confirm which Indigenous group(s) you belong to via the Indigenous Peoples Self-Declaration Form.",
                      id: "uJ1rk3",
                      description: "How it works, step 1 content paragraph 2",
                    })}
                  </p>
                </Step>
              </div>
              <div>
                <Step
                  position="2"
                  title={intl.formatMessage({
                    defaultMessage: "Provide your Information",
                    id: "/5tYua",
                    description: "How it works, step 2 heading",
                  })}
                >
                  <p className="mt-6">
                    {intl.formatMessage({
                      defaultMessage:
                        "We want to learn about you and about your interest/passion in the area of IT!",
                      id: "yZMQ6j",
                      description: "How it works, step 2 content sentence 1",
                    })}
                  </p>
                  <p className="mt-6">
                    {intl.formatMessage({
                      defaultMessage:
                        "We’ll invite you to create a profile which will be saved and submitted as your actual application.",
                      id: "SnnuD+",
                      description: "How it works, step 2 content sentence 2",
                    })}
                  </p>
                </Step>
              </div>
              <div>
                <Step
                  position="3"
                  title={intl.formatMessage({
                    defaultMessage: "Submit your Profile as your Application",
                    id: "zlYw3Z",
                    description: "How it works, step 3 heading",
                  })}
                >
                  <p className="mt-6">
                    {intl.formatMessage({
                      defaultMessage:
                        "You'll be prompted to confirm the information you provided",
                      id: "81iywD",
                      description: "How it works, step 3 content sentence 1",
                    })}
                  </p>
                  <p className="mt-6">
                    {intl.formatMessage({
                      defaultMessage:
                        "Upon submission, a team member will contact you within 5-10 business days.",
                      id: "GaX7sd",
                      description: "How it works, step 3 content sentence 2",
                    })}
                  </p>
                </Step>
              </div>
            </div>
            <div data-h2-text-align="base(center)" data-h2-margin="base(x3, 0)">
              <Heading
                as="h3"
                data-h2-color="base:all(white)"
                className="text-4xl"
              >
                {intl.formatMessage({
                  defaultMessage: "Strategy",
                  id: "DBczOG",
                  description:
                    "Heading for strategy for the indigenous talent portal",
                })}
              </Heading>
              <p
                className="mx-auto mt-6 max-w-[38rem]"
                data-h2-color="base:all(white)"
              >
                {intl.formatMessage({
                  defaultMessage:
                    "In collaboration with the IT Apprenticeship Program for Indigenous Peoples, the Indigenous Talent Portal will begin with a focus on IT and technology talent, which will:",
                  id: "Dzyk1q",
                  description:
                    "Description for strategy for the indigenous talent portal",
                })}
              </p>
            </div>
            <div className="grid gap-20 text-center sm:grid-cols-2 xl:grid-cols-4">
              <Card
                Icon={People}
                title={intl.formatMessage({
                  defaultMessage: "High Demand",
                  id: "MgLLHd",
                  description: "Talent portal strategy item 1 heading",
                })}
              >
                <p>
                  {intl.formatMessage({
                    defaultMessage:
                      "Address the great demand for Indigenous talent in IT.",
                    id: "Xhfkfg",
                    description: "Talent portal strategy item 1 content",
                  })}
                </p>
              </Card>
              <Card
                Icon={TrendingUp}
                title={intl.formatMessage({
                  defaultMessage: "Grow",
                  id: "436DA5",
                  description: "Talent portal strategy item 2 heading",
                })}
              >
                <p>
                  {intl.formatMessage({
                    defaultMessage:
                      "Allow for growth in its recruitment scope by targeting other occupational areas in the future.",
                    id: "84rSVg",
                    description: "Talent portal strategy item 2 content",
                  })}
                </p>
              </Card>
              <Card
                Icon={BarChart}
                title={intl.formatMessage({
                  defaultMessage: "Assess",
                  id: "lIHNov",
                  description: "Talent portal strategy item 3 heading",
                })}
              >
                <p>
                  {intl.formatMessage({
                    defaultMessage:
                      "Allow for data and feedback to be collected and leveraged to improve the service.",
                    id: "rQ61eh",
                    description: "Talent portal strategy item 3 content",
                  })}
                </p>
              </Card>
              <Card
                Icon={Calendar}
                title={intl.formatMessage({
                  defaultMessage: "Launch",
                  id: "8PhWBd",
                  description: "Talent portal strategy item 4 heading",
                })}
              >
                <p>
                  {intl.formatMessage({
                    defaultMessage:
                      "Aim to launch the program in the early half of 2024.",
                    id: "utLdbN",
                    description: "Talent portal strategy item 4 content",
                  })}
                </p>
              </Card>
            </div>
            <div className="py-28">
              <div className="relative">
                <div className="absolute -bottom-8 -left-8 w-3/4 -scale-y-100 sm:-bottom-12 sm:-left-12">
                  <Triangle
                    className="w-full"
                    data-h2-color="base(secondary.light)"
                  />
                </div>
                <div
                  data-h2-background-color="base(secondary.light)"
                  className="relative p-12 pb-0 text-center sm:py-20 sm:text-left md:px-20 md:py-36"
                >
                  <div className="absolute right-0 top-0 h-full w-full overflow-hidden">
                    <img
                      src={iconWatermark}
                      alt=""
                      className="absolute -bottom-32 -right-12 w-[120%] max-w-[initial] opacity-40 sm:-bottom-40 xl:w-[60rem]"
                    />
                  </div>
                  <div className="relative grid gap-12 sm:grid-cols-2 md:grid-cols-5 md:gap-0 xl:grid-cols-2">
                    <div
                      className="md:col-span-3 xl:col-span-1"
                      data-h2-color="base:all(white)"
                    >
                      <Heading data-h2-color="base:all(white)" light>
                        {intl.formatMessage({
                          defaultMessage: "About the Indigenous Talent Portal",
                          id: "loDwKe",
                          description: "Talent Portal information heading",
                        })}
                      </Heading>
                      <p className="mt-6">
                        {intl.formatMessage({
                          defaultMessage:
                            "The Indigenous Talent Portal was built for the Indigenous community, by the Indigenous community.",
                          id: "fF4Ex+",
                          description: "Talent portal information sentence 1",
                        })}
                      </p>
                      <p className="my-6">
                        {intl.formatMessage({
                          defaultMessage:
                            "It is a platform designed to host employment opportunities for Indigenous peoples in a way that recognizes and showcases their unique talents, ideas, skills and passion.",
                          id: "wHWE3M",
                          description: "Talent portal information sentence 2",
                        })}
                      </p>
                      <AccommodationsDialog />
                    </div>
                    <div className="relative grid md:col-span-2 xl:col-span-1">
                      <img
                        className="block sm:absolute sm:-bottom-20 sm:-right-12 md:-bottom-36 md:-right-20"
                        src={indigenousWoman}
                        alt={intl.formatMessage({
                          defaultMessage:
                            "Indigenous woman wearing a red shirt working on a laptop.",
                          id: "dY3Qr4",
                          description:
                            "Indigenous Apprenticeship woman on laptop image text alternative",
                        })}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </m.div>
  );
};

const IAPHomePage_Query = graphql(/* GraphQL */ `
  query IAPHomePage_Query(
    $closingAfter: DateTime
    $publishingGroup: PublishingGroup
  ) {
    publishedPools(
      closingAfter: $closingAfter
      publishingGroup: $publishingGroup
    ) {
      publishedAt
      ...IAPHome_PoolFragment
    }
  }
`);

const now = nowUTCDateTime();

export const Component = () => {
  const [{ data, fetching, error }] = useQuery({
    query: IAPHomePage_Query,
    variables: { closingAfter: now, publishingGroup: PublishingGroup.Iap },
  });

  const pools = orderBy(
    data?.publishedPools.filter(
      (pool) => typeof pool !== `undefined` && !!pool,
    ),
    ["publishedAt"],
    ["desc"],
  ); // Order by date in desc order

  const latestPool = pools && pools.length > 0 ? pools[0] : undefined; // get latest pool (most recent published_at date)

  return (
    <Pending fetching={fetching} error={error}>
      <Home query={latestPool} />
    </Pending>
  );
};

Component.displayName = "IAPHomePage";
