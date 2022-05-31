import React from "react";
import { useIntl } from "react-intl";
import TableOfContents from "@common/components/TableOfContents";
import { commonMessages } from "@common/messages";
import LanguageInformationSection from "@common/components/UserProfile/ProfileSections/LanguageInformationSection";
import GovernmentInformationSection from "@common/components/UserProfile/ProfileSections/GovernmentInformationSection";
import WorkLocationSection from "@common/components/UserProfile/ProfileSections/WorkLocationSection";
import WorkPreferencesSection from "@common/components/UserProfile/ProfileSections/WorkPreferencesSection";
import DiversityEquityInclusionSection from "@common/components/UserProfile/ProfileSections/DiversityEquityInclusionSection";
import RoleSalarySection from "@common/components/UserProfile/ProfileSections/RoleSalarySection";
import ExperienceSection from "@common/components/UserProfile/ExperienceSection";

import {
  UserIcon,
  ChatAlt2Icon,
  CurrencyDollarIcon,
} from "@heroicons/react/outline";
import { notEmpty } from "@common/helpers/util";
import { Applicant, useGetUserProfileQuery } from "../../api/generated";

export interface UserProfileProps {
  applicant: Applicant;
}
export const UserProfile: React.FC<UserProfileProps> = ({ applicant }) => {
  const intl = useIntl();
  const { firstName, lastName, experiences } = applicant;
  return (
    <TableOfContents.Wrapper>
      <TableOfContents.Navigation>
        <TableOfContents.AnchorLink id="about-section">
          {intl.formatMessage({
            defaultMessage: "About",
            description: "Title of the About link section",
          })}
        </TableOfContents.AnchorLink>
        <TableOfContents.AnchorLink id="language-section">
          {intl.formatMessage({
            defaultMessage: "Language Information",
            description: "Title of the Language Information link section",
          })}
        </TableOfContents.AnchorLink>
        <TableOfContents.AnchorLink id="government-section">
          {intl.formatMessage({
            defaultMessage: "Government Information",
            description: "Title of the Government Information link section",
          })}
        </TableOfContents.AnchorLink>
        <TableOfContents.AnchorLink id="work-location-section">
          {intl.formatMessage({
            defaultMessage: "Work Location",
            description: "Title of the Work Location link section",
          })}
        </TableOfContents.AnchorLink>
        <TableOfContents.AnchorLink id="work-preferences-section">
          {intl.formatMessage({
            defaultMessage: "Work Preferences",
            description: "Title of the Work Preferences link section",
          })}
        </TableOfContents.AnchorLink>
        <TableOfContents.AnchorLink id="ee-information-section">
          {intl.formatMessage({
            defaultMessage: "Employment Equity Information",
            description:
              "Title of the Employment Equity Information link section",
          })}
        </TableOfContents.AnchorLink>
        <TableOfContents.AnchorLink id="role-and-salary-section">
          {intl.formatMessage({
            defaultMessage: "Role and salary expectations",
            description:
              "Title of the Role and salary expectations link section",
          })}
        </TableOfContents.AnchorLink>
        <TableOfContents.AnchorLink id="skills-and-experience-section">
          {intl.formatMessage({
            defaultMessage: "My skills and experience",
            description: "Title of the My skills and experience link section",
          })}
        </TableOfContents.AnchorLink>
      </TableOfContents.Navigation>
      <TableOfContents.Content>
        <TableOfContents.Section id="about-section">
          <TableOfContents.Heading icon={UserIcon} style={{ flex: "1 1 0%" }}>
            {intl.formatMessage({
              defaultMessage: "About",
              description: "Title of the about content section",
            })}
          </TableOfContents.Heading>
          <div data-h2-flex-item="b(1of1) s(3of4)">
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
        </TableOfContents.Section>
        <TableOfContents.Section id="language-section">
          <TableOfContents.Heading
            icon={ChatAlt2Icon}
            style={{ flex: "1 1 0%" }}
          >
            {intl.formatMessage({
              defaultMessage: "Language Information",
              description: "Title of the Language Information content section",
            })}
          </TableOfContents.Heading>
          <LanguageInformationSection applicant={applicant} />
        </TableOfContents.Section>
        <TableOfContents.Section id="government-section">
          <TableOfContents.Heading
            icon={ChatAlt2Icon}
            style={{ flex: "1 1 0%" }}
          >
            {intl.formatMessage({
              defaultMessage: "Government Information",
              description:
                "Title of the Government Information content section",
            })}
          </TableOfContents.Heading>
          <GovernmentInformationSection applicant={applicant} />
        </TableOfContents.Section>
        <TableOfContents.Section id="work-location-section">
          <TableOfContents.Heading
            icon={ChatAlt2Icon}
            style={{ flex: "1 1 0%" }}
          >
            {intl.formatMessage({
              defaultMessage: "Work Location",
              description: "Title of the Work Location content section",
            })}
          </TableOfContents.Heading>
          <WorkLocationSection applicant={applicant} />
        </TableOfContents.Section>
        <TableOfContents.Section id="work-preferences-section">
          <TableOfContents.Heading
            icon={ChatAlt2Icon}
            style={{ flex: "1 1 0%" }}
          >
            {intl.formatMessage({
              defaultMessage: "Work Preferences",
              description: "Title of the Work Preferences content section",
            })}
          </TableOfContents.Heading>
          <WorkPreferencesSection applicant={applicant} />
        </TableOfContents.Section>
        <TableOfContents.Section id="ee-information-section">
          <TableOfContents.Heading
            icon={ChatAlt2Icon}
            style={{ flex: "1 1 0%" }}
          >
            {intl.formatMessage({
              defaultMessage: "Employment Equity Information",
              description:
                "Title of the Employment Equity Information content section",
            })}
          </TableOfContents.Heading>
          <DiversityEquityInclusionSection applicant={applicant} />
        </TableOfContents.Section>
        <TableOfContents.Section id="role-and-salary-section">
          <TableOfContents.Heading
            icon={CurrencyDollarIcon}
            style={{ flex: "1 1 0%" }}
          >
            {intl.formatMessage({
              defaultMessage: "Role and salary expectations",
              description: "Title of the Role and salary expectations section",
            })}
          </TableOfContents.Heading>
          <RoleSalarySection applicant={applicant} />
        </TableOfContents.Section>
        <TableOfContents.Section id="skills-and-experience-section">
          <TableOfContents.Heading
            icon={CurrencyDollarIcon}
            style={{ flex: "1 1 0%" }}
          >
            {intl.formatMessage({
              defaultMessage: "My skills and experience",
              description:
                "Title of the My skills and experience content section",
            })}
          </TableOfContents.Heading>
          <ExperienceSection experiences={experiences?.filter(notEmpty)} />
        </TableOfContents.Section>
      </TableOfContents.Content>
    </TableOfContents.Wrapper>
  );
};

export default UserProfile;

export const UserProfileApi: React.FunctionComponent<{
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

  if (userData?.applicant)
    return <UserProfile applicant={userData.applicant} />;
  return (
    <p>
      {intl.formatMessage({
        defaultMessage: "No candidate data",
        description: "No candidate data was found",
      })}
    </p>
  );
};
