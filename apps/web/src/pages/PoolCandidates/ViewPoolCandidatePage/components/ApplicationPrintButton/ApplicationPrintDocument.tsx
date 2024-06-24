import { useIntl } from "react-intl";
import isEmpty from "lodash/isEmpty";
import { ReactNode, forwardRef } from "react";

import { Heading } from "@gc-digital-talent/ui";
import {
  insertBetween,
  notEmpty,
  unpackMaybes,
} from "@gc-digital-talent/helpers";
import {
  commonMessages,
  getArmedForcesStatusesAdmin,
  getCitizenshipStatusesAdmin,
  getEducationRequirementOption,
  getEmploymentEquityGroup,
  getEmploymentEquityStatement,
  getIndigenousCommunity,
  getLanguage,
  getLocale,
  getLocalizedName,
  getOperationalRequirement,
  getProvinceOrTerritory,
  getSimpleGovEmployeeType,
  getWorkRegion,
  navigationMessages,
} from "@gc-digital-talent/i18n";
import { enumToOptions } from "@gc-digital-talent/forms";
import {
  graphql,
  GovEmployeeType,
  OperationalRequirement,
  PositionDuration,
  User,
  IndigenousCommunity,
  SkillCategory,
  FragmentType,
  getFragment,
  PoolSkillType,
} from "@gc-digital-talent/graphql";

import { getFullNameLabel } from "~/utils/nameUtils";
import PrintExperienceByType from "~/components/UserProfile/PrintExperienceByType/PrintExperienceByType";
import { anyCriteriaSelected as anyCriteriaSelectedDiversityEquityInclusion } from "~/validators/profile/diversityEquityInclusion";
import applicationMessages from "~/messages/applicationMessages";
import {
  filterSkillsByCategory,
  getExperiencesSkillIds,
  groupPoolSkillByType,
} from "~/utils/skillUtils";
import processMessages from "~/messages/processMessages";
import Display from "~/components/Profile/components/LanguageProfile/Display";

import SkillWithExperiences from "./SkillWithExperiences";
import EducationRequirementExperience from "./EducationRequirementExperience";

interface ApplicationPrintDocumentProps {
  user: User;
  poolQuery: FragmentType<typeof ApplicationPrintDocument_PoolFragment>;
  anonymous?: boolean;
}

const PageSection = ({ children }: { children: ReactNode }) => (
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
const BreakingPageSection = ({ children }: { children: ReactNode }) => (
  <div data-h2-margin-bottom="base(2rem)" data-h2-display="base(block)">
    {children}
  </div>
);

export const ApplicationPrintDocument_PoolFragment = graphql(/* GraphQL */ `
  fragment ApplicationPrintDocument_PoolFragment on Pool {
    id
    poolSkills {
      id
      type {
        value
      }
      skill {
        id
        category {
          value
        }
        key
        name {
          en
          fr
        }
        description {
          en
          fr
        }
      }
    }
  }
`);

const ApplicationPrintDocument = forwardRef<
  HTMLDivElement,
  ApplicationPrintDocumentProps
>(({ user, poolQuery, anonymous }, ref) => {
  const intl = useIntl();
  const locale = getLocale(intl);

  const pool = getFragment(ApplicationPrintDocument_PoolFragment, poolQuery);

  // data manipulation
  // pull pool candidate for the pool in question out of snapshot
  const poolCandidates = unpackMaybes(user.poolCandidates);
  const relevantPoolCandidate = poolCandidates.find(
    (element) => element.pool.id === pool.id,
  );

  // unpack education requirement experiences
  const educationRequirementExperiencesFiltered =
    relevantPoolCandidate?.educationRequirementExperiences?.filter(notEmpty) ??
    [];

  // filter out behavioural skills for both, and unused asset skills
  const poolSkills = groupPoolSkillByType(pool?.poolSkills);
  const poolEssentialTechnicalSkills = unpackMaybes(
    filterSkillsByCategory(
      poolSkills.get(PoolSkillType.Essential),
      SkillCategory.Technical,
    ),
  );

  const poolNonEssentialTechnicalSkills = unpackMaybes(
    filterSkillsByCategory(
      poolSkills.get(PoolSkillType.Nonessential),
      SkillCategory.Technical,
    ),
  );
  const experiencesSkillIds = getExperiencesSkillIds(
    user.experiences?.filter(notEmpty) ?? [],
  );
  const usedAssetsSkills = poolNonEssentialTechnicalSkills.filter(
    (assetSkill) => experiencesSkillIds.includes(assetSkill.id),
  );

  // massage user data for display
  const govEmployeeTypeId =
    enumToOptions(GovEmployeeType).find(
      (govEmployeeType) => govEmployeeType.value === user.govEmployeeType,
    )?.value || "";
  const regionPreferencesSquished = user.locationPreferences?.map((region) =>
    region ? intl.formatMessage(getWorkRegion(region)) : "",
  );
  const regionPreferences = regionPreferencesSquished
    ? insertBetween(", ", regionPreferencesSquished)
    : "";
  const acceptedOperationalArray = user.acceptedOperationalRequirements
    ? user.acceptedOperationalRequirements.map((opRequirement) => (
        <li key={opRequirement}>
          {opRequirement
            ? intl.formatMessage(
                getOperationalRequirement(opRequirement, "firstPerson"),
              )
            : ""}
        </li>
      ))
    : null;
  const anyCriteriaSelected = !isEmpty(acceptedOperationalArray);
  const operationalRequirementsSubsetV2 = [
    OperationalRequirement.OvertimeOccasional,
    OperationalRequirement.OvertimeRegular,
    OperationalRequirement.ShiftWork,
    OperationalRequirement.OnCall,
    OperationalRequirement.Travel,
    OperationalRequirement.TransportEquipment,
    OperationalRequirement.DriversLicense,
  ];
  const unselectedOperationalArray = operationalRequirementsSubsetV2.filter(
    (requirement) =>
      !user.acceptedOperationalRequirements?.includes(requirement),
  );
  const unacceptedOperationalArray = unselectedOperationalArray
    ? unselectedOperationalArray.map((opRequirement) => (
        <li key={opRequirement}>
          {opRequirement
            ? intl.formatMessage(
                getOperationalRequirement(opRequirement, "firstPerson"),
              )
            : ""}
        </li>
      ))
    : null;
  const nonLegacyIndigenousCommunities =
    unpackMaybes(user.indigenousCommunities).filter(
      (c) => c !== IndigenousCommunity.LegacyIsIndigenous,
    ) || [];

  const classificationGroup = relevantPoolCandidate?.pool.classification?.group;

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
              {anonymous ? (
                <>
                  {getFullNameLabel(
                    user.firstName,
                    user.lastName ? `${user.lastName?.slice(0, 1)}.` : null,
                    intl,
                  )}
                </>
              ) : (
                <>{getFullNameLabel(user.firstName, user.lastName, intl)}</>
              )}
            </Heading>
            {relevantPoolCandidate && (
              <>
                <PageSection>
                  <Heading level="h3" data-h2-font-weight="base(700)">
                    {intl.formatMessage(processMessages.educationRequirement)}
                  </Heading>
                  <p>
                    {intl.formatMessage({
                      defaultMessage: "Requirement selection",
                      id: "bp1VHg",
                      description: "Label before required selection listed.",
                    })}
                    {intl.formatMessage(commonMessages.dividingColon)}
                    {relevantPoolCandidate.educationRequirementOption
                      ? intl.formatMessage(
                          getEducationRequirementOption(
                            relevantPoolCandidate.educationRequirementOption,
                            classificationGroup,
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
                      id: "1CRt78",
                      description:
                        "label before listing experience associated with fulfilling requirements.",
                    })}
                  </p>
                  {educationRequirementExperiencesFiltered.length > 0 && (
                    <ul>
                      {educationRequirementExperiencesFiltered.map(
                        (experience) => {
                          return (
                            <EducationRequirementExperience
                              experience={experience}
                              key={`${experience.id}-education-requirement`}
                            />
                          );
                        },
                      )}
                    </ul>
                  )}
                </PageSection>
                <BreakingPageSection>
                  <Heading level="h3" data-h2-font-weight="base(700)">
                    {intl.formatMessage({
                      defaultMessage: "Essential skills",
                      id: "w7E0He",
                      description:
                        "Title for the required skills snapshot section",
                    })}
                  </Heading>
                  {poolEssentialTechnicalSkills.length > 0 ? (
                    poolEssentialTechnicalSkills.map((skill) => (
                      <SkillWithExperiences
                        key={skill.id}
                        skill={skill}
                        experiences={user.experiences?.filter(notEmpty) ?? []}
                      />
                    ))
                  ) : (
                    <p>{intl.formatMessage(commonMessages.notAvailable)}</p>
                  )}
                </BreakingPageSection>
                <BreakingPageSection>
                  <Heading level="h3" data-h2-font-weight="base(700)">
                    {intl.formatMessage({
                      defaultMessage: "Asset skills",
                      id: "K0Zkdw",
                      description: "Title for optional skills",
                    })}
                  </Heading>
                  {usedAssetsSkills.length > 0 ? (
                    usedAssetsSkills.map((skill) => (
                      <SkillWithExperiences
                        key={skill.id}
                        skill={skill}
                        experiences={user.experiences?.filter(notEmpty) ?? []}
                      />
                    ))
                  ) : (
                    <p>{intl.formatMessage(commonMessages.notAvailable)}</p>
                  )}
                </BreakingPageSection>
                <PageSection>
                  <Heading level="h3" data-h2-font-weight="base(700)">
                    {intl.formatMessage(processMessages.generalQuestions)}
                  </Heading>
                  <ul>
                    {relevantPoolCandidate.generalQuestionResponses?.map(
                      (instance) => {
                        return (
                          <li key={instance?.id}>
                            <p data-h2-font-weight="base(700)">
                              {getLocalizedName(
                                instance?.generalQuestion?.question,
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
              </>
            )}
            {!relevantPoolCandidate && (
              <PageSection>
                <Heading level="h3" data-h2-font-weight="base(700)">
                  {intl.formatMessage({
                    defaultMessage: "Error, snapshot information missing",
                    id: "FxqP5P",
                    description:
                      "Error displayed in print view when attempting to print partial snapshot.",
                  })}
                </Heading>
              </PageSection>
            )}
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
            <Heading level="h2" data-h2-font-weight="base(700)">
              {intl.formatMessage({
                defaultMessage: "Personal information",
                id: "cA0iH+",
                description:
                  "Profile and applications card title for profile card",
              })}
            </Heading>
            {!anonymous && (
              <PageSection>
                <Heading level="h3" data-h2-font-weight="base(700)">
                  {intl.formatMessage({
                    defaultMessage: "Contact information",
                    id: "XqF3wS",
                    description:
                      "Profile section title for contact information",
                  })}
                </Heading>
                {user.email && (
                  <p>
                    {intl.formatMessage(commonMessages.email)}
                    {intl.formatMessage(commonMessages.dividingColon)}
                    {user.email}
                  </p>
                )}
                {user.telephone && (
                  <p>
                    {intl.formatMessage(commonMessages.telephone)}
                    {intl.formatMessage(commonMessages.dividingColon)}
                    {user.telephone}
                  </p>
                )}
                {user.currentCity && user.currentProvince && (
                  <p>
                    {intl.formatMessage({
                      defaultMessage: "City",
                      id: "QjO3Y0",
                      description: "Label for city and province/territory",
                    })}
                    {intl.formatMessage(commonMessages.dividingColon)}
                    {user.currentCity},{" "}
                    {intl.formatMessage(
                      getProvinceOrTerritory(user.currentProvince),
                    )}
                  </p>
                )}
                {user.preferredLang && (
                  <p>
                    {intl.formatMessage({
                      defaultMessage: "Communication language",
                      id: "BzKGyK",
                      description: "Label for communication language",
                    })}
                    {intl.formatMessage(commonMessages.dividingColon)}
                    {intl.formatMessage(getLanguage(user.preferredLang))}
                  </p>
                )}
                {user.preferredLanguageForInterview && (
                  <p>
                    {intl.formatMessage({
                      defaultMessage: "Spoken interview language",
                      id: "HUy0EA",
                      description: "Label for spoken interview language",
                    })}
                    {intl.formatMessage(commonMessages.dividingColon)}
                    {intl.formatMessage(
                      getLanguage(user.preferredLanguageForInterview),
                    )}
                  </p>
                )}
                {user.preferredLanguageForExam && (
                  <p>
                    {intl.formatMessage({
                      defaultMessage: "Written exam language",
                      id: "Yh1Y7Z",
                      description: "Label for written exam language",
                    })}
                    {intl.formatMessage(commonMessages.dividingColon)}
                    {intl.formatMessage(
                      getLanguage(user.preferredLanguageForExam),
                    )}
                  </p>
                )}
              </PageSection>
            )}
            <PageSection>
              <Heading level="h4" data-h2-font-weight="base(700)">
                {intl.formatMessage(commonMessages.status)}
              </Heading>
              {user.armedForcesStatus !== null &&
                user.armedForcesStatus !== undefined && (
                  <p>
                    {intl.formatMessage({
                      defaultMessage: "Member of CAF",
                      id: "ybzxmU",
                      description: "Veteran/member label",
                    })}
                    {intl.formatMessage(commonMessages.dividingColon)}
                    {intl.formatMessage(
                      getArmedForcesStatusesAdmin(user.armedForcesStatus),
                    )}
                  </p>
                )}
              {user.citizenship ? (
                <p>
                  {intl.formatMessage({
                    defaultMessage: "Citizenship",
                    id: "sr20Tb",
                    description: "Citizenship label",
                  })}
                  {intl.formatMessage(commonMessages.dividingColon)}
                  {intl.formatMessage(
                    getCitizenshipStatusesAdmin(user.citizenship),
                  )}
                </p>
              ) : (
                intl.formatMessage(commonMessages.notProvided)
              )}
            </PageSection>
            <PageSection>
              <Heading level="h4" data-h2-font-weight="base(700)">
                {intl.formatMessage(navigationMessages.languageInformation)}
              </Heading>
              <Display user={user} context="print" />
            </PageSection>
            <PageSection>
              <Heading level="h4" data-h2-font-weight="base(700)">
                {intl.formatMessage(navigationMessages.governmentInformation)}
              </Heading>
              <p>
                {intl.formatMessage({
                  defaultMessage: "Government of Canada employee",
                  id: "e5/v2u",
                  description:
                    "Label for status as Government of Canada employee",
                })}
                {intl.formatMessage(commonMessages.dividingColon)}
                {user.isGovEmployee
                  ? intl.formatMessage(commonMessages.yes)
                  : intl.formatMessage(commonMessages.no)}
              </p>
              {user.isGovEmployee && user.department && (
                <p>
                  {intl.formatMessage(commonMessages.department)}
                  {intl.formatMessage(commonMessages.dividingColon)}
                  {user.department.name[locale]}
                </p>
              )}
              {user.govEmployeeType && (
                <p>
                  {intl.formatMessage({
                    defaultMessage: "Employment type",
                    id: "2Oubfe",
                    description: "Label for applicant's employment type",
                  })}
                  {intl.formatMessage(commonMessages.dividingColon)}
                  {intl.formatMessage(
                    getSimpleGovEmployeeType(govEmployeeTypeId),
                  )}
                </p>
              )}
              {user.isGovEmployee &&
                !!user.currentClassification?.group &&
                !!user.currentClassification?.level && (
                  <p>
                    {intl.formatMessage({
                      defaultMessage: "Current group and classification",
                      id: "hV2hKJ",
                      description:
                        "Field label before government employment group and level",
                    })}
                    {intl.formatMessage(commonMessages.dividingColon)}
                    {user.currentClassification?.group}-
                    {user.currentClassification?.level}
                  </p>
                )}
              <p>
                {intl.formatMessage({
                  defaultMessage: "Priority entitlement",
                  id: "Wd/+eR",
                  description:
                    "Label for applicant's priority entitlement status",
                })}
                {intl.formatMessage(commonMessages.dividingColon)}
                {user.hasPriorityEntitlement
                  ? intl.formatMessage(commonMessages.yes)
                  : intl.formatMessage(commonMessages.no)}
              </p>
              {user.hasPriorityEntitlement && (
                <p>
                  {intl.formatMessage({
                    defaultMessage: "Priority number",
                    id: "mGGj/i",
                    description: "Label for applicant's priority number value",
                  })}
                  {intl.formatMessage(commonMessages.dividingColon)}
                  {user.priorityNumber
                    ? user.priorityNumber
                    : intl.formatMessage(commonMessages.notProvided)}
                </p>
              )}
            </PageSection>
            <PageSection>
              <Heading level="h4" data-h2-font-weight="base(700)">
                {intl.formatMessage(navigationMessages.workLocation)}
              </Heading>
              {!isEmpty(user.locationPreferences) && (
                <p>
                  {intl.formatMessage({
                    defaultMessage: "Work location",
                    id: "SZzC9e",
                    description: "Work location label",
                  })}
                  {intl.formatMessage(commonMessages.dividingColon)}
                  {regionPreferences}
                </p>
              )}
              {!!user.locationExemptions && (
                <p>
                  {intl.formatMessage({
                    defaultMessage: "Work location exceptions",
                    id: "OpKC2i",
                    description: "Work location exceptions label",
                  })}
                  {intl.formatMessage(commonMessages.dividingColon)}
                  {user.locationExemptions}
                </p>
              )}
            </PageSection>
            <PageSection>
              <Heading level="h4" data-h2-font-weight="base(700)">
                {intl.formatMessage(navigationMessages.workPreferences)}
              </Heading>
              {user.positionDuration &&
                user.positionDuration.includes(PositionDuration.Temporary) && (
                  <>
                    <p>
                      {intl.formatMessage({
                        defaultMessage:
                          "Would consider accepting a job that lasts for:",
                        id: "j/28Dz",
                        description:
                          "Label for what length of position user prefers, followed by colon",
                      })}
                    </p>
                    <ul>
                      <li>
                        {intl.formatMessage({
                          defaultMessage:
                            "any duration. (short term, long term, or indeterminate duration)",
                          id: "uHx3G7",
                          description:
                            "Label displayed on Work Preferences form for any duration option",
                        })}
                      </li>
                    </ul>
                  </>
                )}
              {user.positionDuration &&
                !user.positionDuration.includes(PositionDuration.Temporary) && (
                  <>
                    <p>
                      {intl.formatMessage({
                        defaultMessage:
                          "Would consider accepting a job that lasts for:",
                        id: "j/28Dz",
                        description:
                          "Label for what length of position user prefers, followed by colon",
                      })}
                    </p>
                    <ul>
                      <li>
                        {intl.formatMessage({
                          defaultMessage: "Permanent duration",
                          id: "8cRL8r",
                          description: "Permanent duration only",
                        })}{" "}
                      </li>
                    </ul>
                  </>
                )}
              {anyCriteriaSelected && !isEmpty(unacceptedOperationalArray) && (
                <>
                  <p>
                    {intl.formatMessage({
                      defaultMessage: "Would consider accepting a job that:",
                      id: "q3xbiI",
                      description:
                        "Label for what conditions a user will accept, followed by a colon",
                    })}
                  </p>
                  <ul>{acceptedOperationalArray}</ul>
                </>
              )}
              {anyCriteriaSelected && !isEmpty(unacceptedOperationalArray) && (
                <>
                  <p>
                    {intl.formatMessage({
                      defaultMessage:
                        "Would <strong>not consider</strong> accepting a job that:",
                      id: "b4Kjwl",
                      description: "would not accept job line before a list",
                    })}
                  </p>
                  <ul>{unacceptedOperationalArray}</ul>
                </>
              )}
              {anyCriteriaSelected && isEmpty(unacceptedOperationalArray) && (
                <>
                  <p>
                    {intl.formatMessage({
                      defaultMessage: "Would consider accepting a job that:",
                      id: "q3xbiI",
                      description:
                        "Label for what conditions a user will accept, followed by a colon",
                    })}
                  </p>
                  <ul>{acceptedOperationalArray}</ul>
                </>
              )}
              {!anyCriteriaSelected && (
                <>
                  <p>
                    {intl.formatMessage({
                      defaultMessage:
                        "Would <strong>not consider</strong> accepting a job that:",
                      id: "b4Kjwl",
                      description: "would not accept job line before a list",
                    })}
                  </p>
                  <ul>{unacceptedOperationalArray}</ul>
                </>
              )}
            </PageSection>
            <PageSection>
              <Heading level="h4" data-h2-font-weight="base(700)">
                {intl.formatMessage(
                  navigationMessages.diversityEquityInclusion,
                )}
              </Heading>
              {anyCriteriaSelectedDiversityEquityInclusion(user) && (
                <>
                  <p>
                    {intl.formatMessage({
                      defaultMessage: "Employment equity information",
                      id: "xd9+6O",
                      description:
                        "Label preceding what groups the user identifies as part of",
                    })}
                  </p>
                  {user.indigenousCommunities &&
                    user.indigenousCommunities.length > 0 && (
                      <div>
                        <ul>
                          <li>
                            {intl.formatMessage(
                              getEmploymentEquityStatement("indigenous"),
                            )}
                            <ul>
                              {nonLegacyIndigenousCommunities.length > 0
                                ? nonLegacyIndigenousCommunities.map(
                                    (community) => {
                                      return (
                                        <li key={community}>
                                          {intl.formatMessage(
                                            getIndigenousCommunity(community),
                                          )}
                                        </li>
                                      );
                                    },
                                  )
                                : ""}
                            </ul>
                          </li>
                        </ul>
                      </div>
                    )}
                  {(user.isWoman ||
                    user.isVisibleMinority ||
                    user.hasDisability) && (
                    <ul>
                      {user.isWoman && (
                        <li>
                          {intl.formatMessage(
                            getEmploymentEquityGroup("woman"),
                          )}
                        </li>
                      )}
                      {user.isVisibleMinority && (
                        <li>
                          {intl.formatMessage(
                            getEmploymentEquityGroup("minority"),
                          )}
                        </li>
                      )}{" "}
                      {user.hasDisability && (
                        <li>
                          {intl.formatMessage(
                            getEmploymentEquityGroup("disability"),
                          )}
                        </li>
                      )}
                    </ul>
                  )}
                </>
              )}
            </PageSection>
            {relevantPoolCandidate && (
              <PageSection>
                <Heading level="h2" data-h2-font-weight="base(700)">
                  {intl.formatMessage({
                    defaultMessage: "Signature",
                    id: "1ZZgbi",
                    description: "Title for the signature snapshot section",
                  })}
                </Heading>
                <p data-h2-margin="base(0, 0, x1, 0)">
                  {intl.formatMessage(applicationMessages.confirmationLead)}
                </p>
                <ul>
                  <li>
                    {intl.formatMessage(applicationMessages.confirmationReview)}
                  </li>
                  <li>
                    {intl.formatMessage(
                      applicationMessages.confirmationCommunity,
                    )}
                  </li>
                  <li>
                    {intl.formatMessage(applicationMessages.confirmationTrue)}
                  </li>
                </ul>
                <p> </p>
                <p>
                  {intl.formatMessage({
                    defaultMessage: "Signed",
                    id: "fEcEv3",
                    description:
                      "Heading for the application snapshot users signature",
                  })}
                </p>
                <p data-h2-font-weight="base(700)">
                  {relevantPoolCandidate.signature}
                </p>
              </PageSection>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});
export default ApplicationPrintDocument;
