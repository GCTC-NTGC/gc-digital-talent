import { useIntl } from "react-intl";
import { m } from "motion/react";
import orderBy from "lodash/orderBy";
import { useSearchParams } from "react-router";
import { useQuery } from "urql";
import { ReactNode } from "react";

import { Container, Link, Pending, Image } from "@gc-digital-talent/ui";
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
import { ApplyDialog, RequirementDialog } from "~/components/IAPDialog";
import Heading from "~/components/IAPHeading/Heading";
import AccommodationsDialog from "~/components/IAPDialog/AccommodationsDialog";

import Banner from "./components/Banner";
import Card from "./components/Card";
import CTAButtons from "./components/CTAButtons";
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

const mailLink = (chunks: ReactNode) => (
  <Link
    color="secondary"
    external
    href="mailto:edsc.pda-iap.esdc@hrsdc-rhdcc.gc.ca"
  >
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
      className="overflow-x-hidden overflow-y-visible bg-white dark:bg-gray-700"
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
            className="relative z-1 order-2 block w-full"
            src={iapHeroImg}
            alt={intl.formatMessage({
              defaultMessage:
                "Group of Indigenous people standing with a painted hand drum.",
              id: "71+GZq",
              description:
                "Indigenous Apprenticeship hero image text alternative",
            })}
          />
          <div className="relative z-[2] -mb-12 w-full bg-linear-to-b from-primary-700 from-90% to-transparent px-12 pt-7 pb-18 xs:-mb-27 xs:from-60% xs:pt-12 xs:pb-6 sm:-mb-37 sm:from-30% sm:pb-0 md:mb-0 md:h-0 md:overflow-visible md:bg-transparent md:p-0">
            <div className="mx-auto max-w-138 xs:flex xs:items-center xs:gap-6 xs:pl-6 md:mt-12 md:max-w-168">
              <img
                src={logoImg}
                alt=""
                className="mx-auto mb-3 flex w-24 md:w-42"
              />
              <div className="text-center text-white xs:text-left">
                <h1 className="text-3xl/[1.2] font-bold lg:text-4xl/[1.2]">
                  {intl.formatMessage({
                    defaultMessage:
                      "IT Apprenticeship Program for Indigenous Peoples",
                    id: "gj0bQO",
                    description:
                      "Homepage title for IT Apprenticeship Program for Indigenous Peoples",
                  })}
                </h1>
                <p className="mt-3 text-sm font-bold">
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
          <div className="xs:--x-1/2 relative z-[1] order-3 my-6 min-w-72 px-12 xs:absolute xs:bottom-1/5 xs:left-1/2 xs:z-[2]">
            {latestPool ? <ApplyLink id={latestPool.id} /> : <ApplyDialog />}
          </div>
        </div>
        {/* About section */}
        <div className="relative z-[1]">
          <Container>
            <div className="relative xs:-top-18 sm:-top-24">
              <div className="rounded-3xl bg-white xs:p-12 sm:px-18 dark:bg-gray-700">
                <div className="grid grid-cols-1 sm:grid-cols-7 sm:gap-12">
                  <div className="flex justify-center sm:col-span-3 sm:justify-start">
                    <div className="relative sm:size-full">
                      <div className="absolute -right-6 -mt-9 size-48 rounded-full bg-primary/10 dark:bg-primary-300/30" />
                      <div className="absolute -bottom-18 -left-33 size-90 rounded-full bg-secondary/10 md:-bottom-5 md:-left-25 dark:bg-secondary-300/30" />
                      <Image
                        src={womanSmiling}
                        width={420}
                        height={630}
                        loading="lazy"
                        alt={intl.formatMessage({
                          defaultMessage:
                            "Indigenous woman wearing a jean jacket which contains several different pins.",
                          id: "cErFoy",
                          description:
                            "Indigenous Apprenticeship woman smiling image text alternative",
                        })}
                        className="relative max-h-[525px] w-full object-cover sm:size-full"
                      />
                      <Image
                        src={feathers}
                        width={625}
                        height={251}
                        loading="lazy"
                        alt={intl.formatMessage({
                          defaultMessage: "Two feathers tied together.",
                          id: "0D8Efk",
                          description:
                            "Indigenous Apprenticeship feathers image text alternative",
                        })}
                        className="absolute -right-[10%] bottom-0 w-[120%] translate-y-3/5 xs:w-[150%] sm:bottom-10 sm:translate-y-0 md:bottom-15"
                      />
                    </div>
                  </div>
                  <div className="px-6 sm:col-span-4 sm:px-8 md:px-0">
                    <Heading
                      size="h3"
                      className="relative z-1 mt-30 mb-12 text-center sm:mt-2 sm:text-left"
                    >
                      {intl.formatMessage({
                        defaultMessage: "About the program",
                        id: "hyJz3G",
                        description: "Program information section title",
                      })}
                    </Heading>
                    <p className="mt-12 mb-6">
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
          </Container>
        </div>
        {/* Learn section */}
        <div className="relative mt-12">
          <Container>
            <div className="relative xs:-top-18 sm:-top-24">
              <div className="grid xs:gap-24 xs:px-12 sm:grid-cols-7 sm:gap-14 sm:p-20">
                <div className="flex justify-center px-6 sm:order-2 sm:col-span-3 sm:justify-start md:px-0">
                  <div className="relative sm:size-full">
                    <RadiatingCircles className="absolute -top-12 -right-72 w-[110%] text-secondary-300/50 dark:text-secondary-300" />
                    <Image
                      height={500}
                      width={500}
                      loading="lazy"
                      src={manOnComputer}
                      alt={intl.formatMessage({
                        defaultMessage: "Indigenous man working at a computer.",
                        id: "XDgkwV",
                        description:
                          "Indigenous Apprenticeship man on computer image text alternative",
                      })}
                      className="relative z-[2] object-cover object-left xs:min-h-[initial] sm:size-full"
                    />
                    <Image
                      src={gloves}
                      width={420}
                      height={462}
                      loading="lazy"
                      alt={intl.formatMessage({
                        defaultMessage:
                          "Métis style gloves with floral beading.",
                        id: "aPLL9Z",
                        description:
                          "Indigenous Apprenticeship gloves image text alternative",
                      })}
                      className="absolute -right-24 -bottom-25 z-[10] block w-[70%]"
                    />
                  </div>
                </div>
                <div className="px-6 sm:order-1 sm:col-span-4 sm:px-8 md:px-0">
                  <Heading
                    size="h3"
                    className="relative my-12 mt-24 mb-12 text-center xs:mt-4 xs:mb-12 sm:mt-6 sm:text-left"
                  >
                    {intl.formatMessage({
                      defaultMessage:
                        "What will I learn in this apprenticeship?",
                      id: "fvsYkj",
                      description:
                        "What applicants will learn sections heading",
                    })}
                  </Heading>
                  <p className="mt-12 mb-6">
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
                  <div className="sm:sr-only">
                    <CTAButtons latestPoolId={latestPool?.id} />
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </div>
        {/* Who section */}
        <div className="relative z-[2] mt-12">
          <Container>
            <div className="grid xs:px-12 sm:mt-14 sm:grid-cols-7 sm:gap-12 sm:px-18">
              <div className="flex justify-center px-6 xs:col-span-3 sm:col-span-3 sm:justify-start md:px-0">
                <div className="relative sm:size-full">
                  <Triangle className="absolute -top-8 -left-8 z-[1] w-[120%] text-secondary xs:-top-12 xs:-left-12 dark:text-secondary-300" />
                  <Image
                    src={applicant}
                    width={500}
                    height={500}
                    loading="lazy"
                    alt={intl.formatMessage({
                      defaultMessage:
                        "Indigenous woman smiling, wearing a brown sweater and glasses.",
                      id: "X6+rc1",
                      description:
                        "Indigenous Apprenticeship applicant image text alternative",
                    })}
                    className="relative z-[2] object-cover xs:min-h-[initial] sm:size-full"
                  />
                  <Image
                    src={ulu}
                    width={540}
                    height={341}
                    loading="lazy"
                    alt={intl.formatMessage({
                      defaultMessage: "Ulu, an Inuit tool used by Inuit women.",
                      id: "IIZNzj",
                      description:
                        "Indigenous Apprenticeship ulu image text alternative",
                    })}
                    className="absolute -right-1/4 -bottom-1/15 z-[3] block w-50 xs:hidden sm:w-100"
                  />
                </div>
              </div>
              <div className="px-6 sm:col-span-4 sm:px-8 md:px-0">
                <Heading
                  size="h3"
                  className="relative z-1 my-12 mt-12 mb-8 text-center xs:mb-12 sm:mt-2 sm:text-left"
                >
                  {intl.formatMessage({
                    defaultMessage: "Who is the program for?",
                    id: "O0z6Ym",
                    description:
                      "Heading for section about who the program is for",
                  })}
                </Heading>
                <p className="mt-12 mb-6">
                  {intl.formatMessage({
                    defaultMessage:
                      "The program is for First Nations, Inuit, and Métis peoples. If you are First Nations, an Inuk, or Métis, and if you have a passion for technology, then this program is for you!",
                    id: "f/yvXg",
                    description: "First paragraph about who the program is for",
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
                <Image
                  src={ulu}
                  width={540}
                  height={341}
                  loading="lazy"
                  alt={intl.formatMessage({
                    defaultMessage: "Ulu, an Inuit tool used by Inuit women.",
                    id: "IIZNzj",
                    description:
                      "Indigenous Apprenticeship ulu image text alternative",
                  })}
                  className="md:display absolute -right-5 hidden w-90 xs:block lg:right-[10%]"
                />
                <div className="relative mt-12 mb-6 min-w-20 xs:w-1/2">
                  <RequirementDialog />
                </div>
              </div>
            </div>
          </Container>
        </div>
        {/* Testimonial section */}
        <div
          className="relative z-[1] bg-cover bg-position-[right_10%_center] pt-18 pb-12 xs:mt-12 sm:py-30"
          style={{
            backgroundImage: `url(${quoteBg})`,
          }}
        >
          <Container size="md">
            <Heading size="h2" color="white" thin className="my-0 text-center">
              {intl.formatMessage({
                defaultMessage: "What We’re Hearing",
                id: "PvH5lJ",
                description: "Heading for the quotes sections",
              })}
            </Heading>
            <Quote {...quote} />
          </Container>
        </div>
        {/* Application call to action section */}
        <div
          className="bg-cover bg-position-[top_center] pt-12 pb-30 xs:pt-18 xs:pb-36 sm:pt-36 sm:pb-54"
          style={{
            backgroundImage: `url(${sash})`,
          }}
        >
          <Container>
            <div>
              <div className="grid grid-cols-1 grid-rows-2 shadow-xl xs:grid-cols-[1fr_2fr] xs:grid-rows-1 sm:grid-cols-2 lg:grid-cols-[4fr_3fr]">
                <div className="relative xs:col-start-1">
                  <Image
                    src={lowerBack}
                    width={710}
                    height={635}
                    loading="lazy"
                    alt={intl.formatMessage({
                      defaultMessage: "Male Traditional dancer in regalia.",
                      id: "9VPBwR",
                      description:
                        "Indigenous Apprenticeship lower back image text alternative",
                    })}
                    className="absolute inset-0 size-full object-cover object-center"
                  />
                </div>
                <div className="row-start-2 xs:col-start-2 xs:row-start-1">
                  <div className="h-full bg-secondary-300 p-12 text-center xs:p-18 xs:text-left dark:bg-secondary-500">
                    <Heading size="h3" color="white" thin className="m-0">
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
                    <p className="my-6 text-white">
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
          </Container>
        </div>
        {/* Coming soon section */}
        <div className="relative bg-secondary xs:pb-6 sm:pb-24">
          <div className="absolute top-0 left-0 z-[1] size-full overflow-hidden">
            <RadiatingCircles className="absolute top-60 -left-1/10 w-1/2 text-primary" />
            <ThickCircle className="absolute -right-1/10 bottom-210 w-[35%]" />
          </div>
          <Container className="relative z-[2]">
            <div className="mb-18 text-center">
              <Banner>
                <Heading size="h3" color="white" className="my-0">
                  {intl.formatMessage({
                    defaultMessage: "Coming Soon!",
                    id: "q5FQbu",
                    description: "Heading for a coming soon section",
                  })}
                </Heading>
              </Banner>
              <Heading size="h2" color="white" thin className="mb-18 xs:my-18">
                {intl.formatMessage({
                  defaultMessage:
                    "IT Apprenticeship Program for Indigenous Peoples + The Indigenous Talent Portal",
                  id: "osGGIt",
                  description: "heading for indigenous talent portal section",
                })}
              </Heading>
              <Heading level="h3" size="h3" color="white">
                {intl.formatMessage({
                  defaultMessage: "How it Will Work",
                  id: "U8bLT7",
                  description:
                    "heading for how the indigenous talent portal will work",
                })}
              </Heading>
              <p className="mx-auto mt-6 max-w-152 text-white">
                {intl.formatMessage({
                  defaultMessage:
                    "Soon, applicants will be able to apply using an online, interactive tool that will be available on this website. Here’s what we’re working on:",
                  id: "UDHGGA",
                  description:
                    "Description of how the indigenous talent portal will work",
                })}
              </p>
            </div>
            <div className="grid gap-6 xs:gap-18 sm:grid-cols-3">
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
            <div className="my-18 text-center">
              <Heading level="h3" size="h3" color="white">
                {intl.formatMessage({
                  defaultMessage: "Strategy",
                  id: "DBczOG",
                  description:
                    "Heading for strategy for the indigenous talent portal",
                })}
              </Heading>
              <p className="mx-auto mt-6 max-w-152 text-white">
                {intl.formatMessage({
                  defaultMessage:
                    "In collaboration with the IT Apprenticeship Program for Indigenous Peoples, the Indigenous Talent Portal will begin with a focus on IT and technology talent, which will:",
                  id: "Dzyk1q",
                  description:
                    "Description for strategy for the indigenous talent portal",
                })}
              </p>
            </div>
            <div className="grid gap-6 xs:grid-cols-2 xs:gap-18 lg:grid-cols-4">
              <div>
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
              </div>
              <div>
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
              </div>
              <div>
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
              </div>
              <div>
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
            </div>
            <div className="py-24">
              <div className="relative">
                <div className="absolute -bottom-8 -left-8 w-3/4 -scale-x-100 rotate-180 xs:-bottom-12 xs:-left-12">
                  <Triangle className="w-full text-secondary-300 dark:text-secondary-500" />
                </div>
                <div className="bg-secondary-300 p-12 pb-0 text-center xs:py-18 xs:text-left sm:px-18 sm:py-30 dark:bg-secondary-500">
                  <div className="absolute top-0 right-0 size-full overflow-hidden">
                    <Image
                      src={iconWatermark}
                      width={94}
                      height={87}
                      loading="lazy"
                      alt=""
                      className="absolute -right-12 -bottom-30 w-[120%] max-w-[initial] opacity-40 xs:-right-24 xs:-bottom-42 xs:w-100 lg:w-140"
                    />
                  </div>
                  <div className="relative grid gap-12 xs:grid-cols-2 xs:gap-0 sm:grid-cols-5 lg:grid-cols-2">
                    <div className="text-white sm:col-span-3 lg:col-span-1">
                      <Heading size="h2" color="white" thin className="my-0">
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
                    <div className="relative sm:col-span-2 lg:col-span-1">
                      <Image
                        className="block xs:absolute xs:-right-12 xs:-bottom-18 sm:-right-18 sm:-bottom-30"
                        src={indigenousWoman}
                        width={500}
                        height={525}
                        loading="lazy"
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
          </Container>
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

export default Component;
