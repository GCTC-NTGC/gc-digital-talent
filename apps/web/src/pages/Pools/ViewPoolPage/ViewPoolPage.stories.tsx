import { useState } from "react";
import { Meta, StoryFn } from "@storybook/react-vite";
import { action } from "storybook/actions";

import {
  fakeClassifications,
  fakePools,
  fakeSkillFamilies,
  fakeSkills,
  toLocalizedEnum,
} from "@gc-digital-talent/fake-data";
import {
  FAR_FUTURE_DATE,
  FAR_PAST_DATE,
} from "@gc-digital-talent/date-helpers";
import { PoolStatus, makeFragmentData } from "@gc-digital-talent/graphql";

import { ViewPool, ViewPoolProps, ViewPool_Fragment } from "./ViewPoolPage";

const classifications = fakeClassifications();
const skills = fakeSkills(100, fakeSkillFamilies(10));
const pool = fakePools(1, skills, classifications)[0];

const meta: Meta<typeof ViewPool> = {
  component: ViewPool,
};

export default meta;

const Template: StoryFn<typeof ViewPool> = (args) => {
  const [isFetching, setIsFetching] = useState<boolean>(false);

  const wait = async <T,>(name: string, data?: T): Promise<void> => {
    action(name)(data);
    setIsFetching(true);
    return new Promise((resolve) => {
      setTimeout(() => {
        setIsFetching(false);
        resolve();
      }, 1000);
    });
  };

  const apiProps: Partial<ViewPoolProps> = {
    isFetching,
    onPublish: async () => wait("onPublish"),
    onDelete: async () => wait("onDelete"),
    onArchive: async () => wait("onArchive"),
    onUnarchive: async () => wait("onUnarchive"),
    onExtend: async (closingDate) => {
      return wait("onExtend", closingDate);
    },
  };

  return <ViewPool {...args} {...apiProps} />;
};

export const DraftCompleteProcess = Template.bind({});
DraftCompleteProcess.args = {
  poolQuery: makeFragmentData(
    {
      ...pool,
      publishedAt: null,
      status: toLocalizedEnum(PoolStatus.Draft),
      isComplete: true,
    },
    ViewPool_Fragment,
  ),
};

export const DraftIncompleteProcess = Template.bind({});
DraftIncompleteProcess.args = {
  poolQuery: makeFragmentData(
    {
      ...pool,
      publishedAt: null,
      status: toLocalizedEnum(PoolStatus.Draft),
      isComplete: false,
    },
    ViewPool_Fragment,
  ),
};

export const PublishedProcess = Template.bind({});
PublishedProcess.args = {
  poolQuery: makeFragmentData(
    {
      ...pool,
      publishedAt: FAR_PAST_DATE,
      status: toLocalizedEnum(PoolStatus.Published),
      closingDate: FAR_FUTURE_DATE,
    },
    ViewPool_Fragment,
  ),
};

export const ExpiredProcess = Template.bind({});
ExpiredProcess.args = {
  poolQuery: makeFragmentData(
    {
      ...pool,
      publishedAt: FAR_PAST_DATE,
      status: toLocalizedEnum(PoolStatus.Closed),
      closingDate: FAR_PAST_DATE,
    },
    ViewPool_Fragment,
  ),
};

export const ArchivedProcess = Template.bind({});
ArchivedProcess.args = {
  poolQuery: makeFragmentData(
    {
      ...pool,
      publishedAt: FAR_PAST_DATE,
      status: toLocalizedEnum(PoolStatus.Archived),
      closingDate: FAR_PAST_DATE,
    },
    ViewPool_Fragment,
  ),
};
