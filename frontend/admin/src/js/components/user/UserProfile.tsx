import React from "react";
import { useIntl } from "react-intl";
import TableOfContents from "@common/components/TableOfContents";
import { commonMessages } from "@common/messages";
import LanguageInformationSection from "@common/components/UserProfile/ProfileSections/LanguageInformationSection";
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
            description: "Title of the Language Information section",
          })}
        </TableOfContents.AnchorLink>
      </TableOfContents.Navigation>
      <TableOfContents.Content>
        <TableOfContents.Section id="status-section">
          <TableOfContents.Heading
            icon={ChatAlt2Icon}
            style={{ flex: "1 1 0%" }}
          >
            {intl.formatMessage({
              defaultMessage: "Language information",
              description: "Title of the Language information section",
            })}
          </TableOfContents.Heading>
          <LanguageInformationSection applicant={applicant} />
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
