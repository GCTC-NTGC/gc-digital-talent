import { StoryFn, Meta } from "@storybook/react-vite";
import { faker } from "@faker-js/faker";

import { fakePools } from "@gc-digital-talent/fake-data";
import {
  makeFragmentData,
  Pool,
  PoolAreaOfSelection,
  PoolSelectionLimitation,
} from "@gc-digital-talent/graphql";
import { allModes } from "@gc-digital-talent/storybook-helpers";

import JobCard, { JobCard_Fragment } from "./JobCard";

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
  parameters: {
    chromatic: {
      modes: {
        light: allModes.light,
        "light mobile": allModes["light mobile"],
        dark: allModes.dark,
        "dark mobile": allModes["dark mobile"],
      },
    },
    design: {
      type: "figma",
      url: "https://www.figma.com/design/1ibVEEPTPTHbjifAgmcoGW/Browse-jobs--All-users-?node-id=375-1724&m=dev",
    },
  },
} as Meta;

const Template: StoryFn<typeof JobCard> = (args) => <JobCard {...args} />;

export const Public = Template.bind({});
Public.args = {
  poolQuery: makeFragmentData(
    {
      ...fakedPool,
      areaOfSelection: {
        value: PoolAreaOfSelection.Public,
      },
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
      areaOfSelection: {
        value: PoolAreaOfSelection.Public,
      },
      selectionLimitations: [
        {
          value: PoolSelectionLimitation.CanadianCitizens,
        },
      ],
    },
    JobCard_Fragment,
  ),
};

export const Employee = Template.bind({});
Employee.args = {
  poolQuery: makeFragmentData(
    {
      ...fakedPool,
      areaOfSelection: {
        value: PoolAreaOfSelection.Employees,
      },
    },
    JobCard_Fragment,
  ),
};

export const AtLevel = Template.bind({});
AtLevel.args = {
  poolQuery: makeFragmentData(
    {
      ...fakedPool,
      areaOfSelection: {
        value: PoolAreaOfSelection.Employees,
      },
      selectionLimitations: [
        {
          value: PoolSelectionLimitation.AtLevelOnly,
        },
      ],
    },
    JobCard_Fragment,
  ),
};

export const Departmental = Template.bind({});
Departmental.args = {
  poolQuery: makeFragmentData(
    {
      ...fakedPool,
      areaOfSelection: {
        value: PoolAreaOfSelection.Employees,
      },
      selectionLimitations: [
        { value: PoolSelectionLimitation.DepartmentalPreference },
      ],
    },
    JobCard_Fragment,
  ),
};

export const All = Template.bind({});
All.args = {
  poolQuery: makeFragmentData(
    {
      ...fakedPool,
      areaOfSelection: {
        value: PoolAreaOfSelection.Employees,
      },
      selectionLimitations: [
        {
          value: PoolSelectionLimitation.AtLevelOnly,
        },
        {
          value: PoolSelectionLimitation.DepartmentalPreference,
        },
      ],
    },
    JobCard_Fragment,
  ),
};

export const DeadlineApproaching = Template.bind({});
DeadlineApproaching.args = {
  poolQuery: makeFragmentData(
    {
      ...fakedPool,
      areaOfSelection: {
        value: PoolAreaOfSelection.Employees,
      },
      selectionLimitations: [
        {
          value: PoolSelectionLimitation.AtLevelOnly,
        },
        {
          value: PoolSelectionLimitation.DepartmentalPreference,
        },
      ],
      closingDate: faker.date.soon({ days: 2 }).toISOString(),
    },
    JobCard_Fragment,
  ),
};

export const Closed = Template.bind({});
Closed.args = {
  poolQuery: makeFragmentData(
    {
      ...fakedPool,
      areaOfSelection: {
        value: PoolAreaOfSelection.Employees,
      },
      selectionLimitations: [
        {
          value: PoolSelectionLimitation.AtLevelOnly,
        },
        {
          value: PoolSelectionLimitation.DepartmentalPreference,
        },
      ],
      closingDate: faker.date.past().toISOString(),
    },
    JobCard_Fragment,
  ),
};

export const Null = Template.bind({});
Null.args = {
  poolQuery: makeFragmentData(nullPool, JobCard_Fragment),
};
