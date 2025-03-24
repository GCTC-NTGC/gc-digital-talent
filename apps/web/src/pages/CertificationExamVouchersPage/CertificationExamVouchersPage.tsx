import { defineMessage, useIntl } from "react-intl";
import { ReactNode } from "react";
import InformationCircleIcon from "@heroicons/react/24/outline/InformationCircleIcon";
import LightBulbIcon from "@heroicons/react/24/outline/LightBulbIcon";
import ClipboardIcon from "@heroicons/react/24/outline/ClipboardIcon";
import UserCircleIcon from "@heroicons/react/24/outline/UserCircleIcon";
import QuestionMarkCircleIcon from "@heroicons/react/24/outline/QuestionMarkCircleIcon";
import TicketIcon from "@heroicons/react/24/outline/TicketIcon";

import { Heading, Link } from "@gc-digital-talent/ui";
import { getLocale } from "@gc-digital-talent/i18n";

import useRoutes from "~/hooks/useRoutes";
import SEO from "~/components/SEO/SEO";
import Hero from "~/components/Hero";
import useBreadcrumbs from "~/hooks/useBreadcrumbs";
import pageTitles from "~/messages/pageTitles";

const itLink = (href: string, chunks: ReactNode) => {
  return (
    <Link href={href} color="secondary" data-h2-font-weight="base(bold)">
      {chunks}
    </Link>
  );
};

const mailLink = (chunks: ReactNode) => (
  <Link href="mailto:icommunity-icollectivite@tbs-sct.gc.ca">{chunks}</Link>
);

const requestAVoucherUrl = {
  en: "https://forms-formulaires.alpha.canada.ca/en/id/cm5ffyomv00jtsdyfv7pt4qu9",
  fr: "https://forms-formulaires.alpha.canada.ca/fr/id/cm5ffyomv00jtsdyfv7pt4qu9",
} as const;

const pageSubtitle = defineMessage({
  defaultMessage: "Validate your skills in key IT areas by becoming certified.",
  id: "YZtE49",
  description: "Page subtitle for certification exam vouchers page",
});

export const Component = () => {
  const intl = useIntl();
  const locale = getLocale(intl);
  const paths = useRoutes();

  const crumbs = useBreadcrumbs({
    crumbs: [
      {
        label: intl.formatMessage(pageTitles.itTrainingFund),
        url: paths.itTrainingFund(),
      },
      {
        label: intl.formatMessage(pageTitles.certificationExamVouchers),
        url: paths.certificationExamVouchers(),
      },
    ],
  });

  return (
    <>
      <SEO
        title={intl.formatMessage(pageTitles.certificationExamVouchers)}
        description={intl.formatMessage(pageSubtitle)}
      />
      <Hero
        title={intl.formatMessage(pageTitles.certificationExamVouchers)}
        subtitle={intl.formatMessage(pageSubtitle)}
        crumbs={crumbs}
        buttonLinks={[
          {
            icon: TicketIcon,
            text: intl.formatMessage({
              defaultMessage: "Request a voucher",
              id: "yGtIgV",
              description: "Link text to request a voucher",
            }),
            url: requestAVoucherUrl[locale],
            color: "quaternary",
          },
        ]}
      />
      <div data-h2-padding="base(x3, 0)">
        <div data-h2-wrapper="base(center, large, x1) p-tablet(center, large, x2)">
          <div data-h2-margin-bottom="base(x3)">
            <Heading
              size="h3"
              Icon={InformationCircleIcon}
              color="primary"
              data-h2-margin-bottom="base(x1)"
            >
              {intl.formatMessage({
                defaultMessage: "About the certification exam vouchers",
                id: "Z8uO3k",
                description: "Title for certification exam vouchers section",
              })}
            </Heading>
            <p data-h2-margin-bottom="base(x.5)">
              {intl.formatMessage({
                defaultMessage:
                  "Take advantage of available vouchers for industry-recognized certification exams intended for eligible Government of Canada IT employees. These vouchers help you enhance your qualifications and advance your career.",
                id: "rYYqbv",
                description:
                  "First paragraph of certification exam vouchers section",
              })}
            </p>
            <p>
              {intl.formatMessage(
                {
                  defaultMessage:
                    "The <link>IT Community Training and Development Fund</link> helps you become certified by paying for your certification exams.",
                  id: "gIvlZk",
                  description:
                    "Second paragraph of certification exam vouchers section",
                },
                {
                  link: (chunks: ReactNode) =>
                    itLink(paths.itTrainingFund(), chunks),
                },
              )}
            </p>
          </div>
          <div data-h2-margin-bottom="base(x3)">
            <Heading
              size="h3"
              Icon={LightBulbIcon}
              color="secondary"
              data-h2-margin-bottom="base(x1)"
            >
              {intl.formatMessage({
                defaultMessage: "Certification topics",
                id: "Qn8C+Z",
                description: "Title for certification topics section",
              })}
            </Heading>
            <p data-h2-margin-bottom="base(x.5)">
              {intl.formatMessage({
                defaultMessage:
                  "You can request vouchers for many IT certifications. Here are some examples of certifications for which you can get a voucher:",
                id: "15nKPJ",
                description: "First paragraph of certification topics section",
              })}
            </p>
            <p data-h2-margin-bottom="base(x.5)">
              <ul>
                <li data-h2-margin-top="base(x.25)">
                  {intl.formatMessage({
                    defaultMessage: "IT project management",
                    id: "ZiCXd1",
                    description:
                      "First item in list of certification topics section",
                  })}
                </li>
                <li data-h2-margin-top="base(x.25)">
                  {intl.formatMessage({
                    defaultMessage: "business analysis",
                    id: "awyksR",
                    description:
                      "Second item in list of certification topics section",
                  })}
                </li>
                <li data-h2-margin-top="base(x.25)">
                  {intl.formatMessage({
                    defaultMessage: "cloud computing",
                    id: "vYigGH",
                    description:
                      "Third item in list of certification topics section",
                  })}
                </li>
                <li data-h2-margin-top="base(x.25)">
                  {intl.formatMessage({
                    defaultMessage: "cyber security",
                    id: "9oUpdh",
                    description:
                      "Fourth item in list of certification topics section",
                  })}
                </li>
                <li data-h2-margin-top="base(x.25)">
                  {intl.formatMessage({
                    defaultMessage: "enterprise architecture",
                    id: "yOii5k",
                    description:
                      "Fifth item in list of certification topics section",
                  })}
                </li>
                <li data-h2-margin-top="base(x.25)">
                  {intl.formatMessage({
                    defaultMessage: "DevOps",
                    id: "zeLVU6",
                    description:
                      "Sixth item in list of certification topics section",
                  })}
                </li>
                <li data-h2-margin-top="base(x.25)">
                  {intl.formatMessage({
                    defaultMessage: "networking",
                    id: "+UjXSM",
                    description:
                      "Seventh item in list of certification topics section",
                  })}
                </li>
              </ul>
            </p>
            <p data-h2-margin-bottom="base(x.5)">
              {intl.formatMessage({
                defaultMessage:
                  "Let us know which certification exam you'd like to take, and we'll assess your application.",
                id: "yu4wqa",
                description: "Second paragraph of certification topics section",
              })}
            </p>
          </div>
          <div data-h2-margin-bottom="base(x3)">
            <Heading
              size="h3"
              Icon={ClipboardIcon}
              color="tertiary"
              data-h2-margin-bottom="base(x1)"
            >
              {intl.formatMessage({
                defaultMessage: "Eligibility requirements",
                id: "mcibCA",
                description: "Title for eligibility requirements section",
              })}
            </Heading>
            <p data-h2-margin-bottom="base(x.5)">
              <ul>
                <li data-h2-margin-top="base(x.25)">
                  {intl.formatMessage({
                    defaultMessage:
                      "You're currently an IT-classified Government of Canada employee covered by the IT collective agreement",
                    id: "7abz0A",
                    description:
                      "First item in list of eligibility requirements section",
                  })}
                </li>
                <li data-h2-margin-top="base(x.25)">
                  {intl.formatMessage({
                    defaultMessage: "You have a GC Digital Talent profile",
                    id: "2B+d2V",
                    description:
                      "Second item in list of eligibility requirements section",
                  })}
                </li>
                <li data-h2-margin-top="base(x.25)">
                  {intl.formatMessage({
                    defaultMessage: "You have an active Navigar account",
                    id: "4ddL8K",
                    description:
                      "Third item in list of eligibility requirements section",
                  })}
                </li>
                <li data-h2-margin-top="base(x.25)">
                  {intl.formatMessage({
                    defaultMessage:
                      "You've completed any preparatory work such as prerequisite training modules and are ready to take the certification exam",
                    id: "oc4iCB",
                    description:
                      "Fourth item in list of eligibility requirements section",
                  })}
                </li>
              </ul>
            </p>
          </div>
          <div data-h2-margin-bottom="base(x3)">
            <Heading
              size="h3"
              Icon={UserCircleIcon}
              color="quaternary"
              data-h2-margin-bottom="base(x1)"
            >
              {intl.formatMessage({
                defaultMessage: "Apply and complete your profile",
                id: "fxhdQd",
                description:
                  "Title for apply and complete your profile section",
              })}
            </Heading>
            <p data-h2-margin-bottom="base(x.5)">
              {intl.formatMessage({
                defaultMessage:
                  "To obtain a voucher, complete the application form. Your GC Digital Talent profile helps us confirm your eligibility. Before you apply, take a moment to review and update your information or create a profile if you haven't done so yet.",
                id: "1uoeR6",
                description:
                  "First paragraph of apply and complete your profile section",
              })}
            </p>
          </div>
          <div data-h2-margin-bottom="base(x3)">
            <Heading
              size="h3"
              Icon={QuestionMarkCircleIcon}
              color="quinary"
              data-h2-margin-bottom="base(x1)"
            >
              {intl.formatMessage({
                defaultMessage: "What to expect",
                id: "8umYON",
                description: "Title for what to expect section",
              })}
            </Heading>
            <p data-h2-margin-bottom="base(x.5)">
              {intl.formatMessage({
                defaultMessage:
                  "We'll respond to your application within 7 business days. If your request is approved, we'll send you a voucher code that you can use when booking your exam on the provider's platform.",
                id: "9gU2in",
                description: "First paragraph of what to expect section",
              })}
            </p>
            <p data-h2-margin-bottom="base(x.5)">
              {intl.formatMessage(
                {
                  defaultMessage:
                    "For questions regarding the vouchers, please contact <mailLink>icommunity-icollectivite@tbs-sct.gc.ca</mailLink>.",
                  id: "I2kLuc",
                  description: "Second paragraph of what to expect section",
                },
                { mailLink },
              )}
            </p>
          </div>
          <div data-h2-text-align="base(center)">
            <Link
              icon={TicketIcon}
              color="quaternary"
              mode="cta"
              href={requestAVoucherUrl[locale]}
              state={{ referrer: window.location.href }}
            >
              {intl.formatMessage({
                defaultMessage: "Request a voucher",
                id: "yGtIgV",
                description: "Link text to request a voucher",
              })}
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

Component.displayName = "CertificationExamVouchersPage";

export default Component;
