import { JSX } from "react";
import { Meta, StoryFn } from "@storybook/react-vite";
import { action } from "storybook/actions";

import {
  fakeSkillFamilies,
  fakeClassifications,
  fakeDepartments,
  fakeSkills,
  fakePools,
  toLocalizedEnum,
} from "@gc-digital-talent/fake-data";
import {
  FAR_FUTURE_DATE,
  FAR_PAST_DATE,
} from "@gc-digital-talent/date-helpers";
import { PoolStatus, makeFragmentData } from "@gc-digital-talent/graphql";

import {
  EditPoolForm,
  EditPoolFormProps,
  EditPool_Fragment,
} from "./EditPoolPage";

const classifications = fakeClassifications();
const departments = fakeDepartments();
const skills = fakeSkills(100, fakeSkillFamilies(10));
const pool = fakePools(1, skills, classifications, departments)[0];

export default {
  component: EditPoolForm,
  args: {
    classifications,
    departments,
    skills,
    onSave: action("onSave"),
    onPublish: action("onPublish"),
    onDelete: action("onDelete"),
    onClose: action("onClose"),
    onExtend: action("onExtend"),
    onArchive: action("onArchive"),
  },
} as Meta;

const TemplateEditPoolForm: StoryFn<EditPoolFormProps> = (
  args: JSX.IntrinsicAttributes & EditPoolFormProps,
) => {
  return <EditPoolForm {...args} />;
};

export const DraftPool = {
  render: TemplateEditPoolForm,

  args: {
    poolQuery: makeFragmentData(
      {
        ...pool,
        closingDate: FAR_FUTURE_DATE,
        publishedAt: null,
        status: toLocalizedEnum(PoolStatus.Draft),
      },
      EditPool_Fragment,
    ),
  },
};

export const PublishedPool = {
  render: TemplateEditPoolForm,

  args: {
    poolQuery: makeFragmentData(
      {
        ...pool,
        publishedAt: FAR_PAST_DATE,
        status: toLocalizedEnum(PoolStatus.Published),
        closingDate: FAR_FUTURE_DATE,
      },
      EditPool_Fragment,
    ),
  },
};

export const ExpiredPool = {
  render: TemplateEditPoolForm,

  args: {
    poolQuery: makeFragmentData(
      {
        ...pool,
        publishedAt: FAR_PAST_DATE,
        status: toLocalizedEnum(PoolStatus.Closed),
        closingDate: FAR_PAST_DATE,
      },
      EditPool_Fragment,
    ),
  },
};
