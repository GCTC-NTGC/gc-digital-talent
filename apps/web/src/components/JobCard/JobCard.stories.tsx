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

const open = {
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

const citizen = {
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

const employee = {
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

const atLevel = {
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

const departmental = {
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

const all = {
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

const deadlineApproaching = {
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

const closed = {
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

const nullCard = {
  poolQuery: makeFragmentData(nullPool, JobCard_Fragment),
};

const Template: StoryFn<typeof JobCard> = () => (
  <div className="flex flex-col gap-6">
    <JobCard {...open} />
    <JobCard {...citizen} />
    <JobCard {...employee} />
    <JobCard {...atLevel} />
    <JobCard {...departmental} />
    <JobCard {...all} />
    <JobCard {...deadlineApproaching} />
    <JobCard {...closed} />
    <JobCard {...nullCard} />
  </div>
);

export const AllCards = Template.bind({});
