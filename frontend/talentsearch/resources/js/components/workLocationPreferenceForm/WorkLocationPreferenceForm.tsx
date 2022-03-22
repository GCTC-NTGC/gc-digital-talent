import { BasicForm, Checklist, TextArea } from "@common/components/form";
import { errorMessages } from "@common/messages";
import React from "react";
import { useIntl } from "react-intl";
import ProfileFormFooter from "../applicantProfile/ProfileFormFooter";
import ProfileFormWrapper from "../applicantProfile/ProfileFormWrapper";

export type FormValues = {
  workLocations: string[];
  locationExemptions: string;
};
export interface WorkLocationPreferenceFormProps {
  handleSubmit: (data: FormValues) => Promise<void>;
}
const WorkLocationPreferenceForm: React.FC<WorkLocationPreferenceFormProps> = ({
  handleSubmit,
}) => {
  const intl = useIntl();
  // function bold(msg: string) {
  //   return <span data-h2-font-weight="b(700)">{msg}</span>;
  // }

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
      <BasicForm
        onSubmit={(fieldValues: FormValues) => {
          return handleSubmit(fieldValues);
        }}
      >
        <div>
          <div data-h2-flex-item="b(1of1)" data-h2-padding="b(top, m)">
            <div data-h2-padding="b(right, l)">
              <Checklist
                idPrefix="work-location"
                legend={intl.formatMessage({
                  defaultMessage: "Work location",
                  description:
                    "Legend for optional work preferences check list in work preferences form",
                })}
                name="workLocations"
                items={[
                  {
                    value: "virtual",
                    label: intl.formatMessage({
                      defaultMessage:
                        "Virtual: Work from home, anywhere in Canada.",
                      description:
                        "Label for one of the check list item in Work Location Preference Form. ",
                    }),
                  },
                  {
                    value: "national-capital-region",
                    label: intl.formatMessage({
                      defaultMessage:
                        "National Capital Region: Ottawa, ON and Gatineau, QC.",
                      description:
                        "Label for one of the check list item in Work Location Preference Form. ",
                    }),
                  },
                  {
                    value: "atlantic-region",
                    label: intl.formatMessage({
                      defaultMessage:
                        "Atlantic Region: New Brunswick, Newfoundland and Labrador, Nova Scotia and Prince Edward Island.",
                      description:
                        "Label for one of the check list item in Work Location Preference Form. ",
                    }),
                  },
                  {
                    value: "quebec-region",
                    label: intl.formatMessage({
                      defaultMessage: "Quebec Region: excluding Gatineau.",
                      description:
                        "Label for one of the check list item in Work Location Preference Form. ",
                    }),
                  },
                  {
                    value: "ontario-region",
                    label: intl.formatMessage({
                      defaultMessage: "Ontario Region: excluding Ottawa.",
                      description:
                        "Label for one of the check list item in Work Location Preference Form. ",
                    }),
                  },
                  {
                    value: "prairie-region",
                    label: intl.formatMessage({
                      defaultMessage:
                        "Prairie Region: Manitoba, Saskatchewan, Alberta.",
                      description:
                        "Label for one of the check list item in Work Location Preference Form. ",
                    }),
                  },
                  {
                    value: "british-columbia-region",
                    label: intl.formatMessage({
                      defaultMessage: "<bold>British Columbia Region</bold>",
                      description:
                        "Label for one of the check list item in Work Location Preference Form. ",
                    }),
                  },
                  {
                    value: "north-region",
                    label: intl.formatMessage({
                      defaultMessage:
                        "<bold>North Region:</bold>Yukon, Northwest Territories and Nunavut.",
                      description:
                        "Label for one of the check list item in Work Location Preference Form. ",
                    }),
                  },
                ]}
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
                name="locationExemptions"
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

export default WorkLocationPreferenceForm;
