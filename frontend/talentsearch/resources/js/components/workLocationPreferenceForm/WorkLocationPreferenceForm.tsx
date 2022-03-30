import { BasicForm, Checklist, TextArea } from "@common/components/form";
import { getworkRegionsDetailed } from "@common/constants/localizedConstants";
import { enumToOptions } from "@common/helpers/formUtils";
import { errorMessages } from "@common/messages";
import React from "react";
import { useIntl } from "react-intl";
import {
  CreateUserInput,
  CreateWorkLocationPreferenceMutation,
  useCreateWorkLocationPreferenceMutation,
  WorkRegion,
} from "../../api/generated";
import ProfileFormFooter from "../applicantProfile/ProfileFormFooter";
import ProfileFormWrapper from "../applicantProfile/ProfileFormWrapper";

// export type FormValues = Pick<
//   CreateUserInput,
//   "locationPreferences" | "locationExemptions"
// >;

export type FormValues = CreateUserInput;

export interface WorkLocationPreferenceFormProps {
  handleSubmit: (
    data: FormValues,
  ) => Promise<CreateWorkLocationPreferenceMutation["createUser"]>;
}

export const WorkLocationPreferenceForm: React.FC<
  WorkLocationPreferenceFormProps
> = ({ handleSubmit }) => {
  const intl = useIntl();

  return (
    <ProfileFormWrapper
      description={intl.formatMessage({
        defaultMessage:
          "Indicate all locations where you are willing to work, including your current location (if you are interested in working there).",
        description:
          "Description text for Profile Form wrapper  in Work Location Preferences Form",
      })}
      title={intl.formatMessage({
        defaultMessage: "Work location",
        description:
          "Title for Profile Form wrapper  in Work Location Preferences Form",
      })}
      crumbs={[
        {
          title: intl.formatMessage({
            defaultMessage: "Work Location Preference",
            description:
              "Display Text for the current page in Work Location Preference Form Page",
          }),
        },
      ]}
    >
      <BasicForm onSubmit={handleSubmit}>
        <div>
          <div data-h2-flex-item="b(1of1)" data-h2-padding="b(top, m)">
            <div data-h2-padding="b(right, l)" data-testid="workLocation">
              <Checklist
                idPrefix="work-location"
                legend={intl.formatMessage({
                  defaultMessage: "Work location",
                  description:
                    "Legend for optional work preferences check list in work preferences form",
                })}
                name="workLocations"
                items={enumToOptions(WorkRegion).map(({ value }) => ({
                  value,
                  label: intl.formatMessage(getworkRegionsDetailed(value)),
                }))}
                rules={{ required: intl.formatMessage(errorMessages.required) }}
              />
            </div>
          </div>
          <div data-h2-flex-item="b(1of1)" data-h2-padding="b(top, m)">
            <div data-h2-padding="b(right, l)">
              <p>
                Indicate if there is a city that you would like to exclude from
                a region.
              </p>
              <p data-h2-font-color="b([dark]gray)">
                E.g.: You want to be considered for the Quebec region, but not
                for Montréal.
              </p>
            </div>
          </div>
          <div data-h2-flex-item="b(1of2)" data-h2-padding="b(top, m)">
            <div data-h2-padding="b(right, l)">
              <TextArea
                id="location-exemptions"
                label="Location exemptions"
                name="locationExemption"
                placeholder="Optionally, add a city or village here..."
              />
            </div>
          </div>
        </div>
        <ProfileFormFooter mode="saveButton" />
      </BasicForm>
    </ProfileFormWrapper>
  );
};

export const WorkLocationPreferenceApi: React.FunctionComponent = () => {
  const [, executeMutation] = useCreateWorkLocationPreferenceMutation();
  const handleCreateUser = (data: CreateUserInput) =>
    executeMutation({ user: data }).then((result) => {
      if (result.data?.createUser) {
        return result.data?.createUser;
      }
      return Promise.reject(result.error);
    });

  return <WorkLocationPreferenceForm handleSubmit={handleCreateUser} />;
};
