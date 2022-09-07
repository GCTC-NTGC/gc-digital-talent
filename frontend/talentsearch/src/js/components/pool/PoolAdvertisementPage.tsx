import React from "react";
import { useIntl } from "react-intl";

import Breadcrumbs from "@common/components/Breadcrumbs";
import type { BreadcrumbsProps } from "@common/components/Breadcrumbs";
import NotFound from "@common/components/NotFound";
import Pending from "@common/components/Pending";
import Card from "@common/components/Card";
import { Link } from "@common/components";
import { getLocale } from "@common/helpers/localize";
import { imageUrl } from "@common/helpers/router";

import { AdvertisementStatus, SkillCategory } from "@common/api/generated";
import TableOfContents from "@common/components/TableOfContents";
import {
  BoltIcon,
  BriefcaseIcon as BriefcaseIconOutline,
  PhoneIcon,
  LightBulbIcon,
  CheckCircleIcon,
  CpuChipIcon,
  CloudIcon,
} from "@heroicons/react/24/outline";
import Accordion from "@common/components/accordion";
import {
  getLanguageRequirement,
  getSecurityClearance,
} from "@common/constants/localizedConstants";
import { categorizeSkill } from "@common/helpers/skillUtils";
import commonMessages from "@common/messages/commonMessages";
import { Role, useGetPoolAdvertisementQuery } from "../../api/generated";
import type { PoolAdvertisement } from "../../api/generated";
import { useDirectIntakeRoutes } from "../../directIntakeRoutes";
import TALENTSEARCH_APP_DIR, {
  TALENTSEARCH_RECRUITMENT_EMAIL,
} from "../../talentSearchConstants";
import PoolInfoCard from "./PoolInfoCard";
import ClassificationDefinition from "../ClassificationDefinition/ClassificationDefinition";
import getFullPoolAdvertisementTitle from "./getFullPoolAdvertisementTitle";

interface ApplyButtonProps {
  disabled: boolean;
  href: string;
}

const ApplyButton = ({ disabled, href }: ApplyButtonProps) => {
  const intl = useIntl();
  return (
    <Link
      type="button"
      color="primary"
      mode="solid"
      disabled={disabled}
      href={href}
    >
      {intl.formatMessage({
        defaultMessage: "Apply for this process",
        description: "Link text to apply for a pool advertisement",
      })}
    </Link>
  );
};
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
    >
      <Icon style={{ width: "1em", marginRight: "0.5rem" }} />
      <span>{children}</span>
    </h3>
  );
};

// NOTE: Not entirely sure why this is failing?
const anchorTag = (chunks: string[]) => (
  // eslint-disable-next-line jsx-a11y/anchor-has-content
  <a href={`mailto:${TALENTSEARCH_RECRUITMENT_EMAIL}`}>{...chunks}</a>
);

interface PoolAdvertisementProps {
  poolAdvertisement: PoolAdvertisement;
}

const PoolAdvertisement = ({ poolAdvertisement }: PoolAdvertisementProps) => {
  const intl = useIntl();
  const locale = getLocale(intl);
  const paths = useDirectIntakeRoutes();

  const classification = poolAdvertisement.classifications
    ? poolAdvertisement.classifications[0]
    : null;
  const genericTitle = classification?.genericJobTitles?.length
    ? classification.genericJobTitles[0]
    : null;
  const classificationSuffix = `${classification?.group}-0${classification?.level}`;
  const fullTitle = getFullPoolAdvertisementTitle(intl, poolAdvertisement);
  const canApply =
    poolAdvertisement.advertisementStatus &&
    poolAdvertisement.advertisementStatus === AdvertisementStatus.Published;

  const languageRequirement = intl.formatMessage(
    getLanguageRequirement(poolAdvertisement.advertisementLanguage ?? ""),
  );

  const securityClearance = intl.formatMessage(
    getSecurityClearance(poolAdvertisement.securityClearance ?? ""),
  );

  const essentialSkills = categorizeSkill(poolAdvertisement.essentialSkills);
  const nonEssentialSkills = categorizeSkill(
    poolAdvertisement.nonessentialSkills,
  );

  const applyBtn = (
    <ApplyButton
      disabled={!canApply}
      href={paths.poolApply(poolAdvertisement.id)}
    />
  );

  const links = [
    {
      title: intl.formatMessage({
        defaultMessage: "Browse opportunities",
        description: "Breadcrumb title for the browse pools page.",
      }),
      href: paths.home(),
    },
    {
      title: fullTitle,
    },
  ] as BreadcrumbsProps["links"];

  const sections: Record<string, { id: string; title: string }> = {
    about: {
      id: "about-section",
      title: intl.formatMessage({
        defaultMessage: "About this process",
        description: "Title for the about section of a pool advertisement",
      }),
    },
    requiredSkills: {
      id: "required-skills-section",
      title: intl.formatMessage({
        defaultMessage: "Need to have",
        description:
          "Title for the required skills section of a pool advertisement",
      }),
    },
    optionalSkills: {
      id: "optional-skills-section",
      title: intl.formatMessage({
        defaultMessage: "Nice to have",
        description:
          "Title for the optional skills section of a pool advertisement",
      }),
    },
    requirements: {
      id: "requirements-section",
      title: intl.formatMessage({
        defaultMessage: "Requirements",
        description:
          "Title for the requirements section of a pool advertisement",
      }),
    },
    details: {
      id: "details-section",
      title: intl.formatMessage({
        defaultMessage: "Additional details",
        description: "Title for the details section of a pool advertisement",
      }),
    },
    apply: {
      id: "apply-section",
      title: intl.formatMessage({
        defaultMessage: "Apply now",
        description:
          "Title for the apply button section of a pool advertisement",
      }),
    },
  };

  return (
    <>
      <div
        data-h2-padding="base(x1, x.5)"
        data-h2-color="base(dt-white)"
        style={{
          background: `url(${imageUrl(
            TALENTSEARCH_APP_DIR,
            "applicant-profile-banner.png",
          )})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div data-h2-container="base(center, medium, 0)">
          <h1 data-h2-margin="base(x2, 0)">{fullTitle}</h1>
        </div>
      </div>
      <div
        data-h2-background-color="base(dt-white)"
        data-h2-shadow="base(m)"
        data-h2-padding="base(x1, 0)"
      >
        <div data-h2-container="base(center, medium, 0)">
          <Breadcrumbs links={links} />
          <div
            data-h2-display="base(flex)"
            data-h2-flex-direction="base(column) p-tablet(row)"
            data-h2-justify-content="base(space-between)"
            data-h2-align-items="base(center) p-tablet(flex-end)"
            data-h2-margin="base(x1, 0, 0, 0)"
          >
            <div>
              <PoolInfoCard
                closingDate={poolAdvertisement.expiryDate}
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
        <TableOfContents.Navigation>
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
        <TableOfContents.Content>
          <TableOfContents.Section id={sections.about.id}>
            <TableOfContents.Heading>
              {sections.about.title}
            </TableOfContents.Heading>
            <Accordion
              title={intl.formatMessage({
                defaultMessage: "What are pool recruitments?",
                description:
                  "Title for according describing pool recruitment's",
              })}
            >
              <p>
                {intl.formatMessage({
                  defaultMessage:
                    "When you apply to this process, you are not applying for a specific position. This process is intended to create and maintain an inventory to staff various positions at the same level in different departments and agencies across the Government of Canada.",
                  description: "Description of pool recruitment, paragraph one",
                })}
              </p>
              <p>
                {intl.formatMessage({
                  defaultMessage:
                    "When hiring managers have IT staffing needs and positions become available, applicants who meet the qualifications for this process may be contacted for further assessment. This means various managers may reach out to you about specific opportunities in the area of application development.",
                  description: "Description of pool recruitment, paragraph two",
                })}
              </p>
            </Accordion>
            {genericTitle?.key && (
              <Accordion
                title={intl.formatMessage(
                  {
                    defaultMessage:
                      "What does {classification}{genericTitle} mean?",
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
              >
                <ClassificationDefinition name={genericTitle.key} />
              </Accordion>
            )}
            {poolAdvertisement.yourImpact ? (
              <>
                <IconTitle icon={BoltIcon}>
                  {intl.formatMessage({
                    defaultMessage: "Your impact",
                    description:
                      "Title for a pool advertisements impact section.",
                  })}
                </IconTitle>
                {poolAdvertisement.yourImpact[locale]}
              </>
            ) : null}
            {poolAdvertisement.keyTasks ? (
              <>
                <IconTitle icon={BriefcaseIconOutline}>
                  {intl.formatMessage({
                    defaultMessage: "Your work",
                    description:
                      "Title for a pool advertisements key tasks section.",
                  })}
                </IconTitle>
                {poolAdvertisement.keyTasks[locale]}
              </>
            ) : null}
          </TableOfContents.Section>
          <TableOfContents.Section id={sections.requiredSkills.id}>
            <TableOfContents.Heading>
              {sections.requiredSkills.title}
            </TableOfContents.Heading>
            {essentialSkills[SkillCategory.Technical]?.length ? (
              <>
                <IconTitle icon={CpuChipIcon}>
                  {intl.formatMessage({
                    defaultMessage: "Occupational skills",
                    description:
                      "Title for occupational skills on a pool advertisement",
                  })}
                </IconTitle>
                <p>
                  {intl.formatMessage({
                    defaultMessage:
                      "To be admitted into this process, you will need to submit sufficient information to verify your experience in <strong>all of these  skills (Need to have - Occupational)</strong> with your application.",
                    description:
                      "Explanation of a pools required occupational skills",
                  })}
                </p>
                {essentialSkills[SkillCategory.Technical]?.map((skill) => (
                  <Accordion title={skill.name[locale] || ""} key={skill.id}>
                    <p>{skill.description ? skill.description[locale] : ""}</p>
                  </Accordion>
                ))}
              </>
            ) : null}
            {essentialSkills[SkillCategory.Behavioural]?.length ? (
              <>
                <IconTitle icon={CloudIcon}>
                  {intl.formatMessage({
                    defaultMessage: "Transferrable skills",
                    description:
                      "Title for transferrable skills on a pool advertisement",
                  })}
                </IconTitle>
                <p>
                  {intl.formatMessage({
                    defaultMessage:
                      "To be admitted into this process, you will need to display  capability in these skills during the assessment process.",
                    description:
                      "Explanation of a pools required transferrable skills",
                  })}
                </p>
                {essentialSkills[SkillCategory.Behavioural]?.map((skill) => (
                  <Accordion title={skill.name[locale] || ""} key={skill.id}>
                    <p>{skill.description ? skill.description[locale] : ""}</p>
                  </Accordion>
                ))}
              </>
            ) : null}
          </TableOfContents.Section>
          <TableOfContents.Section id={sections.optionalSkills.id}>
            <TableOfContents.Heading>
              {sections.optionalSkills.title}
            </TableOfContents.Heading>
            {nonEssentialSkills[SkillCategory.Technical]?.length ? (
              <>
                <IconTitle icon={CpuChipIcon}>
                  {intl.formatMessage({
                    defaultMessage: "Occupational skills",
                    description:
                      "Title for occupational skills on a pool advertisement",
                  })}
                </IconTitle>
                <p>
                  {intl.formatMessage({
                    defaultMessage:
                      "To strengthen your application, take into consideration these skills that many hiring managers are looking for.",
                    description:
                      "Explanation of a pools optional transferrable skills",
                  })}
                </p>
                {nonEssentialSkills[SkillCategory.Technical]?.map((skill) => (
                  <Accordion title={skill.name[locale] || ""} key={skill.id}>
                    <p>{skill.description ? skill.description[locale] : ""}</p>
                  </Accordion>
                ))}
              </>
            ) : null}
            {nonEssentialSkills[SkillCategory.Behavioural]?.length ? (
              <>
                <IconTitle icon={CloudIcon}>
                  {intl.formatMessage({
                    defaultMessage: "Transferrable skills",
                    description:
                      "Title for transferrable skills on a pool advertisement",
                  })}
                </IconTitle>
                {nonEssentialSkills[SkillCategory.Behavioural]?.map((skill) => (
                  <Accordion title={skill.name[locale] || ""} key={skill.id}>
                    <p>{skill.description ? skill.description[locale] : ""}</p>
                  </Accordion>
                ))}
              </>
            ) : null}
          </TableOfContents.Section>
          <TableOfContents.Section id={sections.requirements.id}>
            <TableOfContents.Heading>
              {sections.requirements.title}
            </TableOfContents.Heading>
            <IconTitle icon={LightBulbIcon}>
              {intl.formatMessage({
                defaultMessage: "Experience and education",
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
                  description:
                    "Title for pool applicant experience requirements",
                })}
              >
                <p>
                  {intl.formatMessage({
                    defaultMessage:
                      "2 or more years of combined experience in a related field including any of the following:",
                    description:
                      "lead in to list of experience required for a pool applicant",
                  })}
                </p>
                <ul>
                  <li>
                    {intl.formatMessage({
                      defaultMessage: "On-the-job learning",
                      description:
                        "pool experience requirement, on job learning",
                    })}
                  </li>
                  <li>
                    {intl.formatMessage({
                      defaultMessage: "Non-conventional training",
                      description:
                        "pool experience requirement, non-conventional training",
                    })}
                  </li>
                  <li>
                    {intl.formatMessage({
                      defaultMessage: "Formal education",
                      description:
                        "pool experience requirement, formal education",
                    })}
                  </li>
                  <li>
                    {intl.formatMessage({
                      defaultMessage: "Other field related experience",
                      description: "pool experience requirement, other",
                    })}
                  </li>
                </ul>
              </Card>
              <div
                data-h2-font-size="base(h4, 1)"
                data-h2-padding="base(x.5)"
                data-h2-font-weight="base(700)"
                data-h2-align-self="base(center)"
                data-h2-text-transform="base(uppercase)"
              >
                {intl.formatMessage({
                  defaultMessage: "or",
                  description:
                    "that appears between different experience requirements for a pool applicant",
                })}
              </div>
              <Card
                style={{ width: "100%" }}
                color="ts-secondary"
                title={intl.formatMessage({
                  defaultMessage: "2-Year Post-secondary Experience",
                  description:
                    "Title for pool applicant education requirements",
                })}
              >
                <p>
                  {intl.formatMessage({
                    defaultMessage:
                      "Successful completion of two years of post secondary education in computer science, information technology, information management or another specialty relevant to this position.",
                    description:
                      "post secondary education experience for pool advertisement",
                  })}
                </p>
              </Card>
            </div>
            <IconTitle icon={CheckCircleIcon}>
              {intl.formatMessage({
                defaultMessage: "Other requirements",
                description: "Title for other pool requirements",
              })}
            </IconTitle>
            <ul>
              <li>
                {intl.formatMessage(
                  {
                    defaultMessage:
                      "Language requirement: {languageRequirement}",
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
                    defaultMessage: "Location: Remote",
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
            <TableOfContents.Heading>
              {sections.details.title}
            </TableOfContents.Heading>
            <IconTitle icon={PhoneIcon}>
              {intl.formatMessage({
                defaultMessage: "Contact and Accommodations",
                description:
                  "Title for contact information on pool advertisement",
              })}
            </IconTitle>
            <p>
              {intl.formatMessage({
                defaultMessage:
                  "Do you require accommodations, or do you have any questions about this process?",
                description:
                  "Opening sentence asking if accommodations are needed",
              })}
            </p>
            <p>
              {intl.formatMessage({
                defaultMessage:
                  "Please contact the Digital Community Management Office if you require any accommodations during this application process.",
                description:
                  "Description of what to do when accommodations are needed",
              })}
            </p>
            <p>
              {intl.formatMessage(
                {
                  defaultMessage:
                    "<strong>Email</strong>: <anchorTag>{emailAddress}</anchorTag>",
                  description: "An email address to contact for help",
                },
                {
                  anchorTag,
                  emailAddress: TALENTSEARCH_RECRUITMENT_EMAIL,
                },
              )}
            </p>
            <IconTitle icon={PhoneIcon}>
              {intl.formatMessage({
                defaultMessage: "Hiring Policies",
                description:
                  "Title for hiring information on pool advertisement",
              })}
            </IconTitle>
            <p>
              {intl.formatMessage({
                defaultMessage:
                  "Preference will be given to veterans, Canadian citizens and to permanent residents.",
                description: "First hiring policy for pool advertisement",
              })}
            </p>
          </TableOfContents.Section>
          <TableOfContents.Section id={sections.apply.id}>
            <TableOfContents.Heading>
              {sections.apply.title}
            </TableOfContents.Heading>
            <p>
              {canApply
                ? intl.formatMessage({
                    defaultMessage:
                      "If this process looks like the right fit for you apply now!",
                    description:
                      "Message displayed when the pool advertisement can be applied to.",
                  })
                : intl.formatMessage({
                    defaultMessage: "The deadline for submission has passed.",
                    description:
                      "Message displayed when the pool advertisement has expired.",
                  })}
            </p>
            {applyBtn}
          </TableOfContents.Section>
        </TableOfContents.Content>
      </TableOfContents.Wrapper>
    </>
  );
};

interface PoolAdvertisementPageProps {
  id: string;
}

const PoolAdvertisementPage = ({ id }: PoolAdvertisementPageProps) => {
  const intl = useIntl();

  const [{ data, fetching, error }] = useGetPoolAdvertisementQuery({
    variables: { id },
  });

  let visible = data?.me?.roles?.includes(Role.Admin) ?? false;
  if (
    data?.poolAdvertisement?.advertisementStatus !== AdvertisementStatus.Draft
  ) {
    visible = true;
  }

  return (
    <Pending fetching={fetching} error={error}>
      {data?.poolAdvertisement && visible ? (
        <PoolAdvertisement poolAdvertisement={data?.poolAdvertisement} />
      ) : (
        <NotFound
          headingMessage={intl.formatMessage(commonMessages.notFound, {
            type: "Pool",
            id,
          })}
        >
          {intl.formatMessage({
            defaultMessage: "Error, pool unable to be loaded",
            description: "Error message, placeholder",
          })}
        </NotFound>
      )}
    </Pending>
  );
};

export default PoolAdvertisementPage;
