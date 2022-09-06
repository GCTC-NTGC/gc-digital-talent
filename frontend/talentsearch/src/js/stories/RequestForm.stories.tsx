import React from "react";
import { Meta, Story } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { fakeDepartments } from "@common/fakeData";
import {
  RequestForm,
  RequestFormProps,
} from "../components/request/CreateRequest";
import {
  RequestForm as RequestFormDeprecated,
  RequestFormProps as RequestFormDeprecatedProps,
} from "../components/request/deprecated/CreateRequest";
import {
  CreatePoolCandidateSearchRequestInput,
  OperationalRequirement,
  PoolCandidateFilter,
  WorkRegion,
} from "../api/generated";

const poolCandidateFilter: PoolCandidateFilter = {
  id: "9ef184ad-1752-411e-a022-7f7989f6bf27",
  classifications: [
    {
      id: "90689420-553d-4a3b-999a-fb94b1baaa69",
      group: "IT",
      level: 4,
    },
    {
      id: "bcfa88b3-ed22-4879-8642-e7dd003e91b4",
      group: "IT",
      level: 5,
    },
    {
      id: "7b0d9293-e811-413c-b0df-346e55f3fdd0",
      group: "EC",
      level: 1,
    },
  ],
  cmoAssets: [
    {
      id: "6605d898-bd08-4b30-bb16-d56e299b475b",
      key: "app_dev",
      name: {
        en: "Application Development",
        fr: "Développement d'applications",
      },
    },
    {
      id: "f506e278-e4af-4ab5-b8d6-8f38c1c1591a",
      key: "app_testing",
      name: {
        en: "Application Testing / Quality Assurance",
        fr: "Mise à l'essai des applications / Assurance de la qualité",
      },
    },
    {
      id: "6cf47865-5079-4584-87d3-395b1825c5d4",
      key: "cybersecurity",
      name: {
        en: "Cybersecurity / Information Security / IT Security",
        fr: "Cybersécurité / Sécurité de l'information / Sécurité de la TI",
      },
    },
    {
      id: "1225da7c-c8ff-46c0-be1c-df97f8a4f253",
      key: "data_science",
      name: {
        en: "Data Science / Analysis",
        fr: "Science / analyse des données",
      },
    },
  ],
  hasDiploma: false,
  equity: {
    hasDisability: false,
    isIndigenous: false,
    isVisibleMinority: false,
    isWoman: false,
  },
  languageAbility: null,
  operationalRequirements: [
    OperationalRequirement.DriversLicense,
    OperationalRequirement.OnCall,
  ],
  workRegions: [WorkRegion.Ontario, WorkRegion.Quebec],
  pools: [
    {
      id: "acf045c9-6daf-4a59-aeb3-ab62acb0418e",
    },
  ],
};

export default {
  component: RequestForm,
  title: "RequestForm",
  args: {
    departments: fakeDepartments(),
    poolCandidateFilter,
    candidateCount: 10,
    handleCreatePoolCandidateSearchRequest: async (
      data: CreatePoolCandidateSearchRequestInput,
    ) => {
      await new Promise((resolve) => {
        setTimeout(resolve, 1000);
      });
      action("Create Pool Candidate Search Request")(data);
      return null;
    },
  },
} as Meta;

const TemplateRequestForm: Story<RequestFormProps> = (args) => {
  return <RequestForm {...args} />;
};

const TemplateRequestFormDeprecated: Story<RequestFormDeprecatedProps> = (
  args,
) => {
  return <RequestFormDeprecated {...args} />;
};

export const Form = TemplateRequestForm.bind({});
export const FormDeprecated = TemplateRequestFormDeprecated.bind({});
