import React from "react";
import { useIntl } from "react-intl";
import { motion } from "framer-motion";

import imageUrl from "@common/helpers/imageUrl";

// import LanguageSelector from "../LanguageSelector/LanguageSelector";
import Banner from "~/components/Banner/Banner";
import Card from "~/components/Card/Card";
import Heading from "~/components/Heading/Heading";
import Step from "~/components/Step/Step";
import Quote from "~/components/Quote/Quote";

import BarChart from "~/components/Svg/BarChart";
import Calendar from "~/components/Svg/Calendar";
import People from "~/components/Svg/People";
import RadiatingCircles from "~/components/Svg/RadiatingCircles";
import ThickCircle from "~/components/Svg/ThickCircle";
import TrendingUp from "~/components/Svg/TrendingUp";
import Triangle from "~/components/Svg/Triangle";

import useQuote from "~/hooks/useQuote";
import INDIGENOUSAPPRENTICESHIP_APP_DIR from "~/constants/indigenousApprenticeshipConstants";

import { ApplyDialog, RequirementDialog } from "~/components/Dialog";
import CTAButtons from "~/components/CallToAction/CTAButtons";

import "./home.css";

const mailLink = (chunks: React.ReactNode) => (
  <a href="mailto:edsc.pda-iap.esdc@hrsdc-rhdcc.gc.ca">{chunks}</a>
);

const Home: React.FunctionComponent = () => {
  const intl = useIntl();
  const quote = useQuote();

  /**
   * Language swapping is a little rough here,
   * motion.div adds a fade to smooth things out a bit
   */
  return (
    <motion.div
      data-h2-overflow="base(hidden visible)"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* TODO: Uncomment in #4617 */}
      {/* <LanguageSelector /> */}
      {/* Hero */}
      <div
        data-h2-width="base(100%)"
        data-h2-position="base(relative)"
        data-h2-display="base(flex) p-tablet(block)"
        data-h2-flex-direction="base(column)"
      >
        <div
          data-h2-background="base(ia-primary-dark-to-transparent)"
          data-h2-height="base(x2)"
          data-h2-order="base(2)"
          data-h2-display="base(block) p-tablet(none)"
          data-h2-layer="base(2, relative)"
          data-h2-width="base(100%)"
        />
        <img
          data-h2-display="base(block)"
          data-h2-layer="base(1, relative)"
          data-h2-margin="base(-x2, 0, 0, 0) p-tablet(0)"
          data-h2-width="base(100%)"
          data-h2-order="base(2) p-tablet(1)"
          src={imageUrl(INDIGENOUSAPPRENTICESHIP_APP_DIR, "hero.jpg")}
          alt=""
        />
        <div
          className="hero-logo"
          data-h2-background-color="base(ia-primary.hero) p-tablet(transparent)"
          data-h2-padding="base(x1.2, x2, x1, x2) p-tablet(0)"
          data-h2-layer="base(1, relative) p-tablet(1, absolute)"
          data-h2-order="base(1) p-tablet(2)"
          data-h2-location="p-tablet(5%, auto, auto, 50%)"
          data-h2-width="base(100%) p-tablet(40vw)"
        >
          <h1>
            <img
              data-h2-width="base(100%)"
              src={imageUrl(
                INDIGENOUSAPPRENTICESHIP_APP_DIR,
                `logo-${intl.locale}.svg`,
              )}
              alt=""
            />
            <span data-h2-visually-hidden="base(invisible)">
              {intl.formatMessage({
                defaultMessage:
                  "IT Apprenticeship Program for Indigenous Peoples. Apply today to get started on your IT career journey.",
                id: "qZvV7b",
                description:
                  "Homepage title for Indigenous Apprenticeship Program",
              })}
            </span>
          </h1>
        </div>
        <div
          className="hero-cta"
          data-h2-padding="base(x1, x2)"
          data-h2-position="base(relative) p-tablet(absolute)"
          data-h2-layer="base(1, relative) p-tablet(1, absolute)"
          data-h2-location="p-tablet(auto, auto, 20%, 50%)"
          data-h2-min-width="base(x12)"
          data-h2-order="base(3)"
        >
          <ApplyDialog />
        </div>
      </div>
      {/* About section */}
      <div data-h2-layer="base(1, relative)">
        <div
          data-h2-container="base(center, iap-home, x1) l-tablet(center, iap-home, x2)"
          data-h2-position="base(relative)"
        >
          <div
            data-h2-position="base(relative)"
            data-h2-location="p-tablet(-x3, auto, auto, auto) l-tablet(-x4, auto, auto, auto)"
          >
            <div
              data-h2-padding="p-tablet(x2) l-tablet(x3)"
              data-h2-background-color="base(ia-white)"
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
                      data-h2-background-color="base(ia-primary)"
                      data-h2-opacity="base(10%)"
                      data-h2-position="base(absolute)"
                      data-h2-location="base(-x1.5, -x1, auto, auto)"
                    />
                    <div
                      data-h2-radius="base(100rem)"
                      data-h2-height="base(x15)"
                      data-h2-width="base(x15)"
                      data-h2-background-color="base(ia-secondary)"
                      data-h2-opacity="base(10%)"
                      data-h2-position="base(absolute)"
                      data-h2-location="base(auto, auto, -x3, -x5.5)"
                    />
                    <div
                      data-h2-min-height="base(60vh) p-tablet(initial)"
                      data-h2-height="p-tablet(100%)"
                      data-h2-width="p-tablet(100%)"
                      data-h2-position="base(relative)"
                      style={{
                        backgroundImage: `url('${imageUrl(
                          INDIGENOUSAPPRENTICESHIP_APP_DIR,
                          "indigenous-woman-smiling.jpg",
                        )}')`,
                        backgroundPosition: "center",
                        backgroundSize: "cover",
                      }}
                    />
                    <img
                      src={imageUrl(
                        INDIGENOUSAPPRENTICESHIP_APP_DIR,
                        "feathers.png",
                      )}
                      alt=""
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
                    data-h2-font-size="base(h3, 1)"
                    data-h2-margin="base(x6, 0, x2, 0) p-tablet(x1, 0, x2, 0)"
                    data-h2-text-align="base(center) p-tablet(left)"
                  >
                    {intl.formatMessage({
                      defaultMessage: "About the Program",
                      id: "CqLV19",
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
                        "By valuing and focusing on a person’s potential, rather than on their educational attainment level, the Program removes one of the biggest barriers that exists when it comes to employment within the digital economy. The Program has been developed by, with, and for Indigenous peoples from across Canada. Its design incorporates the preferences and needs of Indigenous learners while recognizing the importance of community.",
                      id: "wqwPhL",
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
                    <CTAButtons />
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
          data-h2-container="base(center, iap-home, x1) l-tablet(center, iap-home, x2)"
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
                    className=""
                    data-h2-position="base(absolute)"
                    data-h2-width="base(110%)"
                    data-h2-location="base(-x2, -x12, auto, auto)"
                    data-h2-opacity="base(20%)"
                  />
                  <div
                    data-h2-min-height="base(60vh) p-tablet(initial)"
                    data-h2-height="p-tablet(100%)"
                    data-h2-width="p-tablet(100%)"
                    data-h2-position="base(relative)"
                    style={{
                      backgroundImage: `url('${imageUrl(
                        INDIGENOUSAPPRENTICESHIP_APP_DIR,
                        "man-on-computer.jpg",
                      )}')`,
                      backgroundPosition: "center",
                      backgroundSize: "cover",
                    }}
                  />
                  <img
                    src={imageUrl(
                      INDIGENOUSAPPRENTICESHIP_APP_DIR,
                      "gloves.png",
                    )}
                    alt=""
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
                  data-h2-font-size="base(h3, 1)"
                  data-h2-margin="base(x4, 0, x2, 0) p-tablet(x1, 0, x2, 0)"
                  data-h2-text-align="base(center) p-tablet(left)"
                >
                  {intl.formatMessage({
                    defaultMessage: "What will I learn in this apprenticeship?",
                    id: "fvsYkj",
                    description: "What applicants will learn sections heading",
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
                  <CTAButtons />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Who section */}
      <div data-h2-layer="base(2, relative)" data-h2-margin="base(x2, 0, 0, 0)">
        <div
          data-h2-container="base(center, iap-home, x1) l-tablet(center, iap-home, x2)"
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
                    className=""
                    data-h2-position="base(absolute)"
                    data-h2-width="base(120%)"
                    data-h2-color="base(ia-secondary)"
                    data-h2-location="base(-2rem, auto, auto, -2rem) p-tablet(-3rem, auto, auto, -3rem)"
                  />
                  <div
                    data-h2-min-height="base(60vh) p-tablet(initial)"
                    data-h2-height="p-tablet(100%)"
                    data-h2-width="p-tablet(100%)"
                    data-h2-position="base(relative)"
                    style={{
                      backgroundImage: `url('${imageUrl(
                        INDIGENOUSAPPRENTICESHIP_APP_DIR,
                        "applicant.jpg",
                      )}')`,
                      backgroundPosition: "center",
                      backgroundSize: "cover",
                    }}
                  />
                  <img
                    src={imageUrl(INDIGENOUSAPPRENTICESHIP_APP_DIR, "ulu.png")}
                    alt=""
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
                  data-h2-font-size="base(h3, 1)"
                  data-h2-margin="base(x2, 0) p-tablet(x1, 0, x2, 0)"
                  data-h2-text-align="base(center) p-tablet(left)"
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
                      "The Program is for First Nations, Inuit, and Métis peoples. If you are First Nations, an Inuk, or Métis, and if you have a passion for technology, then this Program is for you!",
                    id: "khChKa",
                    description: "First paragraph about who the program is for",
                  })}
                </p>
                <p data-h2-margin="base(x1, 0)">
                  {intl.formatMessage(
                    {
                      defaultMessage:
                        "If you are not sure if this Program is right for you, please <mailLink>contact us</mailLink> and a member of our team will be happy to meet with you to answer any questions you may have.",
                      id: "1FM1VL",
                      description:
                        "Second paragraph about who the program is for",
                    },
                    {
                      mailLink,
                    },
                  )}
                </p>
                <img
                  src={imageUrl(INDIGENOUSAPPRENTICESHIP_APP_DIR, "ulu.png")}
                  alt=""
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
          backgroundImage: `url(${imageUrl(
            INDIGENOUSAPPRENTICESHIP_APP_DIR,
            "quote-bg.jpg",
          )})`,
          backgroundSize: "cover",
          backgroundPosition: "right 10% center",
        }}
      >
        <div data-h2-container="base(center, medium, x1) l-tablet(center, medium, x2)">
          <Heading
            light
            data-h2-color="base(ia-white)"
            data-h2-text-align="base(center)"
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
        data-h2-padding="base(x2, 0, x5, 0) p-tablet(x3, 0, x6, 0) l-tablet(x6, 0, x9, 0)"
        style={{
          backgroundImage: `url(${imageUrl(
            INDIGENOUSAPPRENTICESHIP_APP_DIR,
            "sash.jpg",
          )})`,
          backgroundSize: "cover",
          backgroundPosition: "top center",
        }}
      >
        <div data-h2-container="base(center, iap-home, x1) p-tablet(center, iap-home, x2)">
          <div>
            <div data-h2-shadow="base(l)" data-h2-flex-grid="base(stretch, 0)">
              <div data-h2-flex-item="base(1of1) p-tablet(1of3) l-tablet(1of2) desktop(4of7)">
                <div
                  data-h2-height="base(40vh) p-tablet(100%)"
                  style={{
                    backgroundImage: `url(${imageUrl(
                      INDIGENOUSAPPRENTICESHIP_APP_DIR,
                      "lower-back.jpg",
                    )})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                />
              </div>
              <div data-h2-flex-item="base(1of1) p-tablet(2of3) l-tablet(1of2) desktop(3of7)">
                <div
                  data-h2-height="base(100%)"
                  data-h2-background-color="base(ia-secondary.light)"
                  data-h2-padding="base(x2) p-tablet(x3)"
                  data-h2-text-align="base(center) p-tablet(left)"
                >
                  <Heading
                    light
                    data-h2-color="base(ia-white)"
                    data-h2-font-size="base(h3, 1)"
                  >
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
                    data-h2-color="base(ia-white)"
                    data-h2-margin="base(x1, 0)"
                  >
                    {intl.formatMessage({
                      defaultMessage:
                        "Apply today to start your journey to a career in Information Technology.",
                      id: "p19YJ2",
                      description: "Application box content",
                    })}
                  </p>
                  <ApplyDialog />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Coming soon section */}
      <div
        data-h2-background-color="base(ia-secondary)"
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
            className=""
            data-h2-color="base(ia-primary)"
            data-h2-position="base(absolute)"
            data-h2-location="base(x10, auto, auto, -10%)"
            data-h2-width="base(50%)"
          />
          <ThickCircle
            className=""
            data-h2-position="base(absolute)"
            data-h2-location="base(auto, -10%, x35, auto)"
            data-h2-width="base(35%)"
          />
        </div>
        <div
          data-h2-container="base(center, iap-home, x1) p-tablet(center, iap-home, x2)"
          data-h2-position="base(relative)"
        >
          <div
            data-h2-text-align="base(center)"
            data-h2-margin="base(0, 0, x3, 0)"
          >
            <Banner>
              <Heading color="white" data-h2-font-size="base(h3)">
                {intl.formatMessage({
                  defaultMessage: "Coming Soon!",
                  id: "q5FQbu",
                  description: "Heading for a coming soon section",
                })}
              </Heading>
            </Banner>
            <Heading
              light
              color="white"
              data-h2-margin="base(0, 0, x3, 0) p-tablet(x3, 0)"
            >
              {intl.formatMessage({
                defaultMessage:
                  "IT Apprenticeship Program for Indigenous Peoples + The Indigenous Talent Portal",
                id: "osGGIt",
                description: "heading for indigenous talent portal section",
              })}
            </Heading>
            <Heading as="h3" color="white">
              {intl.formatMessage({
                defaultMessage: "How it Will Work",
                id: "U8bLT7",
                description:
                  "heading for how the indigenous talent portal will work",
              })}
            </Heading>
            <p
              data-h2-margin="base(x1, auto, 0, auto)"
              data-h2-color="base(ia-white)"
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
                      "The Program was designed to respond to reconciliation and the building of a renewed relationship based on recognition of rights, respect, cooperation and partnership with Indigenous peoples.",
                    id: "1B4niz",
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
                      "Upon submission, a team member will contact you within 3-5 business days.",
                    id: "GnmmgR",
                    description: "How it works, step 3 content sentence 2",
                  })}
                </p>
              </Step>
            </div>
          </div>
          <div data-h2-text-align="base(center)" data-h2-margin="base(x3, 0)">
            <Heading as="h3" color="white">
              {intl.formatMessage({
                defaultMessage: "Strategy",
                id: "DBczOG",
                description:
                  "Heading for strategy for the indigenous talent portal",
              })}
            </Heading>
            <p
              data-h2-margin="base(x1, auto, 0, auto)"
              data-h2-color="base(ia-white)"
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
                      "Aim to launch the program in the early half of 2023.",
                    id: "0i34ZZ",
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
                  className=""
                  data-h2-width="base(100%)"
                  data-h2-color="base(light.ia-secondary)"
                />
              </div>
              <div
                data-h2-background-color="base(ia-secondary.light)"
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
                    src={imageUrl(
                      INDIGENOUSAPPRENTICESHIP_APP_DIR,
                      "icon-watermark.svg",
                    )}
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
                    data-h2-color="base(ia-white)"
                  >
                    <Heading color="white" light>
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
                    <p data-h2-margin="base(x1, 0, 0, 0)">
                      {intl.formatMessage({
                        defaultMessage:
                          "It is a platform designed to host employment opportunities for Indigenous peoples in a way that recognizes and showcases their unique talents, ideas, skills and passion.",
                        id: "wHWE3M",
                        description: "Talent portal information sentence 2",
                      })}
                    </p>
                  </div>
                  <div
                    data-h2-flex-item="base(1of1) p-tablet(1of2) l-tablet(2of5) desktop(1of2)"
                    data-h2-position="base(relative)"
                  >
                    <img
                      data-h2-display="base(block)"
                      data-h2-position="p-tablet(absolute)"
                      data-h2-location="p-tablet(auto, -x2, -x3, auto) l-tablet(auto, -x3, -x5, auto)"
                      src={imageUrl(
                        INDIGENOUSAPPRENTICESHIP_APP_DIR,
                        "indigenous-woman.png",
                      )}
                      alt=""
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Home;
