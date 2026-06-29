import { defineMessage, useIntl } from "react-intl";
import MapIcon from "@heroicons/react/24/outline/MapIcon";
import BookmarkSquareIcon from "@heroicons/react/24/outline/BookmarkSquareIcon";
import LightBulbIcon from "@heroicons/react/24/outline/LightBulbIcon";
import type { ReactNode } from "react";

import {
  Card,
  CardFlat,
  Container,
  Heading,
  Image,
  Link,
  Ul,
} from "@gc-digital-talent/ui";
import { getLocale } from "@gc-digital-talent/i18n";

import Hero from "~/components/Hero";
import useBreadcrumbs from "~/hooks/useBreadcrumbs";
import useRoutes from "~/hooks/useRoutes";
import image1 from "~/assets/img/person-looking-at-laptop-external-monitor.webp";
import image2 from "~/assets/img/person-in-plaid-smiling.webp";
import image3 from "~/assets/img/person-typing-at-computer.webp";
import SEO from "~/components/SEO/SEO";
import pageTitles from "~/messages/pageTitles";

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

  /* no French version available */
  const navigarLink = (chunks: ReactNode) => (
    <Link external href="https://app.navigar.ca/home">
      {chunks}
    </Link>
  );

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
      <Container className="my-18">
        {/* Investing in the future of IT talent */}
        <Heading
          icon={MapIcon}
          size="h2"
          color="secondary"
          className="mt-0 mb-9 font-normal"
        >
          {intl.formatMessage({
            defaultMessage: "Investing in the future of IT talent",
            id: "v6/BRI",
            description:
              "Heading for section describing investing in future talent",
          })}
        </Heading>
        <p className="mb-6">
          {intl.formatMessage({
            defaultMessage:
              "The Government of Canada is committed to supporting the development of its IT professionals. With the IT Community Training and Development Fund, eligible IT-classified employees now have increased access to a wide range of learning opportunities to build and deepen their IT skills.",
            id: "8TZbgw",
            description:
              "First paragraph describing investing in future talent",
          })}
        </p>
        {/* What is the IT Community Training and Development Fund? */}
        <Heading
          icon={BookmarkSquareIcon}
          size="h2"
          color="error"
          className="mt-18 font-normal"
        >
          {intl.formatMessage({
            defaultMessage:
              "What is the IT Community Training and Development Fund?",
            id: "8p4ty0",
            description: "Heading for section describing the training fund",
          })}
        </Heading>
        <p className="my-9">
          {intl.formatMessage({
            defaultMessage:
              "The IT Community Training and Development Fund supports enterprise wide professional development for the Government of Canada’s IT workforce. Established in December 2023, the fund provides an annual allocation of $4.725 million to enable training and skills development opportunities across the federal public service.",
            id: "2lsIjY",
            description: "First paragraph describing the training fund",
          })}
        </p>
        <div className="my-9 grid items-start gap-12 xs:grid-cols-2 xs:gap-18 sm:grid-cols-3">
          <CardFlat
            color="warning"
            title={intl.formatMessage({
              defaultMessage: "Objectives of the fund",
              id: "y3+Iw5",
              description: "Heading for the fund objectives card",
            })}
          >
            <p className="mb-3">
              {intl.formatMessage({
                defaultMessage:
                  "The fund is intended to complement departmental training budgets by providing additional, consistent, and high-quality training opportunities that:",
                id: "1lw0Uw",
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
                  defaultMessage: "reduce reliance on external contractors",
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
                  "Training opportunities supported by the fund are available to IT-classified employees. Both employees represented by the Professional Institute of the Public Service of Canada (PIPSC) and unrepresented employees may access training. Employees represented by PIPSC will have priority when spaces are limited.",
                id: "L8riJd",
                description: "Description for the employee eligibility card",
              })}
            </p>
          </CardFlat>
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
                  "The management of the fund is the responsibility of the Interdepartmental Joint Consultation Committee (IJCC), co-chaired by the Office of the Chief Information Officer (OCIO) and the PIPSC IT group.",
                id: "KuNZB9",
                description: "Description for the fund management card",
              })}
            </p>
          </CardFlat>
        </div>
        {/* Three types of learning opportunities */}
        <Heading
          icon={LightBulbIcon}
          size="h2"
          color="warning"
          className="mt-18 font-normal"
        >
          {intl.formatMessage({
            defaultMessage: "Three types of learning opportunities",
            id: "Zewopw",
            description:
              "Heading for section describing learning opportunities",
          })}
        </Heading>
        <p className="my-9">
          {intl.formatMessage({
            defaultMessage:
              "The fund offers 3 types of training programs to IT employees.",
            id: "4CpKXN",
            description: "First paragraph describing learning opportunities",
          })}
        </p>
        <div className="grid gap-6 xs:grid-cols-2 sm:grid-cols-3">
          <Card className="flex flex-col overflow-hidden p-0">
            <div className="block bg-gray-700 p-6 text-white [&>span]:block">
              <Heading level="h3" size="h6" className="mt-0 mb-1.5">
                {intl.formatMessage({
                  defaultMessage: "1. Online self-paced learning",
                  id: "mdIHDc",
                  description: "Title for an online learning card",
                })}
              </Heading>
            </div>
            <div className="flex grow flex-col justify-between">
              <Image
                width={400}
                height={300}
                loading="lazy"
                src={image1}
                alt=""
                className="hidden xs:block"
              />
              <div className="flex grow flex-col gap-6 p-6">
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
                    {intl.formatMessage(
                      {
                        defaultMessage:
                          "<strong>How to access it</strong>: Available through Navigar, a smart online skills development tool. If you haven't already, you can activate your account by accessing the <link>Navigar homepage</link>.",
                        id: "y0jr2a",
                        description:
                          "An item in a list of points about online learning",
                      },
                      {
                        link: navigarLink,
                      },
                    )}
                  </li>
                </Ul>
              </div>
              <div className="p-6">
                <Link
                  mode="text"
                  external
                  href={navigarUrl[locale]}
                  className="grow-2 justify-end font-bold"
                >
                  {intl.formatMessage({
                    defaultMessage: "For more information, go to navigar.ca",
                    id: "LqDVSD",
                    description: "A link to a tool named Navigar",
                  })}
                </Link>
              </div>
            </div>
          </Card>
          <Card className="flex flex-col overflow-hidden p-0">
            <div className="block bg-gray-700 p-6 text-white [&>span]:block">
              <Heading level="h3" size="h6" className="mt-0 mb-1.5">
                {intl.formatMessage({
                  defaultMessage: "2. Instructor-led classes and bootcamps",
                  id: "tj5pn8",
                  description: "Title for instructor-led classes card",
                })}
              </Heading>
            </div>
            <div className="flex grow flex-col justify-between">
              <div>
                <Image
                  width={400}
                  height={300}
                  loading="lazy"
                  src={image2}
                  alt=""
                  className="hidden xs:block"
                />
                <div className="flex grow flex-col gap-6 p-6">
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
                          "<strong>Who it is for</strong>: All eligible IT-classified employees who want to gain or deepen expertise in specific high-demand areas.",
                        id: "5JByxj",
                        description:
                          "An item in a list of points about instructor-led classes",
                      })}
                    </li>
                    <li>
                      {intl.formatMessage({
                        defaultMessage:
                          "<strong>How to apply</strong>: Spaces are limited. To be considered, you must submit an application and meet all eligibility requirements and any prerequisites.",
                        id: "MiiHtw",
                        description:
                          "An item in a list of points about instructor-led classes",
                      })}
                    </li>
                  </Ul>
                </div>
                <div className="p-6">
                  <Link
                    mode="text"
                    className="mb-6 block font-bold"
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
                    className="block font-bold"
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
          <Card className="flex flex-col overflow-hidden p-0">
            <div className="block bg-gray-700 p-6 text-white [&>span]:block">
              <Heading level="h3" size="h6" className="mt-0 mb-1.5">
                {intl.formatMessage({
                  defaultMessage: "3. Certification exam vouchers",
                  id: "vfXTEA",
                  description: "Title for cert exam card",
                })}
              </Heading>
            </div>
            <div className="flex grow flex-col justify-between">
              <Image
                width={400}
                height={300}
                loading="lazy"
                src={image3}
                alt=""
                className="hidden xs:block"
              />
              <div className="flex grow flex-col gap-6 p-6">
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
                        "<strong>Who it is for</strong>: All eligible IT-classified employees seeking to enhance their qualifications and career growth.",
                      id: "1yCxmK",
                      description:
                        "An item in a list of points about cert exams",
                    })}
                  </li>
                  <li>
                    {intl.formatMessage({
                      defaultMessage:
                        "<strong>How to apply</strong>: To be considered, you must submit an application and meet all eligibility requirements. You must be prepared to write the exam within 60 days of submitting your application.",
                      id: "nkbzX2",
                      description:
                        "An item in a list of points about cert exams",
                    })}
                  </li>
                </Ul>
              </div>
              <div className="p-6">
                <Link
                  mode="text"
                  external
                  href={paths.certificationExamVouchers()}
                  className="font-bold"
                >
                  {intl.formatMessage({
                    defaultMessage: "Request a voucher",
                    id: "erzpFY",
                    description: "Link text to request a voucher (infinitive)",
                  })}
                </Link>
              </div>
            </div>
          </Card>
        </div>
      </Container>
    </>
  );
};

Component.displayName = "ItTrainingFundPage";

export default Component;
