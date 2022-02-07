import React from "react";
import { Checkbox } from "../form/Checkbox";
import { Input } from "../form/Input";

export const WorkExperience = () => {
  const rules = { required: true };
  return (
    <div>
      <Input
        id="pending"
        label="My Role"
        name="role"
        type="text"
        rules={rules}
      />

      <Input
        id="pending"
        label="Organization"
        name="organization"
        type="text"
        rules={rules}
      />

      <Input
        id="pending"
        label="Team, Group or Division"
        name="team"
        type="text"
        hideOptional
      />

      <Checkbox id="pending" label="Current Role" name="current-role" />

      <Input
        id="pending"
        label="Start Date"
        name="start-date"
        type="date"
        rules={rules}
      />

      <Input
        id="pending"
        label="End Date"
        name="end-date"
        type="date"
        rules={rules}
      />
    </div>
  );
};

export default WorkExperience;
