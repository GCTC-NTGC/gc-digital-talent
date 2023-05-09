import React from "react";
import { useIntl } from "react-intl";
import { useParams } from "react-router-dom";
import BoltIcon from "@heroicons/react/24/outline/BoltIcon";
import BriefcaseIconOutline from "@heroicons/react/24/outline/BriefcaseIcon";
import ClipboardDocumentCheckIcon from "@heroicons/react/24/outline/ClipboardDocumentCheckIcon";
import CheckCircleIcon from "@heroicons/react/24/outline/CheckCircleIcon";
import CloudIcon from "@heroicons/react/24/outline/CloudIcon";
import CpuChipIcon from "@heroicons/react/24/outline/CpuChipIcon";
import LightBulbIcon from "@heroicons/react/24/outline/LightBulbIcon";
import PhoneIcon from "@heroicons/react/24/outline/PhoneIcon";

import {
  Button,
  ThrowNotFound,
  Pending,
  Card,
  Link,
  Accordion,
  TableOfContents,
  Separator,
  Heading,
} from "@gc-digital-talent/ui";
import { StandardHeader as StandardAccordionHeader } from "@gc-digital-talent/ui/src/components/Accordion/StandardHeader";
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
import useBreadcrumbs from "~/hooks/useBreadcrumbs";
import { TALENTSEARCH_RECRUITMENT_EMAIL } from "~/constants/talentSearchConstants";

import PoolInfoCard from "./components/PoolInfoCard";
import ClassificationDefinition from "./components/ClassificationDefinition";
import LightSeparator from "./components/LightSepator";

type SectionContent = {
  id: string;
  linkText?: string;
  title: string;
};

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
  icon: React.ForwardRefExoticComponent<React.SVGProps<SVGSVGElement>>;
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

  let applyBtn = <ApplyButton poolId={poolAdvertisement.id} />;
  if (applicationId) {
    applyBtn = !hasApplied ? (
      <ContinueButton applicationId={applicationId} />
    ) : (
      <AlreadyAppliedButton />
    );
  }

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
            <TableOfContents.AnchorLink id={sections.apply.id}>
              {sections.apply.title}
            </TableOfContents.AnchorLink>
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
                    <StandardAccordionHeader>
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
                    </StandardAccordionHeader>
                    <Accordion.Content>
                      <ClassificationDefinition name={genericTitle.key} />
                    </Accordion.Content>
                  </Accordion.Item>
                )}
              </Accordion.Root>
              <LightSeparator />
            </TableOfContents.Section>
            {showImpactTasks && (
              <TableOfContents.Section id={sections.impactTasks.id}>
                <TableOfContents.Heading>
                  {sections.impactTasks.title}
                </TableOfContents.Heading>
                {poolAdvertisement.yourImpact && (
                  <p>{poolAdvertisement.yourImpact[locale]}</p>
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
                    <p>{poolAdvertisement.keyTasks[locale]}</p>
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
            </TableOfContents.Section>
            <TableOfContents.Section id={sections.locationLangSecurity.id}>
              <TableOfContents.Heading>
                {sections.locationLangSecurity.title}
              </TableOfContents.Heading>
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
