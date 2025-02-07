import { useIntl } from "react-intl";
import EnvelopeIcon from "@heroicons/react/24/outline/EnvelopeIcon";
import EnvelopeSolid from "@heroicons/react/24/solid/EnvelopeIcon";
import ArrowDownTrayIcon from "@heroicons/react/24/outline/ArrowDownTrayIcon";
import { ReactNode } from "react";

import { getLocale } from "@gc-digital-talent/i18n";
import { Heading, Link, Well, headingStyles } from "@gc-digital-talent/ui";
import { buildMailToUri } from "@gc-digital-talent/helpers";

import logoImg from "~/assets/img/iap-logo.svg";
import heroImg from "~/assets/img/IAPManager-Hero.webp";
import section1Img from "~/assets/img/IAPManager-Section-01.webp";
import section1FlourishImg from "~/assets/img/IAPManager-Section-01-flourish.webp";
import section2Img from "~/assets/img/IAPManager-Section-02.webp";
import section2FlourishImg from "~/assets/img/IAPManager-Section-02-flourish.webp";
import testimonials from "~/assets/img/IAPManager-Testimonials.webp";
import section5Img from "~/assets/img/IAPManager-Section-05.webp";
import section5FlourishImg from "~/assets/img/IAPManager-Section-05-flourish.webp";

import { CloseQuote, OpenQuote, Triangle } from "../IAPHomePage/components/Svg";
import TopRightFrame from "./components/Svg/TopRightFrame";

const makeLink = (chunks: ReactNode, url: string) => (
  <Link href={url} color="primary">
    {chunks}
  </Link>
);

// eslint-disable-next-line import/prefer-default-export
export const Component = () => {
  const intl = useIntl();
  const locale = getLocale(intl);
  const hireAnApprenticeEmailUri = buildMailToUri(
    "edsc.patipa.jumelage.emplois-itapip.job.matching.esdc@hrsdc-rhdcc.gc.ca",
    intl.formatMessage({
      defaultMessage: "I'm interested in offering an apprenticeship",
      id: "HqtjhD",
      description: "Subject line of a manager's email for apprenticeship",
    }),
    [
      intl.formatMessage({
        defaultMessage:
          "To best support you in your journey to hire an IT Apprentice, please let us know if you",
        id: "ZKss5S",
        description: "Paragraph 1 of a manager's email for apprenticeship",
      }),
      intl.formatMessage({
        defaultMessage:
          "1. are interested in hiring an Apprentice and would like to learn more about the IT Apprenticeship Program for Indigenous Peoples",
        id: "ipKAvI",
        description: "Paragraph 2 of a manager's email for apprenticeship",
      }),
      intl.formatMessage({
        defaultMessage:
          "2. have reviewed the checklist in the manager’s package and have positions available to hire an IT Apprentice",
        id: "18pJdz",
        description: "Paragraph 3 of a manager's email for apprenticeship",
      }),
      intl.formatMessage({
        defaultMessage: "3. Other…",
        id: "Fz49kD",
        description: "Paragraph 4 of a manager's email for apprenticeship",
      }),
      intl.formatMessage({
        defaultMessage:
          "A team member from the Office of Indigenous Initiatives will be in touch shortly.",
        id: "x45gSl",
        description: "Paragraph 5 of a manager's email for apprenticeship",
      }),
    ].join("\n"),
  );

  return (
    <div
      data-h2-background="base(white) base:dark(background)"
      data-h2-overflow="base(hidden visible)"
    >
      <div
        // hero wrapper
        data-h2-width="base(100%)"
        style={{
          backgroundImage: `url(${heroImg})`,
          backgroundSize: "cover",
          backgroundPosition: "right 10% center",
        }}
      >
        <div
          // content wrapper
          data-h2-display="base(flex)"
          data-h2-flex-direction="base(column)"
          // x4 bottom padding + overlap
          data-h2-padding="base(x4, 0, x4, 0) p-tablet(x4, 0, x7, 0) l-tablet(x4, 0, x8, 0)"
          data-h2-gap="base(x2)"
          data-h2-align-items="base(center)"
          data-h2-min-width="base(x12)"
        >
          <div
            // title wrapper
            data-h2-display="base(flex)"
            data-h2-flex-direction="base(column)"
            data-h2-align-items="base(center)"
            data-h2-gap="base(x1)"
            data-h2-text-align="base(center)"
            data-h2-color="base:all(white)"
          >
            <img
              src={logoImg}
              alt=""
              data-h2-display="base(block)"
              data-h2-width="base(172px) p-tablet(235px)"
            />
            <h1 data-h2-font-size="base(h1)" data-h2-font-weight="base(bold)">
              {intl.formatMessage({
                defaultMessage: "Hire an IT apprentice",
                id: "39RER8",
                description: "Page title for IAP manager homepage",
              })}
            </h1>
            <p data-h2-font-size="base(h5)">
              {intl.formatMessage({
                defaultMessage:
                  "Together we can address barriers to reconciliation, diversity and inclusion",
                id: "56jSOM",
                description: "Hero subtitle for IAP manager homepage",
              })}
            </p>
          </div>
          <div
            // call to action wrapper
            data-h2-align-items="base(center)"
            data-h2-min-width="base(x12)"
            data-h2-padding="base(0 x1) p-tablet(0)"
            data-h2-display="base(flex)"
            data-h2-flex-direction="base(column) p-tablet(row)"
            data-h2-gap="base(x1)"
          >
            <Link
              external
              mode="cta"
              icon={EnvelopeIcon}
              color="primary"
              href={hireAnApprenticeEmailUri}
              data-h2-text-align="base(center)"
            >
              {intl.formatMessage({
                defaultMessage: "Contact the team",
                id: "gJ7CQw",
                description: "Link to send an email to the team",
              })}
            </Link>

            <Link
              external
              mode="cta"
              icon={ArrowDownTrayIcon}
              href={
                locale === "en"
                  ? "/static/documents/Manager package - ITAPIP.pptx"
                  : "/static/documents/Trousse du gestionnaire - PATIPA.pptx"
              }
              color="primary"
              data-h2-text-align="base(center)"
            >
              {intl.formatMessage({
                defaultMessage: "Download the manager’s package",
                id: "sDqpzq",
                description: "Call to action to download the manager's package",
              })}
            </Link>
          </div>
        </div>
      </div>

      <div data-h2-layer="base(1, relative)">
        <div
          data-h2-wrapper="base(center, iap-home, x1) l-tablet(center, iap-home, x2)"
          data-h2-position="base(relative)"
        >
          {/* pull-up overlap */}
          <div data-h2-margin-top="p-tablet(-x3.5) l-tablet(-x4)">
            <div
              data-h2-padding="base(x2) p-tablet(x2.5) l-tablet(x3)"
              data-h2-background-color="base(white) base:dark(background)"
              data-h2-radius="p-tablet(iap-home-card)"
            >
              {/* about the program section */}
              <div
                data-h2-flex-grid="base(stretch, x3, x1) p-tablet(stretch, x3, x1) l-tablet(stretch, x3, x1)"
                data-h2-padding-bottom="base(x2)"
              >
                <div data-h2-flex-item="base(1of1) p-tablet(3of7)">
                  <div
                    data-h2-height="p-tablet(100%)"
                    data-h2-width="p-tablet(100%)"
                    data-h2-position="base(relative)"
                  >
                    <TopRightFrame
                      data-h2-position="base(absolute)"
                      data-h2-width="base(80%)"
                      data-h2-location="base(-1.5rem, -1.5rem, auto, auto) p-tablet(-1.5rem, -1.5rem, auto, auto)"
                    />
                    <img
                      src={section1Img}
                      alt={intl.formatMessage({
                        defaultMessage:
                          "Indigenous woman exchanging virtually with apprentices on a laptop.",
                        id: "QDDnVO",
                        description:
                          "Description of a decorative image of a woman and a laptop",
                      })}
                      data-h2-display="base(block)"
                      data-h2-min-height="base(60vh) p-tablet(initial)"
                      data-h2-height="base(100%)"
                      data-h2-width="base(100%)"
                      data-h2-position="base(relative)"
                      data-h2-margin="base(0 auto)"
                      style={{
                        objectFit: "cover",
                      }}
                    />
                    <img
                      src={section1FlourishImg}
                      alt={intl.formatMessage({
                        defaultMessage:
                          "traditional handmade artwork of a beaded flower and leaves.",
                        id: "7WF1vv",
                        description:
                          "Description of a decorative image of some beaded artwork",
                      })}
                      data-h2-position="base(absolute)"
                      data-h2-width="base(auto)"
                      data-h2-height="base(25rem)"
                      data-h2-location="base(auto, auto, -2rem, -4rem) p-tablet(auto, auto, -3rem, -5rem)"
                    />
                  </div>
                </div>
                <div data-h2-flex-item="base(1of1) p-tablet(4of7)">
                  <Heading
                    data-h2-font-size="base(h3, 1)"
                    data-h2-margin="base(x2, 0, x2, 0) p-tablet(0, 0, 0, 0)"
                    data-h2-text-align="base(center) p-tablet(left)"
                    data-h2-layer="base(1, relative)"
                    data-h2-color="base(primary.darker)"
                  >
                    {intl.formatMessage({
                      defaultMessage: "About the program",
                      id: "+DMD0L",
                      description: "Title of the 'About the program' section",
                    })}
                  </Heading>
                  <p data-h2-margin="base(x1, 0, x1, 0)">
                    {intl.formatMessage({
                      defaultMessage:
                        "The IT Apprenticeship Program for Indigenous Peoples is an innovative Government of Canada initiative that provides a pathway to employment in the federal public service for Indigenous peoples who have a passion for Information Technology.",
                      id: "D3mwyg",
                      description:
                        "Paragraph 1 of the 'About the program' section",
                    })}
                  </p>
                  <p data-h2-margin="base(x1, 0)">
                    {intl.formatMessage({
                      defaultMessage:
                        "Linked directly to the advancement of reconciliation, the program was designed by, for, and with First Nations, Inuit, and Métis peoples.",
                      id: "iSbtcK",
                      description:
                        "Paragraph 2 of the 'About the program' section",
                    })}
                  </p>
                  <p data-h2-margin="base(x1, 0)">
                    {intl.formatMessage({
                      defaultMessage:
                        "This program removes one of the biggest barriers to employment by placing value in a person’s potential rather than on their education attainment level. In doing so, this initiative contributes to closing educational, employment, and economic gaps faced by Indigenous Peoples in Canada.",
                      id: "Rk1i9Q",
                      description:
                        "Paragraph 3 of the 'About the program' section",
                    })}
                  </p>
                  <p data-h2-margin="base(x1, 0)">
                    {intl.formatMessage({
                      defaultMessage:
                        "The Office of Indigenous Initiatives (OII) is the team that supports the program.",
                      id: "1C9UWI",
                      description:
                        "Paragraph 4 of the 'About the program' section",
                    })}
                  </p>

                  <Link
                    mode="solid"
                    external
                    href={
                      locale === "en"
                        ? "/static/documents/Manager package - ITAPIP.pptx"
                        : "/static/documents/Trousse du gestionnaire - PATIPA.pptx"
                    }
                    color="primary"
                    data-h2-text-align="base(center)"
                  >
                    {intl.formatMessage({
                      defaultMessage: "Download the manager’s package",
                      id: "sDqpzq",
                      description:
                        "Call to action to download the manager's package",
                    })}
                  </Link>
                </div>
              </div>

              {/* how the program works section */}
              <div
                data-h2-flex-grid="base(stretch, x3, x1) p-tablet(stretch, x2, x1) l-tablet(stretch, x3, x1)"
                data-h2-padding-top="base(x2)"
              >
                <div data-h2-flex-item="base(1of1) p-tablet(4of7)">
                  <Heading
                    data-h2-font-size="base(h3, 1)"
                    data-h2-text-align="base(center) p-tablet(left)"
                    data-h2-color="base(primary.darker)"
                    data-h2-margin-top="base(0)"
                  >
                    {intl.formatMessage({
                      defaultMessage: "How the program works",
                      id: "u7IbDO",
                      description:
                        "Title of the 'How the program works' section",
                    })}
                  </Heading>
                  <Heading level="h3" size="h6">
                    {intl.formatMessage({
                      defaultMessage: "Hired as a term employee",
                      id: "e5xrSy",
                      description:
                        "Title of the 'Hired as a term employee' subsection",
                    })}
                  </Heading>
                  <p>
                    {intl.formatMessage({
                      defaultMessage:
                        "Indigenous apprentices are hired by a host organization at the entry level of the IT group (IT-01 or equivalent) for a 24-month term.",
                      id: "oES0/4",
                      description:
                        "Paragraph 1 of the 'Hired as a term employee' subsection",
                    })}
                  </p>
                  <Heading level="h3" size="h6">
                    {intl.formatMessage({
                      defaultMessage:
                        "Work integrated learning and IT training",
                      id: "xb4jXA",
                      description:
                        "Title of the 'Work integrated learning and IT training' subsection",
                    })}
                  </Heading>
                  <p>
                    {intl.formatMessage({
                      defaultMessage:
                        "Over the course of the 24 months, apprentices learn on-the-job with a peer partner (4 days per week) and follow a curated self-paced online training curriculum (1 day per week) as part of their development.",
                      id: "0IZsNR",
                      description:
                        "Paragraph 1 of the 'Work integrated learning and IT training' subsection",
                    })}
                  </p>
                  <Heading level="h3" size="h6">
                    {intl.formatMessage({
                      defaultMessage: "Circle of Support",
                      id: "D5Hqhf",
                      description:
                        "Title of the 'Circle of Support' subsection",
                    })}
                  </Heading>
                  <p>
                    {intl.formatMessage({
                      defaultMessage:
                        "Due to the nature of the Apprenticeship, the program has developed a unique circle of supports for apprentices. These include a peer partner for job shadowing and day-to-day support, as well as a mentor who provides experienced guidance.",
                      id: "TB5Pnf",
                      description:
                        "Paragraph 1 of the 'Circle of Support' subsection",
                    })}
                  </p>
                  <p data-h2-margin="base(x1, 0)">
                    {intl.formatMessage({
                      defaultMessage:
                        "Additional supports include Sharing Circles, access to an IT Training Support Advisor, and Apprentice Success Facilitators. While the Facilitators are principally a resource for Apprentices, they are also a support system for Managers and Supervisors.",
                      id: "f3KZGn",
                      description:
                        "Paragraph 2 of the 'Circle of Support' subsection",
                    })}
                  </p>
                  <Heading level="h3" size="h6">
                    {intl.formatMessage({
                      defaultMessage: "Digital certificate credential",
                      id: "+AnEvv",
                      description:
                        "Title of the 'Digital certificate credential' subsection",
                    })}
                  </Heading>
                  <p>
                    {intl.formatMessage(
                      {
                        defaultMessage:
                          "After successfully completing the apprenticeship, graduates are issued a digital certificate and a portable verifiable credential. It is endorsed by the Chief Information Officer of Canada and formally recognized as meeting the <link>GC Qualification Standard alternative for the IT Occupational Group</link>.",
                        id: "LzJpQo",
                        description:
                          "Paragraph 1 of the 'Digital certificate credential' subsection",
                      },
                      {
                        link: (chunks: ReactNode) => {
                          return makeLink(
                            chunks,
                            locale === "en"
                              ? "https://www.canada.ca/en/treasury-board-secretariat/services/information-notice/it-apprenticeship-program--indigenous-peoples-alternative-educational-requirements.html"
                              : "https://www.canada.ca/fr/secretariat-conseil-tresor/services/avis-information/programme-apprentissage-ti-personnes-autochtones-autres-exigences-etudes.html",
                          );
                        },
                      },
                    )}
                  </p>
                </div>
                <div
                  data-h2-flex-item="base(1of1) p-tablet(3of7)"
                  // padding for flourish
                  data-h2-padding-bottom="base(x2) p-tablet(x3) l-tablet(x5)"
                >
                  <div
                    data-h2-height="p-tablet(100%)"
                    data-h2-width="p-tablet(100%)"
                    data-h2-position="base(relative)"
                  >
                    <div
                      data-h2-radius="base(100%)"
                      data-h2-height="base(18rem) p-tablet(18rem) l-tablet(24rem) desktop(32rem)"
                      data-h2-width="base(18rem) p-tablet(18rem) l-tablet(24rem) desktop(32rem)"
                      data-h2-background-color="base(primary.dark.1)"
                      data-h2-position="base(absolute)"
                      data-h2-location="base(-x4, -x6, auto, auto) l-tablet(-x4, -x4, auto, auto) desktop(-x6, -x6, auto, auto)"
                    />
                    <div data-h2-position="base(relative)">
                      <img
                        src={section2Img}
                        alt={intl.formatMessage({
                          defaultMessage:
                            "Indigenous man working with his policy team using a laptop.",
                          id: "wW4ymk",
                          description:
                            "Description of a decorative image of a man and a laptop",
                        })}
                        data-h2-display="base(block)"
                        data-h2-margin="base(0 auto)"
                        data-h2-position="base(relative)"
                        style={{
                          objectFit: "cover",
                        }}
                      />
                      <img
                        src={section2FlourishImg}
                        alt={intl.formatMessage({
                          defaultMessage:
                            "Hummingbird in flight, which represents the messenger of joy in many Indigenous communities",
                          id: "P40FEe",
                          description:
                            "Description of a decorative image of a hummingbird",
                        })}
                        data-h2-position="base(absolute)"
                        data-h2-location="base(auto, auto, -x4, -x3) p-tablet(auto, auto, -x3, -x3) l-tablet(auto, auto, -x4, -x4) desktop(auto, auto, -x4, -x5)"
                        data-h2-width="base(20rem) l-tablet(30rem)"
                        data-h2-height="base(auto)"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonial section */}
      <div
        data-h2-margin-top="base(x1) p-tablet(0)"
        style={{
          backgroundImage: `url(${testimonials})`,
          backgroundSize: "cover",
          backgroundPosition: "50% 75%",
        }}
      >
        <div
          data-h2-background-color="base(secondary.dark.9) base:dark(secondary.darker.9)"
          data-h2-padding="base(x4, 0)"
        >
          <div data-h2-color="base:all(white)">
            <Heading
              level="h2"
              size="h4"
              data-h2-text-align="base(center)"
              data-h2-margin="base(0, 0, x2, 0)"
            >
              {intl.formatMessage({
                defaultMessage: "What we're hearing",
                id: "okRYhl",
                description: "Title of a quotes section",
              })}
            </Heading>
            <blockquote
              data-h2-display="base(grid)"
              // 70rem - iap-home container width
              data-h2-grid-template-columns="base(minmax(x4, auto) minmax(0, 70rem) minmax(x4, auto))"
              data-h2-grid-template-rows="base(auto auto)"
              data-h2-row-gap="base(x1)"
            >
              <div data-h2-grid-column="base(2)" data-h2-grid-row="base(1)">
                <p
                  data-h2-font-weight="base(bold)"
                  data-h2-font-size="base(h3) p-tablet(h2)"
                  data-h2-text-align="base(center) p-tablet(left)"
                >
                  {intl.formatMessage({
                    defaultMessage:
                      "Having had the privilege of working closely with the Indigenous Apprentices and witnessing the immense talent and potential they possess, our IRCC team is confident that this investment will bring tremendous value to both our department and our apprentices themselves.",
                    id: "YSnedz",
                    description:
                      "Quote from Darcy Pierlot about working with apprentices",
                  })}
                </p>
              </div>
              <div data-h2-grid-column="base(2)" data-h2-grid-row="base(2)">
                <cite data-h2-font-weight="base(bold)">
                  {intl.formatMessage({
                    defaultMessage:
                      "– Darcy Pierlot, Chief Information Officer and Assistant Deputy Minister, Immigration, Refugees and Citizenship Canada",
                    id: "T4xKEw",
                    description:
                      "Quote attribution for Quote from Darcy Pierlot about working with apprentices",
                  })}
                </cite>
              </div>
              <div
                data-h2-grid-column="base(1)"
                data-h2-grid-row="base(1)"
                data-h2-justify-self="base(center)"
              >
                <OpenQuote data-h2-width="base(x2) p-tablet(x3)" />
              </div>
              <div
                data-h2-grid-column="base(3)"
                data-h2-grid-row="base(1)"
                data-h2-justify-self="base(center)"
                data-h2-align-self="base(end)"
              >
                <CloseQuote data-h2-width="base(x2) p-tablet(x3)" />
              </div>
            </blockquote>
          </div>
        </div>
      </div>

      <div data-h2-wrapper="base(center, iap-home, x1) l-tablet(center, iap-home, x2)">
        <div data-h2-padding="base(x2) p-tablet(x2.5) l-tablet(x3)">
          {/* ready for IT section */}
          <div data-h2-flex-grid="base(stretch, x3, x1) p-tablet(stretch, x2, x1) l-tablet(stretch, x3, x1)">
            <div
              data-h2-flex-item="base(1of1) p-tablet(1of2)"
              data-h2-order="p-tablet(1)"
            >
              <Heading
                data-h2-font-size="base(h3, 1)"
                data-h2-margin="base(0, 0, x1, 0)"
                data-h2-text-align="base(center) p-tablet(left)"
                data-h2-color="base(primary.darker)"
              >
                {intl.formatMessage({
                  defaultMessage:
                    "Indigenous talent ready for IT apprenticeships",
                  id: "8n9opI",
                  description:
                    "Title for the 'Indigenous talent ready for IT apprenticeships' section",
                })}
              </Heading>
              <p>
                {intl.formatMessage({
                  defaultMessage:
                    "The OII is dedicated to bringing Indigenous talent into the GC's IT workforce and simplifying the hiring process for you.",
                  id: "fHEsA5",
                  description:
                    "Paragraph 1 for the 'Indigenous talent ready for IT apprenticeships' section",
                })}
              </p>
              <p data-h2-margin="base(x0.5, 0)">
                {intl.formatMessage({
                  defaultMessage: "You will receive candidates who have:",
                  id: "SeJ1eB",
                  description:
                    "Title for the candidate list in the 'Indigenous talent ready for IT apprenticeships' section",
                })}
              </p>
              <ul>
                <li data-h2-margin="base(x0.25, 0)">
                  {intl.formatMessage({
                    defaultMessage: "Been interviewed",
                    id: "Wvybds",
                    description:
                      "Item 1 in the candidate list in the 'Indigenous talent ready for IT apprenticeships' section",
                  })}
                </li>
                <li data-h2-margin="base(x0.25, 0)">
                  {intl.formatMessage({
                    defaultMessage:
                      "Been fully assessed against the IT Apprenticeship Program for Indigenous People’s Statement of Merit Criteria and found qualified for the role of an IT-01 (or equivalent) apprentice",
                    id: "q0oPjr",
                    description:
                      "Item 2 in the candidate list in the 'Indigenous talent ready for IT apprenticeships' section",
                  })}
                </li>
                <li data-h2-margin="base(x0.25, 0)">
                  {intl.formatMessage({
                    defaultMessage: "A valid Reliability security status",
                    id: "k1uZ7o",
                    description:
                      "Item 3 in the candidate list in the 'Indigenous talent ready for IT apprenticeships' section",
                  })}
                </li>
                <li data-h2-margin="base(x0.25, 0)">
                  {intl.formatMessage({
                    defaultMessage: "A personal record identifier (PRI)",
                    id: "yaf/jx",
                    description:
                      "Item 4 in the candidate list in the 'Indigenous talent ready for IT apprenticeships' section",
                  })}
                </li>
              </ul>
            </div>
            <div
              data-h2-flex-item="base(1of1) p-tablet(1of2)"
              data-h2-order="p-tablet(2)"
            >
              <div
                data-h2-display="base(flex)"
                data-h2-flex-direction="base(column)"
                data-h2-justify-content="base(center)"
                data-h2-height="base(100%)"
              >
                <div
                  data-h2-background-color="base(primary.dark)"
                  data-h2-padding="base(x2)"
                  data-h2-color="base(white)"
                  data-h2-position="base(relative)"
                >
                  <div
                    data-h2-radius="base(100%)"
                    data-h2-height="base(18rem)"
                    data-h2-width="base(18rem)"
                    data-h2-background-color="base(primary.dark.1)"
                    data-h2-position="base(absolute)"
                    data-h2-location="base(-x3, -x5, auto, auto) desktop(-x3, -x5, auto, auto)"
                    data-h2-z-index="base(0)"
                  />
                  <Heading level="h3" size="h6" data-h2-margin-top="base(0)">
                    {intl.formatMessage({
                      defaultMessage: "How to begin hiring an apprentice",
                      id: "UJPrY7",
                      description:
                        "Title for the 'How to begin hiring an apprentice' section",
                    })}
                  </Heading>
                  <p data-h2-margin="base(x1, 0, 0, 0)">
                    {intl.formatMessage({
                      defaultMessage:
                        "Download the manager’s package for more information and then contact the team to get the process started.",
                      id: "zvXWQB",
                      description:
                        "Paragraph 1 for the 'How to begin hiring an apprentice' section",
                    })}
                  </p>
                </div>
                <div
                  data-h2-margin-top="base(x1)"
                  data-h2-display="base(flex)"
                  data-h2-flex-direction="base(column) p-tablet(row)"
                  data-h2-gap="base(x1)"
                  data-h2-align-items="base(center)"
                >
                  <Link
                    mode="solid"
                    external
                    href={
                      locale === "en"
                        ? "/static/documents/Manager package - ITAPIP.pptx"
                        : "/static/documents/Trousse du gestionnaire - PATIPA.pptx"
                    }
                    color="secondary"
                    data-h2-text-align="base(center)"
                  >
                    {intl.formatMessage({
                      defaultMessage: "Download the package",
                      id: "iGXXjP",
                      description:
                        "Call to action to download the manager's package",
                    })}
                  </Link>
                  <Link
                    external
                    mode="inline"
                    href={hireAnApprenticeEmailUri}
                    data-h2-text-align="base(center)"
                  >
                    {intl.formatMessage({
                      defaultMessage: "Hire an apprentice",
                      id: "qlVBtp",
                      description: "Link to send an email to the team",
                    })}
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* commitment and graduates section */}
          <div
            data-h2-layer="base(2, relative)"
            data-h2-margin="base(x3 0 x6 0)"
          />
          <div data-h2-flex-grid="base(stretch, x3, x1) p-tablet(stretch, x2, x1) l-tablet(stretch, x3, x1)">
            <div
              data-h2-flex-item="base(1of1) p-tablet(3of7)"
              // padding for flourish
              data-h2-padding-bottom="base(x2) p-tablet(x3) l-tablet(x5)"
            >
              <div data-h2-position="base(relative)">
                <Triangle
                  data-h2-position="base(absolute)"
                  data-h2-location="base(-x1, -x1, auto, auto)"
                  style={{ transform: "scaleX(-1)" }}
                  data-h2-width="base(80%)"
                  data-h2-color="base(primary.darker)"
                />
                <img
                  src={section5Img}
                  alt={intl.formatMessage({
                    defaultMessage:
                      "Indigenous woman taking a break from her program delivery work on a laptop.",
                    id: "EtOnRo",
                    description:
                      "Description of a decorative image of a woman and a laptop",
                  })}
                  data-h2-min-height="base(32rem) p-tablet(initial)"
                  data-h2-height="base(100%)"
                  data-h2-width="base(100%)"
                  data-h2-display="base(block)"
                  data-h2-position="base(relative)"
                  data-h2-margin="base(0 auto)"
                  style={{
                    objectFit: "cover",
                    objectPosition: "50% 10%",
                  }}
                />
                <img
                  src={section5FlourishImg}
                  alt={intl.formatMessage({
                    defaultMessage:
                      "Indigenous talking stick, which represents respect in many Indigenous communities.",
                    id: "+tGYjC",
                    description:
                      "Description of a decorative image of a talking stick",
                  })}
                  data-h2-position="base(absolute)"
                  data-h2-location="base(auto, auto, -x5, -x1)  p-tablet(auto, auto,-x4, -x1) l-tablet(auto, auto,-x8, -x1)"
                  data-h2-width="base(80%) base(150%)"
                />
              </div>
            </div>
            <div
              data-h2-flex-item="base(1of1) p-tablet(4of7)"
              data-h2-position="base(relative)"
            >
              <Heading
                size="h3"
                data-h2-font-weight="base(700)"
                data-h2-margin="base(x5, 0, x2, 0) p-tablet(0, 0, 0, 0)"
                data-h2-color="base(primary.darker)"
                data-h2-text-align="base(center) p-tablet(left)"
              >
                {intl.formatMessage({
                  defaultMessage: "A commitment to diverse digital talent",
                  id: "29o8/W",
                  description:
                    "Title of the 'A commitment to diverse digital talent' section",
                })}
              </Heading>
              <p data-h2-margin="base(x1, 0, x1, 0)">
                {intl.formatMessage(
                  {
                    defaultMessage:
                      "The <link>Digital Ambition</link>, released in 2022, provides direction on how to increase representation of under-represented groups by leveraging programs like the IT Apprenticeship Program for Indigenous Peoples.",
                    id: "c4R8FH",
                    description:
                      "Paragraph 1 of the 'A commitment to diverse digital talent' section",
                  },
                  {
                    link: (chunks: ReactNode) => {
                      return makeLink(
                        chunks,
                        locale === "en"
                          ? "https://www.canada.ca/en/government/system/digital-government/digital-ambition.html"
                          : "https://www.canada.ca/fr/gouvernement/systeme/gouvernement-numerique/ambition-numerique.html",
                      );
                    },
                  },
                )}
              </p>
              <Well>
                <p>
                  {intl.formatMessage({
                    defaultMessage:
                      "Together we are empowered to capitalize on the diversity of experience and ideas that Indigenous peoples bring to the Public Service and contribute towards reconciliation in Canada.",
                    id: "HyNRz8",
                    description:
                      "Paragraph 2 of the 'A commitment to diverse digital talent' section",
                  })}
                </p>
              </Well>
              <Heading
                size="h3"
                data-h2-font-weight="base(700)"
                data-h2-color="base(primary.darker)"
                data-h2-text-align="base(center) p-tablet(left)"
                data-h2-margin={headingStyles.h2["data-h2-margin"]}
              >
                {intl.formatMessage({
                  defaultMessage: "Graduates and advanced talent",
                  id: "MZChNU",
                  description:
                    "Title of the 'Graduates and advanced talent' section",
                })}
              </Heading>
              <p data-h2-margin="base(x1 0, x1, 0)">
                {intl.formatMessage({
                  defaultMessage:
                    "Are you looking to hire a graduate from the program or Indigenous talent for more senior positions in IT? Contact our team to discuss potential graduate placements and advanced talent referrals.",
                  id: "lDnHjr",
                  description:
                    "Paragraph 1 of the 'Graduates and advanced talent' section",
                })}
              </p>
              <Link
                external
                mode="solid"
                icon={EnvelopeSolid}
                color="primary"
                href={buildMailToUri(
                  "edsc.patipa.jumelage.emplois-itapip.job.matching.esdc@hrsdc-rhdcc.gc.ca",
                  intl.formatMessage({
                    defaultMessage:
                      "I'm interested in hiring a graduate/advanced talent",
                    id: "WpA63g",
                    description:
                      "Subject line of a manager's email for apprenticeship",
                  }),
                )}
                data-h2-margin="base(0, 0, x2, 0) p-tablet(0, 0, 0, 0)"
                data-h2-text-align="base(center)"
              >
                {intl.formatMessage({
                  defaultMessage: "Contact the team",
                  id: "gJ7CQw",
                  description: "Link to send an email to the team",
                })}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

Component.displayName = "IAPManagerHomePage";

export default Component;
