import React from "react";
import { useIntl } from "react-intl";
import TableOfContents from "@common/components/TableOfContents";
import { commonMessages } from "@common/messages";
import LanguageInformationSection from "@common/components/UserProfile/ProfileSections/LanguageInformationSection";
import GovernmentInformationSection from "@common/components/UserProfile/ProfileSections/GovernmentInformationSection";
import WorkLocationSection from "@common/components/UserProfile/ProfileSections/WorkLocationSection";
import WorkPreferencesSection from "@common/components/UserProfile/ProfileSections/WorkPreferencesSection";
import DiversityEquityInclusionSection from "@common/components/UserProfile/ProfileSections/DiversityEquityInclusionSection";
import { ChatAlt2Icon } from "@heroicons/react/solid";
import { Applicant, useGetUserProfileQuery } from "../../api/generated";

export interface UserProfileProps {
  applicant: Applicant;
}
export const UserProfile: React.FC<UserProfileProps> = ({ applicant }) => {
  const intl = useIntl();
  return (
    <TableOfContents.Wrapper>
      <TableOfContents.Navigation>
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
      </TableOfContents.Navigation>
      <TableOfContents.Content>
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
