/* eslint-disable no-nested-ternary */
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
import TALENTSEARCH_APP_DIR from "../../../talentSearchConstants";
import { useApplicantProfileRoutes } from "../../../applicantProfileRoutes";
import {
  BilingualEvaluation,
  EstimatedLanguageAbility,
  EvaluatedLanguageAbility,
  JobLookingStatus,
  Language,
  LanguageAbility,
  PoolCandidateStatus,
  ProvinceOrTerritory,
  Role,
  SalaryRange,
  useGetMeQuery,
  WorkRegion,
} from "../../../api/generated";

export interface ProfilePageProps {
  id?: string | undefined;
  sub?: string | null | undefined;
  roles?: Array<Role | null | undefined> | null | undefined;
  firstName?: string | null | undefined;
  lastName?: string | null | undefined;
  email?: string | undefined;
  telephone?: string | null | undefined;
  preferredLang?: Language | null | undefined;
  currentProvince?: ProvinceOrTerritory | null | undefined;
  currentCity?: string | null | undefined;
  languageAbility?: LanguageAbility | null | undefined;
  lookingForEnglish?: boolean | null | undefined;
  lookingForFrench?: boolean | null | undefined;
  lookingForBilingual?: boolean | null | undefined;
  bilingualEvaluation?: BilingualEvaluation | null | undefined;
  comprehensionLevel?: EvaluatedLanguageAbility | null | undefined;
  writtenLevel?: EvaluatedLanguageAbility | null | undefined;
  verbalLevel?: EvaluatedLanguageAbility | null | undefined;
  estimatedLanguageAbility?: EstimatedLanguageAbility | null | undefined;
  isGovEmployee?: boolean | null | undefined;
  interestedInLaterOrSecondment?: boolean | null | undefined;
  isWoman?: boolean | null | undefined;
  hasDisability?: boolean | null | undefined;
  isIndigenous?: boolean | null | undefined;
  isVisibleMinority?: boolean | null | undefined;
  jobLookingStatus?: JobLookingStatus | null | undefined;
  hasDiploma?: boolean | null | undefined;
  locationPreferences?: Array<WorkRegion | null | undefined> | null | undefined;
  locationExemptions?: string | null | undefined;
  expectedSalary?: Array<SalaryRange | null | undefined> | null | undefined;
  wouldAcceptTemporary?: boolean | null | undefined;
  currentClassification?:
    | {
        __typename?: "Classification";
        id: string;
        group: string;
        level: number;
        name?:
          | {
              __typename?: "LocalizedString";
              en?: string | null | undefined;
              fr?: string | null | undefined;
            }
          | null
          | undefined;
      }
    | null
    | undefined;
  acceptedOperationalRequirements?:
    | Array<
        | {
            __typename?: "OperationalRequirement";
            id: string;
            name: {
              __typename?: "LocalizedString";
              en?: string | null | undefined;
              fr?: string | null | undefined;
            };
          }
        | null
        | undefined
      >
    | null
    | undefined;
  expectedClassifications?:
    | Array<
        | {
            __typename?: "Classification";
            id: string;
            group: string;
            level: number;
            name?:
              | {
                  __typename?: "LocalizedString";
                  en?: string | null | undefined;
                  fr?: string | null | undefined;
                }
              | null
              | undefined;
          }
        | null
        | undefined
      >
    | null
    | undefined;
  cmoAssets?:
    | Array<
        | {
            __typename?: "CmoAsset";
            id: string;
            name: {
              __typename?: "LocalizedString";
              en?: string | null | undefined;
              fr?: string | null | undefined;
            };
          }
        | null
        | undefined
      >
    | null
    | undefined;
  poolCandidates?:
    | Array<
        | {
            __typename?: "PoolCandidate";
            status?: PoolCandidateStatus | null | undefined;
            expiryDate?: string | null | undefined;
            pool?:
              | {
                  __typename?: "Pool";
                  name?:
                    | {
                        __typename?: "LocalizedString";
                        en?: string | null | undefined;
                        fr?: string | null | undefined;
                      }
                    | null
                    | undefined;
                }
              | null
              | undefined;
            id?: string | null | undefined;
          }
        | null
        | undefined
      >
    | null
    | undefined;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
  id,
  sub,
  roles,
  firstName,
  lastName,
  email,
  telephone,
  preferredLang,
  currentProvince,
  currentCity,
  languageAbility,
  lookingForEnglish,
  lookingForFrench,
  lookingForBilingual,
  bilingualEvaluation,
  comprehensionLevel,
  writtenLevel,
  verbalLevel,
  estimatedLanguageAbility,
  isGovEmployee,
  interestedInLaterOrSecondment,
  currentClassification,
  isWoman,
  hasDisability,
  isIndigenous,
  isVisibleMinority,
  jobLookingStatus,
  hasDiploma,
  locationPreferences,
  locationExemptions,
  acceptedOperationalRequirements,
  expectedSalary,
  expectedClassifications,
  wouldAcceptTemporary,
  cmoAssets,
  poolCandidates,
}) => {
  const intl = useIntl();
  const paths = useApplicantProfileRoutes();
  const locale = getLocale(intl);

  // generate array of pool candidates
  const candidateArray = poolCandidates
    ? poolCandidates.map((iterator) => (
        <div
          key={Math.random()}
          data-h2-display="b(flex)"
          data-h2-flex-direction="b(row)"
          data-h2-justify-content="b(space-between)"
          data-h2-padding="b(top-bottom, m)"
        >
          <div>
            <p>
              {iterator
                ? iterator.pool?.name
                  ? iterator.pool.name[locale]
                  : ""
                : ""}{" "}
            </p>
          </div>
          <div>
            <p>ID: {iterator?.id}</p>
          </div>
          <div>
            <p>Expiry: {iterator?.expiryDate}</p>
          </div>
        </div>
      ))
    : null;

  // generate array of accepted operational requirements
  const acceptedOperationalArray = acceptedOperationalRequirements
    ? acceptedOperationalRequirements.map((iterator) => (
        <li data-h2-font-weight="b(700)" key={Math.random()}>
          {iterator ? iterator.name[locale] : ""}
        </li>
      ))
    : null;

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
              <p>Status details</p>
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
                data-h2-bg-color="b(gray)"
                data-h2-padding="b(all, m)"
                data-h2-radius="b(s)"
              >
                {(candidateArray === null || candidateArray.length === 0) && (
                  <p>You have not been accepted into any hiring pools yet.</p>
                )}
                {candidateArray !== null && candidateArray}
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
                data-h2-display="b(flex)"
                data-h2-flex-direction="b(row)"
                data-h2-justify-content="b(space-between)"
                data-h2-bg-color="b(gray)"
                data-h2-padding="b(all, m)"
                data-h2-radius="b(s)"
              >
                <div>
                  <p>
                    Name:{" "}
                    <span data-h2-font-weight="b(700)">
                      {firstName} {lastName}
                    </span>
                  </p>
                  <p>
                    Email: <span data-h2-font-weight="b(700)">{email}</span>
                  </p>
                  <p>
                    Phone: <span data-h2-font-weight="b(700)">{telephone}</span>
                  </p>
                </div>
                <div>
                  <p>
                    Preferred Communication Language:{" "}
                    <span data-h2-font-weight="b(700)">{preferredLang}</span>
                  </p>
                  <p>
                    Current Location:{" "}
                    <span data-h2-font-weight="b(700)">
                      {currentCity}, {currentProvince}
                    </span>
                  </p>
                </div>
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
                data-h2-bg-color="b(gray)"
                data-h2-padding="b(all, m)"
                data-h2-radius="b(s)"
              >
                {lookingForEnglish &&
                  !lookingForFrench &&
                  !lookingForBilingual && (
                    <p>
                      Interested in:{" "}
                      <span data-h2-font-weight="b(700)">
                        English positions
                      </span>
                    </p>
                  )}
                {!lookingForEnglish &&
                  lookingForFrench &&
                  !lookingForBilingual && (
                    <p>
                      Interested in:{" "}
                      <span data-h2-font-weight="b(700)">French positions</span>
                    </p>
                  )}
                {lookingForBilingual && (
                  <p>
                    Interested in:{" "}
                    <span data-h2-font-weight="b(700)">
                      Bilingual positions (English and French)
                    </span>
                  </p>
                )}
                {bilingualEvaluation ===
                  BilingualEvaluation.CompletedEnglish && (
                  <p>
                    Completed an official GoC evaluation:{" "}
                    <span data-h2-font-weight="b(700)">
                      Yes, completed ENGLISH evaluation
                    </span>
                  </p>
                )}
                {bilingualEvaluation ===
                  BilingualEvaluation.CompletedFrench && (
                  <p>
                    Completed an official GoC evaluation:{" "}
                    <span data-h2-font-weight="b(700)">
                      Yes, completed FRENCH evaluation
                    </span>
                  </p>
                )}
                {bilingualEvaluation === BilingualEvaluation.NotCompleted && (
                  <p>
                    Completed an official GoC evaluation:{" "}
                    <span data-h2-font-weight="b(700)">No</span>
                  </p>
                )}
                {(bilingualEvaluation ===
                  BilingualEvaluation.CompletedEnglish ||
                  bilingualEvaluation ===
                    BilingualEvaluation.CompletedFrench) && (
                  <p>
                    Second language level (Comprehension, Written, Verbal):{" "}
                    <span data-h2-font-weight="b(700)">
                      {comprehensionLevel}, {writtenLevel}, {verbalLevel}
                    </span>
                  </p>
                )}
                {bilingualEvaluation === BilingualEvaluation.NotCompleted && (
                  <p>
                    Second language level:{" "}
                    <span data-h2-font-weight="b(700)">
                      {estimatedLanguageAbility}
                    </span>
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
                data-h2-bg-color="b(gray)"
                data-h2-padding="b(all, m)"
                data-h2-radius="b(s)"
              >
                {isGovEmployee && (
                  <div>
                    <p>Yes I am a current government employee</p>
                    {interestedInLaterOrSecondment && (
                      <p>I am interested in later or secondment</p>
                    )}
                    <p>
                      {" "}
                      Current group and classification:{" "}
                      <span data-h2-font-weight="b(700)">
                        {currentClassification?.group}-
                        {currentClassification?.level}
                      </span>
                    </p>
                  </div>
                )}
                {!isGovEmployee && (
                  <p>You are not entered as a current government employee</p>
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
                data-h2-bg-color="b(gray)"
                data-h2-padding="b(all, m)"
                data-h2-radius="b(s)"
              >
                <p>
                  Work location:{" "}
                  <span data-h2-font-weight="b(700)">
                    {locationPreferences}
                  </span>
                </p>
                <p>
                  Location exemptions:{" "}
                  <span data-h2-font-weight="b(700)">{locationExemptions}</span>
                </p>
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
                data-h2-bg-color="b(gray)"
                data-h2-padding="b(all, m)"
                data-h2-radius="b(s)"
              >
                <p>I would consider accepting a job that lasts for: </p>
                <p>{wouldAcceptTemporary}</p>
                <p>I would consider accepting a job that:</p>
                <p>{acceptedOperationalArray}</p>
                <p>
                  I would <span data-h2-font-weight="b(700)">not</span> consider
                  accepting a job that:
                </p>
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
                  href={paths.diversityAndInclusion()}
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
                data-h2-bg-color="b(gray)"
                data-h2-padding="b(all, m)"
                data-h2-radius="b(s)"
              >
                {(!isWoman || isWoman === null) &&
                  (!isIndigenous || isIndigenous === null) &&
                  (!isVisibleMinority || isVisibleMinority === null) &&
                  (!hasDisability || hasDisability === null) && (
                    <p>
                      You have not identified as a member of any employment
                      equity groups
                    </p>
                  )}
                {(isWoman ||
                  isIndigenous ||
                  isVisibleMinority ||
                  hasDisability) && (
                  <div>
                    <p>I identify as: </p>{" "}
                    <ul data-h2-padding="b(left, l)">
                      {isWoman && <li data-h2-font-weight="b(700)">Woman</li>}{" "}
                      {isIndigenous && (
                        <li data-h2-font-weight="b(700)">Indigenous</li>
                      )}{" "}
                      {isVisibleMinority && (
                        <li data-h2-font-weight="b(700)">
                          Member of a visible minority group
                        </li>
                      )}{" "}
                      {hasDisability && (
                        <li data-h2-font-weight="b(700)">
                          Person with a disability
                        </li>
                      )}
                    </ul>
                  </div>
                )}
              </div>
            </div>
            <div id="skills-section">
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
              <p>Skill and experience details</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export const ProfilePageApi: React.FunctionComponent = () => {
  const intl = useIntl();
  const [result] = useGetMeQuery();
  const { data, fetching, error } = result;

  if (fetching) return <p>{intl.formatMessage(commonMessages.loadingTitle)}</p>;
  if (error)
    return (
      <p>
        {intl.formatMessage(commonMessages.loadingError)}
        {error.message}
      </p>
    );

  return <ProfilePage {...data?.me} />;
};
