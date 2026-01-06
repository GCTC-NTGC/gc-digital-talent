import { defineMessage, useIntl } from "react-intl";
import { OperationContext, useMutation, useQuery } from "urql";

import {
  TableOfContents,
  ThrowNotFound,
  Pending,
  Container,
} from "@gc-digital-talent/ui";
import { navigationMessages } from "@gc-digital-talent/i18n";
import { FragmentType, getFragment, graphql } from "@gc-digital-talent/graphql";
import { ROLE_NAME } from "@gc-digital-talent/auth";

import Hero from "~/components/Hero";
import useRoutes from "~/hooks/useRoutes";
import profileMessages from "~/messages/profileMessages";
import useBreadcrumbs from "~/hooks/useBreadcrumbs";
import SEO from "~/components/SEO/SEO";
import { SectionProps } from "~/components/Profile/types";
import { PAGE_SECTION_ID } from "~/constants/sections/userProfile";
import { getSectionTitle } from "~/components/Profile/utils";
import WorkPreferences from "~/components/Profile/components/WorkPreferences/WorkPreferences";
import LanguageProfile from "~/components/Profile/components/LanguageProfile/LanguageProfile";
import GovernmentInformation from "~/components/Profile/components/GovernmentInformation/GovernmentInformation";
import DiversityEquityInclusion from "~/components/Profile/components/DiversityEquityInclusion/DiversityEquityInclusion";
import RequireAuth from "~/components/RequireAuth/RequireAuth";
import PriorityEntitlements from "~/components/Profile/components/PriorityEntitlements/PriorityEntitlements";

import pageMessages from "./messages";

const ProfileUpdateUser_Mutation = graphql(/* GraphQL */ `
  mutation UpdateUserAsUser($id: ID!, $user: UpdateUserAsUserInput!) {
    updateUserAsUser(id: $id, user: $user) {
      id
    }
  }
`);

const pageTitle = defineMessage(pageMessages.pageTitle);

const subTitle = defineMessage(pageMessages.subTitle);

export const UserProfile_Fragment = graphql(/** GraphQL */ `
  fragment UserProfile on User {
    ...ProfileWorkPreferences
    ...ProfileDiversityEquityInclusion
    ...ProfilePriorityEntitlements
    ...ProfileGovernmentInformation
    ...ProfileLanguageProfile
  }
`);

export interface ProfilePageProps {
  userQuery: FragmentType<typeof UserProfile_Fragment>;
}

export const ProfileForm = ({ userQuery }: ProfilePageProps) => {
  const paths = useRoutes();
  const intl = useIntl();
  const user = getFragment(UserProfile_Fragment, userQuery);

  const formattedPageTitle = intl.formatMessage(pageTitle);
  const formattedSubTitle = intl.formatMessage(subTitle);

  const crumbs = useBreadcrumbs({
    crumbs: [
      {
        label: intl.formatMessage(navigationMessages.applicantDashboard),
        url: paths.applicantDashboard(),
      },
      {
        label: formattedPageTitle,
        url: paths.profile(),
      },
    ],
  });

  const [{ fetching: isUpdating }, executeUpdateMutation] = useMutation(
    ProfileUpdateUser_Mutation,
  );

  const handleUpdate: SectionProps["onUpdate"] = async (userId, userData) => {
    return executeUpdateMutation({
      id: userId,
      user: userData,
    }).then((res) => res.data?.updateUserAsUser);
  };

  const sectionProps = {
    query: user,
    isUpdating,
    onUpdate: handleUpdate,
    pool: null,
  };

  return (
    <>
      <SEO title={formattedPageTitle} description={formattedSubTitle} />
      <Hero
        title={formattedPageTitle}
        subtitle={formattedSubTitle}
        crumbs={crumbs}
      />
      <Container className="my-18">
        <TableOfContents.Wrapper>
          <TableOfContents.Navigation>
            <TableOfContents.List>
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
                <TableOfContents.AnchorLink
                  id={PAGE_SECTION_ID.PRIORITY_ENTITLEMENTS}
                >
                  {intl.formatMessage(getSectionTitle("priority"))}
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
            </TableOfContents.List>
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
                id={PAGE_SECTION_ID.PRIORITY_ENTITLEMENTS}
              >
                <PriorityEntitlements {...sectionProps} />
              </TableOfContents.Section>
              <TableOfContents.Section id={PAGE_SECTION_ID.GOVERNMENT}>
                <GovernmentInformation query={user} />
              </TableOfContents.Section>
              <TableOfContents.Section id={PAGE_SECTION_ID.LANGUAGE}>
                <LanguageProfile {...sectionProps} />
              </TableOfContents.Section>
            </div>
          </TableOfContents.Content>
        </TableOfContents.Wrapper>
      </Container>
    </>
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

export default Component;
