import React from "react";
import { useIntl } from "react-intl";
import { useQuery } from "urql";
import MapIcon from "@heroicons/react/24/outline/MapIcon";
import InformationCircleIcon from "@heroicons/react/20/solid/InformationCircleIcon";
import AcademicCapIcon from "@heroicons/react/24/outline/AcademicCapIcon";
import ClipboardDocumentIcon from "@heroicons/react/24/outline/ClipboardDocumentIcon";
import QuestionMarkCircleIcon from "@heroicons/react/24/outline/QuestionMarkCircleIcon";
import BoltIcon from "@heroicons/react/24/outline/BoltIcon";
import RocketLaunchIcon from "@heroicons/react/24/outline/RocketLaunchIcon";

import {
  ThrowNotFound,
  Pending,
  Accordion,
  TableOfContents,
  Heading,
  Link,
  Well,
  CardBasic,
  Button,
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
  uiMessages,
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
  Maybe,
} from "@gc-digital-talent/graphql";

import { categorizeSkill } from "~/utils/skillUtils";
import {
  formatClassificationString,
  getClassificationGroup,
  getClassificationSalaryRangeUrl,
  getFullPoolTitleHtml,
  getShortPoolTitleLabel,
  isAdvertisementVisible,
} from "~/utils/poolUtils";
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

const anchorTag = (chunks: React.ReactNode, email?: Maybe<string>) => {
  return email ? (
    <Link external href={`mailto:${email}`}>
      {chunks}
    </Link>
  ) : (
    chunks
  );
};

const moreInfoAccordions = {
  whoCanApply: "who-can-apply",
  dei: "diversity-equity-inclusion",
  accommodations: "accommodations",
  whatToExpectApply: "what-to-expect-apply",
  whatToExpectIfSuccessful: "what-to-expect-success",
};

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
  const [moreInfoValue, setMoreInfoValue] = React.useState<string[]>([]);

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
  const poolTitle = getShortPoolTitleLabel(intl, pool);
  const fullPoolTitle = getFullPoolTitleHtml(intl, pool);
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

  const toggleMoreInfoValue = () => {
    if (moreInfoValue.length > 0) {
      setMoreInfoValue([]);
    } else {
      const newMoreInfoValue = Object.values(moreInfoAccordions).filter(
        (id) => {
          if (!pool.whatToExpect && id === "what-to-expect-apply") return false;
          return true;
        },
      );
      const jobTitleValues = genericJobTitles.map(
        (genericJobTitle) => genericJobTitle.id,
      );

      setMoreInfoValue([...newMoreInfoValue, ...jobTitleValues]);
    }
  };

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
      label: poolTitle,
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
    minEducation: {
      id: "minimum-education",
      title: intl.formatMessage({
        defaultMessage: "Minimum education",
        id: "Gc11BQ",
        description: "Title for a education details of a pool advertisement",
      }),
    },
    skillRequirements: {
      id: "skill-requirements",
      title: intl.formatMessage({
        defaultMessage: "Skill requirements",
        id: "h2h7Df",
        description: "Title for the skills section of a pool advertisement",
      }),
    },
    aboutRole: {
      id: "about-role",
      title: intl.formatMessage({
        defaultMessage: "About this role",
        id: "wim0F6",
        description: "Title for the about section of a pool advertisement",
      }),
    },
    moreInfo: {
      id: "more-information",
      title: intl.formatMessage({
        defaultMessage: "More information",
        id: "9ALMEp",
        description: "Title for the about section of a pool advertisement",
      }),
    },
    startAnApplication: {
      id: "start-an-application",
      title: intl.formatMessage({
        defaultMessage: "Start an application",
        id: "Qx8ezq",
        description: "Title for the apply now section of a pool advertisement",
      }),
    },
  };

  const classificationGroup = getClassificationGroup(pool);

  return (
    <>
      <SEO title={poolTitle} />
      <Hero
        title={poolTitle}
        subtitle={intl.formatMessage({
          defaultMessage:
            "Learn more about this opportunity and begin an application.",
          id: "H5EXEi",
          description: "Subtitle for a pool advertisement page",
        })}
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
              <TableOfContents.ListItem>
                <TableOfContents.AnchorLink id={sections.minEducation.id}>
                  {sections.minEducation.title}
                </TableOfContents.AnchorLink>
              </TableOfContents.ListItem>
              <TableOfContents.ListItem>
                <TableOfContents.AnchorLink id={sections.skillRequirements.id}>
                  {sections.skillRequirements.title}
                </TableOfContents.AnchorLink>
              </TableOfContents.ListItem>
              <TableOfContents.ListItem>
                <TableOfContents.AnchorLink id={sections.aboutRole.id}>
                  {sections.aboutRole.title}
                </TableOfContents.AnchorLink>
              </TableOfContents.ListItem>
              <TableOfContents.ListItem>
                <TableOfContents.AnchorLink id={sections.moreInfo.id}>
                  {sections.moreInfo.title}
                </TableOfContents.AnchorLink>
              </TableOfContents.ListItem>
              <TableOfContents.ListItem>
                <TableOfContents.AnchorLink id={sections.startAnApplication.id}>
                  {sections.startAnApplication.title}
                </TableOfContents.AnchorLink>
              </TableOfContents.ListItem>
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
            </TableOfContents.Section>
            <TableOfContents.Section id={sections.minEducation.id}>
              <TableOfContents.Heading
                size="h3"
                icon={AcademicCapIcon}
                color="secondary"
                data-h2-margin="base(x3, 0, x1, 0)"
              >
                {sections.minEducation.title}
              </TableOfContents.Heading>
              <Text>
                {intl.formatMessage({
                  defaultMessage:
                    "This role requires a minimum amount of experience or a relevant degree. All applicants must meet one of the criteria outlined in this section in order to be considered. If you meet more than one of the options provided, you'll be able to specify which option you feel best represents your experience. You can learn more about education and equivalency by visiting the Government of Canada's education standard.",
                  id: "Mr93f0",
                  description: "Description of minimum education requirements",
                })}
              </Text>
              <EducationRequirements
                isIAP={pool.publishingGroup === PublishingGroup.Iap}
                classificationGroup={classificationGroup}
              />
            </TableOfContents.Section>
            <TableOfContents.Section id={sections.skillRequirements.id}>
              <TableOfContents.Heading
                size="h3"
                icon={BoltIcon}
                color="quaternary"
                data-h2-margin="base(x3, 0, x1, 0)"
              >
                {sections.skillRequirements.title}
              </TableOfContents.Heading>
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
            <TableOfContents.Section id={sections.aboutRole.id}>
              <TableOfContents.Heading
                size="h3"
                icon={ClipboardDocumentIcon}
                color="tertiary"
                data-h2-margin="base(x3, 0, x1, 0)"
              >
                {sections.aboutRole.title}
              </TableOfContents.Heading>
              {pool.yourImpact && (
                <>
                  <Heading
                    level="h3"
                    size="h4"
                    data-h2-font-weight="base(700)"
                    data-h2-margin="base(x3, 0, x1, 0)"
                  >
                    {intl.formatMessage({
                      defaultMessage: "Your impact",
                      id: "MOpG7g",
                      description:
                        "Title for impact section on a pool advertisement.",
                    })}
                  </Heading>
                  <RichTextRenderer
                    node={htmlToRichTextJSON(
                      getLocalizedName(pool.yourImpact, intl),
                    )}
                  />
                </>
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
                  <RichTextRenderer
                    node={htmlToRichTextJSON(
                      getLocalizedName(pool.keyTasks, intl),
                    )}
                  />
                </>
              )}
            </TableOfContents.Section>
            <TableOfContents.Section id={sections.moreInfo.id}>
              <div
                data-h2-align-items="base(baseline)"
                data-h2-display="base(flex)"
                data-h2-gap="base(0 x1)"
                data-h2-flex-wrap="base(wrap)"
              >
                <div data-h2-flex-grow="base(1)">
                  <TableOfContents.Heading
                    size="h3"
                    icon={QuestionMarkCircleIcon}
                    color="quinary"
                    data-h2-margin="base(x3, 0, x1, 0)"
                  >
                    {sections.moreInfo.title}
                  </TableOfContents.Heading>
                </div>
                <div
                  data-h2-flex-shrink="base(0)"
                  data-h2-margin-top="base(x.75) p-tablet(0)"
                >
                  <Button
                    mode="inline"
                    color="secondary"
                    onClick={toggleMoreInfoValue}
                    aria-label={
                      moreInfoValue.length > 0
                        ? intl.formatMessage({
                            defaultMessage:
                              "Collapse all more information sections",
                            id: "V6Y2Np",
                            description:
                              "Accessible link text to collapse all accordions for more information",
                          })
                        : intl.formatMessage({
                            defaultMessage:
                              "Expand all more information sections",
                            id: "hAAMFa",
                            description:
                              "Accessible link text to expand all accordions for more information",
                          })
                    }
                  >
                    {intl.formatMessage(
                      moreInfoValue.length > 0
                        ? uiMessages.collapseAll
                        : uiMessages.expandAll,
                    )}
                  </Button>
                </div>
              </div>
              <Accordion.Root
                type="multiple"
                mode="card"
                value={moreInfoValue}
                onValueChange={setMoreInfoValue}
              >
                <Accordion.Item value={moreInfoAccordions.whoCanApply}>
                  <Accordion.Trigger>
                    {intl.formatMessage({
                      defaultMessage:
                        '"Who can apply to this recruitment process?"',
                      id: "EpL8MD",
                      description:
                        "Button text to toggle the accordion for who can apply",
                    })}
                  </Accordion.Trigger>
                  <Accordion.Content>
                    <Text>
                      {intl.formatMessage({
                        defaultMessage:
                          "Persons residing in Canada, and Canadian citizens and permanent residents abroad.",
                        id: "faWz84",
                        description:
                          "List of criteria needed in order to apply",
                      })}
                    </Text>
                    <Text>
                      {intl.formatMessage({
                        defaultMessage:
                          "Preference will be given to veterans, Canadian citizens, and to permanent residents.",
                        id: "aCg/OZ",
                        description:
                          "First hiring policy for pool advertisement",
                      })}
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
                <Accordion.Item value={moreInfoAccordions.dei}>
                  <Accordion.Trigger>
                    {intl.formatMessage({
                      defaultMessage:
                        '"How are equity and inclusion considered in this recruitment process?"',
                      id: "fkw2eD",
                      description:
                        "Button text to toggle the accordion for diversity, equity and inclusion",
                    })}
                  </Accordion.Trigger>
                  <Accordion.Content>
                    <Text>
                      {intl.formatMessage({
                        defaultMessage:
                          "You can learn more about our commitment to equity and inclusion by reading our Inclusivity statement. We also provide an Accessibility statement that outlines how the platform considers and implements accessible best practices.",
                        id: "2sQI9l",
                        description:
                          "Information on commitment to diversity, equity and inclusion",
                      })}
                    </Text>
                  </Accordion.Content>
                </Accordion.Item>
                <Accordion.Item value={moreInfoAccordions.accommodations}>
                  <Accordion.Trigger>
                    {intl.formatMessage({
                      defaultMessage:
                        '"Who can I contact with questions or accommodation needs?"',
                      id: "IbWzvu",
                      description:
                        "Button text to toggle the accordion for accommodations contact",
                    })}
                  </Accordion.Trigger>
                  <Accordion.Content>
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
                  </Accordion.Content>
                </Accordion.Item>
                {showWhatToExpect && (
                  <Accordion.Item value={moreInfoAccordions.accommodations}>
                    <Accordion.Trigger>
                      {intl.formatMessage({
                        defaultMessage: '"What should I expect after I apply?"',
                        id: "pdi2SU",
                        description:
                          "Button text to toggle the accordion for what to expect after you apply",
                      })}
                    </Accordion.Trigger>
                    <Accordion.Content>
                      <RichTextRenderer
                        node={htmlToRichTextJSON(
                          getLocalizedName(pool.whatToExpect, intl),
                        )}
                      />
                    </Accordion.Content>
                  </Accordion.Item>
                )}
              </Accordion.Root>
            </TableOfContents.Section>

            <TableOfContents.Section id={sections.startAnApplication.id}>
              <TableOfContents.Heading
                size="h3"
                icon={RocketLaunchIcon}
                color="primary"
                data-h2-margin="base(x3, 0, x1, 0)"
              >
                {sections.startAnApplication.title}
              </TableOfContents.Heading>
              <Text>
                {intl.formatMessage(
                  {
                    defaultMessage:
                      "If you feel like your skills and experience are a good fit for the <strong>{title}</strong> role, we’d love to hear from you! ",
                    id: "o8bIuI",
                    description:
                      "Lead-in text to the apply call to action at the end of a pool advertisement",
                  },
                  { title: fullPoolTitle },
                )}
              </Text>
              <Text>
                {intl.formatMessage({
                  defaultMessage:
                    "If you have a profile on GC Digital Talent, your information will automatically be added to help speed up the process. You'll have the opportunity to review and edit this information, as well as the chance to complete any information that might be missing. Changes you make to your profile as a part of the application will be saved so that you can use that information at a later time.",
                  id: "/AH0m5",
                  description:
                    "Description of how user profiles assist in application completion",
                })}
              </Text>
              <Text>
                {intl.formatMessage({
                  defaultMessage:
                    "Don't have a profile yet? The application process will walk you through everything you need.",
                  id: "uOTYlH",
                  description:
                    "Text letting users know the application will allow them setup a profile",
                })}
              </Text>
              {applyBtn}
            </TableOfContents.Section>
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
