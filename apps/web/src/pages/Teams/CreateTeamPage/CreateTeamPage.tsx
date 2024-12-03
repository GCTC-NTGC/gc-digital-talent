import { defineMessage, useIntl } from "react-intl";
import { useMutation, useQuery } from "urql";

import { Pending } from "@gc-digital-talent/ui";
import { unpackMaybes } from "@gc-digital-talent/helpers";
import { graphql, CreateTeamInput } from "@gc-digital-talent/graphql";
import { ROLE_NAME } from "@gc-digital-talent/auth";

import SEO from "~/components/SEO/SEO";
import useRoutes from "~/hooks/useRoutes";
import AdminContentWrapper from "~/components/AdminContentWrapper/AdminContentWrapper";
import AdminHero from "~/components/HeroDeprecated/AdminHero";
import useBreadcrumbs from "~/hooks/useBreadcrumbs";
import RequireAuth from "~/components/RequireAuth/RequireAuth";
import pageTitles from "~/messages/pageTitles";

import CreateTeamForm from "./components/CreateTeamForm";

const CreateTeamDepartments_Query = graphql(/* GraphQL */ `
  query CreateTeamDepartments {
    departments {
      ...TeamDepartmentOption
    }
  }
`);

const CreateTeam_Mutation = graphql(/* GraphQL */ `
  mutation CreateTeam($team: CreateTeamInput!) {
    createTeam(team: $team) {
      id
    }
  }
`);

const pageTitle = defineMessage({
  defaultMessage: "Create a team",
  id: "CkrBWY",
  description: "Page title for the create team page",
});

const subtitle = defineMessage({
  defaultMessage: "Create a team from scratch",
  id: "mBeY2F",
  description: "Descriptive text for the create team page in the admin portal.",
});

const CreateTeamPage = () => {
  const intl = useIntl();
  const routes = useRoutes();

  const [{ data, fetching, error }] = useQuery({
    query: CreateTeamDepartments_Query,
  });
  const [, executeMutation] = useMutation(CreateTeam_Mutation);

  const formattedPageTitle = intl.formatMessage(pageTitle);
  const formattedSubTitle = intl.formatMessage(subtitle);

  const handleSubmit = async (values: CreateTeamInput) => {
    return executeMutation({
      team: values,
    }).then((result) => {
      if (result.data?.createTeam) {
        return Promise.resolve(result.data?.createTeam);
      }
      return Promise.reject(new Error(result.error?.toString()));
    });
  };

  const navigationCrumbs = useBreadcrumbs({
    crumbs: [
      {
        label: intl.formatMessage(pageTitles.teams),
        url: routes.teamTable(),
      },
      {
        label: intl.formatMessage({
          defaultMessage: "Create<hidden> team</hidden>",
          id: "o7SM7j",
          description: "Breadcrumb title for the create team page link.",
        }),
        url: routes.teamCreate(),
      },
    ],
  });

  return (
    <>
      <SEO title={formattedPageTitle} description={formattedSubTitle} />
      <AdminHero
        title={formattedPageTitle}
        subtitle={formattedSubTitle}
        nav={{ mode: "crumbs", items: navigationCrumbs }}
      />
      <AdminContentWrapper>
        <Pending fetching={fetching} error={error}>
          <CreateTeamForm
            departmentsQuery={unpackMaybes(data?.departments)}
            onSubmit={handleSubmit}
          />
        </Pending>
      </AdminContentWrapper>
    </>
  );
};

export const Component = () => (
  <RequireAuth roles={[ROLE_NAME.CommunityManager, ROLE_NAME.PlatformAdmin]}>
    <CreateTeamPage />
  </RequireAuth>
);

Component.displayName = "AdminCreateTeamPage";

export default CreateTeamPage;
