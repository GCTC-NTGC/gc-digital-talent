import { StoryFn, Meta } from "@storybook/react-vite";

import { fakePools } from "@gc-digital-talent/fake-data";
import {
  makeFragmentData,
  Pool,
  PoolAreaOfSelection,
  PoolSelectionLimitation,
} from "@gc-digital-talent/graphql";

import JobCard, { JobCard_Fragment } from "./JobCard";

/*

1. Open to the public
2. Open to the public + Canadian citizens
3. Open to employees
4. Open to employees + At level
5. Open to employees + Departmental preference
6. Open to employees + At level + Departmental preference

*/

const open = {
  value: PoolAreaOfSelection.Public,
  label: {
    en: "Public",
    fr: "Public FR",
  },
};

const citizen = {
  value: PoolSelectionLimitation.CanadianCitizens,
  label: {
    en: "Canadian citizen",
    fr: "Canadian citizen FR",
  },
};

const employee = {
  value: PoolAreaOfSelection.Employees,
  label: {
    en: "Employees",
    fr: "Employees FR",
  },
};

const atLevel = {
  value: PoolSelectionLimitation.AtLevelOnly,
  label: {
    en: "At-level",
    fr: "At-level FR",
  },
};

const departmentPref = {
  value: PoolSelectionLimitation.DepartmentalPreference,
  label: {
    en: "Departmental preference",
    fr: "Departmental preference FR",
  },
};

const fakedPools = fakePools();
const fakedPool = fakedPools[0];

const nullPool: Omit<Pool, "activities" | "teamId"> = {
  __typename: "Pool",
  id: "uuid",
};

export default {
  component: JobCard,
  args: {
    poolQuery: makeFragmentData(fakedPool, JobCard_Fragment),
  },
} as Meta;

const Template: StoryFn<typeof JobCard> = (args) => <JobCard {...args} />;

export const Open = Template.bind({});
Open.args = {
  poolQuery: makeFragmentData(
    {
      ...fakedPool,
      areaOfSelection: open,
      selectionLimitations: [],
    },
    JobCard_Fragment,
  ),
};

export const Citizen = Template.bind({});
Citizen.args = {
  poolQuery: makeFragmentData(
    {
      ...fakedPool,
      areaOfSelection: open,
      selectionLimitations: [citizen],
    },
    JobCard_Fragment,
  ),
};

export const Employee = Template.bind({});
Employee.args = {
  poolQuery: makeFragmentData(
    {
      ...fakedPool,
      areaOfSelection: employee,
    },
    JobCard_Fragment,
  ),
};

export const AtLevel = Template.bind({});
AtLevel.args = {
  poolQuery: makeFragmentData(
    {
      ...fakedPool,
      areaOfSelection: employee,
      selectionLimitations: [atLevel],
    },
    JobCard_Fragment,
  ),
};

export const Departmental = Template.bind({});
Departmental.args = {
  poolQuery: makeFragmentData(
    {
      ...fakedPool,
      areaOfSelection: employee,
      selectionLimitations: [departmentPref],
    },
    JobCard_Fragment,
  ),
};

export const All = Template.bind({});
All.args = {
  poolQuery: makeFragmentData(
    {
      ...fakedPool,
      areaOfSelection: employee,
      selectionLimitations: [atLevel, departmentPref],
    },
    JobCard_Fragment,
  ),
};

export const Null = Template.bind({});
Null.args = {
  poolQuery: makeFragmentData(nullPool, JobCard_Fragment),
};
