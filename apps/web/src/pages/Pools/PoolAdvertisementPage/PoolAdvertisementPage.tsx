import React from "react";
import { useIntl } from "react-intl";
import { useParams } from "react-router-dom";
import CurrencyDollarIcon from "@heroicons/react/24/outline/CurrencyDollarIcon";
import BoltIcon from "@heroicons/react/24/outline/BoltIcon";
import MapPinIcon from "@heroicons/react/24/outline/MapPinIcon";
import CalendarDaysIcon from "@heroicons/react/24/outline/CalendarDaysIcon";
import ChatBubbleLeftRightIcon from "@heroicons/react/24/outline/ChatBubbleLeftRightIcon";
import LockClosedIcon from "@heroicons/react/24/outline/LockClosedIcon";

import {
  ThrowNotFound,
  Pending,
  Accordion,
  TableOfContents,
  Heading,
  Pill,
  ExternalLink,
} from "@gc-digital-talent/ui";
import { StandardHeader as StandardAccordionHeader } from "@gc-digital-talent/ui/src/components/Accordion/StandardHeader";
import {
  getLocale,
  getLanguageRequirement,
  getSecurityClearance,
  localizeSalaryRange,
  commonMessages,
  getLocalizedName,
} from "@gc-digital-talent/i18n";
import { notEmpty } from "@gc-digital-talent/helpers";
import { useAuthorization } from "@gc-digital-talent/auth";
import {
  parseDateTimeUtc,
  relativeClosingDate,
} from "@gc-digital-talent/date-helpers";

import {
  AdvertisementStatus,
  Scalars,
  useGetPoolAdvertisementQuery,
  PoolAdvertisement,
} from "~/api/generated";
import { categorizeSkill } from "~/utils/skillUtils";
import {
  formatClassificationString,
  getFullPoolAdvertisementTitleLabel,
  isAdvertisementVisible,
} from "~/utils/poolUtils";
import { wrapAbbr } from "~/utils/nameUtils";
import SEO from "~/components/SEO/SEO";
import Hero from "~/components/Hero/Hero";
import useRoutes from "~/hooks/useRoutes";
import useBreadcrumbs from "~/hooks/useBreadcrumbs";
import { TALENTSEARCH_RECRUITMENT_EMAIL } from "~/constants/talentSearchConstants";

import ClassificationDefinition from "./components/ClassificationDefinition";
import ApplicationLink from "./components/ApplicationLink";
import Text from "./components/Text";
import EducationRequirements from "./components/EducationRequirements";
import SkillAccordion from "./components/SkillAccordion";
import DataRow from "./components/DataRow";
import GenericJobTitleAccordion from "./components/GenericJobTitleAccordion";

type SectionContent = {
  id: string;
  linkText?: string;
  title: string;
};

const anchorTag = (chunks: React.ReactNode) => (
  <a href={`mailto:${TALENTSEARCH_RECRUITMENT_EMAIL}`}>{chunks}</a>
);

interface PoolAdvertisementProps {
  poolAdvertisement: PoolAdvertisement;
  applicationId?: Scalars["ID"];
  hasApplied?: boolean;
}

export const PoolAdvertisementPoster = ({
  poolAdvertisement,
  applicationId,
  hasApplied,
}: PoolAdvertisementProps) => {
  const intl = useIntl();
  const locale = getLocale(intl);
  const paths = useRoutes();
  const notAvailable = intl.formatMessage(commonMessages.notAvailable);

  const classification = poolAdvertisement.classifications
    ? poolAdvertisement.classifications[0]
    : null;
  const genericJobTitles =
    classification?.genericJobTitles?.filter(notEmpty) || [];
  let classificationSuffix = ""; // type wrangling the complex type into a string
  if (classification) {
    classificationSuffix = formatClassificationString({
      group: classification?.group,
      level: classification?.level,
    });
  }
  const fullTitle = getFullPoolAdvertisementTitleLabel(intl, poolAdvertisement);

  const showImpactTasks = !!(
    poolAdvertisement.keyTasks || poolAdvertisement.yourImpact
  );

  const languageRequirement = poolAdvertisement.advertisementLanguage
    ? intl.formatMessage(
        getLanguageRequirement(poolAdvertisement.advertisementLanguage),
      )
    : "";

  const securityClearance = poolAdvertisement.securityClearance
    ? intl.formatMessage(
        getSecurityClearance(poolAdvertisement.securityClearance),
      )
    : "";

  const essentialSkills = categorizeSkill(poolAdvertisement.essentialSkills);
  const nonEssentialSkills = categorizeSkill(
    poolAdvertisement.nonessentialSkills,
  );

  const canApply = !!(
    poolAdvertisement?.advertisementStatus === AdvertisementStatus.Published
  );

  const applyBtn = (
    <ApplicationLink
      poolId={poolAdvertisement.id}
      applicationId={applicationId}
      hasApplied={hasApplied}
      canApply={canApply}
    />
  );

  const links = useBreadcrumbs([
    {
      label: intl.formatMessage({
        defaultMessage: "Browse jobs",
        id: "gC74ro",
        description: "Breadcrumb title for the browse pools page.",
      }),
      url: paths.browsePools(),
    },
    {
      label: fullTitle,
      url: paths.pool(poolAdvertisement.id),
    },
  ]);

  const sections: Record<string, SectionContent> = {
    summary: {
      id: "summary-section",
      linkText: intl.formatMessage({
        defaultMessage: "Opportunity summary",
        id: "lKQBZj",
        description: "Link text for a summary of a job poster",
      }),
      title: intl.formatMessage({
        defaultMessage: "About the opportunity",
        id: "WDsKjD",
        description: "Title for a summary of a pool advertisement",
      }),
    },
    impactTasks: {
      id: "impact-section",
      title: intl.formatMessage({
        defaultMessage: "Impact and tasks",
        id: "s5iy2Z",
        description:
          "Title for the impact and tasks section of a pool advertisement",
      }),
    },
    experienceSkills: {
      id: "experience-skills-section",
      title: intl.formatMessage({
        defaultMessage: "Experience and skill requirements",
        id: "VXHomP",
        description:
          "Title for the experience and skills section of a pool advertisement",
      }),
    },
    locationLangSecurity: {
      id: "loc-lang-sec-section",
      title: intl.formatMessage({
        defaultMessage: "Location, language, and security",
        id: "ARSDO1",
        description:
          "Title for the location, language and security section of a pool advertisement",
      }),
    },
    contact: {
      id: "contact-section",
      title: intl.formatMessage({
        defaultMessage: "Contact and accommodation",
        id: "BLg0f4",
        description:
          "Title for the contact and accommodation section of a pool advertisement",
      }),
    },
    hiringPolicies: {
      id: "hiring-policies-section",
      title: intl.formatMessage({
        defaultMessage: "Hiring policies",
        id: "2gMnSu",
        description:
          "Title for the hiring policies section of a pool advertisement",
      }),
    },
    apply: {
      id: "apply-section",
      title: intl.formatMessage({
        defaultMessage: "Apply now",
        id: "C6YPk3",
        description:
          "Title for the apply button section of a pool advertisement",
      }),
    },
  };

  return (
    <>
      <SEO title={fullTitle} />
      <Hero
        title={fullTitle}
        subtitle={intl.formatMessage(
          {
            defaultMessage:
              "Learn more about {title} opportunities and begin an application.",
            id: "gPEnzf",
            description: "Subtitle for a pool advertisement page",
          },
          { title: fullTitle },
        )}
        crumbs={links}
      />
      <div data-h2-container="base(center, large, x1) p-tablet(center, large, x2)">
        <TableOfContents.Wrapper>
          <TableOfContents.Navigation>
            <TableOfContents.AnchorLink id={sections.summary.id}>
              {sections.summary.linkText}
            </TableOfContents.AnchorLink>
            {showImpactTasks && (
              <TableOfContents.AnchorLink id={sections.impactTasks.id}>
                {sections.impactTasks.title}
              </TableOfContents.AnchorLink>
            )}
            <TableOfContents.AnchorLink id={sections.experienceSkills.id}>
              {sections.experienceSkills.title}
            </TableOfContents.AnchorLink>
            <TableOfContents.AnchorLink id={sections.locationLangSecurity.id}>
              {sections.locationLangSecurity.title}
            </TableOfContents.AnchorLink>
            <TableOfContents.AnchorLink id={sections.contact.id}>
              {sections.contact.title}
            </TableOfContents.AnchorLink>
            <TableOfContents.AnchorLink id={sections.hiringPolicies.id}>
              {sections.hiringPolicies.title}
            </TableOfContents.AnchorLink>
            {canApply && (
              <TableOfContents.AnchorLink id={sections.apply.id}>
                {sections.apply.title}
              </TableOfContents.AnchorLink>
            )}
          </TableOfContents.Navigation>
          <TableOfContents.Content>
            <TableOfContents.Section id={sections.summary.id}>
              <div
                data-h2-display="base(flex)"
                data-h2-gap="base(0 x1)"
                data-h2-margin="base(x3, 0, x1, 0)"
              >
                <div data-h2-flex-grow="base(1)">
                  <TableOfContents.Heading data-h2-margin="base(0)">
                    {sections.summary.title}
                  </TableOfContents.Heading>
                </div>
                <div data-h2-flex-shrink="base(0)">{applyBtn}</div>
              </div>
              <Accordion.Root mode="simple" type="single" collapsible>
                <Accordion.Item value="when">
                  <StandardAccordionHeader>
                    {intl.formatMessage({
                      defaultMessage: "What are pool recruitments?",
                      id: "KYFarS",
                      description:
                        "Title for accordion describing pool recruitments",
                    })}
                  </StandardAccordionHeader>
                  <Accordion.Content>
                    <div data-h2-margin-top="base(x1)">
                      <Text>
                        {intl.formatMessage({
                          defaultMessage:
                            "When you apply to this process, you are not applying for a specific position. This process is intended to create and maintain an inventory to staff various positions at the same level in different departments and agencies across the Government of Canada.",
                          id: "kH4Jsf",
                          description:
                            "Description of pool recruitment, paragraph one",
                        })}
                      </Text>
                      <Text>
                        {intl.formatMessage(
                          {
                            defaultMessage:
                              "When hiring managers have <abbreviation>IT</abbreviation> staffing needs and positions become available, applicants who meet the qualifications for this process may be contacted for further assessment. This means various managers may reach out to you about specific opportunities in the area of application development.",
                            id: "LlgRM8",
                            description:
                              "Description of pool recruitment, paragraph two",
                          },
                          {
                            abbreviation: (text: React.ReactNode) =>
                              wrapAbbr(text, intl),
                          },
                        )}
                      </Text>
                    </div>
                  </Accordion.Content>
                </Accordion.Item>
                {genericJobTitles.length ? (
                  <>
                    {genericJobTitles.map((genericJobTitle) => (
                      <GenericJobTitleAccordion
                        key={genericJobTitle.id}
                        suffix={classificationSuffix}
                        genericJobTitle={genericJobTitle}
                      />
                    ))}
                  </>
                ) : null}
              </Accordion.Root>
              <div data-h2-margin-bottom="base(x3)">
                <DataRow
                  Icon={CurrencyDollarIcon}
                  label={intl.formatMessage({
                    defaultMessage: "Salary range:",
                    id: "ls7b2p",
                    description: "Label for pool advertisement salary range",
                  })}
                  value={
                    localizeSalaryRange(
                      classification?.minSalary,
                      classification?.maxSalary,
                      locale,
                    ) || notAvailable
                  }
                />
                <DataRow
                  Icon={CalendarDaysIcon}
                  label={intl.formatMessage({
                    defaultMessage: "Apply before:",
                    id: "NSois3",
                    description: "Label for pool advertisement closing date",
                  })}
                  value={
                    poolAdvertisement.closingDate
                      ? relativeClosingDate({
                          closingDate: parseDateTimeUtc(
                            poolAdvertisement.closingDate,
                          ),
                          intl,
                        })
                      : notAvailable
                  }
                />
                <DataRow
                  Icon={BoltIcon}
                  label={intl.formatMessage({
                    defaultMessage: "Required skills:",
                    id: "iSaTbE",
                    description:
                      "Label for pool advertisement's required skills",
                  })}
                  value={
                    poolAdvertisement?.essentialSkills?.length ? (
                      <div
                        data-h2-display="base(flex)"
                        data-h2-gap="base(x.15)"
                        data-h2-flex-wrap="base(wrap)"
                      >
                        {poolAdvertisement.essentialSkills.map((skill) => (
                          <Pill color="secondary" mode="outline" key={skill.id}>
                            {getLocalizedName(skill.name, intl)}
                          </Pill>
                        ))}
                      </div>
                    ) : (
                      notAvailable
                    )
                  }
                />
              </div>
            </TableOfContents.Section>
            {showImpactTasks && (
              <TableOfContents.Section id={sections.impactTasks.id}>
                <TableOfContents.Heading>
                  {sections.impactTasks.title}
                </TableOfContents.Heading>
                {poolAdvertisement.yourImpact && (
                  <Text>{poolAdvertisement.yourImpact[locale]}</Text>
                )}
                {poolAdvertisement.keyTasks && (
                  <>
                    <Heading level="h3" size="h4">
                      {intl.formatMessage({
                        defaultMessage: "Common tasks in this role",
                        id: "ATO0GK",
                        description:
                          "Title for key tasks on a pool advertisement.",
                      })}
                    </Heading>
                    <Text>{poolAdvertisement.keyTasks[locale]}</Text>
                  </>
                )}
              </TableOfContents.Section>
            )}
            <TableOfContents.Section id={sections.experienceSkills.id}>
              <TableOfContents.Heading>
                {sections.experienceSkills.title}
              </TableOfContents.Heading>
              <Heading level="h3" size="h4">
                {intl.formatMessage({
                  defaultMessage: "Minimum experience or education",
                  id: "v6boy9",
                  description:
                    "Title for minimum experience or education section of a pool advertisement",
                })}
              </Heading>
              <Text>
                {intl.formatMessage(
                  {
                    defaultMessage:
                      "{title} roles require a minimum amount of experience or a relevant degree.",
                    id: "LnISTX",
                    description:
                      "Descriptive text about experience or education requirements of a pool advertisement",
                  },
                  { title: fullTitle },
                )}
              </Text>
              <EducationRequirements />
              <Heading level="h3" size="h4">
                {intl.formatMessage({
                  defaultMessage: "Skill requirements",
                  id: "706kTz",
                  description:
                    "Title for skill requirements section of a pool advertisement",
                })}
              </Heading>
              <Text>
                {intl.formatMessage({
                  defaultMessage:
                    'All opportunities on this platform require you to use your application to demonstrate a handful of required "occupational" or "technical" skills. Some opportunities will also assess “behavioural” or "soft" skills independently of your application, though you\'re free to add them to your resume.',
                  id: "6F4HY/",
                  description:
                    "Descriptive text about how skills are defined and used for pool advertisements and applications",
                })}
              </Text>
              <Heading level="h4" size="h6">
                {intl.formatMessage({
                  defaultMessage: "Required technical skills",
                  id: "9V8bnL",
                  description:
                    "Title for required technical skills section of a pool advertisement",
                })}
              </Heading>
              <Text>
                {intl.formatMessage({
                  defaultMessage:
                    "The following skills are essential to this role and must be demonstrated as a part of your application.",
                  id: "Ewa83p",
                  description:
                    "Descriptive text about how required technical skills are used in the application process",
                })}
              </Text>
              <SkillAccordion
                skills={essentialSkills.TECHNICAL?.filter(notEmpty) || []}
                nullMessage={intl.formatMessage({
                  defaultMessage:
                    "No required technical skills are being considered for this role.",
                  id: "AFuhfl",
                  description:
                    "Message displayed when a pool advertisement has no required technical skills",
                })}
              />
              <Heading level="h4" size="h6">
                {intl.formatMessage({
                  defaultMessage: "Optional technical skills",
                  id: "CzrCfC",
                  description:
                    "Title for optional technical skills section of a pool advertisement",
                })}
              </Heading>
              <Text>
                {intl.formatMessage({
                  defaultMessage:
                    "All the following skills are optionally beneficial to the role, and demonstrating them might benefit you when being considered.",
                  id: "ry5NUs",
                  description:
                    "Descriptive text about how optional technical skills are used in the application process",
                })}
              </Text>
              <SkillAccordion
                skills={nonEssentialSkills.TECHNICAL?.filter(notEmpty) || []}
                nullMessage={intl.formatMessage({
                  defaultMessage:
                    "No optional technical skills are being considered for this role.",
                  id: "8XIYUA",
                  description:
                    "Message displayed when a pool advertisement has no optional technical skills",
                })}
              />
              <Heading level="h4" size="h6">
                {intl.formatMessage({
                  defaultMessage: "Required behavioural skills",
                  id: "t9HxQm",
                  description:
                    "Title for required behavioural skills section of a pool advertisement",
                })}
              </Heading>
              <Text>
                {intl.formatMessage({
                  defaultMessage:
                    "The following skills are required for this role, but aren't required as a part of your application. <strong>They will be reviewed during the assessment process should your application be accepted</strong>.",
                  id: "v8LEMv",
                  description:
                    "Descriptive text about how required behavioural skills are used in the application process",
                })}
              </Text>
              <SkillAccordion
                skills={essentialSkills.BEHAVIOURAL?.filter(notEmpty) || []}
                nullMessage={intl.formatMessage({
                  defaultMessage:
                    "No required behavioural skills are being considered for this role.",
                  id: "E+AYNX",
                  description:
                    "Message displayed when a pool advertisement has no required behavioural skills",
                })}
              />
              <Heading level="h4" size="h6">
                {intl.formatMessage({
                  defaultMessage: "Optional behavioural skills",
                  id: "LeVJmQ",
                  description:
                    "Title for optional behavioural skills section of a pool advertisement",
                })}
              </Heading>
              <Text>
                {intl.formatMessage({
                  defaultMessage:
                    "All the following skills are optionally beneficial to the role, and demonstrating them might benefit you when being considered.",
                  id: "iXdeVu",
                  description:
                    "Descriptive text about how optional behavioural skills are used in the application process",
                })}
              </Text>
              <SkillAccordion
                skills={nonEssentialSkills.BEHAVIOURAL?.filter(notEmpty) || []}
                nullMessage={intl.formatMessage({
                  defaultMessage:
                    "No optional behavioural skills are being considered for this role.",
                  id: "KRkZS6",
                  description:
                    "Message displayed when a pool advertisement has no optional behavioural skills",
                })}
              />
            </TableOfContents.Section>
            <TableOfContents.Section id={sections.locationLangSecurity.id}>
              <TableOfContents.Heading>
                {sections.locationLangSecurity.title}
              </TableOfContents.Heading>
              <Text>
                {intl.formatMessage({
                  defaultMessage:
                    "These opportunities have the following requirements:",
                  id: "t9Zy30",
                  description:
                    "Lead-in text for other requirements on a pool advertisement",
                })}
              </Text>
              <DataRow
                Icon={MapPinIcon}
                label={intl.formatMessage({
                  defaultMessage: "Location:",
                  id: "H7M6Yv",
                  description:
                    "Label for pool advertisement location requirement",
                })}
                value={
                  poolAdvertisement.isRemote
                    ? intl.formatMessage({
                        defaultMessage: "Remove optional",
                        id: "14pmF7",
                        description:
                          "Location requirement when a pool advertisement is remote",
                      })
                    : getLocalizedName(
                        poolAdvertisement.advertisementLocation,
                        intl,
                      )
                }
              />
              <DataRow
                Icon={ChatBubbleLeftRightIcon}
                label={intl.formatMessage({
                  defaultMessage: "Language:",
                  id: "6eA/CF",
                  description:
                    "Label for pool advertisement language requirement",
                })}
                value={languageRequirement}
                suffix={
                  <ExternalLink
                    newTab
                    href={
                      locale === "fr"
                        ? "https://www.canada.ca/fr/commission-fonction-publique/services/evaluation-langue-seconde.html"
                        : "https://www.canada.ca/en/public-service-commission/services/second-language-testing-public-service.html"
                    }
                  >
                    {intl.formatMessage({
                      defaultMessage: "Learn more about language testing",
                      id: "Swde4t",
                      description: "Link text for language testing information",
                    })}
                  </ExternalLink>
                }
              />
              <DataRow
                Icon={LockClosedIcon}
                label={intl.formatMessage({
                  defaultMessage: "Security clearance:",
                  id: "mmCU6z",
                  description:
                    "Label for pool advertisement security clearance requirement",
                })}
                value={securityClearance}
                suffix={
                  <ExternalLink
                    newTab
                    href={
                      locale === "fr"
                        ? "https://www.canada.ca/fr/service-renseignement-securite/services/filtrage-de-securite-du-gouvernement.html"
                        : "https://www.canada.ca/en/security-intelligence-service/services/government-security-screening.html"
                    }
                  >
                    {intl.formatMessage({
                      defaultMessage: "Learn more about security clearances",
                      id: "WlMSeh",
                      description:
                        "Link text for security clearance information",
                    })}
                  </ExternalLink>
                }
              />
            </TableOfContents.Section>
            <TableOfContents.Section id={sections.contact.id}>
              <TableOfContents.Heading>
                {sections.contact.title}
              </TableOfContents.Heading>
              <Text>
                {intl.formatMessage({
                  defaultMessage:
                    "Do you require accommodations, or do you have any questions about this process?",
                  id: "2K8q04",
                  description:
                    "Opening sentence asking if accommodations are needed",
                })}
              </Text>
              <Text>
                {intl.formatMessage({
                  defaultMessage:
                    "Please contact the Digital Community Management team if you require any accommodations during this application process.",
                  id: "p3j/0q",
                  description:
                    "Description of what to do when accommodations are needed",
                })}
              </Text>
              <Text>
                {intl.formatMessage(
                  {
                    defaultMessage:
                      "<strong>Email</strong>: <anchorTag>{emailAddress}</anchorTag>",
                    id: "Wnw+oz",
                    description: "An email address to contact for help",
                  },
                  {
                    anchorTag,
                    emailAddress: TALENTSEARCH_RECRUITMENT_EMAIL,
                  },
                )}
              </Text>
            </TableOfContents.Section>
            <TableOfContents.Section id={sections.hiringPolicies.id}>
              <TableOfContents.Heading>
                {sections.hiringPolicies.title}
              </TableOfContents.Heading>
              <Text>
                {intl.formatMessage({
                  defaultMessage:
                    "Preference will be given to veterans, Canadian citizens and to permanent residents.",
                  id: "IF1xj8",
                  description: "First hiring policy for pool advertisement",
                })}
              </Text>
            </TableOfContents.Section>
            {canApply && (
              <TableOfContents.Section id={sections.apply.id}>
                <TableOfContents.Heading>
                  {sections.apply.title}
                </TableOfContents.Heading>
                <Text>
                  {intl.formatMessage(
                    {
                      defaultMessage:
                        "If you feel like your skills and experience are a good fit for the <strong>{title}</strong> role, we'd love to hear from you! This platform allows you to submit an application using the existing information in your profile and you'll be able to update that information in the next step.",
                      id: "Io6+0T",
                      description:
                        "Lead-in text to the apply call to action at the end of a pool advertisement",
                    },
                    { title: fullTitle },
                  )}
                </Text>
                {applyBtn}
              </TableOfContents.Section>
            )}
          </TableOfContents.Content>
        </TableOfContents.Wrapper>
      </div>
    </>
  );
};

const PoolNotFound = () => {
  const intl = useIntl();

  return (
    <ThrowNotFound
      message={intl.formatMessage({
        defaultMessage: "Error, pool unable to be loaded",
        id: "DcEinN",
        description: "Error message, placeholder",
      })}
    />
  );
};

type RouteParams = {
  poolId: Scalars["ID"];
};

const PoolAdvertisementPage = () => {
  const { poolId } = useParams<RouteParams>();
  const auth = useAuthorization();

  const [{ data, fetching, error }] = useGetPoolAdvertisementQuery({
    variables: { id: poolId || "" },
  });

  const isVisible = isAdvertisementVisible(
    auth?.roleAssignments?.filter(notEmpty) || [],
    data?.poolAdvertisement?.advertisementStatus ?? null,
  );

  // Attempt to find an application for this user+pool combination
  const application = data?.me?.poolCandidates?.find(
    (candidate) =>
      candidate?.poolAdvertisement?.id === data.poolAdvertisement?.id,
  );

  return (
    <Pending fetching={fetching} error={error}>
      {data?.poolAdvertisement && isVisible ? (
        <PoolAdvertisementPoster
          poolAdvertisement={data?.poolAdvertisement}
          applicationId={application?.id}
          hasApplied={notEmpty(application?.submittedAt)}
        />
      ) : (
        <PoolNotFound />
      )}
    </Pending>
  );
};

export default PoolAdvertisementPage;
