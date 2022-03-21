import React from "react";
import { useIntl } from "react-intl";
import { errorMessages } from "@common/messages";
import { BasicForm, Checklist, RadioGroup } from "@common/components/form";
import { getLocale } from "@common/helpers/localize";
import { OperationalRequirement } from "../../api/generated";
import ProfileFormWrapper from "../applicantProfile/ProfileFormWrapper";
import ProfileFormFooter from "../applicantProfile/ProfileFormFooter";

export type FormValues = {
  requiredWorkPreferences: string;
  optionalWorkPreferences: string[];
};

export const WorkPreferencesForm: React.FunctionComponent<{
  operationalRequirements: OperationalRequirement[];
  handleSubmit: (data: FormValues) => Promise<void>;
}> = ({ operationalRequirements, handleSubmit }) => {
  const intl = useIntl();
  const locale = getLocale(intl);

  const preferencesItems: { value: string; label: string }[] =
    operationalRequirements.map((requirement) => {
      return {
        value: requirement.id,
        label:
          requirement.name[locale] ||
          intl.formatMessage({
            defaultMessage: "Error: operational requirement name not found.",
            description:
              "Error message if OperationalRequirement name is not defined.",
          }),
      };
    });
  return (
    <ProfileFormWrapper
      description={intl.formatMessage({
        defaultMessage:
          "Certain jobs require you to work odd hours or perform tasks that are a little outside of the normal. Please indicate which special requirements you are comfortable with.",
        description:
          "Description text for Profile Form wrapper  in Work Preferences Form",
      })}
      title={intl.formatMessage({
        defaultMessage: "Work preferences",
        description: "Title for Profile Form wrapper  in Work Preferences Form",
      })}
      crumbs={[
        {
          title: intl.formatMessage({
            defaultMessage: "Work Preferences",
            description: "Display Text for Work Preferences Form Page Link",
          }),
        },
      ]}
    >
      <BasicForm
        onSubmit={(fieldValues: FormValues) => {
          // TODO: massage fieldValues to match what the API mutation expects
          return handleSubmit(fieldValues);
        }}
      >
        <div>
          <div data-h2-flex-item="b(1of1)" data-h2-padding="b(top, m)">
            <div data-h2-padding="b(right, l)">
              <RadioGroup
                idPrefix="required-work-preferences"
                legend={intl.formatMessage({
                  defaultMessage:
                    "I would consider accepting a job that lasts for...",
                  description:
                    "Legend Text for required work preferences options in work preferences form",
                })}
                name="requiredWorkPreferences"
                rules={{ required: intl.formatMessage(errorMessages.required) }}
                items={[
                  {
                    value: "any-duration",
                    label: intl.formatMessage({
                      defaultMessage:
                        "...any duration (short term, long term, or indeterminate duration)",
                      description:
                        "Label displayed on Work Preferences form for any duration option",
                    }),
                  },
                  {
                    value: "only-indeterminate",
                    label: intl.formatMessage({
                      defaultMessage:
                        "...only those of an indeterminate duration. (permanent)",
                      description:
                        "Label displayed on Work Preferences form for indeterminate duration option.",
                    }),
                  },
                ]}
              />
            </div>
          </div>
          <div data-h2-flex-item="b(1of1)" data-h2-padding="b(top, m)">
            <div data-h2-padding="b(right, l)">
              <Checklist
                idPrefix="optional-work-preferences"
                legend={intl.formatMessage({
                  defaultMessage:
                    "I would consider accepting a job that requires…",
                  description:
                    "Legend for optional work preferences check list in work preferences form",
                })}
                name="optionalWorkPreferences"
                items={preferencesItems}
              />
            </div>
          </div>
          <div data-h2-flex-item="b(1of1)" data-h2-padding="b(top, m)">
            <div data-h2-padding="b(right, l)">
              <ProfileFormFooter mode="saveButton" />
            </div>
          </div>
        </div>
      </BasicForm>
    </ProfileFormWrapper>
  );
};

export default WorkPreferencesForm;
