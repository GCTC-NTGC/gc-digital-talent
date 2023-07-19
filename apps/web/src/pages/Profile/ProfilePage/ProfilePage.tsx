import React from "react";
import { useIntl } from "react-intl";

import { TableOfContents, ThrowNotFound, Pending } from "@gc-digital-talent/ui";

import Hero from "~/components/Hero/Hero";
import useRoutes from "~/hooks/useRoutes";
import profileMessages from "~/messages/profileMessages";
import {
  useGetMeQuery,
  User,
  GetMeQuery,
  useUpdateUserAsUserMutation,
} from "~/api/generated";
import useBreadcrumbs from "~/hooks/useBreadcrumbs";
import SEO from "~/components/SEO/SEO";
import PersonalInformation from "~/components/Profile/components/PersonalInformation/PersonalInformation";
import { SectionProps } from "~/components/Profile/types";
import { PAGE_SECTION_ID } from "~/components/UserProfile/constants";
import { getSectionTitle } from "~/components/Profile/utils";
import WorkPreferences from "~/components/Profile/components/WorkPreferences/WorkPreferences";
import LanguageProfile from "~/components/Profile/components/LanguageProfile/LanguageProfile";
import GovernmentInformation from "~/components/Profile/components/GovernmentInformation/GovernmentInformation";
import DiversityEquityInclusion from "~/components/Profile/components/DiversityEquityInclusion/DiversityEquityInclusion";
import AccountAndPrivacy from "~/components/Profile/components/AccountAndPrivacy/AccountAndPrivacy";

export interface ProfilePageProps {
  user: User;
}

export const ProfileForm = ({ user }: ProfilePageProps) => {
  const paths = useRoutes();
  const intl = useIntl();

  const pageTitle = intl.formatMessage({
    defaultMessage: "Profile information",
    id: "gTjLic",
    description: "applicant dashboard card title for profile card",
  });

  const crumbs = useBreadcrumbs([
    {
      label: intl.formatMessage({
        defaultMessage: "Profile and applications",
        id: "wDc+F3",
        description: "Breadcrumb for profile and applications page.",
      }),
      url: paths.profileAndApplications(),
    },
    {
      label: pageTitle,
      url: paths.profile(user.id),
    },
  ]);

  const [{ fetching: isUpdating }, executeUpdateMutation] =
    useUpdateUserAsUserMutation();

  const handleUpdate: SectionProps["onUpdate"] = async (userId, userData) => {
    return executeUpdateMutation({
      id: userId,
      user: userData,
    }).then((res) => res.data?.updateUserAsUser);
  };

  const sectionProps = {
    user,
    isUpdating,
    onUpdate: handleUpdate,
    pool: null,
  };

  return (
    <>
      <SEO title={pageTitle} />
      <Hero
        title={pageTitle}
        subtitle={intl.formatMessage({
          defaultMessage:
            "View and update account information including contact and work preferences.",
          id: "NflJW7",
          description: "subtitle for the profile page",
        })}
        crumbs={crumbs}
      />
      <div data-h2-container="base(center, large, x1) p-tablet(center, large, x2)">
        <TableOfContents.Wrapper>
          <TableOfContents.Navigation data-h2-padding-top="base(x3)">
            <TableOfContents.List>
              <TableOfContents.ListItem>
                <TableOfContents.AnchorLink id={PAGE_SECTION_ID.ABOUT}>
                  {intl.formatMessage(getSectionTitle("personal"))}
                </TableOfContents.AnchorLink>
              </TableOfContents.ListItem>
              <TableOfContents.ListItem>
                <TableOfContents.AnchorLink
                  id={PAGE_SECTION_ID.WORK_PREFERENCES}
                >
                  {intl.formatMessage(getSectionTitle("work"))}
                </TableOfContents.AnchorLink>
              </TableOfContents.ListItem>
              <TableOfContents.ListItem>
                <TableOfContents.AnchorLink id={PAGE_SECTION_ID.DEI}>
                  {intl.formatMessage(getSectionTitle("dei"))}
                </TableOfContents.AnchorLink>
              </TableOfContents.ListItem>
              <TableOfContents.ListItem>
                <TableOfContents.AnchorLink id={PAGE_SECTION_ID.GOVERNMENT}>
                  {intl.formatMessage(getSectionTitle("government"))}
                </TableOfContents.AnchorLink>
              </TableOfContents.ListItem>
              <TableOfContents.ListItem>
                <TableOfContents.AnchorLink id={PAGE_SECTION_ID.LANGUAGE}>
                  {intl.formatMessage(getSectionTitle("language"))}
                </TableOfContents.AnchorLink>
              </TableOfContents.ListItem>
              <TableOfContents.ListItem>
                <TableOfContents.AnchorLink
                  id={PAGE_SECTION_ID.ACCOUNT_AND_PRIVACY}
                >
                  {intl.formatMessage(getSectionTitle("account"))}
                </TableOfContents.AnchorLink>
              </TableOfContents.ListItem>
            </TableOfContents.List>
          </TableOfContents.Navigation>
          <TableOfContents.Content data-h2-padding-top="base(x3)">
            <TableOfContents.Section id={PAGE_SECTION_ID.ABOUT}>
              <PersonalInformation {...sectionProps} />
            </TableOfContents.Section>
            <TableOfContents.Section
              id={PAGE_SECTION_ID.WORK_PREFERENCES}
              data-h2-padding-top="base(x2)"
            >
              <WorkPreferences {...sectionProps} />
            </TableOfContents.Section>
            <TableOfContents.Section
              id={PAGE_SECTION_ID.DEI}
              data-h2-padding-top="base(x2)"
            >
              <DiversityEquityInclusion {...sectionProps} />
            </TableOfContents.Section>
            <TableOfContents.Section
              id={PAGE_SECTION_ID.GOVERNMENT}
              data-h2-padding-top="base(x2)"
            >
              <GovernmentInformation {...sectionProps} />
            </TableOfContents.Section>
            <TableOfContents.Section
              id={PAGE_SECTION_ID.LANGUAGE}
              data-h2-padding-top="base(x2)"
            >
              <LanguageProfile {...sectionProps} />
            </TableOfContents.Section>
            <TableOfContents.Section
              id={PAGE_SECTION_ID.ACCOUNT_AND_PRIVACY}
              data-h2-padding-top="base(x2)"
            >
              <AccountAndPrivacy {...sectionProps} />
            </TableOfContents.Section>
          </TableOfContents.Content>
        </TableOfContents.Wrapper>
      </div>
    </>
  );
};

const ProfilePage = () => {
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

  return (
    <Pending fetching={fetching} error={error}>
      {userData ? (
        <ProfileForm user={userData} />
      ) : (
        <ThrowNotFound
          message={intl.formatMessage(profileMessages.userNotFound)}
        />
      )}
    </Pending>
  );
};

export default ProfilePage;
