import React from "react";
import { useIntl } from "react-intl";
import { useQuery } from "urql";
import MapIcon from "@heroicons/react/24/outline/MapIcon";
import InformationCircleIcon from "@heroicons/react/20/solid/InformationCircleIcon";

import {
  ThrowNotFound,
  Pending,
  Accordion,
  TableOfContents,
  Heading,
  Link,
  Well,
  CardBasic,
} from "@gc-digital-talent/ui";
import {
  getLocale,
  getLanguageRequirement,
  getSecurityClearance,
  localizeSalaryRange,
  commonMessages,
  getLocalizedName,
  navigationMessages,
  getPoolStream,
} from "@gc-digital-talent/i18n";
import { notEmpty } from "@gc-digital-talent/helpers";
import { useAuthorization } from "@gc-digital-talent/auth";
import { parseDateTimeUtc, formatDate } from "@gc-digital-talent/date-helpers";
import { RichTextRenderer, htmlToRichTextJSON } from "@gc-digital-talent/forms";
import {
  graphql,
  PoolStatus,
  Scalars,
  Pool,
  PublishingGroup,
} from "@gc-digital-talent/graphql";

import { categorizeSkill } from "~/utils/skillUtils";
import {
  formatClassificationString,
  getClassificationGroup,
  getClassificationSalaryRangeUrl,
  getFullPoolTitleLabel,
  isAdvertisementVisible,
} from "~/utils/poolUtils";
import { wrapAbbr } from "~/utils/nameUtils";
import SEO from "~/components/SEO/SEO";
import Hero from "~/components/Hero/Hero";
import useRoutes from "~/hooks/useRoutes";
import useBreadcrumbs from "~/hooks/useBreadcrumbs";
import EducationRequirements from "~/components/EducationRequirements/EducationRequirements";
import useRequiredParams from "~/hooks/useRequiredParams";

import ApplicationLink from "./components/ApplicationLink";
import Text from "./components/Text";
import SkillAccordion from "./components/SkillAccordion";
import DataRow from "./components/DataRow";
import GenericJobTitleAccordion from "./components/GenericJobTitleAccordion";
import DeadlineDialog from "./components/DeadlineDialog";
import WorkLocationDialog from "./components/WorkLocationDialog";

type SectionContent = {
  id: string;
  linkText?: string;
  title: string;
};

const anchorTag = (chunks: React.ReactNode, email: string) => (
  <Link external href={`mailto:${email}`}>
    {chunks}
  </Link>
);

interface PoolAdvertisementProps {
  pool: Pool;
  applicationId?: Scalars["ID"]["output"];
  hasApplied?: boolean;
}

export const PoolPoster = ({
  pool,
  applicationId,
  hasApplied,
}: PoolAdvertisementProps) => {
  const intl = useIntl();
  const locale = getLocale(intl);
  const paths = useRoutes();
  const notAvailable = intl.formatMessage(commonMessages.notAvailable);

  const classification = pool.classifications ? pool.classifications[0] : null;
  const genericJobTitles =
    classification?.genericJobTitles?.filter(notEmpty) || [];
  let classificationString = ""; // type wrangling the complex type into a string
  if (classification) {
    classificationString = formatClassificationString({
      group: classification?.group,
      level: classification?.level,
    });
  }
  const fullTitle = getFullPoolTitleLabel(intl, pool);
  const salaryRangeUrl = getClassificationSalaryRangeUrl(
    locale,
    classification,
  );
  const workLocation = pool.isRemote
    ? intl.formatMessage({
        defaultMessage: "Remote, hybrid or on-site",
        id: "swESO/",
        description: "Location requirement when a pool advertisement is remote",
      })
    : getLocalizedName(pool.location, intl);

  const showSpecialNote = !!(pool.specialNote && pool.specialNote[locale]);
  const showImpactTasks = !!(pool.keyTasks || pool.yourImpact);
  const showWhatToExpect = !!(pool.whatToExpect && pool.whatToExpect[locale]);

  const languageRequirement = pool.language
    ? intl.formatMessage(getLanguageRequirement(pool.language))
    : "";

  const securityClearance = pool.securityClearance
    ? intl.formatMessage(getSecurityClearance(pool.securityClearance))
    : "";

  const essentialSkills = categorizeSkill(pool.essentialSkills);
  const nonEssentialSkills = categorizeSkill(pool.nonessentialSkills);

  const contactEmail = pool.team?.contactEmail;

  const canApply = !!(pool?.status === PoolStatus.Published);

  const applyBtn = (
    <ApplicationLink
      poolId={pool.id}
      applicationId={applicationId}
      hasApplied={hasApplied}
      canApply={canApply}
    />
  );

  const links = useBreadcrumbs([
    {
      label: intl.formatMessage(navigationMessages.browseJobs),
      url: paths.browsePools(),
    },
    {
      label: fullTitle,
      url: paths.pool(pool.id),
    },
  ]);

  const sections: Record<string, SectionContent> = {
    employmentDetails: {
      id: "employment-details",
      title: intl.formatMessage({
        defaultMessage: "Employment details",
        id: "5+jnam",
        description: "Title for a employment details of a pool advertisement",
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
    whoCanApply: {
      id: "who-can-apply-section",
      title: intl.formatMessage({
        defaultMessage: "Who can apply?",
        id: "UwdpPS",
        description:
          "Title for the hiring policies section of a pool advertisement",
      }),
    },
    whatToExpect: {
      id: "what-to-expect-section",
      title: intl.formatMessage({
        defaultMessage: "What to expect after you apply",
        id: "D2HsoO",
        description:
          "Title for the what to expect section of a pool advertisement",
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

  const classificationGroup = getClassificationGroup(pool);

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
      <div
        data-h2-container="base(center, large, x1) p-tablet(center, large, x2)"
        data-h2-margin-top="base(x3)"
      >
        <TableOfContents.Wrapper>
          <TableOfContents.Navigation>
            <TableOfContents.List>
              <TableOfContents.ListItem>
                <TableOfContents.AnchorLink id={sections.employmentDetails.id}>
                  {sections.employmentDetails.title}
                </TableOfContents.AnchorLink>
              </TableOfContents.ListItem>
              {showImpactTasks && (
                <TableOfContents.ListItem>
                  <TableOfContents.AnchorLink id={sections.impactTasks.id}>
                    {sections.impactTasks.title}
                  </TableOfContents.AnchorLink>
                </TableOfContents.ListItem>
              )}
              <TableOfContents.ListItem>
                <TableOfContents.AnchorLink id={sections.experienceSkills.id}>
                  {sections.experienceSkills.title}
                </TableOfContents.AnchorLink>
              </TableOfContents.ListItem>
              <TableOfContents.ListItem>
                <TableOfContents.AnchorLink
                  id={sections.locationLangSecurity.id}
                >
                  {sections.locationLangSecurity.title}
                </TableOfContents.AnchorLink>
              </TableOfContents.ListItem>
              {contactEmail && (
                <TableOfContents.ListItem>
                  <TableOfContents.AnchorLink id={sections.contact.id}>
                    {sections.contact.title}
                  </TableOfContents.AnchorLink>
                </TableOfContents.ListItem>
              )}
              {showWhatToExpect && (
                <TableOfContents.ListItem>
                  <TableOfContents.AnchorLink id={sections.whatToExpect.id}>
                    {sections.whatToExpect.title}
                  </TableOfContents.AnchorLink>
                </TableOfContents.ListItem>
              )}
              <TableOfContents.ListItem>
                <TableOfContents.AnchorLink id={sections.whoCanApply.id}>
                  {sections.whoCanApply.title}
                </TableOfContents.AnchorLink>
              </TableOfContents.ListItem>
              {canApply && (
                <TableOfContents.ListItem>
                  <TableOfContents.AnchorLink id={sections.apply.id}>
                    {sections.apply.title}
                  </TableOfContents.AnchorLink>
                </TableOfContents.ListItem>
              )}
            </TableOfContents.List>
          </TableOfContents.Navigation>
          <TableOfContents.Content>
            <TableOfContents.Section id={sections.employmentDetails.id}>
              <div
                data-h2-align-items="base(baseline)"
                data-h2-display="base(flex)"
                data-h2-gap="base(0 x1)"
                data-h2-flex-wrap="base(wrap)"
              >
                <div data-h2-flex-grow="base(1)">
                  <TableOfContents.Heading
                    size="h3"
                    icon={MapIcon}
                    color="primary"
                    data-h2-margin="base(0, 0, x1, 0)"
                  >
                    {sections.employmentDetails.title}
                  </TableOfContents.Heading>
                </div>
                <div
                  data-h2-flex-shrink="base(0)"
                  data-h2-margin-top="base(x.75) p-tablet(0)"
                >
                  <ApplicationLink
                    poolId={pool.id}
                    applicationId={applicationId}
                    hasApplied={hasApplied}
                    canApply={canApply}
                    linkProps={{
                      mode: "inline",
                      color: "primary",
                    }}
                  />
                </div>
              </div>
              {showSpecialNote && (
                <Well data-h2-margin="base(x1 0)">
                  <Heading
                    level="h3"
                    size="h6"
                    data-h2-margin-top="base(0)"
                    data-h2-font-size="base(body)"
                  >
                    {intl.formatMessage({
                      defaultMessage: "Special note for this process",
                      id: "cbwWa0",
                      description:
                        "Heading for a special note in pool advertisement.",
                    })}
                  </Heading>
                  <RichTextRenderer
                    node={htmlToRichTextJSON(
                      getLocalizedName(pool.specialNote, intl),
                    )}
                  />
                </Well>
              )}

              <CardBasic>
                <DataRow
                  hideSeparator
                  label={
                    intl.formatMessage({
                      defaultMessage: "Work category",
                      id: "pVCsBB",
                      description: "Label for pool advertisement stream",
                    }) + intl.formatMessage(commonMessages.dividingColon)
                  }
                  value={
                    pool.stream
                      ? intl.formatMessage(getPoolStream(pool.stream))
                      : notAvailable
                  }
                  suffix={
                    classification?.group === "IT" ? (
                      <Link
                        mode="icon_only"
                        external
                        newTab
                        href={
                          locale === "fr"
                            ? "https://www.canada.ca/fr/gouvernement/systeme/gouvernement-numerique/collectivite-gcnumerique/carriere-domaine-numerique.html#technologies-information"
                            : "https://www.canada.ca/en/government/system/digital-government/gcdigital-community/careers-digital.html#information-technology"
                        }
                        icon={InformationCircleIcon}
                        aria-label={intl.formatMessage({
                          defaultMessage:
                            "Information technology (IT) work streams",
                          id: "FZ5qdE",
                          description:
                            "Link text to more information about information technology work streams",
                        })}
                      />
                    ) : undefined
                  }
                />
                <DataRow
                  label={
                    intl.formatMessage({
                      defaultMessage: "Salary range",
                      id: "GgBjAd",
                      description: "Label for pool advertisement salary range",
                    }) + intl.formatMessage(commonMessages.dividingColon)
                  }
                  value={
                    localizeSalaryRange(
                      classification?.minSalary,
                      classification?.maxSalary,
                      locale,
                    ) || notAvailable
                  }
                  suffix={
                    salaryRangeUrl && (
                      <Link
                        mode="icon_only"
                        external
                        newTab
                        href={salaryRangeUrl}
                        icon={InformationCircleIcon}
                        aria-label={intl.formatMessage({
                          defaultMessage: "Salary range information",
                          id: "IvJ9Xd",
                          description:
                            "Link text to more information about classification salary range",
                        })}
                      />
                    )
                  }
                />
                <DataRow
                  label={
                    intl.formatMessage({
                      defaultMessage: "Deadline",
                      id: "FVEh7L",
                      description: "Label for pool advertisement closing date",
                    }) + intl.formatMessage(commonMessages.dividingColon)
                  }
                  value={
                    pool.closingDate
                      ? intl.formatMessage(
                          {
                            defaultMessage: "Apply on or before {closingDate}",
                            id: "LjYzkS",
                            description:
                              "Message to apply to the pool before deadline",
                          },
                          {
                            closingDate: formatDate({
                              date: parseDateTimeUtc(pool.closingDate),
                              formatString: "PPP",
                              intl,
                              timeZone: "Canada/Pacific",
                            }),
                          },
                        )
                      : notAvailable
                  }
                  suffix={
                    pool.closingDate ? (
                      <DeadlineDialog
                        deadline={parseDateTimeUtc(pool.closingDate)}
                      />
                    ) : null
                  }
                />
                <DataRow
                  label={
                    intl.formatMessage({
                      defaultMessage: "Work location",
                      id: "2aE/gp",
                      description:
                        "Label for pool advertisement location requirement",
                    }) + intl.formatMessage(commonMessages.dividingColon)
                  }
                  value={workLocation}
                  suffix={<WorkLocationDialog workLocation={workLocation} />}
                />
                <DataRow
                  label={
                    intl.formatMessage({
                      defaultMessage: "Language requirement",
                      id: "totVDg",
                      description:
                        "Label for pool advertisement language requirement",
                    }) + intl.formatMessage(commonMessages.dividingColon)
                  }
                  value={languageRequirement}
                  suffix={
                    <Link
                      newTab
                      external
                      color="secondary"
                      mode="icon_only"
                      icon={InformationCircleIcon}
                      href={
                        locale === "fr"
                          ? "https://www.canada.ca/fr/commission-fonction-publique/services/evaluation-langue-seconde.html"
                          : "https://www.canada.ca/en/public-service-commission/services/second-language-testing-public-service.html"
                      }
                      aria-label={intl.formatMessage({
                        defaultMessage: "Learn more about language testing",
                        id: "Swde4t",
                        description:
                          "Link text for language testing information",
                      })}
                    />
                  }
                />
                <DataRow
                  label={
                    intl.formatMessage({
                      defaultMessage: "Security clearance",
                      id: "e4eYvU",
                      description:
                        "Label for pool advertisement security clearance requirement",
                    }) + intl.formatMessage(commonMessages.dividingColon)
                  }
                  value={securityClearance}
                  suffix={
                    <Link
                      newTab
                      external
                      color="secondary"
                      mode="icon_only"
                      icon={InformationCircleIcon}
                      href={
                        locale === "fr"
                          ? "https://www.canada.ca/fr/service-renseignement-securite/services/filtrage-de-securite-du-gouvernement.html"
                          : "https://www.canada.ca/en/security-intelligence-service/services/government-security-screening.html"
                      }
                      aria-label={intl.formatMessage({
                        defaultMessage: "Learn more about security clearances",
                        id: "WlMSeh",
                        description:
                          "Link text for security clearance information",
                      })}
                    />
                  }
                />
              </CardBasic>

              <Accordion.Root size="sm" type="single" collapsible>
                <Accordion.Item value="when">
                  <Accordion.Trigger>
                    {intl.formatMessage({
                      defaultMessage: "What are pool recruitments?",
                      id: "KYFarS",
                      description:
                        "Title for accordion describing pool recruitments",
                    })}
                  </Accordion.Trigger>
                  <Accordion.Content>
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
                            "When hiring managers have <abbreviation>IT</abbreviation> staffing needs and positions become available, applicants who meet the qualifications for this process may be contacted for further assessment. This means various managers may reach out to you about specific opportunities.",
                          id: "7b0U9u",
                          description:
                            "Description of pool recruitment, paragraph two",
                        },
                        {
                          abbreviation: (text: React.ReactNode) =>
                            wrapAbbr(text, intl),
                        },
                      )}
                    </Text>
                  </Accordion.Content>
                </Accordion.Item>
                {genericJobTitles.length ? (
                  <>
                    {genericJobTitles.map((genericJobTitle) => (
                      <GenericJobTitleAccordion
                        key={genericJobTitle.id}
                        classification={classificationString}
                        genericJobTitle={genericJobTitle}
                      />
                    ))}
                  </>
                ) : null}
              </Accordion.Root>
            </TableOfContents.Section>
            {showImpactTasks && (
              <TableOfContents.Section id={sections.impactTasks.id}>
                <TableOfContents.Heading
                  size="h3"
                  data-h2-margin="base(x3, 0, x1, 0)"
                >
                  {sections.impactTasks.title}
                </TableOfContents.Heading>
                {pool.yourImpact && (
                  <div>
                    <RichTextRenderer
                      node={htmlToRichTextJSON(
                        getLocalizedName(pool.yourImpact, intl),
                      )}
                    />
                  </div>
                )}
                {pool.keyTasks && (
                  <>
                    <Heading
                      level="h3"
                      size="h4"
                      data-h2-font-weight="base(700)"
                      data-h2-margin="base(x3, 0, x1, 0)"
                    >
                      {intl.formatMessage({
                        defaultMessage: "Common tasks in this role",
                        id: "ATO0GK",
                        description:
                          "Title for key tasks on a pool advertisement.",
                      })}
                    </Heading>
                    <div data-h2-margin-top="base(x1)">
                      <RichTextRenderer
                        node={htmlToRichTextJSON(
                          getLocalizedName(pool.keyTasks, intl),
                        )}
                      />
                    </div>
                  </>
                )}
              </TableOfContents.Section>
            )}
            <TableOfContents.Section id={sections.experienceSkills.id}>
              <TableOfContents.Heading
                size="h3"
                data-h2-margin="base(x3, 0, x1, 0)"
              >
                {sections.experienceSkills.title}
              </TableOfContents.Heading>
              <Heading
                level="h3"
                size="h4"
                data-h2-font-weight="base(700)"
                data-h2-margin="base(x3, 0, x1, 0)"
              >
                {intl.formatMessage({
                  defaultMessage: "Minimum experience or equivalent education",
                  id: "LvYEdh",
                  description:
                    "Title for Minimum experience or equivalent education",
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
              <EducationRequirements
                isIAP={pool.publishingGroup === PublishingGroup.Iap}
                classificationGroup={classificationGroup}
              />
              <Heading
                level="h3"
                size="h4"
                data-h2-font-weight="base(700)"
                data-h2-margin="base(x3, 0, x1, 0)"
              >
                {intl.formatMessage({
                  defaultMessage: "Skill requirements",
                  id: "tON7JL",
                  description: "Title for skill requirements",
                })}
              </Heading>
              <Text>
                {intl.formatMessage({
                  defaultMessage:
                    'All opportunities on this platform require you to use your application to demonstrate a handful of required "occupational" or "technical" skills. Some opportunities will also assess “behavioural” or "soft" skills independently of your application, though you\'re free to add them to your career timeline.',
                  id: "SiF2cz",
                  description:
                    "Descriptive text about how skills are defined and used for pool advertisements and applications",
                })}
              </Text>
              <Heading
                level="h4"
                size="h6"
                data-h2-margin="base(x2, 0, x.5, 0)"
              >
                {intl.formatMessage({
                  defaultMessage: "Required technical skills",
                  id: "9V8bnL",
                  description:
                    "Title for required technical skills section of a pool advertisement",
                })}
              </Heading>
              <p data-h2-margin="base(x.5, 0)">
                {intl.formatMessage({
                  defaultMessage:
                    "The following skills are essential to this role and must be demonstrated as a part of your application.",
                  id: "Ewa83p",
                  description:
                    "Descriptive text about how required technical skills are used in the application process",
                })}
              </p>
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
              <Heading
                level="h4"
                size="h6"
                data-h2-margin="base(x2, 0, x.5, 0)"
              >
                {intl.formatMessage({
                  defaultMessage: "Optional technical skills",
                  id: "mm1X02",
                  description: "Title for optional technical skills section",
                })}
              </Heading>
              <p data-h2-margin="base(x.5, 0)">
                {intl.formatMessage({
                  defaultMessage:
                    "All the following skills are optionally beneficial to the role, and demonstrating them might benefit you when being considered.",
                  id: "mqRhhe",
                  description:
                    "Descriptive text about how optional skills are used in the application process",
                })}
              </p>
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
              <Heading
                level="h4"
                size="h6"
                data-h2-margin="base(x2, 0, x.5, 0)"
              >
                {intl.formatMessage({
                  defaultMessage: "Required behavioural skills",
                  id: "t9HxQm",
                  description:
                    "Title for required behavioural skills section of a pool advertisement",
                })}
              </Heading>
              <p data-h2-margin="base(x.5, 0)">
                {intl.formatMessage({
                  defaultMessage:
                    "The following skills are required for this role, but aren't required as a part of your application. <strong>They will be reviewed during the assessment process should your application be accepted</strong>.",
                  id: "v8LEMv",
                  description:
                    "Descriptive text about how required behavioural skills are used in the application process",
                })}
              </p>
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
              <Heading
                level="h4"
                size="h6"
                data-h2-margin="base(x2, 0, x.5, 0)"
              >
                {intl.formatMessage({
                  defaultMessage: "Optional behavioural skills",
                  id: "LeVJmQ",
                  description:
                    "Title for optional behavioural skills section of a pool advertisement",
                })}
              </Heading>
              <p data-h2-margin="base(x.5, 0)">
                {intl.formatMessage({
                  defaultMessage:
                    "All the following skills are optionally beneficial to the role, and demonstrating them might benefit you when being considered.",
                  id: "mqRhhe",
                  description:
                    "Descriptive text about how optional skills are used in the application process",
                })}
              </p>
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
              <TableOfContents.Heading
                size="h3"
                data-h2-margin="base(x3, 0, x1, 0)"
              >
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
            </TableOfContents.Section>
            {contactEmail && (
              <TableOfContents.Section id={sections.contact.id}>
                <TableOfContents.Heading
                  size="h3"
                  data-h2-margin="base(x3, 0, x1, 0)"
                >
                  {sections.contact.title}
                </TableOfContents.Heading>
                <Text>
                  {intl.formatMessage(
                    {
                      defaultMessage:
                        "Please contact the <a>{name} team</a> by email if you have <strong>any questions</strong> or <strong>require an accommodation</strong> during this process.",
                      id: "rKUVdL",
                      description:
                        "Opening sentence asking if accommodations are needed",
                    },
                    {
                      a: (chunks: React.ReactNode) =>
                        anchorTag(chunks, contactEmail),
                      name: getLocalizedName(pool.team?.displayName, intl),
                    },
                  )}
                </Text>
              </TableOfContents.Section>
            )}
            {showWhatToExpect && (
              <TableOfContents.Section id={sections.whatToExpect.id}>
                <TableOfContents.Heading
                  size="h3"
                  data-h2-margin="base(x3, 0, x1, 0)"
                >
                  {sections.whatToExpect.title}
                </TableOfContents.Heading>
                <div data-h2-margin-top="base(x1)">
                  <RichTextRenderer
                    node={htmlToRichTextJSON(
                      getLocalizedName(pool.whatToExpect, intl),
                    )}
                  />
                </div>
              </TableOfContents.Section>
            )}
            <TableOfContents.Section id={sections.whoCanApply.id}>
              <TableOfContents.Heading
                size="h3"
                data-h2-margin="base(x3, 0, x1, 0)"
              >
                {sections.whoCanApply.title}
              </TableOfContents.Heading>
              <Text>
                {intl.formatMessage({
                  defaultMessage:
                    "Persons residing in Canada, and Canadian citizens and permanent residents abroad.",
                  id: "faWz84",
                  description: "List of criteria needed in order to apply",
                })}
              </Text>
              <Text>
                {intl.formatMessage({
                  defaultMessage:
                    "Preference will be given to veterans, Canadian citizens, and to permanent residents.",
                  id: "aCg/OZ",
                  description: "First hiring policy for pool advertisement",
                })}
              </Text>
            </TableOfContents.Section>
            {canApply && (
              <TableOfContents.Section id={sections.apply.id}>
                <TableOfContents.Heading
                  size="h3"
                  data-h2-margin="base(x3, 0, x1, 0)"
                >
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
  poolId: Scalars["ID"]["output"];
};

const PoolAdvertisementPage_Query = graphql(/* GraphQL */ `
  query PoolAdvertisementPage($id: UUID!) {
    me {
      id
      poolCandidates {
        id
        pool {
          id
        }
        submittedAt
      }
    }
    pool(id: $id) {
      id
      name {
        en
        fr
      }
      stream
      closingDate
      status
      language
      securityClearance
      classifications {
        id
        group
        level
        name {
          en
          fr
        }
        minSalary
        maxSalary
        genericJobTitles {
          id
          key
          name {
            en
            fr
          }
        }
      }
      yourImpact {
        en
        fr
      }
      keyTasks {
        en
        fr
      }
      whatToExpect {
        en
        fr
      }
      specialNote {
        en
        fr
      }
      essentialSkills {
        id
        key
        name {
          en
          fr
        }
        description {
          en
          fr
        }
        category
        families {
          id
          key
          description {
            en
            fr
          }
          name {
            en
            fr
          }
        }
      }
      nonessentialSkills {
        id
        key
        name {
          en
          fr
        }
        description {
          en
          fr
        }
        category
        families {
          id
          key
          description {
            en
            fr
          }
          name {
            en
            fr
          }
        }
      }
      isRemote
      location {
        en
        fr
      }
      stream
      processNumber
      publishingGroup
      screeningQuestions {
        id
        question {
          en
          fr
        }
      }
      team {
        id
        name
        contactEmail
        displayName {
          en
          fr
        }
      }
    }
  }
`);

const PoolAdvertisementPage = () => {
  const { poolId } = useRequiredParams<RouteParams>("poolId", true);
  const auth = useAuthorization();

  const [{ data, fetching, error }] = useQuery({
    query: PoolAdvertisementPage_Query,
    variables: { id: poolId },
  });

  const isVisible = isAdvertisementVisible(
    auth?.roleAssignments?.filter(notEmpty) || [],
    data?.pool?.status ?? null,
  );

  // Attempt to find an application for this user+pool combination
  const application = data?.me?.poolCandidates?.find(
    (candidate) => candidate?.pool.id === data.pool?.id,
  );

  return (
    <Pending fetching={fetching} error={error}>
      {data?.pool && isVisible ? (
        <PoolPoster
          pool={data?.pool}
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
