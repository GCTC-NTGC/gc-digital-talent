import * as React from "react";
import { useIntl } from "react-intl";
import { BuildingOffice2Icon } from "@heroicons/react/24/outline";

import { Pending } from "@gc-digital-talent/ui";
import { notEmpty } from "@gc-digital-talent/helpers";

import {
  CreateTeamInput,
  useDepartmentsQuery,
  useCreateTeamMutation,
} from "~/api/generated";

import PageHeader from "~/components/PageHeader";
import SEO from "~/components/SEO/SEO";
import useRoutes from "~/hooks/useRoutes";
import AdminContentWrapper from "~/components/AdminContentWrapper/AdminContentWrapper";

import CreateTeamForm from "./components/CreateTeamForm";

const CreateTeamPage = () => {
  const intl = useIntl();
  const routes = useRoutes();

  const [
    {
      data: departmentsData,
      fetching: departmentsFetching,
      error: departmentsError,
    },
  ] = useDepartmentsQuery();
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
      label: intl.formatMessage({
        defaultMessage: "Teams",
        id: "P+KWP7",
        description: "Breadcrumb title for the teams page link.",
      }),
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
    <AdminContentWrapper crumbs={navigationCrumbs}>
      <Pending fetching={departmentsFetching} error={departmentsError}>
        <SEO title={pageTitle} />
        <PageHeader icon={BuildingOffice2Icon}>{pageTitle}</PageHeader>
        <p>
          {intl.formatMessage({
            defaultMessage: "Create a new team from scratch",
            id: "XaYhX3",
            description:
              "Descriptive text for the create team page in the admin portal.",
          })}
        </p>
        <hr
          data-h2-margin="base(x1, 0, x1, 0)"
          data-h2-height="base(1px)"
          data-h2-background-color="base(gray)"
          data-h2-border="base(none)"
        />
        <CreateTeamForm departments={departments} onSubmit={handleSubmit} />
      </Pending>
    </AdminContentWrapper>
  );
};

export default CreateTeamPage;
