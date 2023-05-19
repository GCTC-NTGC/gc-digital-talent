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

import { AdvertisementStatus } from "~/api/generated";
import { EditPoolForm, EditPoolFormProps } from "./EditPoolPage";

const classifications = fakeClassifications();
const skills = fakeSkills(100, fakeSkillFamilies(10));
const poolAdvertisement = fakePools(1, skills, classifications)[0];

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
  parameters: {
    themeKey: "admin",
  },
} as Meta;

const TemplateEditPoolForm: Story<EditPoolFormProps> = (
  args: JSX.IntrinsicAttributes & EditPoolFormProps,
) => {
  return <EditPoolForm {...args} />;
};

export const DraftAdvertisement = TemplateEditPoolForm.bind({});
DraftAdvertisement.args = {
  poolAdvertisement: {
    ...poolAdvertisement,
    publishedAt: null,
    advertisementStatus: AdvertisementStatus.Draft,
  },
};

export const PublishedAdvertisement = TemplateEditPoolForm.bind({});
PublishedAdvertisement.args = {
  poolAdvertisement: {
    ...poolAdvertisement,
    publishedAt: FAR_PAST_DATE,
    advertisementStatus: AdvertisementStatus.Published,
    closingDate: FAR_FUTURE_DATE,
  },
};

export const ExpiredAdvertisement = TemplateEditPoolForm.bind({});
ExpiredAdvertisement.args = {
  poolAdvertisement: {
    ...poolAdvertisement,
    publishedAt: FAR_PAST_DATE,
    advertisementStatus: AdvertisementStatus.Closed,
    closingDate: FAR_PAST_DATE,
  },
};
