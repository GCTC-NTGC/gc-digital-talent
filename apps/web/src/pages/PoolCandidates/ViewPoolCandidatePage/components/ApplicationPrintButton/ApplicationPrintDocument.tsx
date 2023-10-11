import React from "react";
import { useIntl } from "react-intl";
import isEmpty from "lodash/isEmpty";

import { Heading } from "@gc-digital-talent/ui";
import { insertBetween, notEmpty } from "@gc-digital-talent/helpers";
import {
  commonMessages,
  getArmedForcesStatusesAdmin,
  getAwardedTo,
  getBilingualEvaluation,
  getCitizenshipStatusesAdmin,
  getEducationRequirementOption,
  getEducationStatus,
  getEmploymentEquityGroup,
  getEmploymentEquityStatement,
  getIndigenousCommunity,
  getLanguage,
  getLanguageProficiency,
  getLocale,
  getLocalizedName,
  getOperationalRequirement,
  getProvinceOrTerritory,
  getSimpleGovEmployeeType,
  getWorkRegion,
  navigationMessages,
} from "@gc-digital-talent/i18n";
import { enumToOptions, unpackMaybes } from "@gc-digital-talent/forms";
import {
  GovEmployeeType,
  OperationalRequirement,
  PositionDuration,
  User,
  BilingualEvaluation,
  IndigenousCommunity,
  PoolCandidate,
  Pool,
  EducationExperience,
  WorkExperience,
  Skill,
  Experience,
  AwardExperience,
  CommunityExperience,
  PersonalExperience,
} from "@gc-digital-talent/graphql";

import { getFullNameLabel } from "~/utils/nameUtils";
import PrintExperienceByType from "~/components/UserProfile/PrintExperienceByType/PrintExperienceByType";
import { anyCriteriaSelected as anyCriteriaSelectedDiversityEquityInclusion } from "~/validators/profile/diversityEquityInclusion";
import { getEvaluatedLanguageLevels } from "~/utils/userUtils";
import {
  getExperienceFormLabels,
  isAwardExperience,
  isCommunityExperience,
  isEducationExperience,
  isPersonalExperience,
  isWorkExperience,
} from "~/utils/experienceUtils";
import experienceMessages from "~/messages/experienceMessages";
import { getExperienceSkills } from "~/utils/skillUtils";
import { formattedDate, getDateRange } from "~/utils/dateUtils";

interface ApplicationPrintDocumentProps {
  user: User;
  pool: Pool;
}

const PageSection = ({ children }: { children: React.ReactNode }) => (
  <div
    data-h2-margin-bottom="base(2rem)"
    data-h2-display="base(block)"
    data-h2-break-inside="base(avoid) base:print(avoid)"
    data-h2-break-after="base(avoid) base:print(avoid)"
  >
    {children}
  </div>
);

// If a section is too big, use this instead of PageSection to allow it to break
const BreakingPageSection = ({ children }: { children: React.ReactNode }) => (
  <div data-h2-margin-bottom="base(2rem)" data-h2-display="base(block)">
    {children}
  </div>
);

const ApplicationPrintDocument = React.forwardRef<
  HTMLDivElement,
  ApplicationPrintDocumentProps
>(({ user, pool }, ref) => {
  const intl = useIntl();
  const locale = getLocale(intl);

  // pull pool candidate for the pool in question out of snapshot
  const poolCandidates = unpackMaybes(user.poolCandidates);
  const relevantPoolCandidate = poolCandidates.find(
    (element) => element.pool.id === pool.id,
  );

  const educationOrWorkExperienceListElement = (
    experience: EducationExperience | WorkExperience,
  ): JSX.Element => {
    if (isEducationExperience(experience)) {
      const { areaOfStudy, institution } = experience;
      return (
        <li key={experience.id}>
          {intl.formatMessage(experienceMessages.educationAt, {
            areaOfStudy,
            institution,
          })}
        </li>
      );
    }
    const { role, organization } = experience;
    return (
      <li key={experience.id}>
        {intl.formatMessage(experienceMessages.workAt, {
          role,
          organization,
        })}
      </li>
    );
  };

  const experienceListForSkill = (
    experience:
      | AwardExperience
      | CommunityExperience
      | EducationExperience
      | PersonalExperience
      | WorkExperience,
  ) => {
    const experienceFormLabels = getExperienceFormLabels(intl);

    if (isAwardExperience(experience)) {
      const { title, issuedBy, awardedDate, awardedTo, details } = experience;
      return (
        <>
          <p>
            {intl.formatMessage(experienceMessages.awardIssuedBy, {
              title,
              issuedBy,
            })}
          </p>
          <p>
            {awardedDate
              ? formattedDate(awardedDate, intl)
              : intl.formatMessage(commonMessages.notProvided)}
          </p>
          <p>
            {experienceFormLabels.awardedTo}
            {intl.formatMessage(commonMessages.dividingColon)}
            {awardedTo
              ? intl.formatMessage(getAwardedTo(awardedTo))
              : intl.formatMessage(commonMessages.notAvailable)}
          </p>
          <p>{details}</p>
          <p>
            {experienceFormLabels.details}
            {intl.formatMessage(commonMessages.dividingColon)}
            {details ?? intl.formatMessage(commonMessages.notAvailable)}
          </p>
        </>
      );
    }
    if (isCommunityExperience(experience)) {
      const { title, organization, endDate, startDate, project, details } =
        experience;
      return (
        <>
          <p>
            {intl.formatMessage(experienceMessages.communityAt, {
              title,
              organization,
            })}
          </p>
          <p>{getDateRange({ endDate, startDate, intl })}</p>
          <p>
            {experienceFormLabels.project}
            {intl.formatMessage(commonMessages.dividingColon)}
            {project ?? intl.formatMessage(commonMessages.notAvailable)}
          </p>
          <p>
            {experienceFormLabels.details}
            {intl.formatMessage(commonMessages.dividingColon)}
            {details ?? intl.formatMessage(commonMessages.notAvailable)}
          </p>
        </>
      );
    }
    if (isEducationExperience(experience)) {
      const { areaOfStudy, institution, startDate, endDate, status, details } =
        experience;
      return (
        <>
          <p>
            {intl.formatMessage(experienceMessages.educationAt, {
              areaOfStudy,
              institution,
            })}
          </p>
          <p>{getDateRange({ endDate, startDate, intl })}</p>
          <p>
            {experienceFormLabels.educationStatus}
            {intl.formatMessage(commonMessages.dividingColon)}
            {status
              ? intl.formatMessage(getEducationStatus(status))
              : intl.formatMessage(commonMessages.notAvailable)}
          </p>
          <p>
            {experienceFormLabels.details}
            {intl.formatMessage(commonMessages.dividingColon)}
            {details ?? intl.formatMessage(commonMessages.notAvailable)}
          </p>
        </>
      );
    }
    if (isPersonalExperience(experience)) {
      const { details, title, startDate, endDate, description } = experience;
      return (
        <>
          <p>{title || ""}</p>
          <p>{getDateRange({ endDate, startDate, intl })}</p>
          <p>{description}</p>
          <p>
            {experienceFormLabels.details}
            {intl.formatMessage(commonMessages.dividingColon)}
            {details ?? intl.formatMessage(commonMessages.notAvailable)}
          </p>
        </>
      );
    }
    const { role, organization, startDate, endDate, division, details } =
      experience; // left with work experience
    return (
      <>
        <p>
          {intl.formatMessage(experienceMessages.workAt, {
            role,
            organization,
          })}
        </p>
        <p>{getDateRange({ endDate, startDate, intl })}</p>
        <p>
          {experienceFormLabels.team}
          {intl.formatMessage(commonMessages.dividingColon)}
          {division ?? intl.formatMessage(commonMessages.notAvailable)}
        </p>
        <p>
          {experienceFormLabels.details}
          {intl.formatMessage(commonMessages.dividingColon)}
          {details ?? intl.formatMessage(commonMessages.notAvailable)}
        </p>
      </>
    );
  };

  const skillSection = (
    skill: Skill,
    experiences: Experience[],
  ): JSX.Element => {
    const skillExperiences = getExperienceSkills(experiences, skill);
    return (
      <PageSection>
        <p data-h2-font-weight="base(700)">
          {getLocalizedName(skill.name, intl)}
        </p>
        <p>
          {skill.description ? getLocalizedName(skill.description, intl) : ""}
        </p>
        <ul>
          {skillExperiences.map((experience) => {
            return (
              <li key={experience.id}>{experienceListForSkill(experience)}</li>
            );
          })}
        </ul>
      </PageSection>
    );
  };

  return (
    <div style={{ display: "none" }}>
      <div data-h2 ref={ref}>
        <div
          data-h2-font-family="base(sans) base:print(sans)"
          data-h2-padding-bottom="base(1rem)"
          data-h2-border-bottom="base(2px dashed black) base:print(2px dashed black)"
        >
          <div>
            <Heading level="h1" data-h2-font-weight="base(700)">
              {intl.formatMessage({
                defaultMessage: "Application snapshot",
                id: "ipsXat",
                description:
                  "Document title for printing a user's application snapshot.",
              })}
            </Heading>
            <Heading level="h2" data-h2-font-weight="base(700)">
              <>{getFullNameLabel(user.firstName, user.lastName, intl)}</>
            </Heading>
            {relevantPoolCandidate && (
              <>
                <PageSection>
                  <Heading level="h3" data-h2-font-weight="base(700)">
                    {intl.formatMessage({
                      defaultMessage: "Education requirement",
                      id: "M7zr6L",
                      description: "abc",
                    })}
                  </Heading>
                  <p>
                    {intl.formatMessage({
                      defaultMessage: "Requirement selection",
                      id: "9FtaQX",
                      description: "aaa",
                    })}
                    {intl.formatMessage(commonMessages.dividingColon)}
                    {relevantPoolCandidate.educationRequirementOption
                      ? intl.formatMessage(
                          getEducationRequirementOption(
                            relevantPoolCandidate.educationRequirementOption,
                          ),
                        )
                      : intl.formatMessage(commonMessages.notAvailable)}
                  </p>
                </PageSection>
                <PageSection>
                  <p>
                    {intl.formatMessage({
                      defaultMessage:
                        "Demonstrated with the following experiences",
                      id: "1+zt86",
                      description: "aaa",
                    })}
                  </p>
                  {relevantPoolCandidate.educationRequirementExperiences &&
                    relevantPoolCandidate.educationRequirementExperiences
                      .length > 0 && (
                      <ul>
                        {relevantPoolCandidate.educationRequirementExperiences.map(
                          (experience) => {
                            return experience &&
                              (isEducationExperience(experience) ||
                                isWorkExperience(experience))
                              ? educationOrWorkExperienceListElement(experience)
                              : "";
                          },
                        )}
                      </ul>
                    )}
                </PageSection>
                <Heading level="h3" data-h2-font-weight="base(700)">
                  {intl.formatMessage({
                    defaultMessage: "Essential skills",
                    id: "gB91od",
                    description: "abc",
                  })}
                </Heading>
                <PageSection>
                  {pool.essentialSkills
                    ? pool.essentialSkills.map((skill) =>
                        skillSection(
                          skill,
                          user.experiences?.filter(notEmpty) ?? [],
                        ),
                      )
                    : ""}
                </PageSection>
                <Heading level="h3" data-h2-font-weight="base(700)">
                  {intl.formatMessage({
                    defaultMessage: "Asset skills",
                    id: "Xre5Pj",
                    description: "abc",
                  })}
                </Heading>
                <PageSection>
                  {pool.nonessentialSkills
                    ? pool.nonessentialSkills.map((skill) =>
                        skillSection(
                          skill,
                          user.experiences?.filter(notEmpty) ?? [],
                        ),
                      )
                    : ""}
                </PageSection>
                <PageSection>
                  <Heading level="h3" data-h2-font-weight="base(700)">
                    {intl.formatMessage({
                      defaultMessage: "Screening questions",
                      id: "8KDi7T",
                      description: "abc",
                    })}
                  </Heading>
                  <ul>
                    {relevantPoolCandidate.screeningQuestionResponses?.map(
                      (instance) => {
                        return (
                          <li key={instance?.id}>
                            <p data-h2-font-weight="base(700)">
                              {getLocalizedName(
                                instance?.screeningQuestion?.question,
                                intl,
                              )}
                            </p>
                            <p>{instance?.answer}</p>
                          </li>
                        );
                      },
                    )}
                  </ul>
                </PageSection>
                <BreakingPageSection>
                  <Heading level="h3" data-h2-font-weight="base(700)">
                    {intl.formatMessage(
                      navigationMessages.careerTimelineAndRecruitment,
                    )}
                  </Heading>
                  <PrintExperienceByType
                    experiences={user.experiences?.filter(notEmpty)}
                  />
                </BreakingPageSection>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});
export default ApplicationPrintDocument;
