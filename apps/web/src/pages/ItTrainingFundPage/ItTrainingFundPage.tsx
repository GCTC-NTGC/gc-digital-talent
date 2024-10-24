import { defineMessage, useIntl } from "react-intl";
import MapIcon from "@heroicons/react/24/outline/MapIcon";
import BookmarkSquareIcon from "@heroicons/react/24/outline/BookmarkSquareIcon";
import LightBulbIcon from "@heroicons/react/24/outline/LightBulbIcon";
import { ReactNode } from "react";

import { CardBasic, CardFlat, Heading, Link } from "@gc-digital-talent/ui";
import { getLocale } from "@gc-digital-talent/i18n";

import Hero from "~/components/Hero";
import useBreadcrumbs from "~/hooks/useBreadcrumbs";
import useRoutes from "~/hooks/useRoutes";
import image1 from "~/assets/img/it-training-fund-1.webp";
import image2 from "~/assets/img/it-training-fund-2.webp";
import image3 from "~/assets/img/it-training-fund-3.webp";

const externalLinkAccessor = (href: string, chunks: ReactNode) => {
  return (
    <Link href={href} color="secondary" external>
      <strong>{chunks}</strong>
    </Link>
  );
};

const pageTitle = defineMessage({
  defaultMessage: "IT Community Training and Development Fund",
  id: "wOITol",
  description: "page title for the IT training fund page",
});

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
                Icon={MapIcon}
                size="h2"
                color="primary"
                data-h2-margin="base(0, 0, x1.5, 0)"
              >
                {intl.formatMessage({
                  defaultMessage: "Investing in the future of IT talent",
                  id: "v6/BRI",
                  description:
                    "Heading for section describing investing in future talent",
                })}
              </Heading>
              <p>
                {intl.formatMessage({
                  defaultMessage:
                    "The Government of Canada is committed to supporting the development of its IT professionals. With the <strong>IT Community Training and Development Fund</strong>, employees represented by Professional Institute of the Public Service of Canada (PIPSC) in the IT group now have increased access to a wide range of learning opportunities to build and deepen their IT skills.",
                  id: "uNM0+t",
                  description:
                    "First paragraph describing investing in future talent",
                })}
              </p>
            </div>
            {/* What is the IT Community Training and Development Fund? */}
            <div
              data-h2-display="base(flex)"
              data-h2-flex-direction="base(column)"
              data-h2-gap="base(x1.5)"
            >
              <Heading
                Icon={BookmarkSquareIcon}
                size="h2"
                color="tertiary"
                data-h2-margin="base(0)"
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
                      "The IT Training and Development Fund is a financial commitment to support the professional growth of the Government of Canada's IT staff. It was established under the <link>IT collective agreement</link> signed between PIPSC’s IT Group and the Treasury Board of Canada Secretariat in December 2023. The Fund allocates $4.725 million each year for training and development for the duration of the agreement.",
                    id: "dFzEKi",
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
                  },
                )}
              </p>
              <div
                data-h2-display="base(grid)"
                data-h2-grid-template-columns="base(1fr) p-tablet(repeat(2, minmax(0, 1fr))) l-tablet(repeat(3, minmax(0, 1fr)))"
                data-h2-gap="base(x2) p-tablet(x3)"
              >
                <CardFlat
                  color="quaternary"
                  title={intl.formatMessage({
                    defaultMessage: "Objectives of the Fund",
                    id: "R9jFeX",
                    description: "Heading for the fund objectives card",
                  })}
                >
                  <p data-h2-margin-bottom="base(x0.5)">
                    {intl.formatMessage({
                      defaultMessage:
                        "The goal is to deliver additional comprehensive, consistent, and high-quality training opportunities to:",
                      id: "VmXu0a",
                      description: "title for a list of fund objectives",
                    })}
                  </p>
                  <ul
                    data-h2-padding="base(0 0 0 x0.75)"
                    data-h2-margin-bottom="base:children[:not(:last-child)](x0.5)"
                  >
                    <li>
                      {intl.formatMessage({
                        defaultMessage: "close critical skills gaps",
                        id: "DeFQGH",
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
                  </ul>
                </CardFlat>
                <CardFlat
                  color="secondary"
                  title={intl.formatMessage({
                    defaultMessage: "Employee eligibility",
                    id: "3deIgM",
                    description: "Heading for the employee eligibility card",
                  })}
                >
                  <p>
                    {intl.formatMessage({
                      defaultMessage:
                        "Training opportunities supported by the Fund are only available to employees represented by PIPSC in the IT group. This includes IT05 individual contributors but not IT05 directors who aren’t represented. The training is not available to employees whose substantive position is not classified as IT.",
                      id: "vF2OFC",
                      description:
                        "Description for the employee eligibility card",
                    })}
                  </p>
                </CardFlat>
                <CardFlat
                  color="tertiary"
                  title={intl.formatMessage({
                    defaultMessage: "Fund management",
                    id: "/ANsjm",
                    description: "Heading for the fund management card",
                  })}
                >
                  <p>
                    {intl.formatMessage({
                      defaultMessage:
                        "The management of the Fund is the responsibility of the Interdepartmental Joint Consultation Committee (IJCC), co-chaired by the Office of the Chief Information Officer (OCIO) and PIPSC’s IT Group.",
                      id: "x/bqCj",
                      description: "Description for the fund management card",
                    })}
                  </p>
                </CardFlat>
              </div>
            </div>
            {/* Three types of learning opportunities */}
            <div
              data-h2-display="base(flex)"
              data-h2-flex-direction="base(column)"
              data-h2-gap="base(x1.5)"
            >
              <Heading
                Icon={LightBulbIcon}
                size="h2"
                color="quaternary"
                data-h2-margin="base(0)"
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
                    "The Fund offers 3 types of training programs to IT employees.",
                  id: "nxTNzG",
                  description:
                    "First paragraph describing learning opportunities",
                })}
              </p>
              <div
                data-h2-display="base(grid)"
                data-h2-grid-template-columns="base(1fr) p-tablet(repeat(2, minmax(0, 1fr))) l-tablet(repeat(3, minmax(0, 1fr)))"
                data-h2-gap="base(x1)"
              >
                <CardBasic
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
                    <span data-h2-font-size="base(h6, 1)">
                      {intl.formatMessage({
                        defaultMessage: "1. Online self-paced learning",
                        id: "mdIHDc",
                        description: "Title for an online learning card",
                      })}
                    </span>
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
                      <p>
                        <strong>
                          {intl.formatMessage({
                            defaultMessage: "Available now",
                            id: "L6MPML",
                            description:
                              "Statement that something is available now",
                          })}
                        </strong>
                      </p>
                      <ul
                        data-h2-padding="base(0 0 0 x0.75)"
                        data-h2-margin-bottom="base:children[:not(:last-child)](x1)"
                      >
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
                              "<strong>Who it is for</strong>: Open to all eligible IT classified employees looking to improve their skills, regardless of role or experience.",
                            id: "hPGsCr",
                            description:
                              "An item in a list of points about online learning",
                          })}
                        </li>
                        <li>
                          {intl.formatMessage({
                            defaultMessage:
                              "<strong>How to access it</strong>: Through Navigar, a smart online skills development tool. All eligible IT employees are expected to receive their Navigar login information by email.",
                            id: "Kx5aMY",
                            description:
                              "An item in a list of points about online learning",
                          })}
                        </li>
                      </ul>
                    </div>
                    <div data-h2-padding="base(x1)">
                      <Link
                        mode="text"
                        data-h2-font-weight="base(bold)"
                        color="secondary"
                        external
                        href="https://navigar.ca/"
                        data-h2-flex-grow="base(2)"
                        data-h2-justify-content="base(end)"
                      >
                        {intl.formatMessage({
                          defaultMessage: "Go to Navigar",
                          id: "umrfZq",
                          description: "A link to a tool named Navigar",
                        })}
                      </Link>
                    </div>
                  </div>
                </CardBasic>

                <CardBasic
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
                    <span data-h2-font-size="base(h6, 1)">
                      {intl.formatMessage({
                        defaultMessage:
                          "2. Instructor-led classes and bootcamps",
                        id: "tj5pn8",
                        description: "Title for instructor-led classes card",
                      })}
                    </span>
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
                        <p>
                          <strong>
                            {intl.formatMessage({
                              defaultMessage: "Coming Winter 2024/2025",
                              id: "RYv6yd",
                              description:
                                "Statement that something will be available in the future",
                            })}
                          </strong>
                        </p>
                        <ul
                          data-h2-padding="base(0 0 0 x0.75)"
                          data-h2-margin-bottom="base:children[:not(:last-child)](x1)"
                        >
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
                                "<strong>Who it is for</strong>: All eligible IT classified employees who prefer structured learning and want to gain or deepen expertise in specific high-demand areas.",
                              id: "H8Aw1b",
                              description:
                                "An item in a list of points about instructor-led classes",
                            })}
                          </li>
                          <li>
                            {intl.formatMessage({
                              defaultMessage:
                                "<strong>How to apply</strong>: Spaces will be limited. You'll need to apply and meet the prerequisites to participate. Information will be posted on GC Digital Talent as opportunities become available in Winter 2024/2025.",
                              id: "enA2zV",
                              description:
                                "An item in a list of points about instructor-led classes",
                            })}
                          </li>
                        </ul>
                      </div>
                      <div data-h2-padding="base(x1)">
                        <Link
                          mode="text"
                          data-h2-font-weight="base(bold)"
                          color="secondary"
                          external
                          href="#"
                        >
                          {intl.formatMessage({
                            defaultMessage: "Sign up for updates",
                            id: "339yzW",
                            description: "A link to sign up for updates",
                          })}
                        </Link>
                      </div>
                    </div>
                  </div>
                </CardBasic>

                <CardBasic
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
                    <span data-h2-font-size="base(h6, 1)">
                      {intl.formatMessage({
                        defaultMessage: "3. Certification exam vouchers",
                        id: "vfXTEA",
                        description: "Title for cert exam card",
                      })}
                    </span>
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
                      <p>
                        <strong>
                          {intl.formatMessage({
                            defaultMessage: "Coming Winter 2024/2025",
                            id: "RYv6yd",
                            description:
                              "Statement that something will be available in the future",
                          })}
                        </strong>
                      </p>
                      <ul
                        data-h2-padding="base(0 0 0 x0.75)"
                        data-h2-margin-bottom="base:children[:not(:last-child)](x1)"
                      >
                        <li>
                          {intl.formatMessage({
                            defaultMessage:
                              "<strong>What it is</strong>: Vouchers for online industry-recognized certification exams that validate your skills with recognized credentials.",
                            id: "i0spVx",
                            description:
                              "An item in a list of points about cert exams",
                          })}
                        </li>
                        <li>
                          {intl.formatMessage({
                            defaultMessage:
                              "<strong>Who it is for</strong>: IT classified employees  seeking to enhance their qualifications and career growth.",
                            id: "YZs3Ph",
                            description:
                              "An item in a list of points about cert exams",
                          })}
                        </li>
                        <li>
                          {intl.formatMessage({
                            defaultMessage:
                              "<strong>How to apply</strong>: Access will be limited. You'll need to apply and meet the prerequisites. Information will be posted on GC Digital Talent as opportunities become available in Winter 2024/2025.",
                            id: "G5Yai+",
                            description:
                              "An item in a list of points about cert exams",
                          })}
                        </li>
                      </ul>
                    </div>
                    <div data-h2-padding="base(x1)">
                      <Link
                        mode="text"
                        data-h2-font-weight="base(bold)"
                        color="secondary"
                        external
                        href="#"
                      >
                        {intl.formatMessage({
                          defaultMessage: "Sign up for updates",
                          id: "339yzW",
                          description: "A link to sign up for updates",
                        })}
                      </Link>
                    </div>
                  </div>
                </CardBasic>
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
