import React from "react";
import { useIntl } from "react-intl";
import { Button } from "@common/components";
import { imageUrl } from "@common/helpers/router";

import Banner from "../Banner/Banner";
import Card from "../Card/Card";
import Heading from "../Heading/Heading";
import Step from "../Step/Step";
import Quote from "../Quote/Quote";

import BarChart from "../Svg/BarChart";
import Calendar from "../Svg/Calendar";
import People from "../Svg/People";
import RadiatingCircles from "../Svg/RadiatingCircles";
import ThickCircle from "../Svg/ThickCircle";
import TrendingUp from "../Svg/TrendingUp";
import Triangle from "../Svg/Triangle";

import useQuote from "../../hooks/useQuote";
import INDIGENOUSAPPRENTICESHIP_APP_DIR from "../../indigenousApprenticeshipConstants";

import { ApplyDialog, LearnDialog, RequirementDialog } from "../Dialog";
import CTAButtons from "../CallToAction/CTAButtons";

import "./home.css";

// TEMP: Disable rule until we get the proper URL
// eslint-disable-next-line jsx-a11y/anchor-is-valid
const honestyPledgeLink = (...chunks: string[]) => <a href="#">{chunks}</a>;

const Home: React.FunctionComponent = () => {
  const [isApplyDialogOpen, setApplyDialogOpen] =
    React.useState<boolean>(false);
  const [isLearnDialogOpen, setLearnDialogOpen] =
    React.useState<boolean>(false);
  const [isRequirementDialogOpen, setRequirementDialogOpen] =
    React.useState<boolean>(false);
  const intl = useIntl();
  const quote = useQuote();

  return (
    <>
      {/* Hero */}
      <div data-h2-width="base(100%)" data-h2-position="base(relative)">
        <img
          data-h2-display="base(block)"
          data-h2-position="base(relative)"
          data-h2-width="base(100%)"
          src={imageUrl(INDIGENOUSAPPRENTICESHIP_APP_DIR, "hero.jpg")}
          alt=""
        />
        <div
          data-h2-position="base(absolute)"
          data-h2-offset="base(x3, auto, auto, 50%)"
          data-h2-width="base(40vw)"
          style={{ transform: "translate(-50%, 0)" }}
        >
          <img
            data-h2-width="base(100%)"
            src={imageUrl(
              INDIGENOUSAPPRENTICESHIP_APP_DIR,
              `logo-${intl.locale}.svg`,
            )}
            alt={intl.formatMessage({
              defaultMessage:
                "IT Apprenticeship Program for Indigenous Peoples",
              description:
                "Homepage title for Indigenous Apprenticeship Program",
            })}
          />
        </div>
        <div
          data-h2-position="base(absolute)"
          data-h2-offset="base(auto, auto, x16, 50%)"
          data-h2-min-width="base(x12)"
          style={{ transform: "translate(-50%, 0)" }}
        >
          <Button
            color="ia-primary"
            mode="solid"
            onClick={() => setApplyDialogOpen(true)}
            block
          >
            {intl.formatMessage({
              defaultMessage: "Apply Now",
              description: "Button text to apply for program",
            })}
          </Button>
        </div>
      </div>
      {/* About section */}
      <div>
        <div
          data-h2-container="base(center, iap-home, x1) p-tablet(center, iap-home, x2)"
          data-h2-position="base(relative)"
        >
          <div
            data-h2-position="base(relative)"
            data-h2-offset="base(-x4, auto, auto, auto)"
          >
            <div
              data-h2-padding="base(x3)"
              data-h2-background-color="base(ia-white)"
              data-h2-radius="base(iap-home-card)"
            >
              <div data-h2-flex-grid="base(stretch, 0, x3, x1)">
                <div data-h2-flex-item="base(1of1) p-tablet(3of7)">
                  <div
                    data-h2-height="base(100%)"
                    data-h2-width="base(100%)"
                    data-h2-position="base(relative)"
                  >
                    <div
                      data-h2-radius="base(100rem)"
                      data-h2-height="base(x8)"
                      data-h2-width="base(x8)"
                      data-h2-background-color="base(ia-primary)"
                      data-h2-opacity="base(10%)"
                      data-h2-position="base(absolute)"
                      data-h2-offset="base(-x1.5, -x1, auto, auto)"
                    />
                    <div
                      data-h2-radius="base(100rem)"
                      data-h2-height="base(x15)"
                      data-h2-width="base(x15)"
                      data-h2-background-color="base(ia-secondary)"
                      data-h2-opacity="base(10%)"
                      data-h2-position="base(absolute)"
                      data-h2-offset="base(auto, auto, -x3, -x5.5)"
                    />
                    <div
                      data-h2-height="base(100%)"
                      data-h2-width="base(100%)"
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
                      data-h2-offset="base(auto, -15%, 0, auto)"
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
                    data-h2-margin="base(x1, 0, x2, 0)"
                  >
                    {intl.formatMessage({
                      defaultMessage: "About the Program",
                      description: "Program information section title",
                    })}
                  </Heading>
                  <p data-h2-margin="base(x2, 0, x1, 0)">
                    {intl.formatMessage({
                      defaultMessage:
                        "The IT Apprenticeship Program for Indigenous Peoples is a Government of Canada initiative specifically for First Nations, Inuit, and Métis peoples. It is pathway to employment in the federal public service for Indigenous peoples who have a passion for Information Technology (IT).",
                      description: "First paragraph about the program",
                    })}
                  </p>
                  <p data-h2-margin="base(x1, 0)">
                    {intl.formatMessage({
                      defaultMessage:
                        "By valuing and focusing on a person’s potential, rather than on their educational attainment level, the Program removes one of the biggest barriers that exists when it comes to employment within the digital economy. The Program has been developed by, with, and for Indigenous peoples from across Canada.  Its design incorporates the preferences and needs of Indigenous learners while recognizing the importance of community.",
                      description: "Second paragraph about the program",
                    })}
                  </p>
                  <p data-h2-margin="base(x1, 0)">
                    {intl.formatMessage({
                      defaultMessage:
                        "Apprentices who are involved in the program say that it is “life-changing”, that it represents “a chance to have a better life through technology”, and that “there are no barriers to succeeding in this program”.",
                      description: "Third paragraph about the program",
                    })}
                  </p>
                  <div data-h2-margin="base(x2, 0, 0, 0)">
                    <CTAButtons
                      onClickApply={() => setApplyDialogOpen(true)}
                      onClickLearn={() => setLearnDialogOpen(true)}
                    />
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
          data-h2-container="base(center, iap-home, x1) p-tablet(center, iap-home, x2)"
          data-h2-position="base(relative)"
        >
          <div data-h2-padding="base(x3)">
            <div data-h2-flex-grid="base(stretch, 0, x3, x1)">
              <div
                data-h2-flex-item="base(1of1) p-tablet(3of7)"
                data-h2-order="p-tablet(2)"
              >
                <div
                  data-h2-height="base(100%)"
                  data-h2-width="base(100%)"
                  data-h2-position="base(relative)"
                >
                  <RadiatingCircles
                    className=""
                    data-h2-position="base(absolute)"
                    data-h2-width="base(110%)"
                    data-h2-offset="base(-x2, -x12, auto, auto)"
                    data-h2-opacity="base(20%)"
                  />
                  <div
                    data-h2-height="base(100%)"
                    data-h2-width="base(100%)"
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
                    data-h2-offset="base(auto, -x8, -x9, auto)"
                  />
                </div>
              </div>
              <div
                data-h2-flex-item="base(1of1) p-tablet(4of7)"
                data-h2-order="p-tablet(1)"
              >
                <Heading
                  data-h2-font-size="base(h3, 1)"
                  data-h2-margin="base(x1, 0, x2, 0)"
                >
                  {intl.formatMessage({
                    defaultMessage: "What will I learn in this apprenticeship?",
                    description: "What applicants will learn sections heading",
                  })}
                </Heading>
                <p data-h2-margin="base(x2, 0, x1, 0)">
                  {intl.formatMessage({
                    defaultMessage:
                      "Apprentices follow a 24-month structured program consisting of a mix of on-the-job learning and formal training.",
                    description:
                      "First paragraph what will you learn at the program",
                  })}
                </p>
                <p data-h2-margin="base(x1, 0)">
                  {intl.formatMessage({
                    defaultMessage:
                      "Apprentices will be partnered with a peer to facilitate job shadowing and supervised work, and they are assigned a mentor who provides experienced counsel and guidance over the course of the program.",
                    description:
                      "First paragraph what will you learn at the program",
                  })}
                </p>
                <p data-h2-margin="base(x1, 0)">
                  {intl.formatMessage({
                    defaultMessage:
                      "At the end of their 24-month term, apprentices will have marketable and in-demand certifications and skills, as well as the confidence necessary to contribute as part of Canada’s digital workforce, both within and outside the federal public service.",
                    description:
                      "First paragraph what will you learn at the program",
                  })}
                </p>
                <div data-h2-visibility="base(visible) l-tablet(invisible)">
                  <CTAButtons
                    onClickApply={() => setApplyDialogOpen(true)}
                    onClickLearn={() => setLearnDialogOpen(true)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Who section */}
      <div data-h2-layer="base(2, relative)" data-h2-margin="base(x2, 0, 0, 0)">
        <div
          data-h2-container="base(center, iap-home, x1) p-tablet(center, iap-home, x2)"
          data-h2-position="base(relative)"
        >
          <div data-h2-padding="base(x3)">
            <div data-h2-flex-grid="base(stretch, 0, x3, x1)">
              <div data-h2-flex-item="base(1of1) p-tablet(3of7)">
                <div
                  data-h2-height="base(100%)"
                  data-h2-width="base(100%)"
                  data-h2-position="base(relative)"
                >
                  <Triangle
                    className=""
                    data-h2-position="base(absolute)"
                    data-h2-width="base(120%)"
                    data-h2-color="base(ia-secondary)"
                    data-h2-offset="base(-3rem, auto, auto, -3rem)"
                  />
                  <div
                    data-h2-height="base(100%)"
                    data-h2-width="base(100%)"
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
                </div>
              </div>
              <div
                data-h2-flex-item="base(1of1) p-tablet(4of7)"
                data-h2-position="base(relative)"
              >
                <Heading
                  data-h2-font-size="base(h3, 1)"
                  data-h2-margin="base(x1, 0, x2, 0)"
                >
                  {intl.formatMessage({
                    defaultMessage: "Who is the program for?",
                    description:
                      "Heading for section about who the program is for",
                  })}
                </Heading>
                <p data-h2-margin="base(x2, 0, x1, 0)">
                  {intl.formatMessage({
                    defaultMessage:
                      "The Program is for First Nations, Inuit, and Métis peoples. If you are First Nations, an Inuk, or Metis, and if you have a passion for technology, then this Program is for you!",
                    description: "First paragraph about who the program is for",
                  })}
                </p>
                <p data-h2-margin="base(x1, 0)">
                  {intl.formatMessage({
                    defaultMessage:
                      "If you are not sure if this Program is right for you, please contact us and a member of our team will be happy to meet with you to answer any questions you may have.",
                    description:
                      "Second paragraph about who the program is for",
                  })}
                </p>
                <img
                  src={imageUrl(INDIGENOUSAPPRENTICESHIP_APP_DIR, "ulu.png")}
                  alt=""
                  data-h2-position="base(absolute)"
                  data-h2-width="base(x20)"
                  data-h2-offset="base(auto, -30%, auto, auto)"
                />
                <div
                  data-h2-margin="base(x2, 0, x1, 0)"
                  data-h2-min-width="base(5rem)"
                  data-h2-width="base(50%)"
                  data-h2-position="base(relative)"
                >
                  <Button
                    color="ia-primary"
                    mode="solid"
                    onClick={() => setRequirementDialogOpen(true)}
                    block
                  >
                    {intl.formatMessage({
                      defaultMessage: "See Eligibility Criteria",
                      description:
                        "Button text for program eligibility criteria",
                    })}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Testimonial section */}
      <div
        data-h2-layer="base(1, relative)"
        data-h2-margin="base(x2, 0, 0, 0)"
        data-h2-padding="base(x5, 0)"
        style={{
          backgroundImage: `url(${imageUrl(
            INDIGENOUSAPPRENTICESHIP_APP_DIR,
            "quote-bg.jpg",
          )})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div data-h2-container="base(center, medium, x1) p-tablet(center, medium, x2)">
          <Heading
            light
            data-h2-color="base(ia-white)"
            data-h2-text-align="base(center)"
          >
            {intl.formatMessage({
              defaultMessage: "What We’re Hearing",
              description: "Heading for the quotes sections",
            })}
          </Heading>
          <Quote {...quote} />
        </div>
      </div>
      {/* Application call to action section */}
      <div
        data-h2-padding="base(x6, 0, x9, 0)"
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
            <div
              data-h2-shadow="base(l)"
              data-h2-flex-grid="base(stretch, 0, 0)"
            >
              <div data-h2-flex-item="base(1of1) p-tablet(4of7)">
                <div
                  data-h2-height="base(100%)"
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
              <div data-h2-flex-item="base(1of1) p-tablet(3of7)">
                <div
                  data-h2-height="base(100%)"
                  data-h2-background-color="base(ia-secondary.light)"
                  data-h2-padding="base(x3)"
                >
                  <Heading
                    light
                    data-h2-color="base(ia-white)"
                    data-h2-font-size="base(h3, 1)"
                  >
                    <span>
                      {intl.formatMessage({
                        defaultMessage:
                          "Is the IT Apprenticeship Program right for you?",
                        description: "Application box heading part one",
                      })}
                    </span>
                    <br />
                    <span>
                      {intl.formatMessage({
                        defaultMessage: "Apply today!",
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
                      description: "Application box content",
                    })}
                  </p>
                  <Button
                    color="ia-primary"
                    mode="solid"
                    onClick={() => setApplyDialogOpen(true)}
                  >
                    {intl.formatMessage({
                      defaultMessage: "Apply Now",
                      description: "Button text to apply for program",
                    })}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Coming soon section */}
      <div
        data-h2-background-color="base(ia-secondary)"
        data-h2-padding="base(0, 0, x4, 0)"
        data-h2-position="base(relative)"
      >
        <div
          data-h2-height="base(100%)"
          data-h2-width="base(100%)"
          data-h2-position="base(absolute)"
          data-h2-offset="base(0, auto, auto, 0)"
          data-h2-overflow="base(hidden, all)"
        >
          <RadiatingCircles
            className=""
            data-h2-color="base(ia-primary)"
            data-h2-position="base(absolute)"
            data-h2-offset="base(x10, auto, auto, -10%)"
            data-h2-width="base(50%)"
          />
          <ThickCircle
            className=""
            data-h2-position="base(absolute)"
            data-h2-offset="base(auto, -10%, x35, auto)"
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
                  description: "Heading for a coming soon section",
                })}
              </Heading>
            </Banner>
            <Heading light color="white" data-h2-margin="base(x3, 0)">
              {intl.formatMessage({
                defaultMessage:
                  "IT Apprenticeship Program for Indigenous Peoples + The Indigenous Talent Portal",
                description: "heading for indigenous talent portal section",
              })}
            </Heading>
            <Heading as="h3" color="white">
              {intl.formatMessage({
                defaultMessage: "How it Will Work",
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
                description:
                  "Description of how the indigenous talent portal will work",
              })}
            </p>
          </div>
          <div data-h2-flex-grid="base(flex-start, 0, x3, x2)">
            <div data-h2-flex-item="base(1of1) l-tablet(1of3)">
              <Step
                position="1"
                title={intl.formatMessage({
                  defaultMessage: "Complete the Community Honesty Pledge",
                  description: "How it works, step 1 heading",
                })}
              >
                <p data-h2-margin="base(x1, 0, 0, 0)">
                  {intl.formatMessage({
                    defaultMessage:
                      "The Program was designed to respond to reconciliation and the building of a renewed relationship based on recognition of rights, respect, cooperation and partnership with Indigenous peoples.",
                    description: "How it works, step 1 content paragraph 1",
                  })}
                </p>
                <p data-h2-margin="base(x1, 0, 0, 0)">
                  {intl.formatMessage(
                    {
                      defaultMessage:
                        "There are  three distinct groups of Indigenous peoples recognized in the Canadian constitution. You will be asked to confirm which Indigenous group(s) you belong to via the <a>Honesty Pledge</a>.",
                      description: "How it works, step 1 content paragraph 2",
                    },
                    {
                      a: honestyPledgeLink,
                    },
                  )}
                </p>
              </Step>
            </div>
            <div data-h2-flex-item="base(1of1) l-tablet(1of3)">
              <Step
                position="2"
                title={intl.formatMessage({
                  defaultMessage: "Provide your Information",
                  description: "How it works, step 2 heading",
                })}
              >
                <p data-h2-margin="base(x1, 0, 0, 0)">
                  {intl.formatMessage({
                    defaultMessage:
                      "We want to learn about you and about your interest/passion in the area of IT!",
                    description: "How it works, step 2 content sentence 1",
                  })}
                </p>
                <p data-h2-margin="base(x1, 0, 0, 0)">
                  {intl.formatMessage({
                    defaultMessage:
                      "We’ll invite you to create a profile which will be saved and submitted as your actual application.",
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
                  description: "How it works, step 3 heading",
                })}
              >
                <p data-h2-margin="base(x1, 0, 0, 0)">
                  {intl.formatMessage({
                    defaultMessage:
                      "You'll be prompted to confirm the information you provided",
                    description: "How it works, step 3 content sentence 1",
                  })}
                </p>
                <p data-h2-margin="base(x1, 0, 0, 0)">
                  {intl.formatMessage({
                    defaultMessage:
                      "Upon submission, a team member will contact you within 3-5 business days.",
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
                description:
                  "Description for strategy for the indigenous talent portal",
              })}
            </p>
          </div>
          <div data-h2-flex-grid="base(flex-start, 0, x3, x2)">
            <div data-h2-flex-item="base(1of1) p-tablet(1of2) l-tablet(1of4)">
              <Card
                Icon={People}
                title={intl.formatMessage({
                  defaultMessage: "High Demand",
                  description: "Talent portal strategy item 1 heading",
                })}
              >
                <p>
                  {intl.formatMessage({
                    defaultMessage:
                      "Address the great demand for Indigenous talent in IT.",
                    description: "Talent portal strategy item 1 content",
                  })}
                </p>
              </Card>
            </div>
            <div data-h2-flex-item="base(1of1) p-tablet(1of2) l-tablet(1of4)">
              <Card
                Icon={TrendingUp}
                title={intl.formatMessage({
                  defaultMessage: "Grow",
                  description: "Talent portal strategy item 2 heading",
                })}
              >
                <p>
                  {intl.formatMessage({
                    defaultMessage:
                      "Allow for growth in its recruitment scope by targeting other occupational areas in the future.",
                    description: "Talent portal strategy item 2 content",
                  })}
                </p>
              </Card>
            </div>
            <div data-h2-flex-item="base(1of1) p-tablet(1of2) l-tablet(1of4)">
              <Card
                Icon={BarChart}
                title={intl.formatMessage({
                  defaultMessage: "Assess",
                  description: "Talent portal strategy item 3 heading",
                })}
              >
                <p>
                  {intl.formatMessage({
                    defaultMessage:
                      "Allow for data and feedback to be collected and leveraged to improve the service.",
                    description: "Talent portal strategy item 3 content",
                  })}
                </p>
              </Card>
            </div>
            <div data-h2-flex-item="base(1of1) p-tablet(1of2) l-tablet(1of4)">
              <Card
                Icon={Calendar}
                title={intl.formatMessage({
                  defaultMessage: "Launch",
                  description: "Talent portal strategy item 4 heading",
                })}
              >
                <p>
                  {intl.formatMessage({
                    defaultMessage:
                      "Aim to launch the program in the early half of 2022.",
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
                data-h2-offset="base(auto, auto, -3rem, -3rem)"
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
                data-h2-padding="base(x5, x3)"
                data-h2-position="base(relative)"
              >
                <div
                  data-h2-height="base(100%)"
                  data-h2-width="base(100%)"
                  data-h2-position="base(absolute)"
                  data-h2-offset="base(0, 0, auto, auto)"
                  data-h2-overflow="base(hidden, all)"
                >
                  <img
                    src={imageUrl(
                      INDIGENOUSAPPRENTICESHIP_APP_DIR,
                      "icon-watermark.svg",
                    )}
                    alt=""
                    data-h2-position="base(absolute)"
                    data-h2-offset="base(auto, -x4, -x7, auto)"
                    data-h2-width="base(x35)"
                    data-h2-opacity="base(40%)"
                  />
                </div>
                <div
                  data-h2-flex-grid="base(stretch, 0, 0)"
                  data-h2-position="base(relative)"
                >
                  <div
                    data-h2-flex-item="base(1of1) p-tablet(1of2)"
                    data-h2-color="base(ia-white)"
                  >
                    <Heading color="white" light>
                      {intl.formatMessage({
                        defaultMessage: "About the Indigenous Talent Portal",
                        description: "Talent Portal information heading",
                      })}
                    </Heading>
                    <p data-h2-margin="base(x1, 0, 0, 0)">
                      {intl.formatMessage({
                        defaultMessage:
                          "The Indigenous Talent Portal was built for the Indigenous community, by the Indigenous community.",
                        description: "Talent portal information sentence 1",
                      })}
                    </p>
                    <p data-h2-margin="base(x1, 0, 0, 0)">
                      {intl.formatMessage({
                        defaultMessage:
                          "It is a platform designed to host employment opportunities for Indigenous peoples in a way that recognizes and showcases their unique talents, ideas, skills and passion.",
                        description: "Talent portal information sentence 2",
                      })}
                    </p>
                  </div>
                  <div
                    data-h2-flex-item="base(1of1) p-tablet(1of2)"
                    data-h2-position="base(relative)"
                  >
                    <img
                      data-h2-position="base(absolute)"
                      data-h2-offset="base(auto, -x3, -x5, auto)"
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
      {/* Dialogs and alerts */}
      <ApplyDialog
        isOpen={isApplyDialogOpen}
        onDismiss={() => setApplyDialogOpen(false)}
      />
      <LearnDialog
        isOpen={isLearnDialogOpen}
        onDismiss={() => setLearnDialogOpen(false)}
      />
      <RequirementDialog
        isOpen={isRequirementDialogOpen}
        onDismiss={() => setRequirementDialogOpen(false)}
      />
    </>
  );
};

export default Home;
