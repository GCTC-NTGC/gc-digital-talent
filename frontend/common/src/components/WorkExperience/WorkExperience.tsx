import React, { useState } from "react";
import { useIntl } from "react-intl";
import { Checkbox } from "../form/Checkbox";
import { Input } from "../form/Input";

export const WorkExperience = () => {
  const rules = { required: true };
  const intl = useIntl();

  // given that the current role state needs to effect whether an end date is required according to the wireframe, here is something to handle that
  // default state is required as box is unchecked by default, onChange in the toggle input calls the function to flip its state which is then called in the end date input
  // adjusting required or not
  const [checkboxState, setCheckbox] = useState({ required: true });
  const checkboxToggle = () => {
    if (checkboxState.required === true) {
      setCheckbox({ required: false });
    } else {
      setCheckbox({ required: true });
    }
  };

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
        onChange={checkboxToggle}
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

      <Input
        id="pending"
        label={intl.formatMessage({
          defaultMessage: "End Date",
          description:
            "Label displayed on Work Experience form for end date input",
        })}
        name="end-date"
        type="date"
        rules={checkboxState}
        hideOptional
      />
    </div>
  );
};

export default WorkExperience;
