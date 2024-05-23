import { defineMessage, useIntl } from "react-intl";
import { useMutation, useQuery } from "urql";

import { Pending } from "@gc-digital-talent/ui";
import { unpackMaybes } from "@gc-digital-talent/helpers";
import { graphql, CreateTeamInput } from "@gc-digital-talent/graphql";
import { ROLE_NAME } from "@gc-digital-talent/auth";

import SEO from "~/components/SEO/SEO";
import useRoutes from "~/hooks/useRoutes";
import AdminContentWrapper from "~/components/AdminContentWrapper/AdminContentWrapper";
import { pageTitle as indexTeamPageTitle } from "~/pages/Teams/IndexTeamPage/IndexTeamPage";
import AdminHero from "~/components/Hero/AdminHero";
import useBreadcrumbs from "~/hooks/useBreadcrumbs";
import RequireAuth from "~/components/RequireAuth/RequireAuth";

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
  defaultMessage: "Create a new team",
  id: "vyyfX6",
  description: "Page title for the create team page",
});

const subtitle = defineMessage({
  defaultMessage: "Create a new team from scratch",
  id: "XaYhX3",
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
      return Promise.reject(result.error);
    });
  };

  const navigationCrumbs = useBreadcrumbs({
    crumbs: [
      {
        label: intl.formatMessage(indexTeamPageTitle),
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
    isAdmin: true,
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
