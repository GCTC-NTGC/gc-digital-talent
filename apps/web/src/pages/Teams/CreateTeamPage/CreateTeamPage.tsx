import * as React from "react";
import { useIntl } from "react-intl";
import { useQuery } from "urql";

import { Pending } from "@gc-digital-talent/ui";
import { notEmpty } from "@gc-digital-talent/helpers";
import { graphql } from "@gc-digital-talent/graphql";

import { CreateTeamInput, useCreateTeamMutation } from "~/api/generated";
import SEO from "~/components/SEO/SEO";
import useRoutes from "~/hooks/useRoutes";
import AdminContentWrapper from "~/components/AdminContentWrapper/AdminContentWrapper";
import { pageTitle as indexTeamPageTitle } from "~/pages/Teams/IndexTeamPage/IndexTeamPage";
import AdminHero from "~/components/Hero/AdminHero";

import CreateTeamForm from "./components/CreateTeamForm";

const CreateTeamDepartments_Query = graphql(/* GraphQL */ `
  query CreateTeamDepartments {
    departments {
      id
      departmentNumber
      name {
        en
        fr
      }
    }
  }
`);

const CreateTeamPage = () => {
  const intl = useIntl();
  const routes = useRoutes();

  const [
    {
      data: departmentsData,
      fetching: departmentsFetching,
      error: departmentsError,
    },
  ] = useQuery({
    query: CreateTeamDepartments_Query,
  });
  const [, executeMutation] = useCreateTeamMutation();

  const departments = departmentsData?.departments.filter(notEmpty);

  const pageTitle = intl.formatMessage({
    defaultMessage: "Create a new team",
    id: "vyyfX6",
    description: "Page title for the create team page",
  });

  const handleSubmit = async (data: CreateTeamInput) => {
    return executeMutation({
      team: data,
    }).then((result) => {
      if (result.data?.createTeam) {
        return Promise.resolve(result.data?.createTeam);
      }
      return Promise.reject(result.error);
    });
  };

  const navigationCrumbs = [
    {
      label: intl.formatMessage({
        defaultMessage: "Home",
        id: "EBmWyo",
        description: "Link text for the home link in breadcrumbs.",
      }),
      url: routes.adminDashboard(),
    },
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
  ];

  return (
    <>
      <SEO title={pageTitle} />
      <AdminHero
        title={pageTitle}
        subtitle={intl.formatMessage({
          defaultMessage: "Create a new team from scratch",
          id: "XaYhX3",
          description:
            "Descriptive text for the create team page in the admin portal.",
        })}
        nav={{ mode: "crumbs", items: navigationCrumbs }}
      />
      <AdminContentWrapper>
        <Pending fetching={departmentsFetching} error={departmentsError}>
          <CreateTeamForm departments={departments} onSubmit={handleSubmit} />
        </Pending>
      </AdminContentWrapper>
    </>
  );
};

export default CreateTeamPage;
