import {
  disabilityLocalized,
  getLanguageProficiency,
  getOperationalRequirement,
  getWorkRegion,
  indigenousLocalized,
  minorityLocalized,
  womanLocalized,
} from "@common/constants/localizedConstants";
import { getLocale } from "@common/helpers/localize";
import { imageUrl } from "@common/helpers/router";
import { insertBetween } from "@common/helpers/util";
import { commonMessages } from "@common/messages";
import {
  ThumbUpIcon,
  UserIcon,
  ChatAlt2Icon,
  InformationCircleIcon,
  LightningBoltIcon,
  CurrencyDollarIcon,
} from "@heroicons/react/outline";
import { BriefcaseIcon, LibraryIcon } from "@heroicons/react/solid";

import React from "react";
import { useIntl } from "react-intl";
import { ADMIN_APP_DIR } from "../../adminConstants";
import { useAdminRoutes } from "../../adminRoutes";
import {
  useGetCandidateProfileQuery,
  GetCandidateProfileQuery,
  BilingualEvaluation,
  GovEmployeeType,
  useGetUserProfileQuery,
  GetUserProfileQuery,
} from "../../api/generated";

export interface UserProfileProps {
  userProfileData: GetUserProfileQuery | undefined;
}
export const UserProfile: React.FC<UserProfileProps> = ({
  userProfileData,
}) => {
  const firstName = userProfileData?.applicant?.firstName;
  const lastName = userProfileData?.applicant?.lastName;
  const lookingForEnglish = userProfileData?.applicant?.lookingForEnglish;
  const lookingForFrench = userProfileData?.applicant?.lookingForFrench;
  const lookingForBilingual = userProfileData?.applicant?.lookingForBilingual;
  const bilingualEvaluation = userProfileData?.applicant?.bilingualEvaluation;
  const writtenLevel = userProfileData?.applicant?.writtenLevel;
  const comprehensionLevel = userProfileData?.applicant?.comprehensionLevel;
  const verbalLevel = userProfileData?.applicant?.verbalLevel;
  const estimatedLanguageAbility =
    userProfileData?.applicant?.estimatedLanguageAbility;
  const isGovEmployee = userProfileData?.applicant?.isGovEmployee;
  const govEmployeeType = userProfileData?.applicant?.govEmployeeType;
  const interestedInLaterOrSecondment =
    userProfileData?.applicant?.interestedInLaterOrSecondment;
  const currentClassification =
    userProfileData?.applicant?.currentClassification;
  const locationPreferences = userProfileData?.applicant?.locationPreferences;
  const locationExemptions = userProfileData?.applicant?.locationExemptions;
  const acceptedOperationalRequirements =
    userProfileData?.applicant?.acceptedOperationalRequirements;
  const wouldAcceptTemporary = userProfileData?.applicant?.wouldAcceptTemporary;
  const isWoman = userProfileData?.applicant?.isWoman;
  const isIndigenous = userProfileData?.applicant?.isIndigenous;
  const isVisibleMinority = userProfileData?.applicant?.isVisibleMinority;
  const hasDisability = userProfileData?.applicant?.hasDisability;
  const experiences = userProfileData?.applicant?.experiences;
  const expectedSalary = userProfileData?.applicant?.expectedSalary;

  const intl = useIntl();
  const paths = useAdminRoutes();
  const locale = getLocale(intl);

  // generate array of location preferences localized and formatted with spaces/commas
  const regionPreferencesSquished = locationPreferences?.map((region) =>
    region ? getWorkRegion(region).defaultMessage : "",
  );
  const regionPreferences = regionPreferencesSquished
    ? insertBetween(", ", regionPreferencesSquished)
    : "";

  // generate array of  expectedSalary
  const expectedSalaryArray = expectedSalary
    ? expectedSalary.map((es) => (
        <li data-h2-font-weight="b(700)" key={es}>
          {es || ""}
        </li>
      ))
    : null;

  // generate array of accepted operational requirements
  const acceptedOperationalArray = acceptedOperationalRequirements
    ? acceptedOperationalRequirements.map((opRequirement) => (
        <li data-h2-font-weight="b(700)" key={opRequirement}>
          {opRequirement
            ? getOperationalRequirement(opRequirement).defaultMessage
            : ""}
        </li>
      ))
    : null;

  return (
    <div
      data-h2-position="b(relative)"
      data-h2-flex-grid="b(top, contained, flush, none)"
      data-h2-container="b(center, l)"
      data-h2-padding="b(right-left, s)"
    >
      <div
        data-h2-flex-item="b(1of1) s(1of4)"
        data-h2-visibility="b(hidden) s(visible)"
        data-h2-text-align="b(right)"
        data-h2-position="b(sticky)"
      >
        <h2 data-h2-font-weight="b(600)">
          {intl.formatMessage({
            defaultMessage: "On this page",
            description: "Title for table of contents",
          })}
        </h2>
        <p>
          <a href="#language-information">
            {intl.formatMessage({
              defaultMessage: "Language Information",
              description: "Title of the Language Information section",
            })}
          </a>
        </p>
        <p>
          <a href="#government-information">
            {intl.formatMessage({
              defaultMessage: "Government Information",
              description: "Title of the Government Information section",
            })}
          </a>
        </p>
        <p>
          <a href="#work-location">
            {intl.formatMessage({
              defaultMessage: "Work Location",
              description: "Title of the Work Location section",
            })}
          </a>
        </p>
        <p>
          <a href="#work-preferences">
            {intl.formatMessage({
              defaultMessage: "Work Preferences",
              description: "Title of the Work Preferences section",
            })}
          </a>
        </p>
        <p>
          <a href="#employment-equity-information">
            {intl.formatMessage({
              defaultMessage: "Employment Equity Information",
              description: "Title of the Employment Equity Information section",
            })}
          </a>
        </p>
        <p>
          <a href="#role-and-salary-expectations">
            {intl.formatMessage({
              defaultMessage: "Role and salary expectations",
              description: "Title of the Role and salary expectations section",
            })}
          </a>
        </p>
        <p>
          <a href="#skills-and-experience">
            {intl.formatMessage({
              defaultMessage: "Skills and Experience",
              description: "Title of the Skills and Experience section",
            })}
          </a>
        </p>
      </div>
      <div data-h2-flex-item="b(1of1) s(3of4)">
        <div data-h2-padding="b(left, l)">
          <div>
            <h2 data-h2-font-weight="b(600)">
              <UserIcon style={{ width: "calc(1rem*2.25)" }} />
              &nbsp;&nbsp;
              {intl.formatMessage({
                defaultMessage: "About",
                description: "Title of the About section",
              })}
            </h2>
            <div
              data-h2-bg-color="b(lightgray)"
              data-h2-padding="b(all, m)"
              data-h2-radius="b(s)"
            >
              {!!firstName && !!lastName && (
                <p>
                  {intl.formatMessage({
                    defaultMessage: "Name:",
                    description: "Name label and colon",
                  })}{" "}
                  <span data-h2-font-weight="b(700)">
                    {firstName} {lastName}
                  </span>
                </p>
              )}
            </div>
          </div>
          <div id="language-information">
            <div style={{ display: "flex", alignItems: "baseline" }}>
              <h2 data-h2-font-weight="b(600)" style={{ flex: "1 1 0%" }}>
                <ChatAlt2Icon style={{ width: "calc(1rem*2.25)" }} />
                &nbsp;&nbsp;
                {intl.formatMessage({
                  defaultMessage: "Language Information",
                  description: "Title of the Language Information section",
                })}
              </h2>
            </div>
            <div
              data-h2-bg-color="b(lightgray)"
              data-h2-padding="b(all, m)"
              data-h2-radius="b(s)"
            >
              {lookingForEnglish && !lookingForFrench && !lookingForBilingual && (
                <p>
                  {intl.formatMessage({
                    defaultMessage: "Interested in:",
                    description: "Interested in label and colon",
                  })}{" "}
                  <span data-h2-font-weight="b(700)">
                    {intl.formatMessage({
                      defaultMessage: "English positions",
                      description: "English Positions message",
                    })}
                  </span>
                </p>
              )}
              {!lookingForEnglish && lookingForFrench && !lookingForBilingual && (
                <p>
                  {intl.formatMessage({
                    defaultMessage: "Interested in:",
                    description: "Interested in label and colon",
                  })}{" "}
                  <span data-h2-font-weight="b(700)">
                    {intl.formatMessage({
                      defaultMessage: "French positions",
                      description: "French Positions message",
                    })}
                  </span>
                </p>
              )}
              {lookingForEnglish && lookingForFrench && !lookingForBilingual && (
                <p>
                  {intl.formatMessage({
                    defaultMessage: "Interested in:",
                    description: "Interested in label and colon",
                  })}{" "}
                  <span data-h2-font-weight="b(700)">
                    {intl.formatMessage({
                      defaultMessage: "English or French positions",
                      description: "English or French Positions message",
                    })}
                  </span>
                </p>
              )}
              {!lookingForEnglish && !lookingForFrench && lookingForBilingual && (
                <p>
                  {intl.formatMessage({
                    defaultMessage: "Interested in:",
                    description: "Interested in label and colon",
                  })}{" "}
                  <span data-h2-font-weight="b(700)">
                    {intl.formatMessage({
                      defaultMessage:
                        "Bilingual positions (English and French) only",
                      description: "Bilingual Positions message",
                    })}
                  </span>
                </p>
              )}
              {lookingForEnglish &&
                !lookingForFrench &&
                lookingForBilingual && (
                  <p>
                    {intl.formatMessage({
                      defaultMessage: "Interested in:",
                      description: "Interested in label and colon",
                    })}{" "}
                    <span data-h2-font-weight="b(700)">
                      {intl.formatMessage({
                        defaultMessage:
                          "Bilingual positions (English and French) and English positions",
                        description: "Bilingual Positions message",
                      })}
                    </span>
                  </p>
                )}{" "}
              {!lookingForEnglish && lookingForFrench && lookingForBilingual && (
                <p>
                  {intl.formatMessage({
                    defaultMessage: "Interested in:",
                    description: "Interested in label and colon",
                  })}{" "}
                  <span data-h2-font-weight="b(700)">
                    {intl.formatMessage({
                      defaultMessage:
                        "Bilingual positions (English and French) and French positions",
                      description: "Bilingual Positions message",
                    })}
                  </span>
                </p>
              )}
              {lookingForEnglish && lookingForFrench && lookingForBilingual && (
                <p>
                  {intl.formatMessage({
                    defaultMessage: "Interested in:",
                    description: "Interested in label and colon",
                  })}{" "}
                  <span data-h2-font-weight="b(700)">
                    {intl.formatMessage({
                      defaultMessage:
                        "Bilingual positions (English and French), French positions and English Positions",
                      description:
                        "Bilingual,French and English  Positions message",
                    })}
                  </span>
                </p>
              )}
              {bilingualEvaluation === BilingualEvaluation.CompletedEnglish && (
                <p>
                  {intl.formatMessage({
                    defaultMessage: "Completed an official GoC evaluation:",
                    description:
                      "Completed a government of canada abbreviation evaluation label and colon",
                  })}{" "}
                  <span data-h2-font-weight="b(700)">
                    {intl.formatMessage({
                      defaultMessage: "Yes, completed ENGLISH evaluation",
                      description: "Completed an English language evaluation",
                    })}
                  </span>
                </p>
              )}
              {bilingualEvaluation === BilingualEvaluation.CompletedFrench && (
                <p>
                  {intl.formatMessage({
                    defaultMessage: "Completed an official GoC evaluation:",
                    description:
                      "Completed a government of canada abbreviation evaluation label and colon",
                  })}{" "}
                  <span data-h2-font-weight="b(700)">
                    {intl.formatMessage({
                      defaultMessage: "Yes, completed FRENCH evaluation",
                      description: "Completed a French language evaluation",
                    })}
                  </span>
                </p>
              )}
              {bilingualEvaluation === BilingualEvaluation.NotCompleted && (
                <p>
                  {intl.formatMessage({
                    defaultMessage: "Completed an official GoC evaluation:",
                    description:
                      "Completed a government of canada abbreviation evaluation label and colon",
                  })}{" "}
                  <span data-h2-font-weight="b(700)">
                    {intl.formatMessage({
                      defaultMessage: "No",
                      description:
                        "No, did not completed a language evaluation",
                    })}
                  </span>
                </p>
              )}
              {(bilingualEvaluation === BilingualEvaluation.CompletedEnglish ||
                bilingualEvaluation ===
                  BilingualEvaluation.CompletedFrench) && (
                <p>
                  {intl.formatMessage({
                    defaultMessage: "Second language level :",
                    description:
                      "Evaluation results for second language, results in that order followed by a colon",
                  })}{" "}
                  <span data-h2-font-weight="b(700)">
                    {comprehensionLevel}, {writtenLevel}, {verbalLevel}
                  </span>
                </p>
              )}
              {bilingualEvaluation === BilingualEvaluation.NotCompleted &&
                !!estimatedLanguageAbility && (
                  <p>
                    {intl.formatMessage({
                      defaultMessage: "Second language level:",
                      description:
                        "Estimated skill in second language, followed by a colon",
                    })}{" "}
                    <span data-h2-font-weight="b(700)">
                      {estimatedLanguageAbility
                        ? getLanguageProficiency(estimatedLanguageAbility)
                            .defaultMessage
                        : ""}
                    </span>
                  </p>
                )}
            </div>
          </div>
          <div id="government-information">
            <div style={{ display: "flex", alignItems: "baseline" }}>
              <img
                style={{ width: "calc(1rem*2.25)" }}
                src={imageUrl(ADMIN_APP_DIR, "gov-building-icon.svg")}
                alt={intl.formatMessage({
                  defaultMessage: "Icon of government building",
                  description:
                    "Alt text for the government building icon in the profile.",
                })}
              />
              &nbsp;&nbsp;
              <h2 data-h2-font-weight="b(600)" style={{ flex: "1 1 0%" }}>
                {intl.formatMessage({
                  defaultMessage: "Government Information",
                  description: "Title of the Government information section",
                })}
              </h2>
            </div>
            <div
              data-h2-bg-color="b(lightgray)"
              data-h2-padding="b(all, m)"
              data-h2-radius="b(s)"
            >
              {isGovEmployee && (
                <div>
                  <li>
                    {intl.formatMessage({
                      defaultMessage:
                        "Yes, I am a Government of Canada employee.",
                      description:
                        "Message to state user is employed by government",
                    })}
                  </li>
                  {govEmployeeType && (
                    <li>
                      {govEmployeeType === GovEmployeeType.Student &&
                        intl.formatMessage({
                          defaultMessage: "I have a student position.",
                          description:
                            "Message to state user is employed federally in a student position",
                        })}
                      {govEmployeeType === GovEmployeeType.Casual &&
                        intl.formatMessage({
                          defaultMessage: "I have a casual position.",
                          description:
                            "Message to state user is employed federally in a casual position",
                        })}
                      {govEmployeeType === GovEmployeeType.Term &&
                        intl.formatMessage({
                          defaultMessage: "I have a term position.",
                          description:
                            "Message to state user is employed federally in a term position",
                        })}
                      {govEmployeeType === GovEmployeeType.Indeterminate &&
                        intl.formatMessage({
                          defaultMessage: "I have an indeterminate position.",
                          description:
                            "Message to state user is employed federally in an indeterminate position",
                        })}
                    </li>
                  )}
                  {interestedInLaterOrSecondment && (
                    <li>
                      {intl.formatMessage({
                        defaultMessage:
                          "I am interested in lateral deployment or secondment.",
                        description:
                          "Message to state user is interested in lateral deployment or secondment",
                      })}
                    </li>
                  )}
                  {!!currentClassification?.group &&
                    !!currentClassification?.level && (
                      <li>
                        {" "}
                        {intl.formatMessage({
                          defaultMessage: "Current group and classification:",
                          description:
                            "Field label before government employment group and level, followed by colon",
                        })}{" "}
                        <span data-h2-font-weight="b(700)">
                          {currentClassification?.group} - 0
                          {currentClassification?.level}
                        </span>
                      </li>
                    )}
                </div>
              )}

              {isGovEmployee === false && (
                <li>
                  {intl.formatMessage({
                    defaultMessage:
                      "No, I am not a Government of Canada employee.",
                    description:
                      "Message indicating the user is not marked in the system as being federally employed currently",
                  })}
                </li>
              )}
            </div>
          </div>
          <div id="work-location">
            <div style={{ display: "flex", alignItems: "baseline" }}>
              <img
                style={{ width: "calc(1rem*2.25)" }}
                src={imageUrl(ADMIN_APP_DIR, "briefcase-with-marker-icon.svg")}
                alt={intl.formatMessage({
                  defaultMessage: "Icon of a location marker on a briefcase",
                  description:
                    "Alt text for the briefcase with marker icon in the profile.",
                })}
              />
              &nbsp;&nbsp;
              <h2 data-h2-font-weight="b(600)" style={{ flex: "1 1 0%" }}>
                {intl.formatMessage({
                  defaultMessage: "Work Location",
                  description: "Title of the Work location section",
                })}
              </h2>
            </div>
            <div
              data-h2-bg-color="b(lightgray)"
              data-h2-padding="b(all, m)"
              data-h2-radius="b(s)"
            >
              {!!locationPreferences && !!locationPreferences.length && (
                <p>
                  {intl.formatMessage({
                    defaultMessage: "Work location:",
                    description: "Work Location label, followed by colon",
                  })}{" "}
                  <span data-h2-font-weight="b(700)">{regionPreferences}</span>
                </p>
              )}
              {!!locationExemptions && (
                <p>
                  {intl.formatMessage({
                    defaultMessage: "Location exemptions:",
                    description: "Location Exemptions label, followed by colon",
                  })}{" "}
                  <span data-h2-font-weight="b(700)">{locationExemptions}</span>
                </p>
              )}
            </div>
          </div>
          <div id="work-preferences">
            <div style={{ display: "flex", alignItems: "baseline" }}>
              <h2 data-h2-font-weight="b(600)" style={{ flex: "1 1 0%" }}>
                <ThumbUpIcon style={{ width: "calc(1rem*2.25)" }} />
                &nbsp;&nbsp;
                {intl.formatMessage({
                  defaultMessage: "Work Preferences",
                  description: "Title of the Work preferences section",
                })}
              </h2>
            </div>
            <div
              data-h2-bg-color="b(lightgray)"
              data-h2-padding="b(all, m)"
              data-h2-radius="b(s)"
            >
              {acceptedOperationalArray !== null &&
                acceptedOperationalArray.length > 0 && (
                  <p>
                    {intl.formatMessage({
                      defaultMessage:
                        "Candidate would consider accepting a job that:",
                      description:
                        "Label for what conditions a user will accept, followed by a colon",
                    })}
                  </p>
                )}
              <ul data-h2-padding="b(left, l)">
                {wouldAcceptTemporary && (
                  <li data-h2-font-weight="b(700)">
                    {intl.formatMessage({
                      defaultMessage:
                        "Any duration (short, long term, or indeterminate duration)",
                      description:
                        "Duration of any length is good, specified three example lengths",
                    })}
                  </li>
                )}
                {wouldAcceptTemporary === false && (
                  <li data-h2-font-weight="b(700)">
                    {intl.formatMessage({
                      defaultMessage: "Permanent duration",
                      description: "Permanent duration only",
                    })}{" "}
                  </li>
                )}
                {acceptedOperationalArray}
              </ul>
            </div>
          </div>
          {(isWoman || isIndigenous || isVisibleMinority || hasDisability) && (
            <div id="employment-equity-information">
              <div style={{ display: "flex", alignItems: "baseline" }}>
                <h2 data-h2-font-weight="b(600)" style={{ flex: "1 1 0%" }}>
                  <InformationCircleIcon style={{ width: "calc(1rem*2.25)" }} />
                  &nbsp;&nbsp;
                  {intl.formatMessage({
                    defaultMessage: "Employment Equity Information",
                    description:
                      "Title of the Employment Equity Information section",
                  })}
                </h2>
              </div>
              <div
                data-h2-bg-color="b(lightgray)"
                data-h2-padding="b(all, m)"
                data-h2-radius="b(s)"
              >
                <ul data-h2-padding="b(left, l)">
                  {isIndigenous && (
                    <li>
                      {intl.formatMessage({
                        defaultMessage: "Indigenous",
                        description: "Indigenous",
                      })}
                    </li>
                  )}
                  {hasDisability && (
                    <li>
                      {intl.formatMessage({
                        defaultMessage: "Person with disability",
                        description: "Person with disability",
                      })}
                    </li>
                  )}
                  {isVisibleMinority && (
                    <li>
                      {intl.formatMessage({
                        defaultMessage: "Visible Minority",
                        description: "Visible Minority",
                      })}
                    </li>
                  )}
                  {isWoman && (
                    <li>
                      {intl.formatMessage({
                        defaultMessage: "Woman",
                        description: "Woman",
                      })}
                    </li>
                  )}
                </ul>
              </div>
            </div>
          )}
          <div id="role-and-salary-expectations">
            <div style={{ display: "flex", alignItems: "baseline" }}>
              <h2 data-h2-font-weight="b(600)" style={{ flex: "1 1 0%" }}>
                <CurrencyDollarIcon style={{ width: "calc(1rem*2.25)" }} />
                &nbsp;&nbsp;
                {intl.formatMessage({
                  defaultMessage: "Role and salary expectations",
                  description:
                    "Title of the Role and salary expectations section",
                })}
              </h2>
            </div>
            <div
              data-h2-bg-color="b(lightgray)"
              data-h2-padding="b(all, m)"
              data-h2-radius="b(s)"
            >
              {expectedSalaryArray !== null && expectedSalaryArray.length > 0 && (
                <p>
                  {intl.formatMessage({
                    defaultMessage:
                      "I would like to be referred for jobs at the following levels:",
                    description:
                      "Label for Role and salary expectations sections",
                  })}
                </p>
              )}
              <ul data-h2-padding="b(left, l)">{expectedSalaryArray}</ul>
            </div>
          </div>
          {experiences && experiences?.length !== 0 && (
            <div id="skills-and-experience" data-h2-padding="b(bottom, xxl)">
              <div style={{ display: "flex", alignItems: "baseline" }}>
                <h2 data-h2-font-weight="b(600)" style={{ flex: "1 1 0%" }}>
                  <LightningBoltIcon style={{ width: "calc(1rem*2.25)" }} />
                  &nbsp;&nbsp;
                  {intl.formatMessage({
                    defaultMessage: "Skills and Experience",
                    description: "Title of the Skills and Experience section",
                  })}
                </h2>
              </div>
              {experiences && experiences?.length !== 0 ? (
                <div
                  data-h2-bg-color="b(lightgray)"
                  data-h2-padding="b(all, m)"
                  data-h2-radius="b(s)"
                />
              ) : (
                <div data-h2-padding="b(all, m)" data-h2-radius="b(s)">
                  {/* <ExperienceSection
                    experiences={experiences?.filter(notEmpty)}
                  /> */}
                  Hi
                </div>
              )}
            </div>
          )}

          {}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;

export const UserProfileAPi: React.FunctionComponent<{
  userId: string;
}> = ({ userId }) => {
  const intl = useIntl();
  const [{ data: initialData, fetching, error }] = useGetUserProfileQuery({
    variables: { id: userId },
  });

  const userData = initialData;

  if (fetching) return <p>{intl.formatMessage(commonMessages.loadingTitle)}</p>;
  if (error)
    return (
      <p>
        {intl.formatMessage(commonMessages.loadingError)}
        {error.message}
      </p>
    );

  if (userData) return <UserProfile userProfileData={userData} />;
  return (
    <p>
      {intl.formatMessage({
        defaultMessage: "No candidate data",
        description: "No candidate data was found",
      })}
    </p>
  );
};
