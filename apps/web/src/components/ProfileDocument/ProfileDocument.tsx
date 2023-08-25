import React from "react";
import { useIntl } from "react-intl";
import isEmpty from "lodash/isEmpty";

import { Heading } from "@gc-digital-talent/ui";
import { insertBetween, notEmpty } from "@gc-digital-talent/helpers";
import {
  commonMessages,
  getArmedForcesStatusesAdmin,
  getBilingualEvaluation,
  getCitizenshipStatusesAdmin,
  getEmploymentEquityGroup,
  getEmploymentEquityStatement,
  getIndigenousCommunity,
  getLanguageProficiency,
  getLocale,
  getOperationalRequirement,
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
} from "@gc-digital-talent/graphql";

import { getFullNameLabel } from "~/utils/nameUtils";
import PrintExperienceByType from "~/components/UserProfile/PrintExperienceByType/PrintExperienceByType";
import { anyCriteriaSelected as anyCriteriaSelectedDiversityEquityInclusion } from "~/validators/profile/diversityEquityInclusion";

interface ProfileDocumentProps {
  results: User[] | PoolCandidate[];
  anonymous?: boolean;
}

const PageSection = ({ children }: { children: React.ReactNode }) => (
  <div
    data-h2-margin-bottom="base(2rem)"
    data-h2-display="base(block)"
    data-h2-break-inside="base(avoid) base:print(avoid)"
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

const ProfileDocument = React.forwardRef<HTMLDivElement, ProfileDocumentProps>(
  ({ results, anonymous }, ref) => {
    const intl = useIntl();
    const locale = getLocale(intl);

    return (
      <div style={{ display: "none" }}>
        <div data-h2 ref={ref}>
          <div
            data-h2-font-family="base(sans) base:print(sans)"
            data-h2-padding-bottom="base(2rem) base:print(2rem)"
            data-h2-border-bottom="base(2px dashed black) base:print(2px dashed black)"
          >
            {results && (
              <div>
                <Heading level="h1" style={{ fontWeight: "700" }}>
                  {intl.formatMessage(
                    {
                      defaultMessage: `{resultCount, plural,
                      =1 {Candidate profile}
                      other {Candidate profiles}
                    }`,
                      id: "mUiS9q",
                      description: "Document title for printing profiles",
                    },
                    {
                      resultCount: results.length,
                    },
                  )}
                </Heading>
              </div>
            )}
            {results &&
              results.map((initialResult, index) => {
                const result: User =
                  "user" in initialResult ? initialResult.user : initialResult;

                const govEmployeeTypeId =
                  enumToOptions(GovEmployeeType).find(
                    (govEmployeeType) =>
                      govEmployeeType.value === result.govEmployeeType,
                  )?.value || "";
                const regionPreferencesSquished =
                  result.locationPreferences?.map((region) =>
                    region ? intl.formatMessage(getWorkRegion(region)) : "",
                  );
                const regionPreferences = regionPreferencesSquished
                  ? insertBetween(", ", regionPreferencesSquished)
                  : "";

                const acceptedOperationalArray =
                  result.acceptedOperationalRequirements
                    ? result.acceptedOperationalRequirements.map(
                        (opRequirement) => (
                          <li key={opRequirement}>
                            {opRequirement
                              ? intl.formatMessage(
                                  getOperationalRequirement(
                                    opRequirement,
                                    "firstPerson",
                                  ),
                                )
                              : ""}
                          </li>
                        ),
                      )
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
                const unselectedOperationalArray =
                  operationalRequirementsSubsetV2.filter(
                    (requirement) =>
                      !result.acceptedOperationalRequirements?.includes(
                        requirement,
                      ),
                  );
                const unacceptedOperationalArray = unselectedOperationalArray
                  ? unselectedOperationalArray.map((opRequirement) => (
                      <li key={opRequirement}>
                        {opRequirement
                          ? intl.formatMessage(
                              getOperationalRequirement(
                                opRequirement,
                                "firstPerson",
                              ),
                            )
                          : ""}
                      </li>
                    ))
                  : null;

                const nonLegacyIndigenousCommunities =
                  unpackMaybes(result.indigenousCommunities).filter(
                    (c) => c !== IndigenousCommunity.LegacyIsIndigenous,
                  ) || [];

                return (
                  <React.Fragment key={result.id}>
                    <div>
                      <PageSection>
                        <Heading level="h2">
                          {(!!result.firstName || !!result.lastName) &&
                            getFullNameLabel(
                              result.firstName,
                              result.lastName,
                              intl,
                            )}
                        </Heading>
                      </PageSection>
                      <PageSection>
                        <Heading level="h3">
                          {intl.formatMessage(commonMessages.status)}
                        </Heading>
                        {result.armedForcesStatus !== null &&
                          result.armedForcesStatus !== undefined && (
                            <p>
                              {intl.formatMessage({
                                defaultMessage: "Member of CAF",
                                id: "ybzxmU",
                                description: "Veteran/member label",
                              })}
                              {intl.formatMessage(commonMessages.dividingColon)}
                              {intl.formatMessage(
                                getArmedForcesStatusesAdmin(
                                  result.armedForcesStatus,
                                ),
                              )}
                            </p>
                          )}
                        {result.citizenship ? (
                          <p>
                            {intl.formatMessage({
                              defaultMessage: "Citizenship",
                              id: "sr20Tb",
                              description: "Citizenship label",
                            })}
                            {intl.formatMessage(commonMessages.dividingColon)}
                            {intl.formatMessage(
                              getCitizenshipStatusesAdmin(result.citizenship),
                            )}
                          </p>
                        ) : (
                          intl.formatMessage(commonMessages.notProvided)
                        )}
                      </PageSection>
                      <PageSection>
                        <Heading level="h3">
                          {intl.formatMessage(
                            navigationMessages.languageInformation,
                          )}
                        </Heading>
                        {result.lookingForEnglish &&
                          !result.lookingForFrench &&
                          !result.lookingForBilingual && (
                            <p>
                              {intl.formatMessage({
                                defaultMessage: "Interested in",
                                id: "/oqWA0",
                                description: "Interested in label",
                              })}
                              {intl.formatMessage(commonMessages.dividingColon)}
                              {intl.formatMessage({
                                defaultMessage: "English positions",
                                id: "vFMPHW",
                                description: "English Positions message",
                              })}
                            </p>
                          )}
                        {!result.lookingForEnglish &&
                          result.lookingForFrench &&
                          !result.lookingForBilingual && (
                            <p>
                              {intl.formatMessage({
                                defaultMessage: "Interested in",
                                id: "/oqWA0",
                                description: "Interested in label",
                              })}
                              {intl.formatMessage(commonMessages.dividingColon)}
                              {intl.formatMessage({
                                defaultMessage: "French positions",
                                id: "qT9sS0",
                                description: "French Positions message",
                              })}
                            </p>
                          )}
                        {result.lookingForEnglish &&
                          result.lookingForFrench &&
                          !result.lookingForBilingual && (
                            <p>
                              {intl.formatMessage({
                                defaultMessage: "Interested in",
                                id: "/oqWA0",
                                description: "Interested in label",
                              })}
                              {intl.formatMessage(commonMessages.dividingColon)}
                              {intl.formatMessage({
                                defaultMessage: "English or French positions",
                                id: "fFznH0",
                                description:
                                  "English or French Positions message",
                              })}
                            </p>
                          )}
                        {result.lookingForBilingual && (
                          <p>
                            {intl.formatMessage({
                              defaultMessage: "Interested in",
                              id: "/oqWA0",
                              description: "Interested in label",
                            })}
                            {intl.formatMessage(commonMessages.dividingColon)}
                            {intl.formatMessage({
                              defaultMessage:
                                "Bilingual positions (English and French)",
                              id: "6eCvv1",
                              description: "Bilingual Positions message",
                            })}
                          </p>
                        )}
                        {result.bilingualEvaluation && (
                          <p>
                            {intl.formatMessage({
                              defaultMessage:
                                "Completed an official Government of Canada evaluation",
                              id: "o4PND7",
                              description:
                                "Completed a Government of Canada evaluation label",
                            })}
                            {intl.formatMessage(commonMessages.dividingColon)}
                            {intl.formatMessage(
                              getBilingualEvaluation(
                                result.bilingualEvaluation,
                              ),
                            )}
                          </p>
                        )}
                        {(result.bilingualEvaluation ===
                          BilingualEvaluation.CompletedEnglish ||
                          result.bilingualEvaluation ===
                            BilingualEvaluation.CompletedFrench) && (
                          <p>
                            {intl.formatMessage({
                              defaultMessage:
                                "Second language level (reading, writing, oral interaction)",
                              id: "qOi2J0",
                              description:
                                "Second language level (reading, writing, oral interaction) label",
                            })}
                            {intl.formatMessage(commonMessages.dividingColon)}
                            {insertBetween(", ", [
                              result.comprehensionLevel
                                ? result.comprehensionLevel
                                : "",
                              result.writtenLevel ? result.writtenLevel : "",
                              result.verbalLevel ? result.verbalLevel : "",
                            ]).join("")}
                          </p>
                        )}
                        {result.bilingualEvaluation ===
                          BilingualEvaluation.NotCompleted &&
                          !!result.estimatedLanguageAbility && (
                            <p>
                              {intl.formatMessage({
                                defaultMessage: "Second language level",
                                id: "VTHGET",
                                description:
                                  "Estimated skill in second language",
                              })}
                              {intl.formatMessage(commonMessages.dividingColon)}
                              {intl.formatMessage(
                                getLanguageProficiency(
                                  result.estimatedLanguageAbility,
                                ),
                              )}
                            </p>
                          )}
                      </PageSection>
                      <PageSection>
                        <Heading level="h3">
                          {intl.formatMessage(
                            navigationMessages.governmentInformation,
                          )}
                        </Heading>
                        <p>
                          {intl.formatMessage({
                            defaultMessage: "Government of Canada employee",
                            id: "e5/v2u",
                            description:
                              "Label for status as Government of Canada employee",
                          })}
                          {intl.formatMessage(commonMessages.dividingColon)}
                          {result.isGovEmployee
                            ? intl.formatMessage(commonMessages.yes)
                            : intl.formatMessage(commonMessages.no)}
                        </p>
                        {result.isGovEmployee && result.department && (
                          <p>
                            {intl.formatMessage({
                              defaultMessage: "Department",
                              id: "M7bb1V",
                              description:
                                "Label for applicant's Government of Canada department",
                            })}
                            {intl.formatMessage(commonMessages.dividingColon)}
                            {result.department.name[locale]}
                          </p>
                        )}
                        {result.govEmployeeType && (
                          <p>
                            {intl.formatMessage({
                              defaultMessage: "Employment type",
                              id: "2Oubfe",
                              description:
                                "Label for applicant's employment type",
                            })}
                            {intl.formatMessage(commonMessages.dividingColon)}
                            {intl.formatMessage(
                              getSimpleGovEmployeeType(govEmployeeTypeId),
                            )}
                          </p>
                        )}
                        {result.isGovEmployee &&
                          !!result.currentClassification?.group &&
                          !!result.currentClassification?.level && (
                            <p>
                              {intl.formatMessage({
                                defaultMessage:
                                  "Current group and classification",
                                id: "hV2hKJ",
                                description:
                                  "Field label before government employment group and level",
                              })}
                              {intl.formatMessage(commonMessages.dividingColon)}
                              {result.currentClassification?.group}-
                              {result.currentClassification?.level}
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
                          {result.hasPriorityEntitlement
                            ? intl.formatMessage(commonMessages.yes)
                            : intl.formatMessage(commonMessages.no)}
                        </p>
                        {result.hasPriorityEntitlement && (
                          <p>
                            {intl.formatMessage({
                              defaultMessage: "Priority number",
                              id: "mGGj/i",
                              description:
                                "Label for applicant's priority number value",
                            })}
                            {intl.formatMessage(commonMessages.dividingColon)}
                            {result.priorityNumber
                              ? result.priorityNumber
                              : intl.formatMessage(commonMessages.notProvided)}
                          </p>
                        )}
                      </PageSection>
                      <PageSection>
                        <Heading level="h3">
                          {intl.formatMessage(navigationMessages.workLocation)}
                        </Heading>
                        {!isEmpty(result.locationPreferences) && (
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
                        {!!result.locationExemptions && (
                          <p>
                            {intl.formatMessage({
                              defaultMessage: "Work location exceptions",
                              id: "OpKC2i",
                              description: "Work location exceptions label",
                            })}
                            {intl.formatMessage(commonMessages.dividingColon)}
                            {result.locationExemptions}
                          </p>
                        )}
                      </PageSection>
                      <PageSection>
                        <Heading level="h3">
                          {intl.formatMessage(
                            navigationMessages.workPreferences,
                          )}
                        </Heading>
                        {result.positionDuration &&
                          result.positionDuration.includes(
                            PositionDuration.Temporary,
                          ) && (
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
                        {result.positionDuration &&
                          !result.positionDuration.includes(
                            PositionDuration.Temporary,
                          ) && (
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
                        {anyCriteriaSelected &&
                          !isEmpty(unacceptedOperationalArray) && (
                            <>
                              <p>
                                {intl.formatMessage({
                                  defaultMessage:
                                    "Would consider accepting a job that:",
                                  id: "q3xbiI",
                                  description:
                                    "Label for what conditions a user will accept, followed by a colon",
                                })}
                              </p>
                              <ul>{acceptedOperationalArray}</ul>
                            </>
                          )}
                        {anyCriteriaSelected &&
                          !isEmpty(unacceptedOperationalArray) && (
                            <>
                              <p>
                                {intl.formatMessage({
                                  defaultMessage:
                                    "Would <strong>not consider</strong> accepting a job that:",
                                  id: "b4Kjwl",
                                  description:
                                    "would not accept job line before a list",
                                })}
                              </p>
                              <ul>{unacceptedOperationalArray}</ul>
                            </>
                          )}
                        {anyCriteriaSelected &&
                          isEmpty(unacceptedOperationalArray) && (
                            <>
                              <p>
                                {intl.formatMessage({
                                  defaultMessage:
                                    "Would consider accepting a job that:",
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
                                description:
                                  "would not accept job line before a list",
                              })}
                            </p>
                            <ul>{unacceptedOperationalArray}</ul>
                          </>
                        )}
                      </PageSection>
                      <PageSection>
                        <Heading level="h3">
                          {intl.formatMessage(
                            navigationMessages.diversityEquityInclusion,
                          )}
                        </Heading>
                        {anyCriteriaSelectedDiversityEquityInclusion(
                          result,
                        ) && (
                          <>
                            <p>
                              {intl.formatMessage({
                                defaultMessage: "Employment equity information",
                                id: "xd9+6O",
                                description:
                                  "Label preceding what groups the user identifies as part of",
                              })}
                            </p>
                            {result.indigenousCommunities &&
                              result.indigenousCommunities.length > 0 && (
                                <div>
                                  <ul>
                                    <li>
                                      {intl.formatMessage(
                                        getEmploymentEquityStatement(
                                          "indigenous",
                                        ),
                                      )}
                                      <ul>
                                        {nonLegacyIndigenousCommunities.length >
                                        0
                                          ? nonLegacyIndigenousCommunities.map(
                                              (community) => {
                                                return (
                                                  <li key={community}>
                                                    {intl.formatMessage(
                                                      getIndigenousCommunity(
                                                        community,
                                                      ),
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
                            {(result.isWoman ||
                              result.isVisibleMinority ||
                              result.hasDisability) && (
                              <ul>
                                {result.isWoman && (
                                  <li>
                                    {intl.formatMessage(
                                      getEmploymentEquityGroup("woman"),
                                    )}
                                  </li>
                                )}
                                {result.isVisibleMinority && (
                                  <li>
                                    {intl.formatMessage(
                                      getEmploymentEquityGroup("minority"),
                                    )}
                                  </li>
                                )}{" "}
                                {result.hasDisability && (
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
                      <BreakingPageSection>
                        <Heading level="h3">
                          {intl.formatMessage(
                            navigationMessages.careerTimelineAndRecruitment,
                          )}
                        </Heading>
                        <PrintExperienceByType
                          experiences={result.experiences?.filter(notEmpty)}
                        />
                      </BreakingPageSection>
                    </div>
                    {index + 1 !== results.length && (
                      <div style={{ breakAfter: "page" }} />
                    )}
                  </React.Fragment>
                );
              })}
          </div>
        </div>
      </div>
    );
  },
);

export default ProfileDocument;
