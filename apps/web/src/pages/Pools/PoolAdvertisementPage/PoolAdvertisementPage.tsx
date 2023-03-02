import React from "react";
import { useIntl } from "react-intl";
import { useParams } from "react-router-dom";
import {
  BoltIcon,
  BriefcaseIcon as BriefcaseIconOutline,
  PhoneIcon,
  LightBulbIcon,
  CheckCircleIcon,
  CpuChipIcon,
  CloudIcon,
} from "@heroicons/react/24/outline";

import {
  Button,
  ThrowNotFound,
  Pending,
  Card,
  Link,
  Accordion,
  TableOfContents,
} from "@gc-digital-talent/ui";
import {
  getLocale,
  getLanguageRequirement,
  getSecurityClearance,
} from "@gc-digital-talent/i18n";
import { notEmpty } from "@gc-digital-talent/helpers";
import { useAuthorization } from "@gc-digital-talent/auth";

import {
  AdvertisementStatus,
  Scalars,
  SkillCategory,
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
import { TALENTSEARCH_RECRUITMENT_EMAIL } from "~/constants/talentSearchConstants";

import PoolInfoCard from "./components/PoolInfoCard";
import ClassificationDefinition from "./components/ClassificationDefinition";

interface ApplyButtonProps {
  poolId: Scalars["ID"];
}

const ApplyButton = ({ poolId }: ApplyButtonProps) => {
  const intl = useIntl();
  const paths = useRoutes();

  return (
    <Link
      type="button"
      mode="solid"
      color="primary"
      href={paths.createApplication(poolId)}
    >
      {intl.formatMessage({
        defaultMessage: "Apply for this process",
        id: "W2YIEA",
        description: "Link text to apply for a pool advertisement",
      })}
    </Link>
  );
};

interface ContinueButtonProps {
  applicationId: Scalars["ID"];
}

const ContinueButton = ({ applicationId }: ContinueButtonProps) => {
  const intl = useIntl();
  const paths = useRoutes();

  return (
    <Link
      type="button"
      mode="solid"
      color="primary"
      href={paths.reviewApplication(applicationId)}
    >
      {intl.formatMessage({
        defaultMessage: "Continue my application",
        id: "ugosop",
        description: "Link text to continue an existing application",
      })}
    </Link>
  );
};

const AlreadyAppliedButton = () => {
  const intl = useIntl();
  return (
    <Button type="button" color="primary" mode="solid" disabled>
      {intl.formatMessage({
        defaultMessage: "You have already applied to this.",
        id: "mwEGU+",
        description:
          "Disabled button when a user already applied to a pool opportunity",
      })}
    </Button>
  );
};

const Text = ({ children }: { children: React.ReactNode }) => (
  <p data-h2-margin="base(0, 0, x.5, 0)">{children}</p>
);
interface IconTitleProps {
  children: React.ReactNode;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
}

const IconTitle = ({ children, icon }: IconTitleProps) => {
  const Icon = icon;

  return (
    <h3
      data-h2-display="base(flex)"
      data-h2-align-items="base(center)"
      data-h2-font-size="base(h4, 1)"
      data-h2-margin="base(x2, 0, x1, 0)"
    >
      <Icon style={{ width: "1em", marginRight: "0.5rem" }} />
      <span>{children}</span>
    </h3>
  );
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

  const classification = poolAdvertisement.classifications
    ? poolAdvertisement.classifications[0]
    : null;
  const genericTitle = classification?.genericJobTitles?.length
    ? classification.genericJobTitles[0]
    : null;
  let classificationSuffix = ""; // type wrangling the complex type into a string
  if (classification) {
    classificationSuffix = formatClassificationString({
      group: classification?.group,
      level: classification?.level,
    });
  }
  const fullTitle = getFullPoolAdvertisementTitleLabel(intl, poolAdvertisement);
  const canApply =
    poolAdvertisement.advertisementStatus &&
    poolAdvertisement.advertisementStatus === AdvertisementStatus.Published;

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

  let applyBtn = <ApplyButton poolId={poolAdvertisement.id} />;
  if (applicationId) {
    applyBtn = !hasApplied ? (
      <ContinueButton applicationId={applicationId} />
    ) : (
      <AlreadyAppliedButton />
    );
  }

  const links = [
    {
      label: intl.formatMessage({
        defaultMessage: "Browse opportunities",
        id: "NSuNSA",
        description: "Breadcrumb title for the browse pools page.",
      }),
      url: paths.allPools(),
    },
    {
      label: fullTitle,
      url: paths.pool(poolAdvertisement.id),
    },
  ];

  const sections: Record<string, { id: string; title: string }> = {
    about: {
      id: "about-section",
      title: intl.formatMessage({
        defaultMessage: "About this process",
        id: "18dDgn",
        description: "Title for the about section of a pool advertisement",
      }),
    },
    requiredSkills: {
      id: "required-skills-section",
      title: intl.formatMessage({
        defaultMessage: "Need to have",
        id: "WkX8Ge",
        description:
          "Title for the required skills section of a pool advertisement",
      }),
    },
    optionalSkills: {
      id: "optional-skills-section",
      title: intl.formatMessage({
        defaultMessage: "Nice to have",
        id: "STLaIq",
        description:
          "Title for the optional skills section of a pool advertisement",
      }),
    },
    requirements: {
      id: "requirements-section",
      title: intl.formatMessage({
        defaultMessage: "Requirements",
        id: "iP8EMf",
        description:
          "Title for the requirements section of a pool advertisement",
      }),
    },
    details: {
      id: "details-section",
      title: intl.formatMessage({
        defaultMessage: "Additional details",
        id: "mNWpoy",
        description: "Title for the details section of a pool advertisement",
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
      <Hero title={fullTitle} crumbs={links} />
      <div
        data-h2-background-color="base(dt-white)"
        data-h2-shadow="base(m)"
        data-h2-padding="base(x1, 0)"
      >
        <div data-h2-container="base(center, medium, 0)">
          <div
            data-h2-display="base(flex)"
            data-h2-flex-direction="base(column) p-tablet(row)"
            data-h2-justify-content="base(space-between)"
            data-h2-align-items="base(center) p-tablet(flex-end)"
            data-h2-margin="base(x1, 0, 0, 0)"
          >
            <div>
              <PoolInfoCard
                closingDate={poolAdvertisement.closingDate}
                classification={classificationSuffix}
                salary={{
                  min: classification?.minSalary,
                  max: classification?.maxSalary,
                }}
              />
            </div>
            <div>{applyBtn}</div>
          </div>
        </div>
      </div>
      <TableOfContents.Wrapper>
        <TableOfContents.Navigation data-h2-padding="base(0, x2, 0, x2) l-tablet(0, 0, 0, 0)">
          <TableOfContents.AnchorLink id={sections.about.id}>
            {sections.about.title}
          </TableOfContents.AnchorLink>
          <TableOfContents.AnchorLink id={sections.requiredSkills.id}>
            {sections.requiredSkills.title}
          </TableOfContents.AnchorLink>
          <TableOfContents.AnchorLink id={sections.optionalSkills.id}>
            {sections.optionalSkills.title}
          </TableOfContents.AnchorLink>
          <TableOfContents.AnchorLink id={sections.requirements.id}>
            {sections.requirements.title}
          </TableOfContents.AnchorLink>
          <TableOfContents.AnchorLink id={sections.details.id}>
            {sections.details.title}
          </TableOfContents.AnchorLink>
          <TableOfContents.AnchorLink id={sections.apply.id}>
            {sections.apply.title}
          </TableOfContents.AnchorLink>
        </TableOfContents.Navigation>
        <TableOfContents.Content data-h2-padding="base(0, x2, 0, x2) l-tablet(0, x2, 0, 0)">
          <TableOfContents.Section id={sections.about.id}>
            <TableOfContents.Heading data-h2-margin="base(x3, 0, x1, 0)">
              {sections.about.title}
            </TableOfContents.Heading>
            <Accordion.Root type="single" collapsible>
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
                </Accordion.Content>
              </Accordion.Item>
              {genericTitle?.key && (
                <Accordion.Item value="what">
                  <Accordion.Trigger>
                    {intl.formatMessage(
                      {
                        defaultMessage:
                          "What does {classification}{genericTitle} mean?",
                        id: "gpuTAV",
                        description:
                          "Title for description of a pool advertisements classification group/level",
                      },
                      {
                        classification: classificationSuffix,
                        genericTitle: genericTitle?.name
                          ? ` ${genericTitle.name[locale]}`
                          : ``,
                      },
                    )}
                  </Accordion.Trigger>
                  <Accordion.Content>
                    <ClassificationDefinition name={genericTitle.key} />
                  </Accordion.Content>
                </Accordion.Item>
              )}
            </Accordion.Root>
            {poolAdvertisement.yourImpact ? (
              <>
                <IconTitle icon={BoltIcon}>
                  {intl.formatMessage({
                    defaultMessage: "Your impact",
                    id: "Kl5OX1",
                    description:
                      "Title for a pool advertisements impact section.",
                  })}
                </IconTitle>
                <p>{poolAdvertisement.yourImpact[locale]}</p>
              </>
            ) : null}
            {poolAdvertisement.keyTasks ? (
              <>
                <IconTitle icon={BriefcaseIconOutline}>
                  {intl.formatMessage({
                    defaultMessage: "Your work",
                    id: "uv2lY0",
                    description:
                      "Title for a pool advertisements key tasks section.",
                  })}
                </IconTitle>
                <p>{poolAdvertisement.keyTasks[locale]}</p>
              </>
            ) : null}
          </TableOfContents.Section>
          <TableOfContents.Section id={sections.requiredSkills.id}>
            <TableOfContents.Heading data-h2-margin="base(x3, 0, 0, 0)">
              {sections.requiredSkills.title}
            </TableOfContents.Heading>
            {essentialSkills[SkillCategory.Technical]?.length ? (
              <>
                <IconTitle icon={CpuChipIcon}>
                  {intl.formatMessage({
                    defaultMessage: "Occupational skills",
                    id: "zeC2K0",
                    description:
                      "Title for occupational skills on a pool advertisement",
                  })}
                </IconTitle>
                <Text>
                  {intl.formatMessage({
                    defaultMessage:
                      "To be admitted into this process, you will need to submit sufficient information to verify your experience in <strong>all of these skills (Need to have - Occupational)</strong> with your application.",
                    id: "mbtf3h",
                    description:
                      "Explanation of a pools required occupational skills",
                  })}
                </Text>
                <Accordion.Root type="multiple">
                  {essentialSkills[SkillCategory.Technical]?.map((skill) => (
                    <Accordion.Item value={skill.id} key={skill.id}>
                      <Accordion.Trigger>
                        {skill.name[locale] || ""}
                      </Accordion.Trigger>
                      <Accordion.Content>
                        <Text>
                          {skill.description ? skill.description[locale] : ""}
                        </Text>
                      </Accordion.Content>
                    </Accordion.Item>
                  ))}
                </Accordion.Root>
              </>
            ) : null}
            {essentialSkills[SkillCategory.Behavioural]?.length ? (
              <>
                <IconTitle icon={CloudIcon}>
                  {intl.formatMessage({
                    defaultMessage: "Transferrable skills",
                    id: "0I8W8B",
                    description:
                      "Title for transferrable skills on a pool advertisement",
                  })}
                </IconTitle>
                <Text>
                  {intl.formatMessage({
                    defaultMessage:
                      "To be admitted into this process, you will need to display capability in these skills during the assessment process.",
                    id: "0FjYi+",
                    description:
                      "Explanation of a pools required transferrable skills",
                  })}
                </Text>
                <Accordion.Root type="multiple">
                  {essentialSkills[SkillCategory.Behavioural]?.map((skill) => (
                    <Accordion.Item value={skill.id} key={skill.id}>
                      <Accordion.Trigger>
                        {skill.name[locale] || ""}
                      </Accordion.Trigger>
                      <Accordion.Content>
                        <Text>
                          {skill.description ? skill.description[locale] : ""}
                        </Text>
                      </Accordion.Content>
                    </Accordion.Item>
                  ))}
                </Accordion.Root>
              </>
            ) : null}
          </TableOfContents.Section>
          <TableOfContents.Section id={sections.optionalSkills.id}>
            <TableOfContents.Heading data-h2-margin="base(x3, 0, 0, 0)">
              {sections.optionalSkills.title}
            </TableOfContents.Heading>
            {nonEssentialSkills[SkillCategory.Technical]?.length ? (
              <>
                <IconTitle icon={CpuChipIcon}>
                  {intl.formatMessage({
                    defaultMessage: "Occupational skills",
                    id: "zeC2K0",
                    description:
                      "Title for occupational skills on a pool advertisement",
                  })}
                </IconTitle>
                <Text>
                  {intl.formatMessage({
                    defaultMessage:
                      "To strengthen your application, take into consideration these skills that many hiring managers are looking for.",
                    id: "yu4yB8",
                    description:
                      "Explanation of a pools optional transferrable skills",
                  })}
                </Text>
                <Accordion.Root type="single" collapsible>
                  {nonEssentialSkills[SkillCategory.Technical]?.map((skill) => (
                    <Accordion.Item value={skill.id} key={skill.id}>
                      <Accordion.Trigger>
                        {skill.name[locale] || ""}
                      </Accordion.Trigger>
                      <Accordion.Content>
                        <Text>
                          {skill.description ? skill.description[locale] : ""}
                        </Text>
                      </Accordion.Content>
                    </Accordion.Item>
                  ))}
                </Accordion.Root>
              </>
            ) : null}
            {nonEssentialSkills[SkillCategory.Behavioural]?.length ? (
              <>
                <IconTitle icon={CloudIcon}>
                  {intl.formatMessage({
                    defaultMessage: "Transferrable skills",
                    id: "0I8W8B",
                    description:
                      "Title for transferrable skills on a pool advertisement",
                  })}
                </IconTitle>
                <Accordion.Root type="single" collapsible>
                  {nonEssentialSkills[SkillCategory.Behavioural]?.map(
                    (skill) => (
                      <Accordion.Item value={skill.id} key={skill.id}>
                        <Accordion.Trigger>
                          {skill.name[locale] || ""}
                        </Accordion.Trigger>
                        <Accordion.Content>
                          <Text>
                            {skill.description ? skill.description[locale] : ""}
                          </Text>
                        </Accordion.Content>
                      </Accordion.Item>
                    ),
                  )}
                </Accordion.Root>
              </>
            ) : null}
          </TableOfContents.Section>
          <TableOfContents.Section id={sections.requirements.id}>
            <TableOfContents.Heading data-h2-margin="base(x3, 0, 0, 0)">
              {sections.requirements.title}
            </TableOfContents.Heading>
            <IconTitle icon={LightBulbIcon}>
              {intl.formatMessage({
                defaultMessage: "Experience and education",
                id: "owzveI",
                description:
                  "Title for experience and education pool requirements",
              })}
            </IconTitle>
            <div
              data-h2-display="base(flex)"
              data-h2-flex-direction="base(column) p-tablet(row)"
              data-h2-align-items="base(center) p-tablet(stretch)"
            >
              <Card
                color="ts-secondary"
                style={{ width: "100%" }}
                title={intl.formatMessage({
                  defaultMessage: "Combination Experience",
                  id: "7o+Vzu",
                  description:
                    "Title for pool applicant experience requirements",
                })}
              >
                <Text>
                  {intl.formatMessage({
                    defaultMessage:
                      "2 or more years of combined experience in a related field including any of the following:",
                    id: "s60QyR",
                    description:
                      "lead in to list of experience required for a pool applicant",
                  })}
                </Text>
                <ul>
                  <li>
                    {intl.formatMessage({
                      defaultMessage: "On-the-job learning",
                      id: "qNL/Rp",
                      description:
                        "pool experience requirement, on job learning",
                    })}
                  </li>
                  <li>
                    {intl.formatMessage({
                      defaultMessage: "Non-conventional training",
                      id: "YlWJ/N",
                      description:
                        "pool experience requirement, non-conventional training",
                    })}
                  </li>
                  <li>
                    {intl.formatMessage({
                      defaultMessage: "Formal education",
                      id: "DydUje",
                      description:
                        "pool experience requirement, formal education",
                    })}
                  </li>
                  <li>
                    {intl.formatMessage({
                      defaultMessage: "Other field related experience",
                      id: "GNvz2K",
                      description: "pool experience requirement, other",
                    })}
                  </li>
                </ul>
              </Card>
              <div
                data-h2-font-size="base(h4, 1)"
                data-h2-padding="base(x.5, x1)"
                data-h2-font-weight="base(700)"
                data-h2-align-self="base(center)"
                data-h2-text-transform="base(uppercase)"
              >
                {intl.formatMessage({
                  defaultMessage: "or",
                  id: "l9AK3C",
                  description:
                    "that appears between different experience requirements for a pool applicant",
                })}
              </div>
              <Card
                style={{ width: "100%" }}
                color="ts-secondary"
                title={intl.formatMessage({
                  defaultMessage: "2-Year Post-secondary Education",
                  id: "U6IroF",
                  description:
                    "Title for pool applicant education requirements",
                })}
              >
                <Text>
                  {intl.formatMessage({
                    defaultMessage:
                      "Successful completion of two years of post secondary education in computer science, information technology, information management or another specialty relevant to this position.",
                    id: "r9FSaq",
                    description:
                      "post secondary education experience for pool advertisement",
                  })}
                </Text>
              </Card>
            </div>
            <IconTitle icon={CheckCircleIcon}>
              {intl.formatMessage({
                defaultMessage: "Other requirements",
                id: "cHJFcW",
                description: "Title for other pool requirements",
              })}
            </IconTitle>
            <ul>
              <li>
                {intl.formatMessage(
                  {
                    defaultMessage:
                      "Language requirement: {languageRequirement}",
                    id: "fvJnoC",
                    description: "Pool advertisement language requirement",
                  },
                  {
                    languageRequirement,
                  },
                )}
              </li>
              <li>
                {intl.formatMessage(
                  {
                    defaultMessage: "Security clearance: {securityClearance}",
                    id: "GYk6Nz",
                    description:
                      "Pool advertisement security clearance requirement",
                  },
                  {
                    securityClearance,
                  },
                )}
              </li>
              {poolAdvertisement.isRemote ? (
                <li>
                  {intl.formatMessage({
                    defaultMessage: "Location: Remote optional",
                    id: "rakdZh",
                    description:
                      "Pool advertisement location requirement, Remote option",
                  })}
                </li>
              ) : (
                poolAdvertisement.advertisementLocation && (
                  <li>
                    {intl.formatMessage(
                      {
                        defaultMessage: "Location: {location}",
                        id: "HYm817",
                        description:
                          "Pool advertisement location requirement, English",
                      },
                      {
                        location:
                          poolAdvertisement.advertisementLocation[locale],
                      },
                    )}
                  </li>
                )
              )}
            </ul>
          </TableOfContents.Section>
          <TableOfContents.Section id={sections.details.id}>
            <TableOfContents.Heading data-h2-margin="base(x3, 0, 0, 0)">
              {sections.details.title}
            </TableOfContents.Heading>
            <IconTitle icon={PhoneIcon}>
              {intl.formatMessage({
                defaultMessage: "Contact and Accommodations",
                id: "W6dFND",
                description:
                  "Title for contact information on pool advertisement",
              })}
            </IconTitle>
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
            <IconTitle icon={PhoneIcon}>
              {intl.formatMessage({
                defaultMessage: "Hiring Policies",
                id: "isfAkZ",
                description:
                  "Title for hiring information on pool advertisement",
              })}
            </IconTitle>
            <Text>
              {intl.formatMessage({
                defaultMessage:
                  "Preference will be given to veterans, Canadian citizens and to permanent residents.",
                id: "IF1xj8",
                description: "First hiring policy for pool advertisement",
              })}
            </Text>
          </TableOfContents.Section>
          <TableOfContents.Section id={sections.apply.id}>
            <TableOfContents.Heading data-h2-margin="base(x3, 0, x1, 0)">
              {sections.apply.title}
            </TableOfContents.Heading>
            <Text>
              {canApply
                ? intl.formatMessage({
                    defaultMessage:
                      "If this process looks like the right fit for you apply now!",
                    id: "SuqyvD",
                    description:
                      "Message displayed when the pool advertisement can be applied to.",
                  })
                : intl.formatMessage({
                    defaultMessage: "The deadline for submission has passed.",
                    id: "U+ApNl",
                    description:
                      "Message displayed when the pool advertisement has expired.",
                  })}
            </Text>
            {applyBtn}
          </TableOfContents.Section>
        </TableOfContents.Content>
      </TableOfContents.Wrapper>
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
