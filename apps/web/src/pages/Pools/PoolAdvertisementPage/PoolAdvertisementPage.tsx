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
  Well,
  CardBasic,
  Button,
  Separator,
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
  Maybe,
  PoolSkillType,
  FragmentType,
  getFragment,
} from "@gc-digital-talent/graphql";
import { useLogger } from "@gc-digital-talent/logger";

import {
  formatClassificationString,
  getFullPoolTitleHtml,
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

import Text from "./components/Text";
import DataRow from "./components/DataRow";
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

interface SectionContent {
  id: string;
  linkText?: string;
  title: string;
}

const anchorTag = (chunks: ReactNode, email?: Maybe<string>) => {
  return email ? (
    <Link external href={`mailto:${email}`}>
      {chunks}
    </Link>
  ) : (
    <>{chunks}</>
  );
};

const internalLink = (href: string, chunks: ReactNode) => (
  <Link href={href}>{chunks}</Link>
);

const standardsLink = (locale: Locales, chunks: ReactNode) => (
  <Link
    newTab
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
  const logger = useLogger();
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
  const fullPoolTitle = getFullPoolTitleHtml(intl, {
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

  // TODO: community does have a contactEmail field
  const contactEmail = "";

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
        url: paths.browsePools(),
      },
      {
        label: poolTitle,
        url: paths.pool(pool.id),
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
      <div
        data-h2-wrapper="base(center, large, x1) p-tablet(center, large, x2)"
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
            <ApplicationLink {...applicationLinkProps} />
            <Text
              data-h2-display="base(flex)"
              data-h2-gap="base(x.25)"
              data-h2-flex-wrap="base(wrap)"
            >
              <span data-h2-font-weight="base(700)">
                {intl.formatMessage({
                  defaultMessage: "Share",
                  id: "E2nMR3",
                  description: "Label for sharing a pool advertisement",
                }) + intl.formatMessage(commonMessages.dividingColon)}
              </span>
              <Button
                mode="inline"
                color="secondary"
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
              <div
                data-h2-align-items="base(baseline)"
                data-h2-display="base(flex)"
                data-h2-gap="base(x.5 x1)"
                data-h2-flex-wrap="base(wrap)"
                data-h2-margin-bottom="base(x1)"
              >
                <div data-h2-flex-grow="base(1)">
                  <TableOfContents.Heading
                    size="h3"
                    icon={MapIcon}
                    color="primary"
                    data-h2-margin="base(0)"
                  >
                    {sections.employmentDetails.title}
                  </TableOfContents.Heading>
                </div>
                <div
                  data-h2-flex-shrink="base(0)"
                  data-h2-margin-top="base(x.75) p-tablet(0)"
                >
                  <ApplicationLink
                    {...applicationLinkProps}
                    linkProps={{ mode: "inline", color: "primary" }}
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
              <AreaOfSelectionWell poolQuery={pool} />

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
                  value={getLocalizedName(pool?.workStream?.name, intl)}
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
                        // eslint-disable-next-line formatjs/no-literal-string-in-jsx
                        aria-label={`${intl.formatMessage({
                          defaultMessage:
                            "Information technology (IT) work streams",
                          id: "FZ5qdE",
                          description:
                            "Link text to more information about information technology work streams",
                        })} ${intl.formatMessage(uiMessages.newTab)}`}
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
                    <Link
                      newTab
                      external
                      color="secondary"
                      mode="icon_only"
                      icon={InformationCircleIcon}
                      href={
                        locale === "fr"
                          ? "https://www.tpsgc-pwgsc.gc.ca/remuneration-compensation/collectivite-community/employeur-employer/emplfpf-emplfps-fra.html#a8"
                          : "https://www.tpsgc-pwgsc.gc.ca/remuneration-compensation/collectivite-community/employeur-employer/emplfpf-emplfps-eng.html#a8"
                      }
                      // eslint-disable-next-line formatjs/no-literal-string-in-jsx
                      aria-label={`${intl.formatMessage({
                        defaultMessage: "Learn more about employment durations",
                        id: "zlHeEz",
                        description:
                          "Link text for employment durations information",
                      })} ${intl.formatMessage(uiMessages.newTab)}`}
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
                    intl.formatMessage(commonMessages.securityClearance) +
                    intl.formatMessage(commonMessages.dividingColon)
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
                      // eslint-disable-next-line formatjs/no-literal-string-in-jsx
                      aria-label={`${intl.formatMessage({
                        defaultMessage: "Learn more about security clearances",
                        id: "WlMSeh",
                        description:
                          "Link text for security clearance information",
                      })} ${intl.formatMessage(uiMessages.newTab)}`}
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
              <Text data-h2-margin-bottom="base(x1)">
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
              <div
                data-h2-align-items="base(baseline)"
                data-h2-display="base(flex)"
                data-h2-gap="base(x.5 x1)"
                data-h2-flex-wrap="base(wrap)"
                data-h2-margin-bottom="base(x1)"
              >
                <div data-h2-flex-grow="base(1)">
                  <TableOfContents.Heading
                    size="h3"
                    icon={BoltIcon}
                    color="quaternary"
                    data-h2-margin="base(x3, 0, 0, 0)"
                  >
                    {sections.skillRequirements.title}
                  </TableOfContents.Heading>
                </div>
                <div data-h2-flex-shrink="base(0)">
                  <Button
                    mode="inline"
                    color="secondary"
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
                    'In order to apply for this job you will need to be able to demonstrate that you have <strong>all the skills</strong> marked <heavyPrimary>"Required"</heavyPrimary>. If you have any of the <heavySecondary>"Optional"</heavySecondary> skills you are encouraged to include them because it will increase your chances of a job placement.',
                  id: "eihm6A",
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
                data-h2-margin-top="base(x1)"
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
                    data-h2-margin-bottom="base(x1)"
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
                    data-h2-margin-bottom="base(x1)"
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
              {showAboutUs && (
                <>
                  <Heading
                    level="h3"
                    size="h4"
                    data-h2-font-weight="base(700)"
                    data-h2-margin-bottom="base(x1)"
                  >
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
              <div
                data-h2-align-items="base(baseline)"
                data-h2-display="base(flex)"
                data-h2-gap="base(x.5 x1)"
                data-h2-flex-wrap="base(wrap)"
                data-h2-margin-bottom="base(x1)"
              >
                <div data-h2-flex-grow="base(1)">
                  <TableOfContents.Heading
                    size="h3"
                    icon={QuestionMarkCircleIcon}
                    color="quinary"
                    data-h2-margin="base(x3, 0, 0, 0)"
                  >
                    {sections.moreInfo.title}
                  </TableOfContents.Heading>
                </div>
                <div data-h2-flex-shrink="base(0)">
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
                    <Text data-h2-margin="base(0)">
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
                    <Text data-h2-margin="base(0)">
                      {intl.formatMessage(
                        {
                          defaultMessage:
                            "Please <a>contact the team</a> by email if you have <strong>any questions</strong> or <strong>require an accommodation</strong> during this process.",
                          id: "YK/RNP",
                          description:
                            "Opening sentence asking if accommodations are needed",
                        },
                        {
                          a: (chunks: ReactNode) =>
                            anchorTag(chunks, contactEmail), // TODO: what is the new source of the contactEmail?
                        },
                      )}
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
                <p
                  data-h2-text-align="base(right)"
                  data-h2-color="base(black.light)"
                >
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
