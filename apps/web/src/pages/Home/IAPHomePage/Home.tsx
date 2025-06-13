import { useIntl } from "react-intl";
import { m } from "motion/react";
import orderBy from "lodash/orderBy";
import { useSearchParams } from "react-router";
import { useQuery } from "urql";
import { ReactNode } from "react";

import { Link, Pending } from "@gc-digital-talent/ui";
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
      data-h2-background="base(white) base:dark(background)"
      data-h2-overflow="base(hidden visible)"
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
        <div
          data-h2-width="base(100%)"
          data-h2-position="base(relative)"
          data-h2-display="base(flex)"
          data-h2-flex-direction="base(column)"
        >
          <img
            data-h2-display="base(block)"
            data-h2-layer="base(1, relative)"
            data-h2-width="base(100%)"
            data-h2-order="base(2)"
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
            data-h2-layer="base(2, relative)"
            data-h2-padding="base(x1.2 x2 x3 x2) p-tablet(x2 x2 x1 x2) l-tablet(x2 x2 0 x2) laptop(0)"
            data-h2-margin-bottom="base(-x2) p-tablet(-x4.5) l-tablet(-x6) laptop(0)"
            data-h2-height="laptop(0)"
            data-h2-overflow="laptop(visible)"
            data-h2-width="base(100%)"
          >
            <div
              data-h2-align-items="p-tablet(center)"
              data-h2-display="p-tablet(flex)"
              data-h2-gap="p-tablet(x1)"
              data-h2-max-width="base(x23) laptop(x28)"
              data-h2-margin="base(0 auto)"
              data-h2-padding="p-tablet(0 0 0 x1) laptop(x2 0 0 x1)"
            >
              <img
                src={logoImg}
                alt=""
                data-h2-display="base(block)"
                data-h2-margin="base(0, auto, x.5, auto)"
                data-h2-width="base(x4) laptop(x7)"
              />
              <div
                data-h2-text-align="base(center) p-tablet(left)"
                data-h2-color="base:all(white)"
              >
                <h1
                  data-h2-font-size="base(h3, 1.2)"
                  data-h2-font-weight="base(bold)"
                >
                  {intl.formatMessage({
                    defaultMessage:
                      "IT Apprenticeship Program for Indigenous Peoples",
                    id: "gj0bQO",
                    description:
                      "Homepage title for IT Apprenticeship Program for Indigenous Peoples",
                  })}
                </h1>
                <p
                  data-h2-font-size="base(caption)"
                  data-h2-font-weight="base(bold)"
                  data-h2-margin-top="base(x.5)"
                >
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
          <div
            data-h2-padding="base(x1, x2)"
            data-h2-position="base(relative) p-tablet(absolute)"
            data-h2-layer="base(1, relative) p-tablet(2, absolute)"
            data-h2-location="p-tablet(auto, auto, 20%, 50%)"
            data-h2-min-width="base(x12)"
            data-h2-order="base(3)"
            data-h2-transform="p-tablet(translateX(-50%))"
          >
            {latestPool ? <ApplyLink id={latestPool.id} /> : <ApplyDialog />}
          </div>
        </div>
        {/* About section */}
        <div data-h2-layer="base(1, relative)">
          <div
            data-h2-wrapper="base(center, iap-home, x1) l-tablet(center, iap-home, x2)"
            data-h2-position="base(relative)"
          >
            <div
              data-h2-position="base(relative)"
              data-h2-location="p-tablet(-x3, auto, auto, auto) l-tablet(-x4, auto, auto, auto)"
            >
              <div
                data-h2-padding="p-tablet(x2) l-tablet(x3)"
                data-h2-background-color="base(white) base:dark(background)"
                data-h2-radius="base(iap-home-card)"
              >
                <div data-h2-flex-grid="base(stretch, x3, x1) p-tablet(stretch, x2, x1) l-tablet(stretch, x3, x1)">
                  <div data-h2-flex-item="base(1of1) p-tablet(3of7)">
                    <div
                      data-h2-height="p-tablet(100%)"
                      data-h2-width="p-tablet(100%)"
                      data-h2-position="base(relative)"
                    >
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
                  <div data-h2-flex-item="base(1of1) p-tablet(4of7)">
                    <Heading
                      size="h3"
                      className="relative z-1 mt-36 mb-12 text-center xs:mt-6 xs:text-left"
                    >
                      {intl.formatMessage({
                        defaultMessage: "About the program",
                        id: "hyJz3G",
                        description: "Program information section title",
                      })}
                    </Heading>
                    <p data-h2-margin="base(x2, 0, x1, 0)">
                      {intl.formatMessage({
                        defaultMessage:
                          "The IT Apprenticeship Program for Indigenous Peoples is a Government of Canada initiative specifically for First Nations, Inuit, and Métis peoples. It is pathway to employment in the federal public service for Indigenous peoples who have a passion for Information Technology (IT).",
                        id: "pWoAv0",
                        description: "First paragraph about the program",
                      })}
                    </p>
                    <p data-h2-margin="base(x1, 0)">
                      {intl.formatMessage({
                        defaultMessage:
                          "By valuing and focusing on a person’s potential, rather than on their educational attainment level, the program removes one of the biggest barriers that exists when it comes to employment within the digital economy. The program has been developed by, with, and for Indigenous peoples from across Canada. Its design incorporates the preferences and needs of Indigenous learners while recognizing the importance of community.",
                        id: "wNJSJ7",
                        description: "Second paragraph about the program",
                      })}
                    </p>
                    <p data-h2-margin="base(x1, 0)">
                      {intl.formatMessage({
                        defaultMessage:
                          "Apprentices who are involved in the program say that it is “life-changing”, that it represents “a chance to have a better life through technology”, and that “there are no barriers to succeeding in this program”.",
                        id: "cYq1Dp",
                        description: "Third paragraph about the program",
                      })}
                    </p>
                    <div data-h2-margin="base(x2, 0, 0, 0)">
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
            data-h2-wrapper="base(center, iap-home, x1) l-tablet(center, iap-home, x2)"
            data-h2-position="base(relative)"
          >
            <div data-h2-padding="p-tablet(x2) l-tablet(x3)">
              <div data-h2-flex-grid="base(stretch, x3, x1) p-tablet(stretch, x2, x1) l-tablet(stretch, x3, x1)">
                <div
                  data-h2-flex-item="base(1of1) p-tablet(3of7)"
                  data-h2-order="p-tablet(2)"
                >
                  <div
                    data-h2-height="p-tablet(100%)"
                    data-h2-width="p-tablet(100%)"
                    data-h2-position="base(relative)"
                  >
                    <RadiatingCircles
                      data-h2-color="base(secondary.light.5) base:dark(secondary.light)"
                      data-h2-position="base(absolute)"
                      data-h2-width="base(110%)"
                      data-h2-location="base(-x2, -x12, auto, auto)"
                    />
                    <img
                      src={manOnComputer}
                      alt={intl.formatMessage({
                        defaultMessage: "Indigenous man working at a computer.",
                        id: "XDgkwV",
                        description:
                          "Indigenous Apprenticeship man on computer image text alternative",
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
                      src={gloves}
                      alt={intl.formatMessage({
                        defaultMessage:
                          "Métis style gloves with floral beading.",
                        id: "aPLL9Z",
                        description:
                          "Indigenous Apprenticeship gloves image text alternative",
                      })}
                      data-h2-position="base(absolute)"
                      data-h2-width="base(140%)"
                      data-h2-location="base(auto, -x4, -x5, auto) l-tablet(auto, -x8, -x9, auto)"
                    />
                  </div>
                </div>
                <div
                  data-h2-flex-item="base(1of1) p-tablet(4of7)"
                  data-h2-order="p-tablet(1)"
                >
                  <Heading
                    size="h3"
                    className="mt-24 mb-12 text-center xs:mt-6 xs:text-left"
                  >
                    {intl.formatMessage({
                      defaultMessage:
                        "What will I learn in this apprenticeship?",
                      id: "fvsYkj",
                      description:
                        "What applicants will learn sections heading",
                    })}
                  </Heading>
                  <p data-h2-margin="base(x2, 0, x1, 0)">
                    {intl.formatMessage({
                      defaultMessage:
                        "Apprentices follow a 24-month structured program consisting of a mix of on-the-job learning and formal training.",
                      id: "dDHy5d",
                      description:
                        "First paragraph what will you learn at the program",
                    })}
                  </p>
                  <p data-h2-margin="base(x1, 0)">
                    {intl.formatMessage({
                      defaultMessage:
                        "Apprentices will be partnered with a peer to facilitate job shadowing and supervised work, and they are assigned a mentor who provides experienced counsel and guidance over the course of the program.",
                      id: "nzcwrW",
                      description:
                        "First paragraph what will you learn at the program",
                    })}
                  </p>
                  <p data-h2-margin="base(x1, 0)">
                    {intl.formatMessage({
                      defaultMessage:
                        "At the end of their 24-month term, apprentices will have marketable and in-demand certifications and skills, as well as the confidence necessary to contribute as part of Canada’s digital workforce, both within and outside the federal public service.",
                      id: "b09U1u",
                      description:
                        "First paragraph what will you learn at the program",
                    })}
                  </p>
                  <div data-h2-visually-hidden="base(revealed) l-tablet(invisible)">
                    <CTAButtons latestPoolId={latestPool?.id} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Who section */}
        <div
          data-h2-layer="base(2, relative)"
          data-h2-margin="base(x2, 0, 0, 0)"
        >
          <div
            data-h2-wrapper="base(center, iap-home, x1) l-tablet(center, iap-home, x2)"
            data-h2-position="base(relative)"
          >
            <div data-h2-padding="p-tablet(x2) l-tablet(x3)">
              <div data-h2-flex-grid="base(stretch, x3, x1) p-tablet(stretch, x2, x1) l-tablet(stretch, x3, x1)">
                <div data-h2-flex-item="base(1of1) p-tablet(3of7)">
                  <div
                    data-h2-height="p-tablet(100%)"
                    data-h2-width="p-tablet(100%)"
                    data-h2-position="base(relative)"
                  >
                    <Triangle
                      data-h2-position="base(absolute)"
                      data-h2-width="base(120%)"
                      data-h2-color="base(secondary) base:dark(secondary.light)"
                      data-h2-location="base(-2rem, auto, auto, -2rem) p-tablet(-3rem, auto, auto, -3rem)"
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
                      data-h2-min-height="base(60vh) p-tablet(initial)"
                      data-h2-height="p-tablet(100%)"
                      data-h2-width="p-tablet(100%)"
                      data-h2-position="base(relative)"
                      style={{
                        objectFit: "cover",
                      }}
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
                      data-h2-display="base(block) p-tablet(none)"
                      data-h2-position="base(absolute)"
                      data-h2-width="base(x20)"
                      data-h2-location="base(auto, -30%, -10%, auto)"
                    />
                  </div>
                </div>
                <div
                  data-h2-flex-item="base(1of1) p-tablet(4of7)"
                  data-h2-position="base(relative)"
                >
                  <Heading
                    size="h3"
                    className="my-12 text-center xs:mt-6 xs:mb-12 xs:text-left"
                  >
                    {intl.formatMessage({
                      defaultMessage: "Who is the program for?",
                      id: "O0z6Ym",
                      description:
                        "Heading for section about who the program is for",
                    })}
                  </Heading>
                  <p data-h2-margin="base(x2, 0, x1, 0)">
                    {intl.formatMessage({
                      defaultMessage:
                        "The program is for First Nations, Inuit, and Métis peoples. If you are First Nations, an Inuk, or Métis, and if you have a passion for technology, then this program is for you!",
                      id: "f/yvXg",
                      description:
                        "First paragraph about who the program is for",
                    })}
                  </p>
                  <p data-h2-margin="base(x1, 0)">
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
                    data-h2-display="base(none) p-tablet(block)"
                    data-h2-position="base(absolute)"
                    data-h2-width="base(x20)"
                    data-h2-location="base(auto, -40%, auto, auto) l-tablet(auto, -30%, auto, auto)"
                  />
                  <div
                    data-h2-margin="base(x2, 0, x1, 0)"
                    data-h2-min-width="base(5rem)"
                    data-h2-width="p-tablet(50%)"
                    data-h2-position="base(relative)"
                  >
                    <RequirementDialog />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Testimonial section */}
        <div
          data-h2-layer="base(1, relative)"
          data-h2-margin="p-tablet(x2, 0, 0, 0)"
          data-h2-padding="base(x3, 0, x2, 0) l-tablet(x5, 0)"
          style={{
            backgroundImage: `url(${quoteBg})`,
            backgroundSize: "cover",
            backgroundPosition: "right 10% center",
          }}
        >
          <div data-h2-wrapper="base(center, medium, x1) l-tablet(center, medium, x2)">
            <Heading size="h2" color="white" thin className="my-0 text-center">
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
          data-h2-padding="base(x2, 0, x5, 0) p-tablet(x3, 0, x6, 0) l-tablet(x6, 0, x9, 0)"
          style={{
            backgroundImage: `url(${sash})`,
            backgroundSize: "cover",
            backgroundPosition: "top center",
          }}
        >
          <div data-h2-wrapper="base(center, iap-home, x1) p-tablet(center, iap-home, x2)">
            <div>
              <div
                data-h2-shadow="base(l)"
                data-h2-display="base(grid)"
                data-h2-grid-template-rows="base(1fr 1fr) p-tablet(1fr)"
                data-h2-grid-template-columns="base(minmax(1px, 1fr)) p-tablet(1fr 2fr) l-tablet(1fr 1fr) desktop(4fr 3fr)"
              >
                <div data-h2-position="base(relative)">
                  <img
                    src={lowerBack}
                    alt={intl.formatMessage({
                      defaultMessage: "Male Traditional dancer in regalia.",
                      id: "9VPBwR",
                      description:
                        "Indigenous Apprenticeship lower back image text alternative",
                    })}
                    style={{
                      position: "absolute",
                      inset: "0",
                      objectFit: "cover",
                      objectPosition: "center",
                      height: "100%",
                      width: "100%",
                    }}
                  />
                </div>
                <div>
                  <div
                    data-h2-height="base(100%)"
                    data-h2-background-color="base(secondary.light)"
                    data-h2-padding="base(x2) p-tablet(x3)"
                    data-h2-text-align="base(center) p-tablet(left)"
                  >
                    <Heading size="h3" color="white" thin className="m-0">
                      <span data-h2-display="base(block)">
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
                    <p
                      data-h2-color="base:all(white)"
                      data-h2-margin="base(x1, 0)"
                    >
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
          data-h2-padding="base(0) p-tablet(0, 0, x1, 0) l-tablet(0, 0, x4, 0)"
          data-h2-position="base(relative)"
        >
          <div
            data-h2-height="base(100%)"
            data-h2-width="base(100%)"
            data-h2-position="base(absolute)"
            data-h2-location="base(0, auto, auto, 0)"
            data-h2-overflow="base(hidden)"
          >
            <RadiatingCircles
              data-h2-color="base(primary)"
              data-h2-position="base(absolute)"
              data-h2-location="base(x10, auto, auto, -10%)"
              data-h2-width="base(50%)"
            />
            <ThickCircle
              data-h2-position="base(absolute)"
              data-h2-location="base(auto, -10%, x35, auto)"
              data-h2-width="base(35%)"
            />
          </div>
          <div
            data-h2-wrapper="base(center, iap-home, x1) p-tablet(center, iap-home, x2)"
            data-h2-position="base(relative)"
          >
            <div
              data-h2-text-align="base(center)"
              data-h2-margin="base(0, 0, x3, 0)"
            >
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
              <p
                data-h2-margin="base(x1, auto, 0, auto)"
                data-h2-color="base:all(white)"
                data-h2-max-width="base(38rem)"
              >
                {intl.formatMessage({
                  defaultMessage:
                    "Soon, applicants will be able to apply using an online, interactive tool that will be available on this website. Here’s what we’re working on:",
                  id: "UDHGGA",
                  description:
                    "Description of how the indigenous talent portal will work",
                })}
              </p>
            </div>
            <div data-h2-flex-grid="base(flex-start, x3, x2)">
              <div data-h2-flex-item="base(1of1) l-tablet(1of3)">
                <Step
                  position="1"
                  title={intl.formatMessage({
                    defaultMessage:
                      "Complete the Community Indigenous Peoples Self-Declaration Form",
                    id: "1pFMSH",
                    description: "How it works, step 1 heading",
                  })}
                >
                  <p data-h2-margin="base(x1, 0, 0, 0)">
                    {intl.formatMessage({
                      defaultMessage:
                        "The program was designed to respond to reconciliation and the building of a renewed relationship based on recognition of rights, respect, cooperation and partnership with Indigenous peoples.",
                      id: "J9HjFN",
                      description: "How it works, step 1 content paragraph 1",
                    })}
                  </p>
                  <p data-h2-margin="base(x1, 0, 0, 0)">
                    {intl.formatMessage({
                      defaultMessage:
                        "There are three distinct groups of Indigenous peoples recognized in the Canadian constitution. You will be asked to confirm which Indigenous group(s) you belong to via the Indigenous Peoples Self-Declaration Form.",
                      id: "uJ1rk3",
                      description: "How it works, step 1 content paragraph 2",
                    })}
                  </p>
                </Step>
              </div>
              <div data-h2-flex-item="base(1of1) l-tablet(1of3)">
                <Step
                  position="2"
                  title={intl.formatMessage({
                    defaultMessage: "Provide your Information",
                    id: "/5tYua",
                    description: "How it works, step 2 heading",
                  })}
                >
                  <p data-h2-margin="base(x1, 0, 0, 0)">
                    {intl.formatMessage({
                      defaultMessage:
                        "We want to learn about you and about your interest/passion in the area of IT!",
                      id: "yZMQ6j",
                      description: "How it works, step 2 content sentence 1",
                    })}
                  </p>
                  <p data-h2-margin="base(x1, 0, 0, 0)">
                    {intl.formatMessage({
                      defaultMessage:
                        "We’ll invite you to create a profile which will be saved and submitted as your actual application.",
                      id: "SnnuD+",
                      description: "How it works, step 2 content sentence 2",
                    })}
                  </p>
                </Step>
              </div>
              <div data-h2-flex-item="base(1of1) l-tablet(1of3)">
                <Step
                  position="3"
                  title={intl.formatMessage({
                    defaultMessage: "Submit your Profile as your Application",
                    id: "zlYw3Z",
                    description: "How it works, step 3 heading",
                  })}
                >
                  <p data-h2-margin="base(x1, 0, 0, 0)">
                    {intl.formatMessage({
                      defaultMessage:
                        "You'll be prompted to confirm the information you provided",
                      id: "81iywD",
                      description: "How it works, step 3 content sentence 1",
                    })}
                  </p>
                  <p data-h2-margin="base(x1, 0, 0, 0)">
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
              <Heading level="h3" size="h3" color="white">
                {intl.formatMessage({
                  defaultMessage: "Strategy",
                  id: "DBczOG",
                  description:
                    "Heading for strategy for the indigenous talent portal",
                })}
              </Heading>
              <p
                data-h2-margin="base(x1, auto, 0, auto)"
                data-h2-color="base:all(white)"
                data-h2-max-width="base(38rem)"
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
            <div data-h2-flex-grid="base(flex-start, x3, x2)">
              <div data-h2-flex-item="base(1of1) p-tablet(1of2) desktop(1of4)">
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
              <div data-h2-flex-item="base(1of1) p-tablet(1of2) desktop(1of4)">
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
              <div data-h2-flex-item="base(1of1) p-tablet(1of2) desktop(1of4)">
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
              <div data-h2-flex-item="base(1of1) p-tablet(1of2) desktop(1of4)">
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
            <div data-h2-padding="base(x4, 0)">
              <div data-h2-position="base(relative)">
                <div
                  data-h2-position="base(absolute)"
                  data-h2-width="base(75%)"
                  data-h2-location="base(auto, auto, -2rem, -2rem) p-tablet(auto, auto, -3rem, -3rem)"
                  style={{ transform: "rotate(180deg) scaleX(-1)" }}
                >
                  <Triangle
                    data-h2-width="base(100%)"
                    data-h2-color="base(secondary.light)"
                  />
                </div>
                <div
                  data-h2-background-color="base(secondary.light)"
                  data-h2-padding="base(x2, x2, 0, x2) p-tablet(x3, x2) l-tablet(x5, x3)"
                  data-h2-position="base(relative)"
                  data-h2-text-align="base(center) p-tablet(left)"
                >
                  <div
                    data-h2-height="base(100%)"
                    data-h2-width="base(100%)"
                    data-h2-position="base(absolute)"
                    data-h2-location="base(0, 0, auto, auto)"
                    data-h2-overflow="base(hidden)"
                  >
                    <img
                      src={iconWatermark}
                      alt=""
                      data-h2-position="base(absolute)"
                      data-h2-location="base(auto, -x2, -x5, auto) p-tablet(auto, -x4, -x7, auto)"
                      data-h2-width="base(120%) p-tablet(x25) desktop(x35)"
                      data-h2-max-width="base(initial)"
                      data-h2-opacity="base(40%)"
                    />
                  </div>
                  <div
                    data-h2-flex-grid="base(stretch, x2) p-tablet(stretch, 0)"
                    data-h2-position="base(relative)"
                  >
                    <div
                      data-h2-flex-item="base(1of1) p-tablet(1of2) l-tablet(3of5) desktop(1of2)"
                      data-h2-color="base:all(white)"
                    >
                      <Heading size="h2" color="white" thin className="my-0">
                        {intl.formatMessage({
                          defaultMessage: "About the Indigenous Talent Portal",
                          id: "loDwKe",
                          description: "Talent Portal information heading",
                        })}
                      </Heading>
                      <p data-h2-margin="base(x1, 0, 0, 0)">
                        {intl.formatMessage({
                          defaultMessage:
                            "The Indigenous Talent Portal was built for the Indigenous community, by the Indigenous community.",
                          id: "fF4Ex+",
                          description: "Talent portal information sentence 1",
                        })}
                      </p>
                      <p data-h2-margin="base(x1, 0)">
                        {intl.formatMessage({
                          defaultMessage:
                            "It is a platform designed to host employment opportunities for Indigenous peoples in a way that recognizes and showcases their unique talents, ideas, skills and passion.",
                          id: "wHWE3M",
                          description: "Talent portal information sentence 2",
                        })}
                      </p>
                      <AccommodationsDialog />
                    </div>
                    <div
                      data-h2-flex-item="base(1of1) p-tablet(1of2) l-tablet(2of5) desktop(1of2)"
                      data-h2-position="base(relative)"
                    >
                      <img
                        data-h2-display="base(block)"
                        data-h2-position="p-tablet(absolute)"
                        data-h2-location="p-tablet(auto, -x2, -x3, auto) l-tablet(auto, -x3, -x5, auto)"
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
