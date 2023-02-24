import React from "react";
import { useIntl } from "react-intl";
import { useNavigate } from "react-router-dom";
import { SubmitHandler } from "react-hook-form";
import omit from "lodash/omit";

import {
  BasicForm,
  Input,
  Submit,
  TextArea,
  MultiSelectField,
  unpackIds,
  countNumberOfWords,
} from "@gc-digital-talent/forms";
import { toast } from "@gc-digital-talent/toast";
import { errorMessages, getLocalizedName } from "@gc-digital-talent/i18n";
import { Link } from "@gc-digital-talent/ui";
import { notEmpty } from "@gc-digital-talent/helpers";

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

import NameField from "./NameField";
import DescriptionWordCounter, {
  TEXT_AREA_MAX_WORDS,
} from "./DescriptionWordCounter";

const TEXT_AREA_ROWS = 4;

type FormValues = {
  name: string;
  displayName?: Maybe<LocalizedStringInput>;
  description?: Maybe<LocalizedStringInput>;
  contactEmail?: Maybe<Scalars["Email"]>;
  departments?: Array<Scalars["UUID"]>;
};

const dataToFormValues = (data: Team): FormValues => {
  const { departments, displayName, description, ...rest } = data;
  return {
    ...omit(rest, ["id", "__typename"]),
    displayName: omit(displayName, "__typename"),
    description: omit(description, "__typename"),
    departments: unpackIds(departments),
  };
};

const formValuesToSubmitData = (data: FormValues): UpdateTeamInput => {
  const { departments, ...rest } = data;
  return {
    ...rest,
    departments: { sync: departments },
  };
};

interface UpdateTeamFormProps {
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

  const handleSubmit: SubmitHandler<FormValues> = async (data) => {
    return onSubmit(team.id, formValuesToSubmitData(data))
      .then(() => {
        navigate(paths.teamTable());
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

  const departmentOptions = departments?.filter(notEmpty).map((department) => ({
    value: department.id,
    label: getLocalizedName(department.name, intl),
  }));

  return (
    <BasicForm
      onSubmit={handleSubmit}
      options={{
        defaultValues: dataToFormValues(team),
      }}
    >
      <div data-h2-flex-grid="base(center, x1, 0)">
        <NameField />
        <div data-h2-flex-item="base(1/2)">
          <MultiSelectField
            id="departments"
            name="departments"
            label={intl.formatMessage({
              defaultMessage: "Departments",
              id: "ytHvhD",
              description: "Label for the team departments input",
            })}
            placeholder={intl.formatMessage({
              defaultMessage: "Select on or more departments...",
              id: "jzax3k",
              description: "Placeholder text for the team departments input",
            })}
            rules={{
              required: intl.formatMessage(errorMessages.required),
            }}
            options={departmentOptions}
          />
        </div>
        <div data-h2-flex-item="base(1/2)">
          <Input
            type="email"
            id="contactEmail"
            name="contactEmail"
            label={intl.formatMessage({
              defaultMessage: "Contact email",
              id: "PhrOLp",
              description: "Label for the French team display name input",
            })}
            placeholder={intl.formatMessage({
              defaultMessage: "contact@email.com",
              id: "hTzoAW",
              description:
                "Placeholder email format example for team contact email input",
            })}
            rules={{
              required: intl.formatMessage(errorMessages.required),
            }}
          />
        </div>
        <div data-h2-flex-item="base(1/2)">
          <TextArea
            id="description_en"
            name="description.en"
            rows={TEXT_AREA_ROWS}
            label={intl.formatMessage({
              defaultMessage: "Organization's short description (English)",
              id: "TCQhlo",
              description: "Label for the English team description input",
            })}
            rules={{
              required: intl.formatMessage(errorMessages.required),
              validate: {
                wordCount: (value: string) =>
                  countNumberOfWords(value) <= TEXT_AREA_MAX_WORDS ||
                  intl.formatMessage(errorMessages.overWordLimit, {
                    value: TEXT_AREA_MAX_WORDS,
                  }),
              },
            }}
          />
          <DescriptionWordCounter name="description.en" />
        </div>
        <div data-h2-flex-item="base(1/2)">
          <TextArea
            id="description_fr"
            name="description.fr"
            rows={TEXT_AREA_ROWS}
            label={intl.formatMessage({
              defaultMessage: "Organization's short description (French)",
              id: "RtDf2h",
              description: "Label for the French team description input",
            })}
            rules={{
              required: intl.formatMessage(errorMessages.required),
              validate: {
                wordCount: (value: string) =>
                  countNumberOfWords(value) <= TEXT_AREA_MAX_WORDS ||
                  intl.formatMessage(errorMessages.overWordLimit, {
                    value: TEXT_AREA_MAX_WORDS,
                  }),
              },
            }}
          />
          <DescriptionWordCounter name="description.fr" />
        </div>
      </div>
      <div
        data-h2-display="base(flex)"
        data-h2-gap="base(x1)"
        data-h2-align-items="base(center)"
      >
        <Submit
          text={intl.formatMessage({
            defaultMessage: "Save team information",
            id: "gBKyL2",
            description: "Button text for the update team form submit button",
          })}
        />
        <Link href={paths.teamTable()}>
          {intl.formatMessage({
            defaultMessage: "Cancel and go back to teams",
            id: "i0IT1I",
            description: "Link text to cancel updating a team",
          })}
        </Link>
      </div>
    </BasicForm>
  );
};

export default UpdateTeamForm;
