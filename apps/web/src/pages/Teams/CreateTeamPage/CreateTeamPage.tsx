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

import CreateTeamForm from "./components/CreateTeamForm";

const CreateTeamPage = () => {
  const intl = useIntl();

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

  return (
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
  );
};

export default CreateTeamPage;
