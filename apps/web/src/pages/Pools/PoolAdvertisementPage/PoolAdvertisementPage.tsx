import { defineMessage, useIntl } from "react-intl";
import { useQuery } from "urql";
import MapIcon from "@heroicons/react/24/outline/MapIcon";
import InformationCircleIcon from "@heroicons/react/20/solid/InformationCircleIcon";
import AcademicCapIcon from "@heroicons/react/24/outline/AcademicCapIcon";
import ClipboardDocumentIcon from "@heroicons/react/24/outline/ClipboardDocumentIcon";
import QuestionMarkCircleIcon from "@heroicons/react/24/outline/QuestionMarkCircleIcon";
import BoltIcon from "@heroicons/react/24/outline/BoltIcon";
import RocketLaunchIcon from "@heroicons/react/24/outline/RocketLaunchIcon";
import CheckIcon from "@heroicons/react/20/solid/CheckIcon";
import { ReactNode, useState } from "react";

import {
  ThrowNotFound,
  Pending,
  Accordion,
  TableOfContents,
  Heading,
  Link,
  Notice,
  Card,
  Button,
  Separator,
  IconLink,
  Ul,
  Container,
} from "@gc-digital-talent/ui";
import {
  getLocale,
  localizeSalaryRange,
  commonMessages,
  getLocalizedName,
  navigationMessages,
  uiMessages,
  Locales,
} from "@gc-digital-talent/i18n";
import { notEmpty, unpackMaybes } from "@gc-digital-talent/helpers";
import { useAuthorization } from "@gc-digital-talent/auth";
import { parseDateTimeUtc } from "@gc-digital-talent/date-helpers";
import { RichTextRenderer, htmlToRichTextJSON } from "@gc-digital-talent/forms";
import {
  graphql,
  PoolStatus,
  Scalars,
  PublishingGroup,
  PoolSkillType,
  FragmentType,
  getFragment,
} from "@gc-digital-talent/graphql";
import { getLogger } from "@gc-digital-talent/logger";

import {
  contactEmailTag,
  formatClassificationString,
  getFullPoolTitleLabel,
  getShortPoolTitleLabel,
  isAdvertisementVisible,
} from "~/utils/poolUtils";
import SEO from "~/components/SEO/SEO";
import Hero from "~/components/Hero";
import useRoutes from "~/hooks/useRoutes";
import useBreadcrumbs from "~/hooks/useBreadcrumbs";
import EducationRequirements from "~/components/EducationRequirements/EducationRequirements";
import useRequiredParams from "~/hooks/useRequiredParams";
import { sortPoolSkillsBySkillCategory } from "~/utils/skillUtils";
import ApplicationLink, {
  ApplicationLinkProps,
} from "~/components/ApplicationLink/ApplicationLink";
import SkillAccordion from "~/components/PoolSkillAccordion/PoolSkillAccordion";
import {
  ClassificationGroup,
  isClassificationGroup,
} from "~/types/classificationGroup";
import DataRow from "~/components/DataRow/DataRow";
import processMessages from "~/messages/processMessages";

import Text from "./components/Text";
import GenericJobTitleAccordion from "./components/GenericJobTitleAccordion";
import DeadlineDialog from "./components/DeadlineDialog";
import WorkLocationDialog from "./components/WorkLocationDialog";
import SkillLevelDialog from "./components/SkillLevelDialog";
import LanguageRequirementDialog from "./components/LanguageRequirementDialog";
import ClosedEarlyDeadlineDialog from "./components/ClosedEarlyDeadlineDialog";
import DeadlineValue from "./components/DeadlineValue";
import AreaOfSelectionWell from "./components/AreaOfSelectionWell";
import WhoCanApplyText from "./components/WhoCanApplyText";
import SalaryRangeDialog from "./components/SalaryRangeDialog";
import SecurityClearanceDialog from "./components/SecurityClearanceDialog";
interface SectionContent {
  id: string;
  linkText?: string;
  title: string;
}

const internalLink = (href: string, chunks: ReactNode) => (
  <Link href={href}>{chunks}</Link>
);

const standardsLink = (locale: Locales, chunks: ReactNode) => (
  <Link
    external
    href={
      locale === "en"
        ? "https://www.canada.ca/en/treasury-board-secretariat/services/staffing/qualification-standards/core.html"
        : "https://www.canada.ca/fr/secretariat-conseil-tresor/services/dotation/normes-qualification/centrale.html"
    }
  >
    {chunks}
  </Link>
);

const gocGCKeyLink = (locale: Locales, chunks: ReactNode) => (
  <Link
    external
    href={
      locale === "en"
        ? "https://clegc-gckey.gc.ca/j/eng/CU-01"
        : "https://clegc-gckey.gc.ca/j/fra/CU-01"
    }
  >
    {chunks}
  </Link>
);

const DeadlineDialogReturn = ({
  closingDate,
  closingReason,
}: {
  closingDate: string | null | undefined;
  closingReason: string | null | undefined;
}): ReactNode | null => {
  if (closingDate && !closingReason) {
    return <DeadlineDialog deadline={parseDateTimeUtc(closingDate)} />;
  }

  if (closingReason) {
    return <ClosedEarlyDeadlineDialog />;
  }

  return null;
};

export const PoolAdvertisement_Fragment = graphql(/* GraphQL */ `
  fragment PoolAdvertisement on Pool {
    id
    name {
      en
      fr
    }
    workStream {
      id
      name {
        en
        fr
      }
    }
    closingDate
    closingReason
    status {
      value
      label {
        en
        fr
      }
    }
    language {
      value
      label {
        en
        fr
      }
    }
    securityClearance {
      value
      label {
        en
        fr
      }
    }
    department {
      name {
        en
        fr
      }
    }
    opportunityLength {
      value
      label {
        en
        fr
      }
    }
    classification {
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
    whatToExpectAdmission {
      en
      fr
    }
    aboutUs {
      en
      fr
    }
    poolSkills {
      id
      type {
        value
        label {
          en
          fr
        }
      }
      skill {
        id
        key
        category {
          value
          label {
            en
            fr
          }
        }
        name {
          en
          fr
        }
      }
      ...PoolSkillAccordion
    }
    isRemote
    location {
      en
      fr
    }
    workStream {
      id
      name {
        en
        fr
      }
    }
    processNumber
    publishingGroup {
      value
      label {
        en
        fr
      }
    }
    community {
      key
    }
    contactEmail

    ...AreaOfSelectionNote
    ...WhoCanApplyText
  }
`);

const moreInfoAccordions = {
  whoCanApply: "who-can-apply",
  dei: "diversity-equity-inclusion",
  accommodations: "accommodations",
  whatToExpectApply: "what-to-expect-apply",
  whatToExpectAdmission: "what-to-expect-admission",
  earlyApplication: "early-application",
  technicalIssues: "technical-issues",
  signInOrUpIssues: "sign-in-or-up-issues",
};

const subTitle = defineMessage({
  defaultMessage: "Learn more about this opportunity and begin an application.",
  id: "H5EXEi",
  description: "Subtitle for a pool advertisement page",
});

interface PoolAdvertisementProps {
  poolQuery: FragmentType<typeof PoolAdvertisement_Fragment>;
  applicationId?: Scalars["ID"]["output"];
  hasApplied?: boolean;
}

export const PoolPoster = ({
  poolQuery,
  applicationId,
  hasApplied,
}: PoolAdvertisementProps) => {
  const intl = useIntl();
  const locale = getLocale(intl);
  const paths = useRoutes();
  const logger = getLogger();
  const notAvailable = intl.formatMessage(commonMessages.notAvailable);
  const [moreInfoValue, setMoreInfoValue] = useState<string[]>([]);
  const [skillsValue, setSkillsValue] = useState<string[]>([]);
  const [linkCopied, setLinkCopied] = useState<boolean>(false);
  const pool = getFragment(PoolAdvertisement_Fragment, poolQuery);

  const departmentName = getLocalizedName(pool.department?.name, intl, true);

  const { classification } = pool;
  const genericJobTitles =
    classification?.genericJobTitles?.filter(notEmpty) ?? [];
  let classificationString = ""; // type wrangling the complex type into a string
  if (classification) {
    classificationString = formatClassificationString({
      group: classification?.group,
      level: classification?.level,
    });
  }
  const poolTitle = getShortPoolTitleLabel(intl, {
    workStream: pool.workStream,
    name: pool.name,
    publishingGroup: pool.publishingGroup,
    classification: pool.classification,
  });
  const fullPoolTitle = getFullPoolTitleLabel(intl, {
    workStream: pool.workStream,
    name: pool.name,
    publishingGroup: pool.publishingGroup,
    classification: pool.classification,
  });
  const formattedSubTitle = intl.formatMessage(subTitle);
  const workLocation = pool.isRemote
    ? intl.formatMessage(commonMessages.remote)
    : getLocalizedName(pool.location, intl);

  const showAboutUs = !!pool.aboutUs?.[locale];
  const showSpecialNote = !!pool.specialNote?.[locale];
  const showWhatToExpect = !!pool.whatToExpect?.[locale];
  const showWhatToExpectAdmission = !!pool.whatToExpectAdmission?.[locale];

  const opportunityLength = getLocalizedName(
    pool.opportunityLength?.label,
    intl,
    true,
  );

  const languageRequirement = getLocalizedName(
    pool.language?.label,
    intl,
    true,
  );

  const securityClearance = getLocalizedName(
    pool.securityClearance?.label,
    intl,
    true,
  );

  // Separate essential and asset skills, sort them by category, and confirm they include skill data
  const poolSkills = unpackMaybes(pool.poolSkills);
  const essentialPoolSkills = sortPoolSkillsBySkillCategory(
    poolSkills.filter(
      (poolSkill) => poolSkill.type?.value === PoolSkillType.Essential,
    ),
  );
  const nonessentialPoolSkills = sortPoolSkillsBySkillCategory(
    poolSkills.filter(
      (poolSkill) => poolSkill.type?.value === PoolSkillType.Nonessential,
    ),
  );

  const contactEmail =
    pool.contactEmail ?? intl.formatMessage(commonMessages.notFound);

  const canApply = !!(pool?.status?.value === PoolStatus.Published);

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

  const toggleSkillsValue = () => {
    if (skillsValue.length > 0) {
      setSkillsValue([]);
    } else {
      const essentialIds = essentialPoolSkills.map(
        (poolSkill) => poolSkill.skill?.id,
      );
      const nonEssentialIds = nonessentialPoolSkills.map(
        (poolSkill) => poolSkill.skill?.id,
      );

      setSkillsValue(unpackMaybes([...essentialIds, ...nonEssentialIds]));
    }
  };

  const applicationLinkProps: ApplicationLinkProps = {
    poolId: pool.id,
    applicationId,
    hasApplied,
    canApply,
  };

  const links = useBreadcrumbs({
    crumbs: [
      {
        label: intl.formatMessage(navigationMessages.browseJobs),
        url: paths.jobs(),
      },
      {
        label: poolTitle,
        url: paths.jobPoster(pool.id),
      },
    ],
  });

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
      title: intl.formatMessage(commonMessages.skillRequirements),
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

  let classificationGroup: ClassificationGroup;

  if (isClassificationGroup(pool.classification?.group)) {
    classificationGroup = pool.classification.group;
  } else {
    logger.error(`Unexpected classification: ${pool.classification?.group}`);
    classificationGroup = "IT";
  }

  return (
    <>
      <SEO title={poolTitle} description={formattedSubTitle} />
      <Hero title={poolTitle} subtitle={formattedSubTitle} crumbs={links} />
      <Container className="my-18">
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
            <ApplicationLink {...applicationLinkProps} />
            <Text className="flex flex-wrap gap-1.5">
              <span className="font-bold">
                {intl.formatMessage({
                  defaultMessage: "Share",
                  id: "E2nMR3",
                  description: "Label for sharing a pool advertisement",
                }) + intl.formatMessage(commonMessages.dividingColon)}
              </span>
              <Button
                mode="inline"
                color="primary"
                icon={linkCopied ? CheckIcon : undefined}
                onClick={async () => {
                  await navigator.clipboard.writeText(window.location.href);
                  setLinkCopied(true);
                  setTimeout(() => {
                    setLinkCopied(false);
                  }, 2000);
                }}
                aria-label={
                  linkCopied
                    ? intl.formatMessage({
                        defaultMessage: "Link copied",
                        id: "br+QLe",
                        description:
                          "Button text to indicate that a pool advertisements URL has been copied",
                      })
                    : intl.formatMessage(
                        {
                          defaultMessage: "Copy {title} URL to clipboard",
                          id: "QF/z5s",
                          description:
                            "Button text to copy a specific qualified recruitment's ID",
                        },
                        {
                          title: poolTitle,
                        },
                      )
                }
              >
                {linkCopied
                  ? intl.formatMessage({
                      defaultMessage: "Link copied",
                      id: "br+QLe",
                      description:
                        "Button text to indicate that a pool advertisements URL has been copied",
                    })
                  : intl.formatMessage({
                      defaultMessage: "Copy link",
                      id: "1HiKy8",
                      description:
                        "Button text to copy a pool advertisements URL",
                    })}
              </Button>
            </Text>
          </TableOfContents.Navigation>
          <TableOfContents.Content>
            <TableOfContents.Section id={sections.employmentDetails.id}>
              <div className="mb-6 flex flex-wrap items-baseline gap-x-6 gap-y-3">
                <div className="grow">
                  <TableOfContents.Heading
                    size="h3"
                    icon={MapIcon}
                    color="primary"
                    className="mt-0"
                  >
                    {sections.employmentDetails.title}
                  </TableOfContents.Heading>
                </div>
                <div className="mt-4.5 shrink-0 xs:mt-0">
                  <ApplicationLink
                    {...applicationLinkProps}
                    linkProps={{ mode: "inline", color: "primary" }}
                  />
                </div>
              </div>
              {showSpecialNote && (
                <Notice.Root className="my-6">
                  <Notice.Title as="h3">
                    {intl.formatMessage({
                      defaultMessage: "Special note for this process",
                      id: "cbwWa0",
                      description:
                        "Heading for a special note in pool advertisement.",
                    })}
                  </Notice.Title>
                  <Notice.Content>
                    <RichTextRenderer
                      node={htmlToRichTextJSON(
                        getLocalizedName(pool.specialNote, intl),
                      )}
                    />
                  </Notice.Content>
                </Notice.Root>
              )}
              <AreaOfSelectionWell poolQuery={pool} />

              <Card>
                <DataRow
                  hideSeparator
                  label={
                    intl.formatMessage({
                      defaultMessage: "Work category",
                      id: "pVCsBB",
                      description: "Label for pool advertisement stream",
                    }) + intl.formatMessage(commonMessages.dividingColon)
                  }
                  value={getLocalizedName(pool?.workStream?.name, intl)}
                  suffix={
                    classification?.group === "IT" ? (
                      <IconLink
                        external
                        newTab
                        href={
                          locale === "fr"
                            ? "https://www.canada.ca/fr/gouvernement/systeme/gouvernement-numerique/collectivite-gcnumerique/carriere-domaine-numerique.html#technologies-information"
                            : "https://www.canada.ca/en/government/system/digital-government/gcdigital-community/careers-digital.html#information-technology"
                        }
                        icon={InformationCircleIcon}
                        label={intl.formatMessage({
                          defaultMessage:
                            "Information technology (IT) work streams (opens in new tab)",
                          id: "qLuX+k",
                          description:
                            "Link text to more information about information technology work streams",
                        })}
                      />
                    ) : undefined
                  }
                />
                <DataRow
                  label={
                    intl.formatMessage(commonMessages.department) +
                    intl.formatMessage(commonMessages.dividingColon)
                  }
                  value={departmentName}
                />
                <DataRow
                  label={
                    intl.formatMessage(commonMessages.salaryRange) +
                    intl.formatMessage(commonMessages.dividingColon)
                  }
                  value={
                    localizeSalaryRange(
                      classification?.minSalary,
                      classification?.maxSalary,
                      locale,
                    ) ?? notAvailable
                  }
                  suffix={<SalaryRangeDialog />}
                />
                <DataRow
                  label={
                    intl.formatMessage(commonMessages.deadline) +
                    intl.formatMessage(commonMessages.dividingColon)
                  }
                  value={
                    <DeadlineValue
                      closingDate={pool.closingDate}
                      closingReason={pool.closingReason}
                    />
                  }
                  suffix={
                    <DeadlineDialogReturn
                      closingDate={pool.closingDate}
                      closingReason={pool.closingReason}
                    />
                  }
                />
                <DataRow
                  label={
                    intl.formatMessage(commonMessages.employmentLength) +
                    intl.formatMessage(commonMessages.dividingColon)
                  }
                  value={opportunityLength}
                  suffix={
                    <IconLink
                      newTab
                      external
                      color="primary"
                      icon={InformationCircleIcon}
                      href={
                        locale === "fr"
                          ? "https://www.canada.ca/fr/services-publics-approvisionnement/services/paye-pension/communaute-remuneration/procedures-soutien-employeur/emploi-fonction-publique-federale.html#a4"
                          : "https://www.canada.ca/en/public-services-procurement/services/pay-pension/compensation-community/employer-support-procedures/employment-federal-public-service.html#a4"
                      }
                      label={intl.formatMessage({
                        defaultMessage:
                          "Learn more about employment durations (opens in new tab)",
                        id: "RuLbg4",
                        description:
                          "Link text for employment durations information",
                      })}
                    />
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
                  suffix={<LanguageRequirementDialog />}
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
                  suffix={<SecurityClearanceDialog />}
                />
                {pool.processNumber && (
                  <DataRow
                    label={
                      intl.formatMessage({
                        defaultMessage: "Selection process number",
                        id: "H6seW1",
                        description:
                          "Label for pool advertisement selection process number",
                      }) + intl.formatMessage(commonMessages.dividingColon)
                    }
                    value={pool.processNumber}
                  />
                )}
              </Card>
            </TableOfContents.Section>
            <TableOfContents.Section id={sections.minEducation.id}>
              <TableOfContents.Heading
                size="h3"
                icon={AcademicCapIcon}
                color="secondary"
                className="mt-18 mb-6"
              >
                {sections.minEducation.title}
              </TableOfContents.Heading>
              <Text className="mb-6">
                {intl.formatMessage(
                  {
                    defaultMessage:
                      "This role requires a minimum amount of experience or a relevant degree. All applicants must meet one of the criteria outlined in this section in order to be considered. If you meet more than one of the options provided, you'll be able to specify which option you feel best represents your experience. You can learn more about education and equivalency by visiting the <link>Government of Canada's qualification standard</link>.",
                    id: "gXFpR1",
                    description:
                      "Description of minimum education requirements",
                  },
                  {
                    link: (chunks: ReactNode) => standardsLink(locale, chunks),
                  },
                )}
              </Text>
              <EducationRequirements
                isIAP={pool.publishingGroup?.value === PublishingGroup.Iap}
                classificationGroup={classificationGroup}
              />
            </TableOfContents.Section>
            <TableOfContents.Section id={sections.skillRequirements.id}>
              <div className="mb-6 flex flex-wrap items-baseline gap-x-6 gap-y-3">
                <div className="grow">
                  <TableOfContents.Heading
                    size="h3"
                    icon={BoltIcon}
                    color="warning"
                    className="mt-18 mb-0"
                  >
                    {sections.skillRequirements.title}
                  </TableOfContents.Heading>
                </div>
                <div className="shrink-0">
                  <Button
                    mode="inline"
                    color="primary"
                    onClick={toggleSkillsValue}
                    aria-label={
                      skillsValue.length > 0
                        ? intl.formatMessage({
                            defaultMessage: "Collapse all skills",
                            id: "+PGnDL",
                            description:
                              "Accessible link text to collapse all accordions for skills",
                          })
                        : intl.formatMessage({
                            defaultMessage: "Expand all skills",
                            id: "MZSPTS",
                            description:
                              "Accessible link text to expand all accordions for skills",
                          })
                    }
                  >
                    {intl.formatMessage(
                      skillsValue.length > 0
                        ? uiMessages.collapseAll
                        : uiMessages.expandAll,
                    )}
                  </Button>
                </div>
              </div>
              <Text>
                {intl.formatMessage({
                  defaultMessage:
                    'In order to apply for this job you will need to be able to demonstrate that you have <strong>all the skills</strong> marked <heavySecondary>"Required"</heavySecondary>. If you have any of the <heavyPrimary>"Optional"</heavyPrimary> skills you are encouraged to include them because it will increase your chances of a job placement.',
                  id: "3Z4fra",
                  description:
                    "Descriptive text about how skills are defined and used for pool advertisements and applications",
                })}
              </Text>
              <Text>
                {intl.formatMessage({
                  defaultMessage:
                    'To make the application process shorter, information is only collected on specific skills during the application stage. These are each identified under the skill name using "Assessed during initial application". Additional assessments will follow later if your application is successful. These additional assessments may be conducted on any of the required or optional skills.',
                  id: "Qxl9Ec",
                  description:
                    "Descriptive text about how skills are used during the application process",
                })}
              </Text>
              <SkillLevelDialog />
              <Accordion.Root
                type="multiple"
                mode="card"
                size="sm"
                className="mt-6"
                value={skillsValue}
                onValueChange={setSkillsValue}
              >
                {essentialPoolSkills.map((poolSkill) => (
                  <SkillAccordion
                    key={poolSkill.id}
                    poolSkillQuery={poolSkill}
                    required
                  />
                ))}
                {nonessentialPoolSkills.map((poolSkill) => (
                  <SkillAccordion
                    key={poolSkill.id}
                    poolSkillQuery={poolSkill}
                    required={false}
                  />
                ))}
              </Accordion.Root>
            </TableOfContents.Section>
            <TableOfContents.Section id={sections.aboutRole.id}>
              <TableOfContents.Heading
                size="h3"
                icon={ClipboardDocumentIcon}
                color="error"
                className="mt-18 mb-6"
              >
                {sections.aboutRole.title}
              </TableOfContents.Heading>
              {pool.yourImpact && (
                <>
                  <Heading level="h3" size="h4" className="mb-6 font-bold">
                    {intl.formatMessage(processMessages.yourImpact)}
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
                  <Heading level="h3" size="h4" className="mb-6 font-bold">
                    {intl.formatMessage(processMessages.keyTasks)}
                  </Heading>
                  <RichTextRenderer
                    node={htmlToRichTextJSON(
                      getLocalizedName(pool.keyTasks, intl),
                    )}
                  />
                </>
              )}
              {showAboutUs && (
                <>
                  <Heading level="h3" size="h4" className="mb-6 font-bold">
                    {intl.formatMessage({
                      defaultMessage: "About us",
                      id: "LTpCFL",
                      description:
                        "Title for about us section on a pool advertisement.",
                    })}
                  </Heading>
                  <RichTextRenderer
                    node={htmlToRichTextJSON(
                      getLocalizedName(pool.aboutUs, intl),
                    )}
                  />
                </>
              )}
            </TableOfContents.Section>
            <TableOfContents.Section id={sections.moreInfo.id}>
              <div className="mb-6 flex flex-wrap items-baseline gap-x-6 gap-y-3">
                <div className="grow">
                  <TableOfContents.Heading
                    size="h3"
                    icon={QuestionMarkCircleIcon}
                    color="success"
                    className="m-t18 mb-0"
                  >
                    {sections.moreInfo.title}
                  </TableOfContents.Heading>
                </div>
                <div className="shrink-0">
                  <Button
                    mode="inline"
                    color="primary"
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
                size="sm"
                value={moreInfoValue}
                onValueChange={setMoreInfoValue}
              >
                <Accordion.Item value={moreInfoAccordions.whoCanApply}>
                  <Accordion.Trigger as="h3">
                    {intl.formatMessage({
                      defaultMessage:
                        "Who can apply to this recruitment process?",
                      id: "Y63cqS",
                      description:
                        "Button text to toggle the accordion for who can apply",
                    })}
                  </Accordion.Trigger>
                  <Accordion.Content>
                    <WhoCanApplyText poolQuery={pool} />
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
                  <Accordion.Trigger as="h3">
                    {intl.formatMessage({
                      defaultMessage:
                        "How are equity and inclusion considered in this recruitment process?",
                      id: "mDsQmj",
                      description:
                        "Button text to toggle the accordion for diversity, equity, and inclusion",
                    })}
                  </Accordion.Trigger>
                  <Accordion.Content>
                    <Text className="my-0">
                      {intl.formatMessage(
                        {
                          defaultMessage:
                            "You can learn more about how our team uses employment equity information to shape equity and diversity in hiring by reading our <inclusivityLink>Inclusivity and equity statement</inclusivityLink>. We also provide an <accessibilityLink>Accessibility statement</accessibilityLink> that outline how the platform considers and implements accessible best practices.",
                          id: "RJlpxV",
                          description:
                            "Information on commitment to diversity, equity, and inclusion",
                        },
                        {
                          accessibilityLink: (chunks: ReactNode) =>
                            internalLink(paths.accessibility(), chunks),
                          inclusivityLink: (chunks: ReactNode) =>
                            internalLink(paths.inclusivityEquity(), chunks),
                        },
                      )}
                    </Text>
                  </Accordion.Content>
                </Accordion.Item>
                <Accordion.Item value={moreInfoAccordions.earlyApplication}>
                  <Accordion.Trigger as="h3">
                    {intl.formatMessage({
                      defaultMessage:
                        "How early should I start my application?",
                      id: "YqutpD",
                      description:
                        "Button text to toggle the accordion for early application",
                    })}
                  </Accordion.Trigger>
                  <Accordion.Content>
                    <Text className="my-0">
                      {intl.formatMessage(
                        {
                          defaultMessage:
                            "We recommend starting your application as early as possible. This way, you'll have time to contact us in case of any technical issues. If you don't have an account yet, you'll need to <gcDigitalTalentLink>sign up for a GCkey</gcDigitalTalentLink> to start your application. Expect to spend approximately 20 minutes signing up for the first time.",
                          id: "G0AEfY",
                          description:
                            "Text explaining the importance of starting an application early",
                        },
                        {
                          gcDigitalTalentLink: (chunks: ReactNode) =>
                            internalLink(paths.register(), chunks),
                        },
                      )}
                      <Text>
                        {intl.formatMessage({
                          defaultMessage:
                            "First-time users report spending between 2 to 3 hours on average on their first application. The second time you apply, it should take significantly less time since we'll reuse most of your information. Return users spend on average between 30 minutes to 1 hour on each application.",
                          id: "adaiV0",
                          description:
                            "Text explaining the average time spent on applications",
                        })}
                      </Text>
                      <Text>
                        {intl.formatMessage({
                          defaultMessage:
                            "Applying early also allows hiring managers to review your application sooner. They can begin assessing your application as soon as you submit it, even if the deadline hasn't passed yet.",
                          id: "ay8mcT",
                          description:
                            "Text explaining the benefits of applying early",
                        })}
                      </Text>
                    </Text>
                  </Accordion.Content>
                </Accordion.Item>
                {showWhatToExpect && (
                  <Accordion.Item value={moreInfoAccordions.whatToExpectApply}>
                    <Accordion.Trigger as="h3">
                      {intl.formatMessage({
                        defaultMessage: "What should I expect after I apply?",
                        id: "PDGUT2",
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

                {showWhatToExpectAdmission && (
                  <Accordion.Item
                    value={moreInfoAccordions.whatToExpectAdmission}
                  >
                    <Accordion.Trigger as="h3">
                      {intl.formatMessage({
                        defaultMessage:
                          "What should I expect if I'm successful in the process?",
                        id: "utlf9l",
                        description:
                          "Button text to toggle the accordion for what to expect after admission",
                      })}
                    </Accordion.Trigger>
                    <Accordion.Content>
                      <RichTextRenderer
                        node={htmlToRichTextJSON(
                          getLocalizedName(pool.whatToExpectAdmission, intl),
                        )}
                      />
                    </Accordion.Content>
                  </Accordion.Item>
                )}
                <Accordion.Item value={moreInfoAccordions.technicalIssues}>
                  <Accordion.Trigger as="h3">
                    {intl.formatMessage({
                      defaultMessage:
                        "What should I do if I experience technical issues while applying?",
                      id: "8T/Szk",
                      description:
                        "Button text to toggle the accordion for technical issues",
                    })}
                  </Accordion.Trigger>
                  <Accordion.Content>
                    <Text className="my-0">
                      {intl.formatMessage(
                        {
                          defaultMessage:
                            "<link>Contact our support team</link> as soon as possible when you encounter a technical issue that could prevent you from applying. You can submit a ticket at any time to let us know about the difficulties you're experiencing. It's important to do this as soon as the issue arises so we can keep a record of when it happened, even if it's outside of business hours.",
                          id: "oGNR16",
                          description:
                            "Text explaining the importance of reporting technical issues",
                        },
                        {
                          link: (chunks: ReactNode) =>
                            internalLink(paths.support(), chunks),
                        },
                      )}
                      <Text>
                        {intl.formatMessage({
                          defaultMessage:
                            "We review tickets during business hours. If you report an issue late at night, right before a job advertisement deadline, expect a response within 2 business days. To avoid last-minute issues, we encourage you to submit your application as early as possible.",
                          id: "b9gGFH",
                          description:
                            "Text explaining the average time spent on applications",
                        })}
                      </Text>
                      <Text>
                        {intl.formatMessage({
                          defaultMessage:
                            "If you submit your ticket after the application deadline has passed, we won't be able to assist you, and your application won't be accepted.",
                          id: "4DfNUW",
                          description:
                            "Text explaining the benefits of applying early",
                        })}
                      </Text>
                    </Text>
                  </Accordion.Content>
                </Accordion.Item>
                <Accordion.Item value={moreInfoAccordions.signInOrUpIssues}>
                  <Accordion.Trigger as="h3">
                    {intl.formatMessage({
                      defaultMessage:
                        "What should I do if I have trouble signing up or signing in?",
                      id: "w061Za",
                      description:
                        "Button text to toggle the accordion for sign in or up issues",
                    })}
                  </Accordion.Trigger>
                  <Accordion.Content>
                    <Text className="m-y0">
                      {intl.formatMessage(
                        {
                          defaultMessage:
                            "We've set up <link>a guide explaining how to set up GCKey and two-factor authentication</link>. We also have <use2FALink>instructions on how to use two-factor authentication to log in</use2FALink>. If the issue persists, contact us.",
                          id: "MYnfw/",
                          description:
                            "Text explaining the importance of reporting technical issues",
                        },
                        {
                          link: (chunks: ReactNode) =>
                            internalLink(paths.register(), chunks),
                          use2FALink: (chunks: ReactNode) =>
                            internalLink(paths.login(), chunks),
                        },
                      )}
                    </Text>
                    <Text>
                      <Ul className="mt-3">
                        <li>
                          {intl.formatMessage(
                            {
                              defaultMessage:
                                "For trouble creating a GCKey, <link>contact the GCKey team</link>.",
                              id: "YzGpQQ",
                              description:
                                "Bullet point about contacting GCKey support",
                            },
                            {
                              link: (chunks: ReactNode) =>
                                gocGCKeyLink(locale, chunks),
                            },
                          )}
                        </li>
                        <li>
                          {intl.formatMessage(
                            {
                              defaultMessage:
                                "For trouble setting up or logging in with two-factor authentication, <link>contact our support team</link>.",
                              id: "k1HxPf",
                              description:
                                "Bullet point about contacting support for 2FA issues",
                            },
                            {
                              link: (chunks: ReactNode) =>
                                internalLink(paths.support(), chunks),
                            },
                          )}
                        </li>
                      </Ul>
                    </Text>
                  </Accordion.Content>
                </Accordion.Item>
                <Accordion.Item value={moreInfoAccordions.accommodations}>
                  <Accordion.Trigger as="h3">
                    {intl.formatMessage({
                      defaultMessage:
                        "Who can I contact with questions or accommodation needs?",
                      id: "2/fjEP",
                      description:
                        "Button text to toggle the accordion for accommodations contact",
                    })}
                  </Accordion.Trigger>
                  <Accordion.Content>
                    <Text className="my-0">
                      {intl.formatMessage(
                        {
                          defaultMessage:
                            "For accommodation requests or questions about this process, please contact the recruitment team at <link>{contactEmail}</link>.",
                          id: "bz55F8",
                          description:
                            "Opening sentence asking if accommodations are needed",
                        },
                        {
                          contactEmail,
                          link: () => contactEmailTag(contactEmail),
                        },
                      )}
                    </Text>
                  </Accordion.Content>
                </Accordion.Item>
              </Accordion.Root>
            </TableOfContents.Section>
            <TableOfContents.Section id={sections.startAnApplication.id}>
              <TableOfContents.Heading
                size="h3"
                icon={RocketLaunchIcon}
                color="primary"
                className="mt-18 mb-6"
              >
                {sections.startAnApplication.title}
              </TableOfContents.Heading>
              <Text>
                {intl.formatMessage(
                  {
                    defaultMessage:
                      "If you feel like your skills and experience are a good fit for the <strong>{title}</strong> role, we'd love to hear from you!",
                    id: "qvfSHZ",
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
              <ApplicationLink {...applicationLinkProps} />
            </TableOfContents.Section>
            {pool.processNumber && (
              <>
                <Separator orientation="horizontal" space="sm" decorative />
                <p className="text-right text-gray-600 dark:text-gray-200">
                  {intl.formatMessage({
                    defaultMessage: "Selection process number",
                    id: "LdlxBV",
                    description: "Label for a process number",
                  })}
                  {intl.formatMessage(commonMessages.dividingColon)}
                  {pool.processNumber}
                </p>
              </>
            )}
          </TableOfContents.Content>
        </TableOfContents.Wrapper>
      </Container>
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

interface RouteParams extends Record<string, string> {
  poolId: Scalars["ID"]["output"];
}

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
      ...PoolAdvertisement
      id
      status {
        value
      }
    }
  }
`);

export const Component = () => {
  const { poolId } = useRequiredParams<RouteParams>("poolId", true);
  const auth = useAuthorization();

  const [{ data, fetching, error }] = useQuery({
    query: PoolAdvertisementPage_Query,
    variables: { id: poolId },
  });

  const isVisible = isAdvertisementVisible(
    auth?.roleAssignments?.filter(notEmpty) ?? [],
    data?.pool?.status?.value ?? null,
  );

  // Attempt to find an application for this user+pool combination
  const application = data?.me?.poolCandidates?.find(
    (candidate) => candidate?.pool.id === data.pool?.id,
  );

  return (
    <Pending fetching={fetching} error={error}>
      {data?.pool && isVisible ? (
        <PoolPoster
          poolQuery={data?.pool}
          applicationId={application?.id}
          hasApplied={notEmpty(application?.submittedAt)}
        />
      ) : (
        <PoolNotFound />
      )}
    </Pending>
  );
};

Component.displayName = "PoolAdvertisementPage";

export default Component;
