import React from "react";
import { useIntl } from "react-intl";
import { BriefcaseIcon } from "@heroicons/react/solid";

import Breadcrumbs from "@common/components/Breadcrumbs";
import type { BreadcrumbsProps } from "@common/components/Breadcrumbs";
import NotFound from "@common/components/NotFound";
import Pending from "@common/components/Pending";
import { Link } from "@common/components";
import { getLocale, getLocalizedName } from "@common/helpers/localize";
import { imageUrl } from "@common/helpers/router";

import { AdvertisementStatus } from "@common/api/generated";
import TableOfContents from "@common/components/TableOfContents";
import {
  LightningBoltIcon,
  BriefcaseIcon as BriefcaseIconOutline,
  PhoneIcon,
} from "@heroicons/react/outline";
import Accordion from "@common/components/accordion";
import { strong } from "@common/helpers/format";
import { useGetPoolAdvertisementQuery } from "../../api/generated";
import type { PoolAdvertisement } from "../../api/generated";
import { useDirectIntakeRoutes } from "../../directIntakeRoutes";
import TALENTSEARCH_APP_DIR from "../../talentSearchConstants";
import commonMessages from "../commonMessages";
import PoolInfoCard from "./PoolInfoCard";
import ClassificationDefinition from "../ClassificationDefinition/ClassificationDefinition";

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
    <h3 data-h2-display="b(flex)" data-h2-align-items="b(center)">
      <Icon style={{ width: "1em", marginRight: "0.5rem" }} />
      <span>{children}</span>
    </h3>
  );
};

// NOTE: Not entirely sure why this is failing?
const accommodationEmail = (chunks: string[]) => (
  // eslint-disable-next-line jsx-a11y/anchor-has-content
  <a href="mailto:fames@acanteipsum.ca">{...chunks}</a>
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
  const localizedClassificationName = getLocalizedName(
    classification?.name,
    intl,
  );
  const localizedTitle = getLocalizedName(genericTitle?.name, intl);
  const classificationSuffix = `${classification?.group}-0${classification?.level}`;
  const fullTitle = `${localizedClassificationName} ${localizedTitle} (${classificationSuffix})`;
  const canApply =
    poolAdvertisement.advertisementStatus &&
    poolAdvertisement.advertisementStatus === AdvertisementStatus.Published;

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
      icon: <BriefcaseIcon style={{ width: "1rem", marginRight: "5px" }} />,
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
        data-h2-padding="b(top-bottom, m) b(right-left, s)"
        data-h2-font-color="b(white)"
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
        <div data-h2-container="b(center, m)">
          <h1 data-h2-margin="b(top-bottom, l)">{fullTitle}</h1>
        </div>
      </div>
      <div
        data-h2-bg-color="b(white)"
        data-h2-shadow="b(m)"
        data-h2-padding="b(top-bottom, m)"
      >
        <div data-h2-container="b(center, m)">
          <Breadcrumbs links={links} />
          <div
            data-h2-display="b(flex)"
            data-h2-flex-direction="b(column) m(row)"
            data-h2-justify-content="b(space-between)"
            data-h2-align-items="b(center) m(flex-end)"
            data-h2-margin="b(top, m)"
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
                defaultMessage: "What are pool recruitment's?",
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
                <IconTitle icon={LightningBoltIcon}>
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
          </TableOfContents.Section>
          <TableOfContents.Section id={sections.optionalSkills.id}>
            <TableOfContents.Heading>
              {sections.optionalSkills.title}
            </TableOfContents.Heading>
          </TableOfContents.Section>
          <TableOfContents.Section id={sections.requirements.id}>
            <TableOfContents.Heading>
              {sections.requirements.title}
            </TableOfContents.Heading>
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
                  "Do you require accommodations? or do you have any questions about this process?",
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
                    "<strong>Email</strong>: <accommodationEmail>fames@acanteipsum.ca</accommodationEmail>",
                },
                {
                  strong,
                  accommodationEmail,
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

  return (
    <Pending fetching={fetching} error={error}>
      {data?.poolAdvertisement ? (
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
