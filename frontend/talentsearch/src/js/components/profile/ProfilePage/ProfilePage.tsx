import React from "react";
import {
  ChatAlt2Icon,
  LightBulbIcon,
  LightningBoltIcon,
  ThumbUpIcon,
  UserCircleIcon,
  UserGroupIcon,
  UserIcon,
} from "@heroicons/react/solid";
import { useIntl } from "react-intl";
import { Link } from "@common/components";
import commonMessages from "@common/messages/commonMessages";
import { imageUrl } from "@common/helpers/router";
import { getLocale } from "@common/helpers/localize";
import {
  getLanguage,
  getOperationalRequirement,
  getWorkRegion,
  getProvinceOrTerritory,
  getLanguageProficiency,
  womanLocalized,
  indigenousLocalized,
  minorityLocalized,
  disabilityLocalized,
} from "@common/constants/localizedConstants";

import { insertBetween, notEmpty } from "@common/helpers/util";
import TALENTSEARCH_APP_DIR from "../../../talentSearchConstants";
import { useApplicantProfileRoutes } from "../../../applicantProfileRoutes";
import {
  BilingualEvaluation,
  useGetMeQuery,
  User,
  GetMeQuery,
  GovEmployeeType,
} from "../../../api/generated";

import MyStatusApi from "../../myStatusForm/MyStatusForm";
import ExperienceSection from "../../applicantProfile/ExperienceSection";

export interface ProfilePageProps {
  profileDataInput: User;
}

export const ProfileForm: React.FC<ProfilePageProps> = ({
  profileDataInput,
}) => {
  const {
    firstName,
    lastName,
    email,
    telephone,
    preferredLang,
    currentProvince,
    currentCity,
    lookingForEnglish,
    lookingForFrench,
    lookingForBilingual,
    bilingualEvaluation,
    comprehensionLevel,
    writtenLevel,
    verbalLevel,
    estimatedLanguageAbility,
    isGovEmployee,
    govEmployeeType,
    interestedInLaterOrSecondment,
    currentClassification,
    isWoman,
    hasDisability,
    isIndigenous,
    isVisibleMinority,
    locationPreferences,
    locationExemptions,
    acceptedOperationalRequirements,
    wouldAcceptTemporary,
    poolCandidates,
    experiences,
  } = profileDataInput;

  const intl = useIntl();
  const paths = useApplicantProfileRoutes();
  const locale = getLocale(intl);

  // styling a text bit with red colour within intls
  function redText(msg: string) {
    return <span data-h2-font-color="b(red)">{msg}</span>;
  }

  // add link to Equity groups <a> tags around a message
  function equityLinkText(msg: string) {
    return <a href="/equity-groups">{msg}</a>;
  }

  // generate array of pool candidates entries
  const candidateArray = poolCandidates
    ? poolCandidates.map((poolCandidate) => (
        <div
          key={poolCandidate?.id}
          data-h2-display="b(flex)"
          data-h2-flex-direction="b(row)"
          data-h2-justify-content="b(space-between)"
          data-h2-padding="b(top-bottom, m)"
        >
          <div>
            <p>{poolCandidate?.pool?.name?.[locale]}</p>
          </div>
          <div>
            <p>
              {intl.formatMessage({
                defaultMessage: "ID:",
                description: "The ID and colon",
              })}{" "}
              {poolCandidate?.id}
            </p>
          </div>
          <div>
            <p>
              {intl.formatMessage({
                defaultMessage: "Expiry Date:",
                description: "The expiry date label and colon",
              })}{" "}
              {poolCandidate?.expiryDate}
            </p>
          </div>
        </div>
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

  // generate array of location preferences localized and formatted with spaces/commas
  const regionPreferencesSquished = locationPreferences?.map((region) =>
    region ? getWorkRegion(region).defaultMessage : "",
  );
  const regionPreferences = regionPreferencesSquished
    ? insertBetween(", ", regionPreferencesSquished)
    : "";

  return (
    <>
      <div
        data-h2-padding="b(top, xxs) b(bottom, m) b(right-left, s)"
        data-h2-font-color="b(white)"
        data-h2-text-align="b(center)"
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
        <h1>{`${firstName} ${lastName}`}</h1>
      </div>
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
            <a href="#status-section">
              {intl.formatMessage({
                defaultMessage: "My Status",
                description: "Title of the My Status section",
              })}
            </a>
          </p>
          <p>
            <a href="#pools-section">
              {intl.formatMessage({
                defaultMessage: "My Hiring Pools",
                description: "Title of the My Hiring Pools section",
              })}
            </a>
          </p>
          <p>
            <a href="#about-me-section">
              {intl.formatMessage({
                defaultMessage: "About Me",
                description: "Title of the About Me section",
              })}
            </a>
          </p>
          <p>
            <a href="#language-section">
              {intl.formatMessage({
                defaultMessage: "Language Information",
                description: "Title of the Language Information section",
              })}
            </a>
          </p>
          <p>
            <a href="#gov-info-section">
              {intl.formatMessage({
                defaultMessage: "Government Information",
                description: "Title of the Government Information section",
              })}
            </a>
          </p>
          <p>
            <a href="#work-location-section">
              {intl.formatMessage({
                defaultMessage: "Work Location",
                description: "Title of the Work Location section",
              })}
            </a>
          </p>
          <p>
            <a href="#work-preferences-section">
              {intl.formatMessage({
                defaultMessage: "Work Preferences",
                description: "Title of the Work Preferences section",
              })}
            </a>
          </p>
          <p>
            <a href="#diversity-section">
              {intl.formatMessage({
                defaultMessage: "Diversity, Equity and Inclusion",
                description:
                  "Title of the Diversity, Equity and Inclusion section",
              })}
            </a>
          </p>
          <p>
            <a href="#skills-section">
              {intl.formatMessage({
                defaultMessage: "My Skills and Experience",
                description: "Title of the My Skills and Experience section",
              })}
            </a>
          </p>
        </div>
        <div data-h2-flex-item="b(1of1) s(3of4)">
          <div data-h2-padding="b(left, l)">
            <div id="status-section">
              <h2 data-h2-font-weight="b(600)">
                <LightBulbIcon style={{ width: "calc(1rem*2.25)" }} />
                &nbsp;&nbsp;
                {intl.formatMessage({
                  defaultMessage: "My status",
                  description: "Title of the My status section",
                })}
              </h2>
              <MyStatusApi />
            </div>
            <div id="pools-section">
              <h2 data-h2-font-weight="b(600)">
                <UserGroupIcon style={{ width: "calc(1rem*2.25)" }} />
                &nbsp;&nbsp;
                {intl.formatMessage({
                  defaultMessage: "My hiring pools",
                  description: "Title of the My hiring pools section",
                })}
              </h2>
              <div
                data-h2-bg-color="b(lightgray)"
                data-h2-padding="b(all, m)"
                data-h2-radius="b(s)"
              >
                {(!candidateArray || !candidateArray.length) && (
                  <p>
                    {intl.formatMessage({
                      defaultMessage:
                        "You have not been accepted into any hiring pools yet.",
                      description:
                        "Message for if user not part of any hiring pools",
                    })}
                  </p>
                )}
                {!!candidateArray && candidateArray}
              </div>
            </div>
            <div id="about-me-section">
              <div style={{ display: "flex", alignItems: "baseline" }}>
                <h2 data-h2-font-weight="b(600)" style={{ flex: "1 1 0%" }}>
                  <UserIcon style={{ width: "calc(1rem*2.25)" }} />
                  &nbsp;&nbsp;
                  {intl.formatMessage({
                    defaultMessage: "About me",
                    description: "Title of the About me section",
                  })}
                </h2>
                <Link
                  href={paths.aboutMe()}
                  title=""
                  {...{
                    "data-h2-font-color": "b(lightpurple)",
                  }}
                >
                  {intl.formatMessage({
                    defaultMessage: "Edit About Me",
                    description:
                      "Text on link to update a users personal information",
                  })}
                </Link>
              </div>
              <div
                data-h2-bg-color="b(lightgray)"
                data-h2-padding="b(all, m)"
                data-h2-radius="b(s)"
              >
                <div
                  data-h2-display="b(flex)"
                  data-h2-flex-direction="s(row) b(column)"
                  data-h2-justify-content="b(space-between)"
                >
                  <div>
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
                    {!!email && (
                      <p>
                        {intl.formatMessage({
                          defaultMessage: "Email:",
                          description: "Email label and colon",
                        })}{" "}
                        <span data-h2-font-weight="b(700)">{email}</span>
                      </p>
                    )}
                    {!!telephone && (
                      <p>
                        {intl.formatMessage({
                          defaultMessage: "Phone:",
                          description: "Phone label and colon",
                        })}{" "}
                        <span data-h2-font-weight="b(700)">{telephone}</span>
                      </p>
                    )}
                  </div>
                  <div>
                    {!!preferredLang && (
                      <p>
                        {intl.formatMessage({
                          defaultMessage: "Preferred Communication Language:",
                          description:
                            "Preferred Language for communication purposes label and colon",
                        })}{" "}
                        <span data-h2-font-weight="b(700)">
                          {preferredLang
                            ? getLanguage(preferredLang).defaultMessage
                            : ""}
                        </span>
                      </p>
                    )}
                    {!!currentCity && !!currentProvince && (
                      <p>
                        {intl.formatMessage({
                          defaultMessage: "Current Location:",
                          description: "Current Location label and colon",
                        })}{" "}
                        <span data-h2-font-weight="b(700)">
                          {currentCity},{" "}
                          {currentProvince
                            ? getProvinceOrTerritory(currentProvince)
                                .defaultMessage
                            : ""}
                        </span>
                      </p>
                    )}
                  </div>
                </div>
                {!firstName &&
                  !lastName &&
                  !email &&
                  !telephone &&
                  !preferredLang &&
                  !currentCity &&
                  !currentProvince && (
                    <p>
                      {intl.formatMessage({
                        defaultMessage:
                          "You haven't added any information here yet.",
                        description:
                          "Message for when no data exists for the section",
                      })}
                    </p>
                  )}
                {(!firstName ||
                  !lastName ||
                  !email ||
                  !telephone ||
                  !preferredLang ||
                  !currentCity ||
                  !currentProvince) && (
                  <p>
                    {intl.formatMessage(
                      {
                        defaultMessage:
                          "There are <redText>required</redText> fields missing.",
                        description:
                          "Message that there are required fields missing. Please ignore things in <> tags.",
                      },
                      {
                        redText,
                      },
                    )}{" "}
                    <a href={paths.aboutMe()}>
                      {intl.formatMessage({
                        defaultMessage: "Click here to get started.",
                        description:
                          "Message to click on the words to begin something",
                      })}
                    </a>
                  </p>
                )}
              </div>
            </div>
            <div id="language-section">
              <div style={{ display: "flex", alignItems: "baseline" }}>
                <h2 data-h2-font-weight="b(600)" style={{ flex: "1 1 0%" }}>
                  <ChatAlt2Icon style={{ width: "calc(1rem*2.25)" }} />
                  &nbsp;&nbsp;
                  {intl.formatMessage({
                    defaultMessage: "Language information",
                    description: "Title of the Language information section",
                  })}
                </h2>
                <Link
                  href={paths.languageInformation()}
                  title=""
                  {...{
                    "data-h2-font-color": "b(lightpurple)",
                  }}
                >
                  {intl.formatMessage({
                    defaultMessage: "Edit Language Information",
                    description:
                      "Text on link to update a users language information",
                  })}
                </Link>
              </div>
              <div
                data-h2-bg-color="b(lightgray)"
                data-h2-padding="b(all, m)"
                data-h2-radius="b(s)"
              >
                {lookingForEnglish &&
                  !lookingForFrench &&
                  !lookingForBilingual && (
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
                {!lookingForEnglish &&
                  lookingForFrench &&
                  !lookingForBilingual && (
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
                {lookingForBilingual && (
                  <p>
                    {intl.formatMessage({
                      defaultMessage: "Interested in:",
                      description: "Interested in label and colon",
                    })}{" "}
                    <span data-h2-font-weight="b(700)">
                      {intl.formatMessage({
                        defaultMessage:
                          "Bilingual positions (English and French)",
                        description: "Bilingual Positions message",
                      })}
                    </span>
                  </p>
                )}
                {bilingualEvaluation ===
                  BilingualEvaluation.CompletedEnglish && (
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
                {bilingualEvaluation ===
                  BilingualEvaluation.CompletedFrench && (
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
                {(bilingualEvaluation ===
                  BilingualEvaluation.CompletedEnglish ||
                  bilingualEvaluation ===
                    BilingualEvaluation.CompletedFrench) && (
                  <p>
                    {intl.formatMessage({
                      defaultMessage:
                        "Second language level (Comprehension, Written, Verbal):",
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
                {!lookingForEnglish &&
                  !lookingForFrench &&
                  !lookingForBilingual &&
                  !bilingualEvaluation && (
                    <p>
                      {intl.formatMessage({
                        defaultMessage:
                          "You haven't added any information here yet.",
                        description:
                          "Message for when no data exists for the section",
                      })}
                    </p>
                  )}
                {((!lookingForEnglish &&
                  !lookingForFrench &&
                  !lookingForBilingual) ||
                  (lookingForBilingual &&
                    (!bilingualEvaluation ||
                      ((bilingualEvaluation ===
                        BilingualEvaluation.CompletedEnglish ||
                        bilingualEvaluation ===
                          BilingualEvaluation.CompletedFrench) &&
                        (!comprehensionLevel ||
                          !writtenLevel ||
                          !verbalLevel))))) && (
                  <p>
                    {intl.formatMessage(
                      {
                        defaultMessage:
                          "There are <redText>required</redText> fields missing.",
                        description:
                          "Message that there are required fields missing. Please ignore things in <> tags.",
                      },
                      {
                        redText,
                      },
                    )}{" "}
                    <a href={paths.languageInformation()}>
                      {intl.formatMessage({
                        defaultMessage: "Click here to get started.",
                        description:
                          "Message to click on the words to begin something",
                      })}
                    </a>
                  </p>
                )}
              </div>
            </div>
            <div id="gov-info-section">
              <div style={{ display: "flex", alignItems: "baseline" }}>
                <h2 data-h2-font-weight="b(600)" style={{ flex: "1 1 0%" }}>
                  <img
                    style={{ width: "calc(1rem*2.25)" }}
                    src={imageUrl(
                      TALENTSEARCH_APP_DIR,
                      "gov-building-icon.svg",
                    )}
                    alt={intl.formatMessage({
                      defaultMessage: "Icon of government building",
                      description:
                        "Alt text for the government building icon in the profile.",
                    })}
                  />
                  &nbsp;&nbsp;
                  {intl.formatMessage({
                    defaultMessage: "Government information",
                    description: "Title of the Government information section",
                  })}
                </h2>
                <Link
                  href={paths.governmentInformation()}
                  title=""
                  {...{
                    "data-h2-font-color": "b(lightpurple)",
                  }}
                >
                  {intl.formatMessage({
                    defaultMessage: "Edit Government Information",
                    description:
                      "Text on link to update a users government information",
                  })}
                </Link>
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
                            defaultMessage: "I have a student position",
                            description:
                              "Message to state user is employed federally in a student position",
                          })}
                        {govEmployeeType === GovEmployeeType.Casual &&
                          intl.formatMessage({
                            defaultMessage: "I have a casual position",
                            description:
                              "Message to state user is employed federally in a casual position",
                          })}
                        {govEmployeeType === GovEmployeeType.Term &&
                          intl.formatMessage({
                            defaultMessage: "I have a term position",
                            description:
                              "Message to state user is employed federally in a term position",
                          })}
                        {govEmployeeType === GovEmployeeType.Indeterminate &&
                          intl.formatMessage({
                            defaultMessage: "I have an indeterminate position",
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
                            {currentClassification?.group}-
                            {currentClassification?.level}
                          </span>
                        </li>
                      )}
                  </div>
                )}
                {isGovEmployee === null && (
                  <p>
                    {intl.formatMessage({
                      defaultMessage:
                        "You haven't added any information here yet.",
                      description:
                        "Message for when no data exists for the section",
                    })}
                  </p>
                )}
                {isGovEmployee === false && (
                  <li>
                    {intl.formatMessage({
                      defaultMessage:
                        "You are not entered as a current government employee",
                      description:
                        "Message indicating the user is not marked in the system as being federally employed currently",
                    })}
                  </li>
                )}
              </div>
            </div>
            <div id="work-location-section">
              <div style={{ display: "flex", alignItems: "baseline" }}>
                <h2 data-h2-font-weight="b(600)" style={{ flex: "1 1 0%" }}>
                  <img
                    style={{ width: "calc(1rem*2.25)" }}
                    src={imageUrl(
                      TALENTSEARCH_APP_DIR,
                      "briefcase-with-marker-icon.svg",
                    )}
                    alt={intl.formatMessage({
                      defaultMessage:
                        "Icon of a location marker on a briefcase",
                      description:
                        "Alt text for the briefcase with marker icon in the profile.",
                    })}
                  />
                  &nbsp;&nbsp;
                  {intl.formatMessage({
                    defaultMessage: "Work location",
                    description: "Title of the Work location section",
                  })}
                </h2>
                <Link
                  href={paths.workLocation()}
                  title=""
                  {...{
                    "data-h2-font-color": "b(lightpurple)",
                  }}
                >
                  {intl.formatMessage({
                    defaultMessage: "Edit Work Location",
                    description:
                      "Text on link to update a users work location info",
                  })}
                </Link>
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
                    <span data-h2-font-weight="b(700)">
                      {regionPreferences}
                    </span>
                  </p>
                )}
                {!!locationExemptions && (
                  <p>
                    {intl.formatMessage({
                      defaultMessage: "Location exemptions:",
                      description:
                        "Location Exemptions label, followed by colon",
                    })}{" "}
                    <span data-h2-font-weight="b(700)">
                      {locationExemptions}
                    </span>
                  </p>
                )}
                {!locationPreferences && !locationExemptions && (
                  <p>
                    {intl.formatMessage({
                      defaultMessage:
                        "You haven't added any information here yet.",
                      description:
                        "Message for when no data exists for the section",
                    })}
                  </p>
                )}
                {(!locationPreferences || !locationPreferences.length) && (
                  <p>
                    {intl.formatMessage(
                      {
                        defaultMessage:
                          "There are <redText>required</redText> fields missing.",
                        description:
                          "Message that there are required fields missing. Please ignore things in <> tags.",
                      },
                      {
                        redText,
                      },
                    )}{" "}
                    <a href={paths.workLocation()}>
                      {intl.formatMessage({
                        defaultMessage: "Click here to get started.",
                        description:
                          "Message to click on the words to begin something",
                      })}
                    </a>
                  </p>
                )}
              </div>
            </div>
            <div id="work-preferences-section">
              <div style={{ display: "flex", alignItems: "baseline" }}>
                <h2 data-h2-font-weight="b(600)" style={{ flex: "1 1 0%" }}>
                  <ThumbUpIcon style={{ width: "calc(1rem*2.25)" }} />
                  &nbsp;&nbsp;
                  {intl.formatMessage({
                    defaultMessage: "Work preferences",
                    description: "Title of the Work preferences section",
                  })}
                </h2>
                <Link
                  href={paths.workPreferences()}
                  title=""
                  {...{
                    "data-h2-font-color": "b(lightpurple)",
                  }}
                >
                  {intl.formatMessage({
                    defaultMessage: "Edit Work Preferences",
                    description:
                      "Text on link to update a users work preferences",
                  })}
                </Link>
              </div>
              <div
                data-h2-bg-color="b(lightgray)"
                data-h2-padding="b(all, m)"
                data-h2-radius="b(s)"
              >
                {wouldAcceptTemporary !== null && (
                  <p>
                    {intl.formatMessage({
                      defaultMessage:
                        "I would consider accepting a job that lasts for:",
                      description:
                        "Label for what length of position user prefers, followed by colon",
                    })}{" "}
                  </p>
                )}
                {wouldAcceptTemporary && (
                  <ul data-h2-padding="b(left, l)">
                    <li data-h2-font-weight="b(700)">
                      {intl.formatMessage({
                        defaultMessage:
                          "Any duration (short, long term, or indeterminate duration)",
                        description:
                          "Duration of any length is good, specified three example lengths",
                      })}
                    </li>
                  </ul>
                )}
                {wouldAcceptTemporary === false && (
                  <ul data-h2-padding="b(left, l)">
                    <li data-h2-font-weight="b(700)">
                      {intl.formatMessage({
                        defaultMessage: "Permanent duration",
                        description: "Permanent duration only",
                      })}{" "}
                    </li>
                  </ul>
                )}

                {acceptedOperationalArray !== null &&
                  acceptedOperationalArray.length > 0 && (
                    <p>
                      {intl.formatMessage({
                        defaultMessage:
                          "I would consider accepting a job that:",
                        description:
                          "Label for what conditions a user will accept, followed by a colon",
                      })}
                    </p>
                  )}
                <ul data-h2-padding="b(left, l)">{acceptedOperationalArray}</ul>
                {wouldAcceptTemporary === null && (
                  <p>
                    {intl.formatMessage({
                      defaultMessage:
                        "You haven't added any information here yet.",
                      description:
                        "Message for when no data exists for the section",
                    })}
                  </p>
                )}
                {wouldAcceptTemporary === null && (
                  <p>
                    {intl.formatMessage(
                      {
                        defaultMessage:
                          "There are <redText>required</redText> fields missing.",
                        description:
                          "Message that there are required fields missing. Please ignore things in <> tags.",
                      },
                      {
                        redText,
                      },
                    )}{" "}
                    <a href={paths.workPreferences()}>
                      {intl.formatMessage({
                        defaultMessage: "Click here to get started.",
                        description:
                          "Message to click on the words to begin something",
                      })}
                    </a>
                  </p>
                )}
              </div>
            </div>
            <div id="diversity-section">
              <div style={{ display: "flex", alignItems: "baseline" }}>
                <h2 data-h2-font-weight="b(600)" style={{ flex: "1 1 0%" }}>
                  <UserCircleIcon style={{ width: "calc(1rem*2.25)" }} />
                  &nbsp;&nbsp;
                  {intl.formatMessage({
                    defaultMessage: "Diversity, equity and inclusion",
                    description:
                      "Title of the Diversity, equity and inclusion section",
                  })}
                </h2>
                <Link
                  href={paths.diversityEquityInclusion()}
                  title=""
                  {...{
                    "data-h2-font-color": "b(lightpurple)",
                  }}
                >
                  {intl.formatMessage({
                    defaultMessage: "Edit Diversity Equity and Inclusion",
                    description:
                      "Text on link to update a users diversity equity and inclusion information",
                  })}
                </Link>
              </div>
              <div
                data-h2-bg-color="b(lightgray)"
                data-h2-padding="b(all, m)"
                data-h2-radius="b(s)"
              >
                {!isWoman &&
                  !isIndigenous &&
                  !isVisibleMinority &&
                  !hasDisability && (
                    <p>
                      {intl.formatMessage(
                        {
                          defaultMessage:
                            "You have not identified as a member of any <equityLinkText>employment equity groups.</equityLinkText>",
                          description:
                            "Message indicating the user has not been marked as part of an equity group, Ignore things in <> please.",
                        },
                        { equityLinkText },
                      )}
                    </p>
                  )}
                {(isWoman ||
                  isIndigenous ||
                  isVisibleMinority ||
                  hasDisability) && (
                  <div>
                    <p>
                      {intl.formatMessage({
                        defaultMessage: "I identify as:",
                        description:
                          "Label preceding what groups the user identifies as part of, followed by a colon",
                      })}{" "}
                    </p>{" "}
                    <ul data-h2-padding="b(left, l)">
                      {isWoman && (
                        <li data-h2-font-weight="b(700)">
                          {womanLocalized.defaultMessage}
                        </li>
                      )}{" "}
                      {isIndigenous && (
                        <li data-h2-font-weight="b(700)">
                          {indigenousLocalized.defaultMessage}
                        </li>
                      )}{" "}
                      {isVisibleMinority && (
                        <li data-h2-font-weight="b(700)">
                          {minorityLocalized.defaultMessage}
                        </li>
                      )}{" "}
                      {hasDisability && (
                        <li data-h2-font-weight="b(700)">
                          {disabilityLocalized.defaultMessage}
                        </li>
                      )}
                    </ul>
                  </div>
                )}
              </div>
            </div>
            <div id="skills-section" data-h2-padding="b(bottom, xxl)">
              <div style={{ display: "flex", alignItems: "baseline" }}>
                <h2 data-h2-font-weight="b(600)" style={{ flex: "1 1 0%" }}>
                  <LightningBoltIcon style={{ width: "calc(1rem*2.25)" }} />
                  &nbsp;&nbsp;
                  {intl.formatMessage({
                    defaultMessage: "My skills and experience",
                    description:
                      "Title of the My skills and experience section",
                  })}
                </h2>
                <Link
                  href={paths.skillsAndExperiences()}
                  title=""
                  {...{
                    "data-h2-font-color": "b(lightpurple)",
                  }}
                >
                  {intl.formatMessage({
                    defaultMessage: "Edit Skills and Experience",
                    description:
                      "Text on link to update a users skills and experience",
                  })}
                </Link>
              </div>
              {!experiences || experiences?.length === 0 ? (
                <div
                  data-h2-bg-color="b(lightgray)"
                  data-h2-padding="b(all, m)"
                  data-h2-radius="b(s)"
                >
                  <p>
                    {intl.formatMessage({
                      defaultMessage:
                        "You haven't added any information here yet.",
                      description:
                        "Message that the user hasn't filled out the section yet",
                    })}
                  </p>
                  <p>
                    {intl.formatMessage(
                      {
                        defaultMessage:
                          "There are <redText>required</redText> fields missing.",
                        description:
                          "Message that there are required fields missing. Please ignore things in <> tags.",
                      },
                      {
                        redText,
                      },
                    )}{" "}
                    <a href={paths.skillsAndExperiences()}>
                      {intl.formatMessage({
                        defaultMessage: "Click here to get started.",
                        description:
                          "Message to click on the words to begin something",
                      })}
                    </a>
                  </p>
                </div>
              ) : (
                <div data-h2-padding="b(all, m)" data-h2-radius="b(s)">
                  <ExperienceSection
                    experiences={experiences?.filter(notEmpty)}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export const ProfilePage: React.FunctionComponent = () => {
  const intl = useIntl();
  const [result] = useGetMeQuery();
  const { data, fetching, error } = result;

  // type magic on data variable to make it end up as a valid User type
  const dataToUser = (input: GetMeQuery): User | undefined => {
    if (input) {
      if (input.me) {
        return input.me;
      }
    }
    return undefined;
  };
  const userData = data ? dataToUser(data) : undefined;

  if (fetching) return <p>{intl.formatMessage(commonMessages.loadingTitle)}</p>;
  if (error)
    return (
      <p>
        {intl.formatMessage(commonMessages.loadingError)}
        {error.message}
      </p>
    );

  if (userData) return <ProfileForm profileDataInput={userData} />;
  return (
    <p>
      {intl.formatMessage({
        defaultMessage: "No user data",
        description: "No user data was found",
      })}
    </p>
  );
};
