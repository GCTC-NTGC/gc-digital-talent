import React from "react";
import { Meta, Story } from "@storybook/react";
import { action } from "@storybook/addon-actions";

import {
  fakeSkillFamilies,
  fakeClassifications,
  fakeSkills,
  fakePools,
} from "@gc-digital-talent/fake-data";
import {
  FAR_FUTURE_DATE,
  FAR_PAST_DATE,
} from "@gc-digital-talent/date-helpers";
import { PoolStatus } from "@gc-digital-talent/graphql";

import { EditPoolForm, EditPoolFormProps } from "./EditPoolPage";

const classifications = fakeClassifications();
const skills = fakeSkills(100, fakeSkillFamilies(10));
const pool = fakePools(1, skills, classifications)[0];

export default {
  component: EditPoolForm,
  title: "Forms/Edit Pool Form",
  args: {
    classifications,
    skills,
    onSave: action("onSave"),
    onPublish: action("onPublish"),
    onDelete: action("onDelete"),
    onClose: action("onClose"),
    onExtend: action("onExtend"),
    onArchive: action("onArchive"),
  },
} as Meta;

const TemplateEditPoolForm: Story<EditPoolFormProps> = (
  args: JSX.IntrinsicAttributes & EditPoolFormProps,
) => {
  return <EditPoolForm {...args} />;
};

export const DraftPool = TemplateEditPoolForm.bind({});
DraftPool.args = {
  pool: {
    ...pool,
    publishedAt: null,
    status: PoolStatus.Draft,
  },
};

export const PublishedPool = TemplateEditPoolForm.bind({});
PublishedPool.args = {
  pool: {
    ...pool,
    publishedAt: FAR_PAST_DATE,
    status: PoolStatus.Published,
    closingDate: FAR_FUTURE_DATE,
  },
};

export const ExpiredPool = TemplateEditPoolForm.bind({});
ExpiredPool.args = {
  pool: {
    ...pool,
    publishedAt: FAR_PAST_DATE,
    status: PoolStatus.Closed,
    closingDate: FAR_PAST_DATE,
  },
};
