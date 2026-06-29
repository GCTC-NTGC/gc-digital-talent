import { defineMessage, useIntl } from "react-intl";
import { useMutation, useQuery, type OperationContext } from "urql";

import {
  Link,
  Pending,
  Separator,
  TableOfContents,
  ThrowNotFound,
} from "@gc-digital-talent/ui";
import { navigationMessages } from "@gc-digital-talent/i18n";
import {
  getFragment,
  graphql,
  type FragmentType,
} from "@gc-digital-talent/graphql";
import { ROLE_NAME } from "@gc-digital-talent/auth";
import { useLocalStorage } from "@gc-digital-talent/storage";

import profileMessages from "~/messages/profileMessages";
import type { SectionProps } from "~/components/Profile/types";
import { PAGE_SECTION_ID } from "~/constants/sections/userProfile";
import { getSectionTitle } from "~/components/Profile/utils";
import WorkPreferences from "~/components/Profile/components/WorkPreferences/WorkPreferences";
import LanguageProfile from "~/components/Profile/components/LanguageProfile/LanguageProfile";
import DiversityEquityInclusion from "~/components/Profile/components/DiversityEquityInclusion/DiversityEquityInclusion";
import CitizenVeteranPriority from "~/components/Profile/components/CitizenVeteranPriority/CitizenVeteranPriority";
import useRoutes from "~/hooks/useRoutes";
import { KEY_NEW_USER_LANGUAGE_PRESET } from "~/constants/storageKeys";
import RequireAuth from "~/components/RequireAuth/RequireAuth";

const ProfileUpdateUser_Mutation = graphql(/* GraphQL */ `
  mutation UpdateUserAsUser($id: ID!, $user: UpdateUserAsUserInput!) {
    updateUserAsUser(id: $id, user: $user) {
      id
    }
  }
`);

export const handle = {
  pageTitle: defineMessage(navigationMessages.profilePage),
};

export const UserProfile_Fragment = graphql(/* GraphQL */ `
  fragment UserProfile on User {
    isVerifiedGovEmployee
    ...ProfileWorkPreferences
    ...ProfileDiversityEquityInclusion
    ...ProfileCitizenVeteranPriority
    ...ProfileLanguageProfile
  }
`);

export interface ProfilePageProps {
  userQuery: FragmentType<typeof UserProfile_Fragment>;
}

export const ProfileForm = ({ userQuery }: ProfilePageProps) => {
  const intl = useIntl();
  const paths = useRoutes();
  const user = getFragment(UserProfile_Fragment, userQuery);

  const [languagePresetNoticeIsVisible, setLanguagePresetNoticeIsVisible] =
    useLocalStorage<boolean>(KEY_NEW_USER_LANGUAGE_PRESET, false);

  const [{ fetching: isUpdating }, executeUpdateMutation] = useMutation(
    ProfileUpdateUser_Mutation,
  );

  const handleUpdate: SectionProps["onUpdate"] = async (userId, userData) => {
    return executeUpdateMutation({
      id: userId,
      user: userData,
    }).then((res) => {
      return res.data?.updateUserAsUser;
    });
  };

  const sectionProps = {
    query: user,
    isUpdating,
    onUpdate: handleUpdate,
    pool: null,
  };

  return (
    <TableOfContents.Wrapper>
      <TableOfContents.Navigation>
        <TableOfContents.List>
          <TableOfContents.ListItem>
            <TableOfContents.AnchorLink id={PAGE_SECTION_ID.WORK_PREFERENCES}>
              {intl.formatMessage(getSectionTitle("work"))}
            </TableOfContents.AnchorLink>
          </TableOfContents.ListItem>
          <TableOfContents.ListItem>
            <TableOfContents.AnchorLink id={PAGE_SECTION_ID.DEI}>
              {intl.formatMessage(getSectionTitle("dei"))}
            </TableOfContents.AnchorLink>
          </TableOfContents.ListItem>
          <TableOfContents.ListItem>
            <TableOfContents.AnchorLink
              id={PAGE_SECTION_ID.CITIZEN_VETERAN_PRIORITY}
            >
              {intl.formatMessage(getSectionTitle("citizen-veteran-priority"))}
            </TableOfContents.AnchorLink>
          </TableOfContents.ListItem>
          <TableOfContents.ListItem>
            <TableOfContents.AnchorLink id={PAGE_SECTION_ID.LANGUAGE}>
              {intl.formatMessage(getSectionTitle("language"))}
            </TableOfContents.AnchorLink>
          </TableOfContents.ListItem>
        </TableOfContents.List>
        <Separator space="sm" />
        <div className="flex flex-col gap-y-3">
          <Link href={paths.employeeProfile()}>
            {intl.formatMessage(navigationMessages.employeeProfileGC)}
          </Link>
          <Link href={paths.accountSettings()}>
            {intl.formatMessage(navigationMessages.accountSettings)}
          </Link>
        </div>
      </TableOfContents.Navigation>
      <TableOfContents.Content>
        <div className="flex flex-col gap-y-18">
          <TableOfContents.Section id={PAGE_SECTION_ID.WORK_PREFERENCES}>
            <WorkPreferences {...sectionProps} />
          </TableOfContents.Section>
          <TableOfContents.Section id={PAGE_SECTION_ID.DEI}>
            <DiversityEquityInclusion {...sectionProps} />
          </TableOfContents.Section>
          <TableOfContents.Section
            id={PAGE_SECTION_ID.CITIZEN_VETERAN_PRIORITY}
          >
            <CitizenVeteranPriority {...sectionProps} />
          </TableOfContents.Section>
          <TableOfContents.Section id={PAGE_SECTION_ID.LANGUAGE}>
            <LanguageProfile
              languagePresetNoticeIsVisible={languagePresetNoticeIsVisible}
              setLanguagePresetNoticeIsVisible={
                setLanguagePresetNoticeIsVisible
              }
              {...sectionProps}
            />
          </TableOfContents.Section>
        </div>
      </TableOfContents.Content>
    </TableOfContents.Wrapper>
  );
};

const ProfileUser_Query = graphql(/* GraphQL */ `
  query ProfileUser {
    me {
      ...UserProfile
    }
  }
`);

const context: Partial<OperationContext> = {
  requestPolicy: "cache-and-network",
};

const ProfilePage = () => {
  const intl = useIntl();
  const [{ data, fetching, error }] = useQuery({
    query: ProfileUser_Query,
    context,
  });

  return (
    <Pending fetching={fetching} error={error}>
      {data?.me ? (
        <ProfileForm userQuery={data?.me} />
      ) : (
        <ThrowNotFound
          message={intl.formatMessage(profileMessages.userNotFound)}
        />
      )}
    </Pending>
  );
};

export const Component = () => (
  <RequireAuth roles={[ROLE_NAME.Applicant]}>
    <ProfilePage />
  </RequireAuth>
);

Component.displayName = "ProfilePage";

export default ProfilePage;
