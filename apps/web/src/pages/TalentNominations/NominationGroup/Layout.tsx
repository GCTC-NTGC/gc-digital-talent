import { useIntl } from "react-intl";
import { Outlet } from "react-router";
import { useQuery } from "urql";

import { ROLE_NAME } from "@gc-digital-talent/auth";
import { FragmentType, getFragment, graphql } from "@gc-digital-talent/graphql";
import { Pending, Sidebar, ThrowNotFound } from "@gc-digital-talent/ui";
import { commonMessages, navigationMessages } from "@gc-digital-talent/i18n";

import Hero from "~/components/Hero";
import RequireAuth from "~/components/RequireAuth/RequireAuth";
import SEO from "~/components/SEO/SEO";
import useRequiredParams from "~/hooks/useRequiredParams";
import { getFullNameLabel } from "~/utils/nameUtils";
import useBreadcrumbs from "~/hooks/useBreadcrumbs";
import useRoutes from "~/hooks/useRoutes";
import pageTitles from "~/messages/pageTitles";
import AdminContentWrapper from "~/components/AdminContentWrapper/AdminContentWrapper";

import { RouteParams } from "./types";
import NominationGroupSidebar from "./components/NominationGroupSidebar";
import { detailTabMessages } from "./messages";

const TalentNominationGroupLayout_Fragment = graphql(/* GraphQL */ `
  fragment TalentNominationGroupLayout on TalentNominationGroup {
    talentNominationEvent {
      id
      name {
        localized
      }
    }
    nominee {
      firstName
      lastName
    }
    ...NominationGroupSidebar
  }
`);

interface LayoutProps {
  query: FragmentType<typeof TalentNominationGroupLayout_Fragment>;
}

const Layout = ({ query }: LayoutProps) => {
  const intl = useIntl();
  const paths = useRoutes();
  const { talentNominationGroupId } = useRequiredParams<RouteParams>(
    "talentNominationGroupId",
  );
  const talentNominationGroup = getFragment(
    TalentNominationGroupLayout_Fragment,
    query,
  );

  const nomineeName = getFullNameLabel(
    talentNominationGroup.nominee?.firstName,
    talentNominationGroup.nominee?.lastName,
    intl,
  );

  const description = intl.formatMessage({
    defaultMessage:
      "Review a nominee’s profile and approve or reject their nomination.",
    id: "0m1utE",
    description: "Description of a talent nomination group",
  });

  const crumbs = useBreadcrumbs({
    crumbs: [
      {
        label: intl.formatMessage(navigationMessages.communityDashboard),
        url: paths.communityDashboard(),
      },
      {
        label: intl.formatMessage(pageTitles.talentManagement),
        url: paths.adminTalentManagementEvents(),
      },
      {
        label:
          talentNominationGroup.talentNominationEvent.name.localized ??
          intl.formatMessage(commonMessages.notAvailable),
        url: paths.adminTalentManagementEvent(
          talentNominationGroup.talentNominationEvent.id,
        ),
      },
      {
        label: nomineeName,
        url: paths.talentNominationGroup(
          talentNominationGroup.talentNominationEvent.id,
          talentNominationGroupId,
        ),
      },
    ],
  });

  return (
    <>
      <SEO title={nomineeName} description={description} />
      <Hero
        title={nomineeName}
        subtitle={description}
        crumbs={crumbs}
        navTabs={[
          {
            url: paths.talentNominationGroup(
              talentNominationGroup.talentNominationEvent.id,
              talentNominationGroupId,
            ),
            label: intl.formatMessage(
              detailTabMessages.nominationDetailsPageTitle,
            ),
          },
          {
            url: paths.talentNominationGroupProfile(
              talentNominationGroup.talentNominationEvent.id,
              talentNominationGroupId,
            ),
            label: intl.formatMessage({
              defaultMessage: "Profile",
              id: "n8Mc9q",
              description: "Link text for the profile of a nominee",
            }),
          },
          {
            url: paths.talentNominationGroupExperience(
              talentNominationGroup.talentNominationEvent.id,
              talentNominationGroupId,
            ),
            label: intl.formatMessage(navigationMessages.careerExperience),
          },
        ]}
      />
      <AdminContentWrapper table>
        <Sidebar.Wrapper className="sm:gap-x-6">
          <Sidebar.Sidebar className="sm:order-2">
            <NominationGroupSidebar
              talentNominationGroupQuery={talentNominationGroup}
            />
          </Sidebar.Sidebar>
          <Sidebar.Content className="sm:order-1">
            <Outlet />
          </Sidebar.Content>
        </Sidebar.Wrapper>
      </AdminContentWrapper>
    </>
  );
};

const TalentNominationGroupLayout_Query = graphql(/* GraphQL */ `
  query TalentNominationGroupLayout($talentNominationGroupId: UUID!) {
    talentNominationGroup(id: $talentNominationGroupId) {
      ...TalentNominationGroupLayout
    }
  }
`);

const TalentNominationGroupLayout = () => {
  const { talentNominationGroupId } = useRequiredParams<RouteParams>(
    "talentNominationGroupId",
  );
  const [{ data, fetching, error }] = useQuery({
    query: TalentNominationGroupLayout_Query,
    variables: { talentNominationGroupId },
  });

  return (
    <Pending fetching={fetching} error={error}>
      {data?.talentNominationGroup ? (
        <Layout query={data.talentNominationGroup} />
      ) : (
        <ThrowNotFound />
      )}
    </Pending>
  );
};

export const Component = () => (
  <RequireAuth roles={[ROLE_NAME.CommunityTalentCoordinator]}>
    <TalentNominationGroupLayout />
  </RequireAuth>
);

Component.displayName = "TalentNominationGroupLayout";

export default Component;
