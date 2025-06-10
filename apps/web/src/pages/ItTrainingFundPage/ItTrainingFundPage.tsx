import { defineMessage, useIntl } from "react-intl";
import MapIcon from "@heroicons/react/24/outline/MapIcon";
import BookmarkSquareIcon from "@heroicons/react/24/outline/BookmarkSquareIcon";
import LightBulbIcon from "@heroicons/react/24/outline/LightBulbIcon";
import { ReactNode } from "react";

import { Card, CardFlat, Heading, Link, Ul } from "@gc-digital-talent/ui";
import { getLocale } from "@gc-digital-talent/i18n";

import Hero from "~/components/Hero";
import useBreadcrumbs from "~/hooks/useBreadcrumbs";
import useRoutes from "~/hooks/useRoutes";
import image1 from "~/assets/img/it-training-fund-1.webp";
import image2 from "~/assets/img/it-training-fund-2.webp";
import image3 from "~/assets/img/it-training-fund-3.webp";
import SEO from "~/components/SEO/SEO";
import pageTitles from "~/messages/pageTitles";
import { wrapAbbr } from "~/utils/nameUtils";

const externalLinkAccessor = (href: string, chunks: ReactNode) => {
  return (
    <Link href={href} external>
      {chunks}
    </Link>
  );
};

const pageTitle = defineMessage(pageTitles.itTrainingFund);

const pageSubtitle = defineMessage({
  defaultMessage:
    "Explore learning opportunities for IT employees to build and strengthen skills.",
  id: "A94Zgi",
  description: "Page subtitle for the IT training fund page",
});

export const Component = () => {
  const intl = useIntl();
  const locale = getLocale(intl);
  const paths = useRoutes();

  const signUpUrl = {
    en: "https://forms-formulaires.alpha.canada.ca/en/id/cm4ww5k8l00bbaxduytwfcrjk",
    fr: "https://forms-formulaires.alpha.canada.ca/fr/id/cm4ww5k8l00bbaxduytwfcrjk",
  } as const;

  const navigarUrl = {
    en: "https://navigar.ca/",
    fr: "https://navigar.ca/fr/",
  } as const;

  const crumbs = useBreadcrumbs({
    crumbs: [
      {
        label: intl.formatMessage(pageTitle),
        url: paths.itTrainingFund(),
      },
    ],
  });

  return (
    <>
      <SEO
        title={intl.formatMessage(pageTitle)}
        description={intl.formatMessage(pageSubtitle)}
      />
      <Hero
        title={intl.formatMessage(pageTitle)}
        subtitle={intl.formatMessage(pageSubtitle)}
        crumbs={crumbs}
        centered
      />
      <div data-h2-padding="base(x3, 0)">
        <div data-h2-wrapper="base(center, large, x1) p-tablet(center, large, x2)">
          <div
            data-h2-display="base(flex)"
            data-h2-flex-direction="base(column)"
            data-h2-gap="base(x3)"
          >
            {/* Investing in the future of IT talent */}
            <div>
              <Heading
                icon={MapIcon}
                size="h2"
                color="secondary"
                data-h2-margin="base(0, 0, x1.5, 0)"
                data-h2-font-weight="base(400)"
              >
                {intl.formatMessage({
                  defaultMessage: "Investing in the future of IT talent",
                  id: "v6/BRI",
                  description:
                    "Heading for section describing investing in future talent",
                })}
              </Heading>
              <p>
                {intl.formatMessage(
                  {
                    defaultMessage:
                      "The Government of Canada is committed to supporting the development of its <abbreviation>IT</abbreviation> professionals. With the <strong><abbreviation>IT</abbreviation> Community Training and Development Fund</strong>, <abbreviation>IT</abbreviation>-classified employees who are covered by the <link><abbreviation>IT</abbreviation> collective agreement</link> now have increased access to a wide range of learning opportunities to build and deepen their <abbreviation>IT</abbreviation> skills.",
                    id: "AcpYdi",
                    description:
                      "First paragraph describing investing in future talent",
                  },
                  {
                    link: (chunks: ReactNode) =>
                      externalLinkAccessor(
                        locale === "en"
                          ? "https://www.tbs-sct.canada.ca/agreements-conventions/view-visualiser-eng.aspx?id=31"
                          : "https://www.tbs-sct.canada.ca/agreements-conventions/view-visualiser-fra.aspx?id=31",
                        chunks,
                      ),
                    abbreviation: (text: ReactNode) => wrapAbbr(text, intl),
                  },
                )}
              </p>
            </div>
            {/* What is the IT Community Training and Development Fund? */}
            <div
              data-h2-display="base(flex)"
              data-h2-flex-direction="base(column)"
              data-h2-gap="base(x1.5)"
            >
              <Heading
                icon={BookmarkSquareIcon}
                size="h2"
                color="error"
                data-h2-margin="base(0)"
                data-h2-font-weight="base(400)"
              >
                {intl.formatMessage({
                  defaultMessage:
                    "What is the IT Community Training and Development Fund?",
                  id: "8p4ty0",
                  description:
                    "Heading for section describing the training fund",
                })}
              </Heading>
              <p>
                {intl.formatMessage(
                  {
                    defaultMessage:
                      "The fund is a financial commitment to support the professional growth of the Government of Canada's <abbreviation>IT</abbreviation> staff. It was established under the <link><abbreviation>IT</abbreviation> collective agreement</link> signed between the PIPSC <abbreviation>IT</abbreviation> group and the Treasury Board of Canada Secretariat in December 2023. The fund allocates $4.725 million each year for training and development for the duration of the agreement.",
                    id: "sMCVdo",
                    description: "First paragraph describing the training fund",
                  },
                  {
                    link: (chunks: ReactNode) =>
                      externalLinkAccessor(
                        locale == "en"
                          ? "https://www.tbs-sct.canada.ca/agreements-conventions/view-visualiser-eng.aspx?id=31"
                          : "https://www.tbs-sct.canada.ca/agreements-conventions/view-visualiser-fra.aspx?id=31",
                        chunks,
                      ),
                    abbreviation: (text: ReactNode) => wrapAbbr(text, intl),
                  },
                )}
              </p>
              <div
                data-h2-display="base(grid)"
                data-h2-grid-template-columns="base(1fr) p-tablet(repeat(2, minmax(0, 1fr))) l-tablet(repeat(3, minmax(0, 1fr)))"
                data-h2-gap="base(x2) p-tablet(x3)"
              >
                <div>
                  <CardFlat
                    color="warning"
                    title={intl.formatMessage({
                      defaultMessage: "Objectives of the fund",
                      id: "y3+Iw5",
                      description: "Heading for the fund objectives card",
                    })}
                  >
                    <p data-h2-margin-bottom="base(x0.5)">
                      {intl.formatMessage({
                        defaultMessage:
                          "The goal is to provide additional comprehensive, consistent, and high-quality training opportunities to:",
                        id: "Ta28fI",
                        description: "title for a list of fund objectives",
                      })}
                    </p>
                    <Ul space="lg" noIndent>
                      <li>
                        {intl.formatMessage({
                          defaultMessage: "close critical skill gaps",
                          id: "O8yYPv",
                          description: "an item in a list of fund objectives",
                        })}
                      </li>
                      <li>
                        {intl.formatMessage({
                          defaultMessage:
                            "reduce reliance on external contractors",
                          id: "fCgDxi",
                          description: "an item in a list of fund objectives",
                        })}
                      </li>
                      <li>
                        {intl.formatMessage({
                          defaultMessage:
                            "equip IT employees to drive digital transformation",
                          id: "3I8R7b",
                          description: "an item in a list of fund objectives",
                        })}
                      </li>
                    </Ul>
                  </CardFlat>
                </div>
                <div>
                  <CardFlat
                    color="primary"
                    title={intl.formatMessage({
                      defaultMessage: "Employee eligibility",
                      id: "3deIgM",
                      description: "Heading for the employee eligibility card",
                    })}
                  >
                    <p>
                      {intl.formatMessage({
                        defaultMessage:
                          "Training opportunities supported by the fund are available to IT-classified employees covered by the IT collective agreement. Both employees represented by the Professional Institute of the Public Service of Canada (PIPSC) and unrepresented employees may access training. Employees represented by PIPSC will have priority when spaces are limited.",
                        id: "oY+SWP",
                        description:
                          "Description for the employee eligibility card",
                      })}
                    </p>
                  </CardFlat>
                </div>
                <div>
                  <CardFlat
                    color="error"
                    title={intl.formatMessage({
                      defaultMessage: "Fund management",
                      id: "/ANsjm",
                      description: "Heading for the fund management card",
                    })}
                  >
                    <p>
                      {intl.formatMessage({
                        defaultMessage:
                          "The management of the fund is the responsibility of the Interdepartmental Joint Consultation Committee, co-chaired by the Office of the Chief Information Officer and the PIPSC IT group.",
                        id: "fKQsbL",
                        description: "Description for the fund management card",
                      })}
                    </p>
                  </CardFlat>
                </div>
              </div>
            </div>
            {/* Three types of learning opportunities */}
            <div
              data-h2-display="base(flex)"
              data-h2-flex-direction="base(column)"
              data-h2-gap="base(x1.5)"
            >
              <Heading
                icon={LightBulbIcon}
                size="h2"
                color="warning"
                data-h2-margin="base(0)"
                data-h2-font-weight="base(400)"
              >
                {intl.formatMessage({
                  defaultMessage: "Three types of learning opportunities",
                  id: "Zewopw",
                  description:
                    "Heading for section describing learning opportunities",
                })}
              </Heading>
              <p>
                {intl.formatMessage({
                  defaultMessage:
                    "The fund offers 3 types of training programs to IT employees.",
                  id: "4CpKXN",
                  description:
                    "First paragraph describing learning opportunities",
                })}
              </p>
              <div
                data-h2-display="base(grid)"
                data-h2-grid-template-columns="base(1fr) p-tablet(repeat(2, minmax(0, 1fr))) l-tablet(repeat(3, minmax(0, 1fr)))"
                data-h2-gap="base(x1)"
              >
                <Card
                  data-h2-overflow="base(hidden)"
                  data-h2-padding="base(0)"
                  data-h2-display="base(flex)"
                  data-h2-flex-direction="base(column)"
                >
                  <div
                    data-h2-display="base(block) base:children[>span](block)"
                    data-h2-padding="base(x1)"
                    data-h2-background-color="base(gray.darkest) base:dark(foreground.shade)"
                    data-h2-color="base:all(white)"
                  >
                    <Heading
                      level="h3"
                      size="h2"
                      data-h2-font-size="base(h6)"
                      data-h2-margin="base(0, 0, x0.25, 0)"
                    >
                      {intl.formatMessage({
                        defaultMessage: "1. Online self-paced learning",
                        id: "mdIHDc",
                        description: "Title for an online learning card",
                      })}
                    </Heading>
                  </div>
                  <div
                    data-h2-display="base(flex)"
                    data-h2-flex-direction="base(column)"
                    data-h2-justify-content="base(space-between)"
                    data-h2-flex-grow="base(1)"
                  >
                    <img
                      src={image1}
                      alt=""
                      data-h2-display="base(none) p-tablet(block)"
                    />
                    <div
                      data-h2-padding="base(x1)"
                      data-h2-flex-grow="base(1)"
                      data-h2-display="base(flex)"
                      data-h2-flex-direction="base(column)"
                      data-h2-gap="base(x1)"
                    >
                      <Ul space="xl" noIndent>
                        <li>
                          {intl.formatMessage({
                            defaultMessage:
                              "<strong>What it is</strong>: On-demand courses that allow you to learn whenever it suits you, covering both technical and behavioural skills.",
                            id: "5fnoWK",
                            description:
                              "An item in a list of points about online learning",
                          })}
                        </li>
                        <li>
                          {intl.formatMessage({
                            defaultMessage:
                              "<strong>Who it is for</strong>: Open to all eligible IT-classified employees looking to improve their skills, regardless of their role or experience.",
                            id: "5eTpEJ",
                            description:
                              "An item in a list of points about online learning",
                          })}
                        </li>
                        <li>
                          {intl.formatMessage({
                            defaultMessage:
                              "<strong>How to access it</strong>: Available through Navigar, a smart online skills development tool. All eligible IT-classified employees will receive their Navigar account activation email.",
                            id: "jT46zb",
                            description:
                              "An item in a list of points about online learning",
                          })}
                        </li>
                      </Ul>
                    </div>
                    <div data-h2-padding="base(x1)">
                      <Link
                        mode="text"
                        data-h2-font-weight="base(bold)"
                        external
                        href={navigarUrl[locale]}
                        data-h2-flex-grow="base(2)"
                        data-h2-justify-content="base(end)"
                      >
                        {intl.formatMessage({
                          defaultMessage:
                            "For more information, go to navigar.ca",
                          id: "LqDVSD",
                          description: "A link to a tool named Navigar",
                        })}
                      </Link>
                    </div>
                  </div>
                </Card>

                <Card
                  data-h2-overflow="base(hidden)"
                  data-h2-padding="base(0)"
                  data-h2-display="base(flex)"
                  data-h2-flex-direction="base(column)"
                >
                  <div
                    data-h2-display="base(block) base:children[>span](block)"
                    data-h2-padding="base(x1)"
                    data-h2-background-color="base(gray.darkest) base:dark(foreground.shade)"
                    data-h2-color="base:all(white)"
                  >
                    <Heading
                      level="h3"
                      size="h2"
                      data-h2-font-size="base(h6)"
                      data-h2-margin="base(0, 0, x0.25, 0)"
                    >
                      {intl.formatMessage({
                        defaultMessage:
                          "2. Instructor-led classes and bootcamps",
                        id: "tj5pn8",
                        description: "Title for instructor-led classes card",
                      })}
                    </Heading>
                  </div>
                  <div
                    data-h2-display="base(flex)"
                    data-h2-flex-direction="base(column)"
                    data-h2-justify-content="base(space-between)"
                    data-h2-flex-grow="base(1)"
                  >
                    <div>
                      <img
                        src={image2}
                        alt=""
                        data-h2-display="base(none) p-tablet(block)"
                      />

                      <div
                        data-h2-padding="base(x1)"
                        data-h2-flex-grow="base(1)"
                        data-h2-display="base(flex)"
                        data-h2-flex-direction="base(column)"
                        data-h2-gap="base(x1)"
                      >
                        <Ul space="xl" noIndent>
                          <li>
                            {intl.formatMessage({
                              defaultMessage:
                                "<strong>What it is</strong>: Scheduled, interactive training led by experts, designed to offer you a deep dive into key IT topics, such as cybersecurity, cloud computing, and more.",
                              id: "be2aA/",
                              description:
                                "An item in a list of points about instructor-led classes",
                            })}
                          </li>
                          <li>
                            {intl.formatMessage({
                              defaultMessage:
                                "<strong>Who it is for</strong>: All eligible IT-classified employees who prefer structured learning and want to gain or deepen expertise in specific high-demand areas.",
                              id: "CDO5vW",
                              description:
                                "An item in a list of points about instructor-led classes",
                            })}
                          </li>
                          <li>
                            {intl.formatMessage({
                              defaultMessage:
                                "<strong>How to apply</strong>: Spaces are limited. You need to apply and meet the prerequisites to participate.",
                              id: "BlFUsz",
                              description:
                                "An item in a list of points about instructor-led classes",
                            })}
                          </li>
                        </Ul>
                      </div>
                      <div data-h2-padding="base(x1)">
                        <Link
                          mode="text"
                          data-h2-font-weight="base(bold)"
                          data-h2-padding-bottom="base(x1)"
                          data-h2-display="base(block)"
                          external
                          href={paths.instructorLedTraining()}
                        >
                          {intl.formatMessage({
                            defaultMessage: "Browse training opportunities",
                            id: "alKxbI",
                            description: "A link to sign up for updates",
                          })}
                        </Link>
                        <Link
                          mode="text"
                          data-h2-font-weight="base(bold)"
                          data-h2-display="base(block)"
                          external
                          href={signUpUrl[locale]}
                        >
                          {intl.formatMessage({
                            defaultMessage:
                              "Sign up for updates<hidden> about instructor-led classes and bootcamps</hidden>",
                            id: "Tj1iyN",
                            description: "A link to sign up for updates",
                          })}
                        </Link>
                      </div>
                    </div>
                  </div>
                </Card>

                <Card
                  data-h2-overflow="base(hidden)"
                  data-h2-padding="base(0)"
                  data-h2-display="base(flex)"
                  data-h2-flex-direction="base(column)"
                >
                  <div
                    data-h2-display="base(block) base:children[>span](block)"
                    data-h2-padding="base(x1)"
                    data-h2-background-color="base(gray.darkest) base:dark(foreground.shade)"
                    data-h2-color="base:all(white)"
                  >
                    <Heading
                      level="h3"
                      size="h2"
                      data-h2-font-size="base(h6)"
                      data-h2-margin="base(0, 0, x0.25, 0)"
                    >
                      {intl.formatMessage({
                        defaultMessage: "3. Certification exam vouchers",
                        id: "vfXTEA",
                        description: "Title for cert exam card",
                      })}
                    </Heading>
                  </div>
                  <div
                    data-h2-display="base(flex)"
                    data-h2-flex-direction="base(column)"
                    data-h2-justify-content="base(space-between)"
                    data-h2-flex-grow="base(1)"
                  >
                    <img
                      src={image3}
                      alt=""
                      data-h2-display="base(none) p-tablet(block)"
                    />

                    <div
                      data-h2-padding="base(x1)"
                      data-h2-flex-grow="base(1)"
                      data-h2-display="base(flex)"
                      data-h2-flex-direction="base(column)"
                      data-h2-gap="base(x1)"
                    >
                      <Ul space="xl" noIndent>
                        <li>
                          {intl.formatMessage({
                            defaultMessage:
                              "<strong>What it is</strong>: Vouchers for online industry-recognized certification exams that validate your skills in key IT areas with recognized credentials.",
                            id: "Vck6JW",
                            description:
                              "An item in a list of points about cert exams",
                          })}
                        </li>
                        <li>
                          {intl.formatMessage({
                            defaultMessage:
                              "<strong>Who it is for</strong>: IT-classified employees seeking to enhance their qualifications and career growth.",
                            id: "ixxGIm",
                            description:
                              "An item in a list of points about cert exams",
                          })}
                        </li>
                        <li>
                          {intl.formatMessage({
                            defaultMessage:
                              "<strong>How to apply</strong>: Access is limited. You need to request a voucher and meet the prerequisites.",
                            id: "vmVdJt",
                            description:
                              "An item in a list of points about cert exams",
                          })}
                        </li>
                      </Ul>
                    </div>
                    <div data-h2-padding="base(x1)">
                      <Link
                        mode="text"
                        data-h2-font-weight="base(bold)"
                        external
                        href={paths.certificationExamVouchers()}
                      >
                        {intl.formatMessage({
                          defaultMessage: "Request a voucher",
                          id: "erzpFY",
                          description:
                            "Link text to request a voucher (infinitive)",
                        })}
                      </Link>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

Component.displayName = "ItTrainingFundPage";

export default Component;
