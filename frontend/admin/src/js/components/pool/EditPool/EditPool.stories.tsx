import React from "react";
import { Meta, Story } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import {
  fakeSkillFamilies,
  fakeClassifications,
  fakeSkills,
  fakePoolAdvertisements,
} from "@common/fakeData";

import { AdvertisementStatus } from "@common/api/generated";
import { FAR_FUTURE_DATE, FAR_PAST_DATE } from "@common/helpers/dateUtils";
import { EditPoolForm, EditPoolFormProps } from "./EditPool";

const classifications = fakeClassifications();
const skills = fakeSkills(100, fakeSkillFamilies(10));
const poolAdvertisement = fakePoolAdvertisements(1, skills, classifications)[0];

export default {
  component: EditPoolForm,
  title: "Pools/Edit Pool Form",
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

const TemplateEditPoolForm: Story<EditPoolFormProps> = (args) => {
  return <EditPoolForm {...args} />;
};

export const DraftAdvertisement = TemplateEditPoolForm.bind({});
DraftAdvertisement.args = {
  poolAdvertisement: {
    ...poolAdvertisement,
    isPublished: false,
    advertisementStatus: AdvertisementStatus.Draft,
  },
};

export const PublishedAdvertisement = TemplateEditPoolForm.bind({});
PublishedAdvertisement.args = {
  poolAdvertisement: {
    ...poolAdvertisement,
    isPublished: true,
    advertisementStatus: AdvertisementStatus.Published,
    expiryDate: FAR_FUTURE_DATE.toISOString(),
  },
};

export const ExpiredAdvertisement = TemplateEditPoolForm.bind({});
ExpiredAdvertisement.args = {
  poolAdvertisement: {
    ...poolAdvertisement,
    isPublished: true,
    advertisementStatus: AdvertisementStatus.Expired,
    expiryDate: FAR_PAST_DATE.toISOString(),
  },
};
