import React from "react";
import { useIntl } from "react-intl";
import { useLocation, useNavigate } from "react-router-dom";
import { SubmitHandler } from "react-hook-form";
import omit from "lodash/omit";
import kebabCase from "lodash/kebabCase";

import {
  BasicForm,
  Submit,
  TextArea,
  unpackIds,
} from "@gc-digital-talent/forms";
import { toast } from "@gc-digital-talent/toast";
import { errorMessages } from "@gc-digital-talent/i18n";
import { Link } from "@gc-digital-talent/ui";

import {
  Scalars,
  Team,
  UpdateTeamInput,
  UpdateTeamMutation,
  LocalizedStringInput,
  Maybe,
  Department,
} from "~/api/generated";
import useRoutes from "~/hooks/useRoutes";

import CreateTeamFormFields from "../../CreateTeamPage/components/CreateTeamFormFields";

const TEXT_AREA_ROWS = 4;
const TEXT_AREA_MAX_WORDS = 200;

type FormValues = {
  displayName?: Maybe<LocalizedStringInput>;
  description?: Maybe<LocalizedStringInput>;
  contactEmail?: Maybe<Scalars["Email"]>;
  departments?: Array<Scalars["UUID"]>;
};

const dataToFormValues = (data: Team): FormValues => {
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
  team: Team;
  departments?: Maybe<Array<Maybe<Omit<Department, "teams">>>>;
  onSubmit: (
    teamId: Scalars["UUID"],
    data: UpdateTeamInput,
  ) => Promise<UpdateTeamMutation["updateTeam"]>;
}

const UpdateTeamForm = ({
  team,
  departments,
  onSubmit,
}: UpdateTeamFormProps) => {
  const intl = useIntl();
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
      <div data-h2-flex-grid="base(center, x1, x1)">
        <CreateTeamFormFields departments={departments} />
        <div data-h2-flex-item="base(1/2)">
          <TextArea
            id="description_en"
            name="description.en"
            rows={TEXT_AREA_ROWS}
            wordLimit={TEXT_AREA_MAX_WORDS}
            label={intl.formatMessage({
              defaultMessage: "Team's short description (English)",
              id: "sSGgnI",
              description: "Label for team description in English language",
            })}
            rules={{
              required: intl.formatMessage(errorMessages.required),
            }}
          />
        </div>
        <div data-h2-flex-item="base(1/2)">
          <TextArea
            id="description_fr"
            name="description.fr"
            rows={TEXT_AREA_ROWS}
            wordLimit={TEXT_AREA_MAX_WORDS}
            label={intl.formatMessage({
              defaultMessage: "Team's short description (French)",
              id: "RSkJQR",
              description: "Label for team description in French language",
            })}
            rules={{
              required: intl.formatMessage(errorMessages.required),
            }}
          />
        </div>
      </div>
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
