import { useIntl } from "react-intl";
import InformationCircleIcon from "@heroicons/react/24/solid/InformationCircleIcon";
import { ReactNode } from "react";

import {
  Button,
  Dialog,
  Heading,
  HeadingProps,
  IconButton,
  Link,
  Ul,
} from "@gc-digital-talent/ui";
import { Locales, getLocale } from "@gc-digital-talent/i18n";

const securityScreenConsentFormLink = (locale: Locales, chunks: ReactNode) => (
  <Link
    external
    href={
      locale === "en"
        ? "https://www.canada.ca/en/treasury-board-secretariat/corporate/forms/security-screening-application-consent-form.html"
        : "https://www.canada.ca/fr/secretariat-conseil-tresor/organisation/formulaires/formulaire-consentement-demande-filtrage-securite.html"
    }
  >
    {chunks}
  </Link>
);

const learnMoreLink = (locale: Locales, chunks: ReactNode) => (
  <Link
    external
    href={
      locale === "en"
        ? "https://www.canada.ca/en/government/publicservice/workforce/staffing/security-screening.html"
        : "https://www.canada.ca/fr/gouvernement/fonctionpublique/effectif/dotation/filtrage-de-securite.html"
    }
  >
    {chunks}
  </Link>
);

const securityScreenLink = (locale: Locales, chunks: ReactNode) => (
  <Link
    external
    href={
      locale === "en"
        ? "https://www.tbs-sct.canada.ca/pol/doc-eng.aspx?id=32805"
        : "https://www.tbs-sct.canada.ca/pol/doc-fra.aspx?id=32805"
    }
  >
    {chunks}
  </Link>
);

const SecurityClearanceDialog = () => {
  const intl = useIntl();
  const headingLevel: HeadingProps["level"] = "h3";
  const locale = getLocale(intl);

  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <IconButton
          color="primary"
          icon={InformationCircleIcon}
          label={intl.formatMessage({
            defaultMessage: "Learn more about security clearance",
            id: "KlvT7A",
            description:
              "Info button label for pool application security clearance details.",
          })}
        />
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Header>
          {intl.formatMessage({
            defaultMessage: "Security clearance",
            id: "ySQ1Kf",
            description: "Heading for security clearance dialog",
          })}
        </Dialog.Header>
        <Dialog.Body>
          <div className="flex flex-col items-start gap-3">
            <p>
              {intl.formatMessage({
                defaultMessage:
                  "You don't need to have an existing security status or clearance to apply for positions listed on GC Digital Talent. You'll undergo security screening during the hiring process, usually after all other assessments are complete.",
                id: "CeWqSY",
                description:
                  "First paragraph for the security clearance dialog",
              })}
            </p>
            <p className="mb-3">
              {intl.formatMessage({
                defaultMessage:
                  "The time it takes to complete security screening can vary from a few days to several months. Higher levels of security screening and more complex cases tend to take longer.",
                id: "LxGqKt",
                description:
                  "Second paragraph for the security clearance dialog",
              })}
            </p>
            <Heading level={headingLevel} size="h6" className="mt-0">
              {intl.formatMessage({
                defaultMessage: "Levels of security screening",
                id: "ZZLwb5",
                description:
                  "Heading for the security clearance levels section",
              })}
            </Heading>
            <p className="mb-3">
              {intl.formatMessage({
                defaultMessage:
                  "The required level of security screening depends on the job and is determined by the sensitivity of the information you'll handle and the location of your office. There are three levels of security screening, each with an enhanced option:",
                id: "683LAr",
                description:
                  "Third paragraph for the security clearance dialog",
              })}
            </p>
            <Ul className="mb-3">
              <li>
                {intl.formatMessage({
                  defaultMessage: "reliability status",
                  id: "0GcfAj",
                  description: "Reliability status level of security clearance",
                })}
              </li>
              <li>
                {intl.formatMessage({
                  defaultMessage: "secret security clearance",
                  id: "jFInhC",
                  description:
                    "Secret security clearance level of security clearance",
                })}
              </li>
              <li>
                {intl.formatMessage({
                  defaultMessage: "top secret security clearance",
                  id: "/9+N+W",
                  description:
                    "Top secret security clearance level of security clearance",
                })}
              </li>
            </Ul>
            <Heading level={headingLevel} size="h6" className="mt-0">
              {intl.formatMessage({
                defaultMessage: "Obtaining your security status or clearance",
                id: "FxB6Km",
                description:
                  "Heading for the obtaining security clearance section",
              })}
            </Heading>
            <p>
              {intl.formatMessage(
                {
                  defaultMessage:
                    "As part of a background check, you'll need to provide certain personal information by filling out sections of the <link>Security Screening Application and Consent Form</link>.",
                  id: "XUmyGM",
                  description:
                    "First paragraph for the obtaining security clearance section",
                },
                {
                  link: (chunks: ReactNode) =>
                    securityScreenConsentFormLink(locale, chunks),
                },
              )}
            </p>
            <p>
              {intl.formatMessage({
                defaultMessage:
                  "Among the security screening activities, all levels require individuals to undergo a financial inquiry (credit check) and a criminal records check (fingerprinting).",
                id: "v3kVqD",
                description:
                  "Second paragraph for the obtaining security clearance section",
              })}
            </p>
            <p className="mb-3">
              {intl.formatMessage({
                defaultMessage:
                  "Reliability status and secret clearance are valid for up to 10 years, while top secret clearance is valid for up to 5 years.",
                id: "mOb/qH",
                description:
                  "Third paragraph for the obtaining security clearance section",
              })}
            </p>
            <Heading level={headingLevel} size="h6" className="mt-0">
              {intl.formatMessage({
                defaultMessage: "More information",
                id: "dCmN+g",
                description:
                  "Heading for the obtaining security clearance section",
              })}
            </Heading>
            <p>
              {intl.formatMessage(
                {
                  defaultMessage:
                    "Learn more about <link>security screening</link> or have a look at the <securityScreenLink>Directive on Security Screening</securityScreenLink>.",
                  id: "C+FsJw",
                  description:
                    "First paragraph for the obtaining security clearance section",
                },
                {
                  link: (chunks: ReactNode) => learnMoreLink(locale, chunks),
                  securityScreenLink: (chunks: ReactNode) =>
                    securityScreenLink(locale, chunks),
                },
              )}
            </p>
          </div>
          <Dialog.Footer>
            <Dialog.Close>
              <Button color="primary">
                {intl.formatMessage({
                  defaultMessage: "Close",
                  id: "4p0QdF",
                  description: "Button text used to close an open modal",
                })}
              </Button>
            </Dialog.Close>
          </Dialog.Footer>
        </Dialog.Body>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default SecurityClearanceDialog;
