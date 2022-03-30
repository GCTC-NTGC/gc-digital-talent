import { BasicForm, Checklist, TextArea } from "@common/components/form";
// import { getWorkPreferenceregion } from "@common/constants/localizedConstants";
import { enumToOptions } from "@common/helpers/formUtils";
import { errorMessages } from "@common/messages";
import React from "react";
import { SubmitHandler } from "react-hook-form";
import { MessageDescriptor, useIntl, defineMessages } from "react-intl";
import { navigate } from "@common/helpers/router";
import { toast } from "react-toastify";
import { getOrThrowError } from "@common/helpers/util";
import { useApplicantProfileRoutes } from "../../applicantProfileRoutes";
import {
  CreateUserInput,
  CreateWorkLocationPreferenceMutation,
  useCreateWorkLocationPreferenceMutation,
  WorkRegion,
} from "../../api/generated";
import ProfileFormFooter from "../applicantProfile/ProfileFormFooter";
import ProfileFormWrapper from "../applicantProfile/ProfileFormWrapper";

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
  const paths = useApplicantProfileRoutes();
  const onSubmit: SubmitHandler<FormValues> = async (data: FormValues) => {
    return handleSubmit(data)
      .then(() => {
        navigate(paths.home());
        toast.success(
          intl.formatMessage({
            defaultMessage: "Work location preferences  saved successfully!",
            description:
              "Message displayed to user after work location preferences  saved successfully!",
          }),
        );
      })
      .catch(() => {
        toast.error(
          intl.formatMessage({
            defaultMessage: "Error: Something went wrong! Please try again!",
            description:
              "Message displayed to user after work location preferences  not saved successfully!",
          }),
        );
      });
  };
  const workRegionsForWorkPreferenceForm = defineMessages({
    [WorkRegion.Telework]: {
      defaultMessage: "Virtual: Work from home, anywhere in Canada.",
      description: "The work region of Canada described as Telework.",
    },
    [WorkRegion.NationalCapital]: {
      defaultMessage: "National Capital Region: Ottawa, ON and Gatineau, QC.",
      description: "The work region of Canada described as National Capital.",
    },
    [WorkRegion.Atlantic]: {
      defaultMessage:
        "Atlantic Region: New Brunswick, Newfoundland and Labrador, Nova Scotia and Prince Edward Island.",
      description: "The work region of Canada described as Atlantic.",
    },
    [WorkRegion.Quebec]: {
      defaultMessage: "Quebec Region: excluding Gatineau.",
      description: "The work region of Canada described as Quebec.",
    },
    [WorkRegion.Ontario]: {
      defaultMessage: "Ontario Region: excluding Ottawa.",
      description: "The work region of Canada described as Ontario.",
    },
    [WorkRegion.Prairie]: {
      defaultMessage: "Prairie Region: Manitoba, Saskatchewan, Alberta.",
      description: "The work region of Canada described as Prairie.",
    },
    [WorkRegion.BritishColumbia]: {
      defaultMessage: "British Columbia Region",
      description: "The work region of Canada described as British Columbia.",
    },
    [WorkRegion.North]: {
      defaultMessage: "North Region: Yukon, Northwest Territories and Nunavut.",
      description: "The work region of Canada described as North.",
    },
  });

  const getWorkPreferenceregion = (
    workRegionId: string | number,
  ): MessageDescriptor =>
    getOrThrowError(
      workRegionsForWorkPreferenceForm,
      workRegionId,
      `Invalid Work Region '${workRegionId}'`,
    );

  return (
    <ProfileFormWrapper
      description="Indicate all locations where you are willing to work, including your current location (if you are interested in working there)."
      title="Work location"
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
      <BasicForm onSubmit={onSubmit}>
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
                  label: intl.formatMessage(getWorkPreferenceregion(value)),
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
