import React from "react";
import {
  BriefcaseIcon,
  ChatAlt2Icon,
  LibraryIcon,
  LightBulbIcon,
  LightningBoltIcon,
  ThumbUpIcon,
  UserCircleIcon,
  UserGroupIcon,
  UserIcon,
} from "@heroicons/react/solid";
import { useIntl } from "react-intl";
import { Link } from "@common/components";
import TableOfContents from "@common/components/TableOfContents";
import commonMessages from "@common/messages/commonMessages";
import { imageUrl } from "@common/helpers/router";
import {
  getOperationalRequirement,
  getWorkRegion,
  womanLocalized,
  indigenousLocalized,
  minorityLocalized,
  disabilityLocalized,
} from "@common/constants/localizedConstants";

import { insertBetween, notEmpty } from "@common/helpers/util";
import ExperienceSection from "@common/components/UserProfile/ExperienceSection";
import { unpackMaybes } from "@common/helpers/formUtils";
import TALENTSEARCH_APP_DIR from "../../../talentSearchConstants";
import { useApplicantProfileRoutes } from "../../../applicantProfileRoutes";
import {
  useGetMeQuery,
  User,
  GetMeQuery,
  GovEmployeeType,
} from "../../../api/generated";

import MyStatusApi from "../../myStatusForm/MyStatusForm";
import CandidatePoolsSection from "./CandidatePoolsSection";
import AboutMeSection from "./AboutMeSection";
import LanguageInformationSection from "./LanguageInformationSection";

export interface ProfilePageProps {
  profileDataInput: User;
}

// styling a text bit with red colour within intls
export function redText(msg: string) {
  return <span data-h2-font-color="b(red)">{msg}</span>;
}

export const ProfileForm: React.FC<ProfilePageProps> = ({
  profileDataInput,
}) => {
  const {
    firstName,
    lastName,
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

  const experienceEditPaths = {
    awardUrl: (id: string) => paths.editExperience("award", id),
    communityUrl: (id: string) => paths.editExperience("community", id),
    educationUrl: (id: string) => paths.editExperience("education", id),
    personalUrl: (id: string) => paths.editExperience("personal", id),
    workUrl: (id: string) => paths.editExperience("work", id),
  };

  // add link to Equity groups <a> tags around a message
  function equityLinkText(msg: string) {
    return <a href="/equity-groups">{msg}</a>;
  }

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
        data-h2-padding="b(top-bottom, m) b(right-left, s)"
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
        <h1 data-h2-margin="b(top-bottom, l)">{`${firstName} ${lastName}`}</h1>
      </div>
      <TableOfContents.Wrapper>
        <TableOfContents.Navigation>
          <TableOfContents.AnchorLink id="status-section">
            {intl.formatMessage({
              defaultMessage: "My Status",
              description: "Title of the My Status section",
            })}
          </TableOfContents.AnchorLink>
          <TableOfContents.AnchorLink id="pools-section">
            {intl.formatMessage({
              defaultMessage: "My Hiring Pools",
              description: "Title of the My Hiring Pools section",
            })}
          </TableOfContents.AnchorLink>
          <TableOfContents.AnchorLink id="about-me-section">
            {intl.formatMessage({
              defaultMessage: "About Me",
              description: "Title of the About Me section",
            })}
          </TableOfContents.AnchorLink>
          <TableOfContents.AnchorLink id="language-section">
            {intl.formatMessage({
              defaultMessage: "Language Information",
              description: "Title of the Language Information section",
            })}
          </TableOfContents.AnchorLink>
          <TableOfContents.AnchorLink id="gov-info-section">
            {intl.formatMessage({
              defaultMessage: "Government Information",
              description: "Title of the Government Information section",
            })}
          </TableOfContents.AnchorLink>
          <TableOfContents.AnchorLink id="work-location-section">
            {intl.formatMessage({
              defaultMessage: "Work Location",
              description: "Title of the Work Location section",
            })}
          </TableOfContents.AnchorLink>
          <TableOfContents.AnchorLink id="work-preferences-section">
            {intl.formatMessage({
              defaultMessage: "Work Preferences",
              description: "Title of the Work Preferences section",
            })}
          </TableOfContents.AnchorLink>
          <TableOfContents.AnchorLink id="diversity-section">
            {intl.formatMessage({
              defaultMessage: "Diversity, Equity and Inclusion",
              description:
                "Title of the Diversity, Equity and Inclusion section",
            })}
          </TableOfContents.AnchorLink>
          <TableOfContents.AnchorLink id="skills-section">
            {intl.formatMessage({
              defaultMessage: "My Skills and Experience",
              description: "Title of the My Skills and Experience section",
            })}
          </TableOfContents.AnchorLink>
        </TableOfContents.Navigation>
        <TableOfContents.Content>
          <TableOfContents.Section id="status-section">
            <TableOfContents.Heading icon={LightBulbIcon}>
              {intl.formatMessage({
                defaultMessage: "My status",
                description: "Title of the My status section",
              })}
            </TableOfContents.Heading>
            <MyStatusApi />
          </TableOfContents.Section>
          <TableOfContents.Section id="pools-section">
            <TableOfContents.Heading icon={UserGroupIcon}>
              {intl.formatMessage({
                defaultMessage: "My hiring pools",
                description: "Title of the My hiring pools section",
              })}
            </TableOfContents.Heading>
            <CandidatePoolsSection
              poolCandidates={unpackMaybes(poolCandidates)}
            />
          </TableOfContents.Section>
          <TableOfContents.Section id="about-me-section">
            <div style={{ display: "flex", alignItems: "baseline" }}>
              <TableOfContents.Heading
                icon={UserIcon}
                style={{ flex: "1 1 0%" }}
              >
                {intl.formatMessage({
                  defaultMessage: "About me",
                  description: "Title of the About me section",
                })}
              </TableOfContents.Heading>
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
            <AboutMeSection
              applicant={profileDataInput}
              editPath={paths.aboutMe()}
            />
          </TableOfContents.Section>
          <TableOfContents.Section id="language-section">
            <div style={{ display: "flex", alignItems: "baseline" }}>
              <TableOfContents.Heading
                icon={ChatAlt2Icon}
                style={{ flex: "1 1 0%" }}
              >
                {intl.formatMessage({
                  defaultMessage: "Language information",
                  description: "Title of the Language information section",
                })}
              </TableOfContents.Heading>
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
            <LanguageInformationSection
              applicant={profileDataInput}
              editPath={paths.languageInformation()}
            />
          </TableOfContents.Section>
          <TableOfContents.Section id="gov-info-section">
            <div style={{ display: "flex", alignItems: "baseline" }}>
              <TableOfContents.Heading
                icon={LibraryIcon}
                style={{ flex: "1 1 0%" }}
              >
                {intl.formatMessage({
                  defaultMessage: "Government information",
                  description: "Title of the Government information section",
                })}
              </TableOfContents.Heading>
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
              <ul data-h2-padding="b(left, s)">
                {isGovEmployee && (
                  <>
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
                  </>
                )}
                {isGovEmployee === null && (
                  <li>
                    {intl.formatMessage({
                      defaultMessage:
                        "You haven't added any information here yet.",
                      description:
                        "Message for when no data exists for the section",
                    })}
                  </li>
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
              </ul>
            </div>
          </TableOfContents.Section>
          <TableOfContents.Section id="work-location-section">
            <div style={{ display: "flex", alignItems: "baseline" }}>
              <TableOfContents.Heading
                icon={BriefcaseIcon}
                style={{ flex: "1 1 0%" }}
              >
                {intl.formatMessage({
                  defaultMessage: "Work location",
                  description: "Title of the Work location section",
                })}
              </TableOfContents.Heading>
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
          </TableOfContents.Section>
          <TableOfContents.Section id="work-preferences-section">
            <div style={{ display: "flex", alignItems: "baseline" }}>
              <TableOfContents.Heading
                icon={ThumbUpIcon}
                style={{ flex: "1 1 0%" }}
              >
                {intl.formatMessage({
                  defaultMessage: "Work preferences",
                  description: "Title of the Work preferences section",
                })}
              </TableOfContents.Heading>
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
                      defaultMessage: "I would consider accepting a job that:",
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
          </TableOfContents.Section>
          <TableOfContents.Section id="diversity-section">
            <div style={{ display: "flex", alignItems: "baseline" }}>
              <TableOfContents.Heading
                icon={UserCircleIcon}
                style={{ flex: "1 1 0%" }}
              >
                {intl.formatMessage({
                  defaultMessage: "Diversity, equity and inclusion",
                  description:
                    "Title of the Diversity, equity and inclusion section",
                })}
              </TableOfContents.Heading>
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
          </TableOfContents.Section>
          <TableOfContents.Section
            id="skills-section"
            data-h2-padding="b(bottom, xxl)"
          >
            <div style={{ display: "flex", alignItems: "baseline" }}>
              <TableOfContents.Heading
                icon={LightningBoltIcon}
                style={{ flex: "1 1 0%" }}
              >
                {intl.formatMessage({
                  defaultMessage: "My skills and experience",
                  description: "Title of the My skills and experience section",
                })}
              </TableOfContents.Heading>
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
                  experienceEditPaths={experienceEditPaths}
                />
              </div>
            )}
          </TableOfContents.Section>
        </TableOfContents.Content>
      </TableOfContents.Wrapper>
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
