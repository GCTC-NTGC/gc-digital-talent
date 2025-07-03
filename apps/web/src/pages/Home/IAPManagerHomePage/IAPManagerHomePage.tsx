import { useIntl } from "react-intl";
import EnvelopeIcon from "@heroicons/react/24/outline/EnvelopeIcon";
import EnvelopeSolid from "@heroicons/react/24/solid/EnvelopeIcon";
import ArrowDownTrayIcon from "@heroicons/react/24/outline/ArrowDownTrayIcon";
import { ReactNode } from "react";

import { getLocale } from "@gc-digital-talent/i18n";
import {
  Container,
  CTALink,
  Heading,
  Link,
  Ul,
  Well,
} from "@gc-digital-talent/ui";
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
    <div className="overflow-x-hidden overflow-y-visible bg-white dark:bg-gray-700">
      <div
        // hero wrapper
        className="w-fill bg-cover bg-position-[right_10%_center]"
        style={{
          backgroundImage: `url(${heroImg})`,
        }}
      >
        <div
          // content wrapper
          // 24 bottom padding + overlap
          className="flex min-w-72 flex-col items-center gap-12 py-24 xs:pb-42 sm:pb-48"
        >
          <div
            // title wrapper
            className="flex flex-col items-center gap-6 text-center text-white"
          >
            <img src={logoImg} alt="" className="block w-42 xs:w-58" />
            <h1 className="text-5xl font-bold lg:text-6xl">
              {intl.formatMessage({
                defaultMessage: "Hire an IT apprentice",
                id: "39RER8",
                description: "Page title for IAP manager homepage",
              })}
            </h1>
            <p className="text-xl lg:text-2xl">
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
            className="mx-6 flex min-w-72 flex-col items-center gap-6 xs:flex-row xs:p-0"
          >
            <CTALink
              external
              icon={EnvelopeIcon}
              color="primary"
              href={hireAnApprenticeEmailUri}
            >
              {intl.formatMessage({
                defaultMessage: "Contact the team",
                id: "gJ7CQw",
                description: "Link to send an email to the team",
              })}
            </CTALink>
            <CTALink
              external
              icon={ArrowDownTrayIcon}
              href={
                locale === "en"
                  ? "/static/documents/Manager package - ITAPIP.pptx"
                  : "/static/documents/Trousse du gestionnaire - PATIPA.pptx"
              }
              color="primary"
            >
              {intl.formatMessage({
                defaultMessage: "Download the manager’s package",
                id: "sDqpzq",
                description: "Call to action to download the manager's package",
              })}
            </CTALink>
          </div>
        </div>
      </div>

      <div className="relative z-[1]">
        <Container>
          {/* pull-up overlap */}
          <div className="xs:-mt-21 sm:-mt-24">
            <div className="rounded-3xl bg-white p-12 xs:p-15 sm:p-18 dark:bg-gray-700">
              {/* about the program section */}
              <div className="grid pb-12 xs:grid-cols-7 xs:gap-x-18">
                <div className="xs:col-span-3">
                  <div className="relative xs:size-full">
                    <TopRightFrame className="absolute -top-6 -right-6 w-4/5" />
                    <img
                      src={section1Img}
                      alt={intl.formatMessage({
                        defaultMessage:
                          "Indigenous woman exchanging virtually with apprentices on a laptop.",
                        id: "QDDnVO",
                        description:
                          "Description of a decorative image of a woman and a laptop",
                      })}
                      className="relative mx-auto my-0 block h-full min-h-[60vh] w-full object-cover xs:min-h-[initial]"
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
                      className="auto absolute -bottom-8 -left-16 h-100 xs:-bottom-12 xs:-left-20"
                    />
                  </div>
                </div>
                <div className="xs:col-span-4">
                  <Heading className="relative z-[1] my-12 text-center text-3xl text-primary-600 xs:m-0 xs:text-left lg:text-4xl dark:text-primary-200">
                    {intl.formatMessage({
                      defaultMessage: "About the program",
                      id: "+DMD0L",
                      description: "Title of the 'About the program' section",
                    })}
                  </Heading>
                  <p className="my-6">
                    {intl.formatMessage({
                      defaultMessage:
                        "The IT Apprenticeship Program for Indigenous Peoples is an innovative Government of Canada initiative that provides a pathway to employment in the federal public service for Indigenous peoples who have a passion for Information Technology.",
                      id: "D3mwyg",
                      description:
                        "Paragraph 1 of the 'About the program' section",
                    })}
                  </p>
                  <p className="my-6">
                    {intl.formatMessage({
                      defaultMessage:
                        "Linked directly to the advancement of reconciliation, the program was designed by, for, and with First Nations, Inuit, and Métis peoples.",
                      id: "iSbtcK",
                      description:
                        "Paragraph 2 of the 'About the program' section",
                    })}
                  </p>
                  <p className="my-6">
                    {intl.formatMessage({
                      defaultMessage:
                        "This program removes one of the biggest barriers to employment by placing value in a person’s potential rather than on their education attainment level. In doing so, this initiative contributes to closing educational, employment, and economic gaps faced by Indigenous Peoples in Canada.",
                      id: "Rk1i9Q",
                      description:
                        "Paragraph 3 of the 'About the program' section",
                    })}
                  </p>
                  <p className="my-6">
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
                    className="text-center"
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
              <div className="grid gap-6 pt-12 xs:grid-cols-7 xs:gap-18">
                <div className="xs:col-span-4">
                  <Heading className="mt-0 text-center text-3xl text-primary-700 xs:text-left lg:text-4xl dark:text-primary-200">
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
                  <p className="my-6">
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
                  // padding for flourish
                  className="pb-12 xs:col-span-3 xs:pb-18 sm:pb-30"
                >
                  <div className="relative xs:h-full xs:w-full">
                    <div className="dark:primary-300/10 absolute -top-24 -right-36 size-72 rounded-full bg-primary-500/10 sm:-right-24 sm:size-96 lg:-top-36 lg:-right-36 lg:size-128" />
                    <div className="relative">
                      <img
                        src={section2Img}
                        alt={intl.formatMessage({
                          defaultMessage:
                            "Indigenous man working with his policy team using a laptop.",
                          id: "wW4ymk",
                          description:
                            "Description of a decorative image of a man and a laptop",
                        })}
                        className="relative mx-auto my-0 block object-cover"
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
                        className="absolute -bottom-24 -left-18 h-auto xs:-bottom-18 lg:-bottom-24 lg:-left-30"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </div>

      {/* Testimonial section */}
      <div
        className="mt-6 bg-cover bg-position-[50%_75%] xs:mt-0"
        style={{
          backgroundImage: `url(${testimonials})`,
        }}
      >
        <div className="bg-secondary-500/90 py-24 text-white dark:bg-secondary-600/90">
          <Heading level="h2" size="h4" className="mt-0 mb-12 text-center">
            {intl.formatMessage({
              defaultMessage: "What we're hearing",
              id: "okRYhl",
              description: "Title of a quotes section",
            })}
          </Heading>
          <blockquote
            className="grid grid-cols-[minmax(calc(var(--spacing)*24),auto)_minmax(0,70rem)_minmax(calc(var(--spacing)*24),auto)] grid-rows-[auto_auto] gap-y-6"
            // 70rem - iap-home container width
          >
            <div className="col-start-2 row-start-1">
              <p className="text-center text-3xl font-bold xs:text-left xs:text-4xl lg:text-5xl">
                {intl.formatMessage({
                  defaultMessage:
                    "Having had the privilege of working closely with the Indigenous Apprentices and witnessing the immense talent and potential they possess, our IRCC team is confident that this investment will bring tremendous value to both our department and our apprentices themselves.",
                  id: "YSnedz",
                  description:
                    "Quote from Darcy Pierlot about working with apprentices",
                })}
              </p>
            </div>
            <div className="col-start-2 row-start-2">
              <cite className="font-bold">
                {intl.formatMessage({
                  defaultMessage:
                    "– Darcy Pierlot, Chief Information Officer and Assistant Deputy Minister, Immigration, Refugees and Citizenship Canada",
                  id: "T4xKEw",
                  description:
                    "Quote attribution for Quote from Darcy Pierlot about working with apprentices",
                })}
              </cite>
            </div>
            <div className="col-start-1 row-start-1 justify-self-center">
              <OpenQuote className="w-12 xs:w-18" />
            </div>
            <div className="col-start-3 row-start-1 self-end justify-self-center">
              <CloseQuote className="w-12 xs:w-18" />
            </div>
          </blockquote>
        </div>
      </div>

      <Container>
        <div className="p-12 xs:p-15 sm:p-18">
          {/* ready for IT section */}
          <div className="grid gap-6 xs:grid-cols-2 xs:gap-18">
            <div className="xs:order-1">
              <Heading className="mt-0 mb-6 text-center text-3xl text-primary-600 xs:text-left lg:text-4xl dark:text-primary-200">
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
              <p className="m-y3">
                {intl.formatMessage({
                  defaultMessage: "You will receive candidates who have:",
                  id: "SeJ1eB",
                  description:
                    "Title for the candidate list in the 'Indigenous talent ready for IT apprenticeships' section",
                })}
              </p>
              <Ul space="md">
                <li>
                  {intl.formatMessage({
                    defaultMessage: "Been interviewed",
                    id: "Wvybds",
                    description:
                      "Item 1 in the candidate list in the 'Indigenous talent ready for IT apprenticeships' section",
                  })}
                </li>
                <li>
                  {intl.formatMessage({
                    defaultMessage:
                      "Been fully assessed against the IT Apprenticeship Program for Indigenous People’s Statement of Merit Criteria and found qualified for the role of an IT-01 (or equivalent) apprentice",
                    id: "q0oPjr",
                    description:
                      "Item 2 in the candidate list in the 'Indigenous talent ready for IT apprenticeships' section",
                  })}
                </li>
                <li>
                  {intl.formatMessage({
                    defaultMessage: "A valid Reliability security status",
                    id: "k1uZ7o",
                    description:
                      "Item 3 in the candidate list in the 'Indigenous talent ready for IT apprenticeships' section",
                  })}
                </li>
                <li>
                  {intl.formatMessage({
                    defaultMessage: "A personal record identifier (PRI)",
                    id: "yaf/jx",
                    description:
                      "Item 4 in the candidate list in the 'Indigenous talent ready for IT apprenticeships' section",
                  })}
                </li>
              </Ul>
            </div>
            <div className="xs:order-2">
              <div className="flex h-full flex-col justify-center">
                <div className="relative bg-primary-500 p-12 text-white dark:bg-primary-300 dark:text-black">
                  <div className="absolute -top-18 -right-30 z-0 size-72 rounded-full bg-primary-500/10 dark:bg-primary-300/10" />
                  <Heading level="h3" size="h6" className="mt-0">
                    {intl.formatMessage({
                      defaultMessage: "How to begin hiring an apprentice",
                      id: "UJPrY7",
                      description:
                        "Title for the 'How to begin hiring an apprentice' section",
                    })}
                  </Heading>
                  <p className="mt-6">
                    {intl.formatMessage({
                      defaultMessage:
                        "Download the manager’s package for more information and then contact the team to get the process started.",
                      id: "zvXWQB",
                      description:
                        "Paragraph 1 for the 'How to begin hiring an apprentice' section",
                    })}
                  </p>
                </div>
                <div className="mt-6 flex flex-col items-center gap-6 xs:flex-row">
                  <Link
                    mode="solid"
                    external
                    href={
                      locale === "en"
                        ? "/static/documents/Manager package - ITAPIP.pptx"
                        : "/static/documents/Trousse du gestionnaire - PATIPA.pptx"
                    }
                    color="secondary"
                    className="text-center"
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
                    color="secondary"
                    href={hireAnApprenticeEmailUri}
                    className="text-center"
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
          <div className="relative z-[2] mt-24">
            <div className="grid gap-6 xs:grid-cols-7 xs:gap-18">
              <div className="pb-12 xs:col-span-3 xs:pb-18 sm:pb-30">
                <div className="relative">
                  <Triangle className="absolute -top-6 -right-6 w-4/5 -scale-x-100 text-primary-600 dark:text-primary-200" />
                  <img
                    src={section5Img}
                    alt={intl.formatMessage({
                      defaultMessage:
                        "Indigenous woman taking a break from her program delivery work on a laptop.",
                      id: "EtOnRo",
                      description:
                        "Description of a decorative image of a woman and a laptop",
                    })}
                    className="relative mx-auto my-0 block size-full min-h-128 object-cover object-[50%_10%] xs:min-h-[initial]"
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
                    className="absolute -bottom-30 -left-6 w-[150%] xs:-bottom-24 sm:-bottom-48"
                  />
                </div>
              </div>
              <div className="relative xs:col-span-4">
                <Heading
                  size="h3"
                  className="mt-30 mb-12 text-center font-bold text-primary-600 xs:m-0 xs:text-left dark:text-primary-200"
                >
                  {intl.formatMessage({
                    defaultMessage: "A commitment to diverse digital talent",
                    id: "29o8/W",
                    description:
                      "Title of the 'A commitment to diverse digital talent' section",
                  })}
                </Heading>
                <p className="my-6">
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
                  className="mt-12 mb-3 text-center font-bold text-primary-600 xs:text-left dark:text-primary-200"
                >
                  {intl.formatMessage({
                    defaultMessage: "Graduates and advanced talent",
                    id: "MZChNU",
                    description:
                      "Title of the 'Graduates and advanced talent' section",
                  })}
                </Heading>
                <p className="my-6">
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
                  className="mb-12 text-center xs:m-0"
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
      </Container>
    </div>
  );
};

Component.displayName = "IAPManagerHomePage";

export default Component;
