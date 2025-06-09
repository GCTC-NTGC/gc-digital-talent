import { defineMessages, useIntl } from "react-intl";
import InformationCircleIcon from "@heroicons/react/24/solid/InformationCircleIcon";
import { ReactNode } from "react";

import {
  Button,
  DescriptionList,
  Dialog,
  Heading,
  HeadingProps,
  Link,
  Ul,
} from "@gc-digital-talent/ui";
import { Locales, commonMessages, getLocale } from "@gc-digital-talent/i18n";

const selfAssessmentLink = (locale: Locales, chunks: ReactNode) => (
  <Link
    newTab
    external
    href={
      locale === "fr"
        ? "https://www.canada.ca/fr/commission-fonction-publique/services/evaluation-langue-seconde/tests-autoevaluation.html"
        : "https://www.canada.ca/en/public-service-commission/services/second-language-testing-public-service/self-assessment-tests.html"
    }
  >
    {chunks}
  </Link>
);

const languageProfiles = defineMessages({
  frenchEssential: {
    defaultMessage: "French essential",
    id: "kvxHHl",
    description: "French essential language requirement",
  },
  englishEssential: {
    defaultMessage: "English essential",
    id: "H0h1Vn",
    description: "English essential language requirement",
  },
  bilingualIntermediate: {
    defaultMessage: "Bilingual intermediate (B B B)",
    id: "Y555u5",
    description: "Bilingual intermediate language requirement",
  },
  bilingualAdvanced: {
    defaultMessage: "Bilingual advanced (C B C)",
    id: "AjVbZs",
    description: "Bilingual advanced language requirement",
  },
  various: {
    defaultMessage: "Various",
    id: "MgK9E0",
    description: "Various language requirement",
  },
});

const languageProfileDescriptions = defineMessages({
  frenchEssential: {
    defaultMessage:
      "This position requires a working ability in French. The hiring manager is responsible for determining if you meet this language requirement.",
    id: "+o1lWq",
    description: "French essential language requirement description",
  },
  englishEssential: {
    defaultMessage:
      "This position requires a working ability in English. The hiring manager is responsible for determining if you meet this language requirement.",
    id: "IlvS9l",
    description: "English essential language requirement description",
  },
  bilingualIntermediate: {
    defaultMessage:
      "This position requires that you are bilingual and pass a second language evaluation. The following section on Bilingual positions explains in detail.",
    id: "XhiQW6",
    description: "Bilingual intermediate language requirement description",
  },
  bilingualAdvanced: {
    defaultMessage:
      "This position requires that you are bilingual and pass a second language evaluation. The following section on Bilingual positions explains in detail.",
    id: "X3PC+9",
    description: "Bilingual advanced language requirement description",
  },
  various: {
    defaultMessage:
      "Multiple positions are expected to be staffed through this process. You may apply to this process if you meet any of the previous language profiles.",
    id: "mF1SAO",
    description: "Various language requirement description",
  },
});

const LanguageRequirementDialog = () => {
  const intl = useIntl();
  const locale = getLocale(intl);
  const headingLevel: HeadingProps["level"] = "h3";

  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <Button
          mode="icon_only"
          color="secondary"
          icon={InformationCircleIcon}
          aria-label={intl.formatMessage({
            defaultMessage: "Learn about how language requirements work.",
            id: "WhHVMt",
            description:
              "Info button label for pool language requirements details.",
          })}
        />
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Header>
          {intl.formatMessage({
            defaultMessage:
              "Language requirements and second language proficiency",
            id: "+7yxK0",
            description: "Heading for the pool language requirements dialog",
          })}
        </Dialog.Header>
        <Dialog.Body>
          <Heading level={headingLevel} size="h6" data-h2-margin-top="base(0)">
            {intl.formatMessage({
              defaultMessage: "Language requirements on GC Digital Talent",
              id: "h1UJ1Q",
              description: "Sub-heading for language requirements dialog",
            })}
          </Heading>
          <p>
            {intl.formatMessage({
              defaultMessage:
                "These are the language profiles that you can find on GC Digital Talent",
              id: "sry9Wl",
              description:
                "Language profiles list for language requirements dialog",
            }) + intl.formatMessage(commonMessages.dividingColon)}
          </p>
          <DescriptionList.Root>
            <DescriptionList.Item
              title={intl.formatMessage(languageProfiles.englishEssential)}
            >
              {intl.formatMessage(languageProfileDescriptions.englishEssential)}
            </DescriptionList.Item>
            <DescriptionList.Item
              title={intl.formatMessage(languageProfiles.frenchEssential)}
            >
              {intl.formatMessage(languageProfileDescriptions.frenchEssential)}
            </DescriptionList.Item>
            <DescriptionList.Item
              title={intl.formatMessage(languageProfiles.bilingualIntermediate)}
            >
              {intl.formatMessage(
                languageProfileDescriptions.bilingualIntermediate,
              )}
            </DescriptionList.Item>
            <DescriptionList.Item
              title={intl.formatMessage(languageProfiles.bilingualAdvanced)}
            >
              {intl.formatMessage(
                languageProfileDescriptions.bilingualAdvanced,
              )}
            </DescriptionList.Item>
            <DescriptionList.Item
              title={intl.formatMessage(languageProfiles.various)}
            >
              {intl.formatMessage(languageProfileDescriptions.various)}
            </DescriptionList.Item>
          </DescriptionList.Root>

          <Heading level={headingLevel} size="h6" data-h2-margin-top="base(0)">
            {intl.formatMessage({
              defaultMessage: "Bilingual positions",
              id: "i9ovz7",
              description: "Sub-heading for language requirements dialog",
            })}
          </Heading>
          <p data-h2-margin-bottom="base(x.5)">
            {intl.formatMessage({
              defaultMessage:
                "You do not need to have your second language proficiency levels before applying for a bilingual position. You will be sent for testing as part of the hiring process.",
              id: "++a1ZY",
              description:
                "Description for bilingual positions in language requirements dialog",
            })}
          </p>
          <p data-h2-margin-bottom="base(x.5)">
            {intl.formatMessage({
              defaultMessage:
                "If you are applying for a bilingual position, you must pass the language tests before you can be hired. If the position is bilingual, the manager cannot hire someone who does not meet the second language proficiency levels, no matter what other qualifications the candidate may have or how well they perform in the job competition. If you are interested in a bilingual job but are not bilingual, you are strongly encouraged to apply to other opportunities on the platform that meet your language abilities.",
              id: "53MCSe",
              description:
                "Description for bilingual positions in language requirements dialog",
            })}
          </p>
          <p data-h2-margin-bottom="base(x.5)">
            {intl.formatMessage(
              {
                defaultMessage:
                  "Try out the <link>self-assessment</link> tests to get a sense of your current level.",
                id: "x20cWU",
                description:
                  "Description for bilingual positions in language requirements dialog",
              },
              {
                link: (chunks: ReactNode) => selfAssessmentLink(locale, chunks),
              },
            )}
          </p>
          <Heading level={headingLevel} size="h6" data-h2-margin-top="base(0)">
            {intl.formatMessage({
              defaultMessage: "Second language proficiency",
              id: "fSeYdG",
              description: "Sub-heading for language requirements dialog",
            })}
          </Heading>
          <p data-h2-margin-bottom="base(x.5)">
            {intl.formatMessage({
              defaultMessage:
                "The Government of Canada uses letter codes to describe second language proficiency. There are three proficiency levels for general qualifications",
              id: "sgt8f7",
              description:
                "Language proficiency list for language requirements dialog",
            }) + intl.formatMessage(commonMessages.dividingColon)}
          </p>
          <Ul className="mb-3">
            <li>
              {intl.formatMessage({
                defaultMessage: `"A" is the lowest level of bilingual ability and indicates a beginner level.`,
                id: "qD0lyZ",
                description:
                  "Proficiency level on language requirements dialog",
              })}
            </li>
            <li>
              {intl.formatMessage({
                defaultMessage: `"B" indicates an intermediate level.`,
                id: "DoZebI",
                description:
                  "Proficiency level on language requirements dialog",
              })}
            </li>
            <li>
              {intl.formatMessage({
                defaultMessage: `"C" is the highest and indicates an advanced level.`,
                id: "e9jncy",
                description:
                  "Proficiency level on language requirements dialog",
              })}
            </li>
          </Ul>
          <p data-h2-margin-bottom="base(x.5)">
            {intl.formatMessage({
              defaultMessage:
                "Second language proficiency is also determined for three related skills",
              id: "HJTr0Q",
              description:
                "Second language proficiency related skills list fo language requirements dialog",
            }) + intl.formatMessage(commonMessages.dividingColon)}
          </p>
          <Ul className="mb-3">
            <li>
              {intl.formatMessage({
                defaultMessage: "Reading (or Written Comprehension)",
                id: "1XsXrt",
                description:
                  "Proficiency level related skill on language requirements dialog",
              })}
            </li>
            <li>
              {intl.formatMessage({
                defaultMessage: "Writing (or Written Expression)",
                id: "imNqyO",
                description:
                  "Proficiency level related skill on language requirements dialog",
              })}
            </li>
            <li>
              {intl.formatMessage({
                defaultMessage: "Speaking (or Oral Proficiency)",
                id: "2hc9V9",
                description:
                  "Proficiency level related skill on language requirements dialog",
              })}
            </li>
          </Ul>
          <p data-h2-margin-bottom="base(x.5)">
            {intl.formatMessage({
              defaultMessage:
                "To assess your second language proficiency, you will need to complete an evaluation for each of the three skills. After each evaluation, you will obtain a letter code indicating the proficiency level you demonstrated for that skill.",
              id: "YW+ZVh",
              description:
                "Description for second language proficiency on language requirement dialog",
            })}
          </p>
          <p data-h2-margin-bottom="base(x.5)">
            {intl.formatMessage({
              defaultMessage:
                "Language requirements for bilingual positions are summarized using one of the letter codes for each of the skills. The first letter refers to the required level for <strong>Reading</strong>, the second <strong>Writing</strong> and the third <strong>Speaking</strong>.",
              id: "dYejJH",
              description:
                "Description for second language proficiency on language requirement dialog",
            })}
          </p>
          <p data-h2-margin-bottom="base(x.5)">
            {intl.formatMessage({
              defaultMessage:
                "In practice, most bilingual positions are either B B B (intermediate) or C B C (advanced).",
              id: "+fSWpK",
              description:
                "Description for second language proficiency on language requirement dialog",
            })}
          </p>
          <p data-h2-margin-bottom="base(x.5)">
            {intl.formatMessage({
              defaultMessage:
                "The Public Service Commission (PSC) is responsible for all second language evaluations for Government of Canada employment opportunities. You can read more about this topic on the PSC's website",
              id: "+MCd8X",
              description:
                "PSC second language evaluations list for language requirements dialog",
            }) + intl.formatMessage(commonMessages.dividingColon)}
          </p>
          <Ul>
            <li>
              <Link
                newTab
                external
                href={
                  locale === "fr"
                    ? "https://www.canada.ca/fr/secretariat-conseil-tresor/services/dotation/normes-qualification/relatives-langues-officielles.html"
                    : "https://www.canada.ca/en/treasury-board-secretariat/services/staffing/qualification-standards/relation-official-languages.html"
                }
              >
                {intl.formatMessage({
                  defaultMessage:
                    "Qualification Standards in Relation to Official Languages",
                  id: "POj+1M",
                  description:
                    "Link to second language evaluations PSC info page on language requirements dialog",
                })}
              </Link>
            </li>
            <li>
              <Link
                newTab
                external
                href={
                  locale === "fr"
                    ? "https://www.canada.ca/fr/commission-fonction-publique/emplois/services/emplois-gc/exigences-linguistiques.html"
                    : "https://www.canada.ca/en/public-service-commission/jobs/services/gc-jobs/language-requirements-candidates.html"
                }
              >
                {intl.formatMessage({
                  defaultMessage: "Language requirements for candidates",
                  id: "MmTWYV",
                  description:
                    "Link to second language evaluations PSC info page on language requirements dialog",
                })}
              </Link>
            </li>
            <li>
              <Link
                newTab
                external
                href={
                  locale === "fr"
                    ? "https://www.canada.ca/fr/commission-fonction-publique/services/evaluation-langue-seconde.html"
                    : "https://www.canada.ca/en/public-service-commission/services/second-language-testing-public-service.html"
                }
              >
                {intl.formatMessage({
                  defaultMessage:
                    "Second language evaluation in the federal public service",
                  id: "fwDXW8",
                  description:
                    "Link to second language evaluations PSC info page on language requirements dialog",
                })}
              </Link>
            </li>
            <li>
              <Link
                newTab
                external
                href={
                  locale === "fr"
                    ? "https://www.canada.ca/fr/commission-fonction-publique/services/cadre-nomination/guides-outils/evaluation-langues-officielles-cadre-dun-processus-nomination.html"
                    : "https://www.canada.ca/en/public-service-commission/services/appointment-framework/guides-tools-appointment-framework/assessment-official-languages-appointment-process.html"
                }
              >
                {intl.formatMessage({
                  defaultMessage:
                    "Assessment of official languages in the appointment process",
                  id: "EWq+u3",
                  description:
                    "Link to second language evaluations PSC info page on language requirements dialog",
                })}
              </Link>
            </li>
          </Ul>

          <Dialog.Footer>
            <Dialog.Close>
              <Button color="secondary">
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

export default LanguageRequirementDialog;
