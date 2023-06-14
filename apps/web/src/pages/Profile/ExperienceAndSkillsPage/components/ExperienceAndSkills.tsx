import React from "react";
import { useSearchParams } from "react-router-dom";
import { useIntl } from "react-intl";

import { Well } from "@gc-digital-talent/ui";
import { notEmpty } from "@gc-digital-talent/helpers";
import { navigationMessages } from "@gc-digital-talent/i18n";

import { getFullPoolTitleHtml } from "~/utils/poolUtils";
import { flattenExperienceSkills } from "~/types/experience";
import MissingSkills from "~/components/MissingSkills";
import ExperienceSection from "~/components/UserProfile/ExperienceSection";
import {
  AwardExperience,
  CommunityExperience,
  EducationExperience,
  PersonalExperience,
  Pool,
  Skill,
  WorkExperience,
} from "~/api/generated";
import useRoutes from "~/hooks/useRoutes";
import ProfileFormWrapper, {
  ProfileFormFooter,
} from "~/components/ProfileFormWrapper/ProfileFormWrapper";
import { wrapAbbr } from "~/utils/nameUtils";
import AddExperienceDialog from "./AddExperienceDialog";

type MergedExperiences = Array<
  | AwardExperience
  | CommunityExperience
  | EducationExperience
  | PersonalExperience
  | WorkExperience
>;

export type ExperienceForDate =
  | (AwardExperience & { startDate: string; endDate: string })
  | CommunityExperience
  | EducationExperience
  | PersonalExperience
  | WorkExperience;

export interface ExperienceAndSkillsProps {
  applicantId: string;
  experiences?: MergedExperiences;
  pool?: Pool;
  missingSkills?: {
    requiredSkills: Skill[];
    optionalSkills: Skill[];
  };
}

export const ExperienceAndSkills = ({
  experiences,
  missingSkills,
  applicantId,
  pool,
}: ExperienceAndSkillsProps) => {
  const intl = useIntl();
  const paths = useRoutes();
  const [searchParams] = useSearchParams();
  const applicationId = searchParams.get("applicationId");
  const applicationParam = applicationId
    ? `?applicationId=${applicationId}`
    : ``;
  const returnRoute = applicationId
    ? paths.reviewApplication(applicationId)
    : paths.profile(applicantId);

  const hasExperiences = notEmpty(experiences);

  const applicationBreadcrumbs: {
    label: string | React.ReactNode;
    url: string;
  }[] = pool
    ? [
        {
          label: intl.formatMessage({
            defaultMessage: "My applications",
            id: "jSYDwZ",
            description: "Link text for breadcrumb to user applications page.",
          }),
          url: paths.applications(applicantId),
        },
        {
          label: getFullPoolTitleHtml(intl, pool),
          url: paths.pool(pool.id),
        },
        {
          label: intl.formatMessage(navigationMessages.stepOne),
          url: paths.reviewApplication(applicationId ?? ""),
        },
        {
          label: intl.formatMessage({
            defaultMessage: "Experience and Skills",
            id: "PF2m1d",
            description:
              "Breadcrumb for experience and skills page in applicant profile.",
          }),
          url: `${paths.skillsAndExperiences(applicantId)}${applicationParam}`,
        },
      ]
    : [];

  return (
    <ProfileFormWrapper
      crumbs={
        applicationBreadcrumbs?.length
          ? applicationBreadcrumbs
          : [
              {
                label: intl.formatMessage({
                  defaultMessage: "Experience and Skills",
                  id: "PF2m1d",
                  description:
                    "Breadcrumb for experience and skills page in applicant profile.",
                }),
                url: paths.skillsAndExperiences(applicantId),
              },
            ]
      }
      prefixBreadcrumbs={!pool}
      description={intl.formatMessage(
        {
          defaultMessage:
            "Here is where you can add experiences and skills to your profile. This could be anything from helping community members troubleshoot their computers to full-time employment at an <abbreviation>IT</abbreviation> organization.",
          id: "Ks4G8p",
          description:
            "Description for the experience and skills page in applicant profile.",
        },
        {
          abbreviation: (text: React.ReactNode) => wrapAbbr(text, intl),
        },
      )}
      title={intl.formatMessage({
        defaultMessage: "My experience and skills",
        id: "KE49r9",
        description:
          "Heading for experience and skills page in applicant profile.",
      })}
    >
      {missingSkills && (
        <div data-h2-margin="base(x1, 0)">
          <MissingSkills
            addedSkills={
              hasExperiences ? flattenExperienceSkills(experiences) : []
            }
            requiredSkills={missingSkills.requiredSkills}
            optionalSkills={missingSkills.optionalSkills}
          />
        </div>
      )}
      <div data-h2-margin="base(x2, 0)">
        <div
          data-h2-display="base(flex)"
          data-h2-justify-content="base(flex-end)"
        >
          <AddExperienceDialog
            data-h2-flex-item="base(1of1)"
            applicantId={applicantId}
          />
        </div>
      </div>
      {!hasExperiences ? (
        <Well>
          <p data-h2-font-style="base(italic)">
            {intl.formatMessage({
              defaultMessage:
                "There are no experiences on your profile yet. You can add some using the preceding buttons.",
              id: "XzUzZz",
              description:
                "Message to user when no experiences have been attached to profile.",
            })}
          </p>
        </Well>
      ) : (
        <ExperienceSection
          editParam={applicationParam}
          experiences={experiences}
          headingLevel="h2"
        />
      )}
      <ProfileFormFooter
        mode="cancelButton"
        cancelLink={{
          href: returnRoute,
          children: intl.formatMessage(
            applicationId
              ? navigationMessages.backToApplication
              : navigationMessages.backToProfile,
          ),
        }}
      />
    </ProfileFormWrapper>
  );
};

export default ExperienceAndSkills;
