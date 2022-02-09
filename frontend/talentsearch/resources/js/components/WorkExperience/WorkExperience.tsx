import React from "react";
import { useIntl } from "react-intl";
import { useWatch } from "react-hook-form";
import { Input } from "@common/components/form/Input";
import { Checkbox } from "@common/components/form/Checkbox";

export const WorkExperience = () => {
  const rules = { required: true };
  const intl = useIntl();

  // to toggle whether End Date is required, the state of the Current Role checkbox must be monitored and have to adjust the form accordingly
  const isCurrent = useWatch({ name: "current-role", defaultValue: false });

  return (
    <div>
      <Input
        id="pending"
        label={intl.formatMessage({
          defaultMessage: "My Role",
          description: "Label displayed on Work Experience form for role input",
        })}
        name="role"
        type="text"
        rules={rules}
      />

      <Input
        id="pending"
        label={intl.formatMessage({
          defaultMessage: "Organization",
          description:
            "Label displayed on Work Experience form for organization input",
        })}
        name="organization"
        type="text"
        rules={rules}
      />

      <Input
        id="pending"
        label={intl.formatMessage({
          defaultMessage: "Team, Group, or Division",
          description:
            "Label displayed on Work Experience form for team/group/division input",
        })}
        name="team"
        type="text"
        hideOptional
      />

      <Checkbox
        id="pending"
        label={intl.formatMessage({
          defaultMessage: "Current Role",
          description:
            "Label displayed on Work Experience form for current role input",
        })}
        name="current-role"
      />

      <Input
        id="pending"
        label={intl.formatMessage({
          defaultMessage: "Start Date",
          description:
            "Label displayed on Work Experience form for start date input",
        })}
        name="start-date"
        type="date"
        rules={rules}
      />

      {/* conditionally render the end-date based off the state attached to the checkbox input */}
      {!isCurrent && (
        <Input
          id="pending"
          label={intl.formatMessage({
            defaultMessage: "End Date",
            description:
              "Label displayed on Work Experience form for end date input",
          })}
          name="end-date"
          type="date"
          rules={isCurrent ? {} : rules}
        />
      )}
    </div>
  );
};

export default WorkExperience;
