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
import TALENTSEARCH_APP_DIR from "../../../talentSearchConstants";
import { useTalentSearchRoutes } from "../../../talentSearchRoutes";
import { useGetMeQuery } from "../../../api/generated";

export interface ProfilePageProps {
  firstName?: string | null;
  lastName?: string | null;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
  firstName,
  lastName,
}) => {
  const intl = useIntl();
  const paths = useTalentSearchRoutes();

  return (
    <>
      <div
        data-h2-padding="b(top, xxs) b(bottom, m) b(right-left, s)"
        data-h2-font-color="b(white)"
        data-h2-text-align="b(center)"
        style={{
          background: `url(${imageUrl(
            TALENTSEARCH_APP_DIR,
            "applicant-profile-banner.jpg",
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
              <p>Pool details</p>
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
                  href={`${paths.home()}/update-status`}
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
              <p>Personal details</p>
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
                  href={`${paths.home()}/update-lang-info`}
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
              <p>Language details</p>
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
                  href={`${paths.home()}/update-gov-info`}
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
              <p>Government status details</p>
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
                  href={`${paths.home()}/update-work-location`}
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
              <p>Work location details</p>
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
                  href={`${paths.home()}/update-work-preferences`}
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
              <p>Work preference details</p>
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
                  href={`${paths.home()}/update-diversity-info`}
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
              <p>Diversity and inclusion details</p>
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
                  href={`${paths.home()}/update-skills-and-experience`}
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
