import React from "react";
import { useIntl } from "react-intl";
import { useLocation, useNavigate } from "react-router-dom";
import { SubmitHandler } from "react-hook-form";
import omit from "lodash/omit";
import kebabCase from "lodash/kebabCase";

import { BasicForm, Submit, unpackIds } from "@gc-digital-talent/forms";
import { toast } from "@gc-digital-talent/toast";
import { Link } from "@gc-digital-talent/ui";
import {
  Scalars,
  UpdateTeamInput,
  UpdateTeamMutation,
  LocalizedStringInput,
  Maybe,
  Department,
  graphql,
  FragmentType,
  getFragment,
  UpdateTeamPage_TeamFragment as UpdateTeamPageFragmentType,
} from "@gc-digital-talent/graphql";

import useRoutes from "~/hooks/useRoutes";

import CreateTeamFormFields from "../../CreateTeamPage/components/CreateTeamFormFields";

export const UpdateTeamPage_TeamFragment = graphql(/* GraphQL */ `
  fragment UpdateTeamPage_Team on Team {
    id
    name
    contactEmail
    displayName {
      en
      fr
    }
    departments {
      id
      departmentNumber
      name {
        en
        fr
      }
    }
    description {
      en
      fr
    }
  }
`);

export type UpdateTeamPageFragment = FragmentType<
  typeof UpdateTeamPage_TeamFragment
>;

type FormValues = {
  displayName?: Maybe<LocalizedStringInput>;
  description?: Maybe<LocalizedStringInput>;
  contactEmail?: Maybe<Scalars["Email"]["output"]>;
  departments?: Array<Scalars["UUID"]["output"]>;
};

const dataToFormValues = (data: UpdateTeamPageFragmentType): FormValues => {
  const { departments, displayName, description, ...rest } = data;
  return {
    ...omit(rest, ["id", "__typename", "roleAssignments"]),
    displayName: omit(displayName, "__typename"),
    description: omit(description, "__typename"),
    departments: unpackIds(departments),
  };
};

const formValuesToSubmitData = (data: FormValues): UpdateTeamInput => {
  const { departments, displayName, ...rest } = data;
  return {
    ...rest,
    displayName,
    name: kebabCase(displayName?.en || ""),
    departments: { sync: departments },
  };
};

export interface UpdateTeamFormProps {
  teamQuery: UpdateTeamPageFragment;
  departments?: Maybe<Array<Maybe<Omit<Department, "teams">>>>;
  onSubmit: (
    teamId: Scalars["UUID"]["output"],
    data: UpdateTeamInput,
  ) => Promise<UpdateTeamMutation["updateTeam"]>;
}

const UpdateTeamForm = ({
  teamQuery,
  departments,
  onSubmit,
}: UpdateTeamFormProps) => {
  const intl = useIntl();
  const team = getFragment(UpdateTeamPage_TeamFragment, teamQuery);
  const paths = useRoutes();
  const navigate = useNavigate();

  const { state } = useLocation();
  const navigateTo = state?.from ?? paths.teamTable();

  const handleSubmit: SubmitHandler<FormValues> = async (data) => {
    return onSubmit(team.id, formValuesToSubmitData(data))
      .then(() => {
        navigate(navigateTo);
        toast.success(
          intl.formatMessage({
            defaultMessage: "Team updated successfully!",
            id: "2ni0ia",
            description: "Message displayed after a team is updated",
          }),
        );
      })
      .catch(() => {
        toast.error(
          intl.formatMessage({
            defaultMessage: "Error: updating team failed",
            id: "h486wf",
            description: "Messaged displayed after updating team fails",
          }),
        );
      });
  };

  return (
    <BasicForm
      onSubmit={handleSubmit}
      options={{
        defaultValues: dataToFormValues(team),
      }}
    >
      <CreateTeamFormFields departments={departments} />

      <div
        data-h2-display="base(flex)"
        data-h2-gap="base(x1)"
        data-h2-align-items="base(center)"
      >
        <Link mode="inline" href={navigateTo}>
          {intl.formatMessage({
            defaultMessage: "Cancel and go back to teams",
            id: "i0IT1I",
            description: "Link text to cancel updating a team",
          })}
        </Link>
        <Submit
          text={intl.formatMessage({
            defaultMessage: "Save team information",
            id: "gBKyL2",
            description: "Button text for the update team form submit button",
          })}
        />
      </div>
    </BasicForm>
  );
};

export default UpdateTeamForm;
