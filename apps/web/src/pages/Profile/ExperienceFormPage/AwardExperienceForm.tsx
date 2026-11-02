import { defineMessages, useIntl } from "react-intl";
import StarIcon from "@heroicons/react/24/outline/StarIcon";

import type { FragmentType } from "@gc-digital-talent/graphql";
import { getFragment, graphql } from "@gc-digital-talent/graphql";

import AwardFields from "~/components/ExperienceFormFields/AwardFields";
import {
  getExperienceFormLabels,
  queryResultToDefaultValues,
} from "~/utils/experienceUtils";

import ExperienceFormLayout, {
  editSubTitle,
} from "./components/ExperienceFormLayout";
import type { ExperienceTypeFormProps } from "./components/ExperienceFormLayout";

const messages = defineMessages({
  addTitle: {
    defaultMessage: "Add an award or recognition",
    id: "s83ACE",
    description: "Title for the add award experience page",
  },
  editTitle: {
    defaultMessage: "Edit award or recognition",
    id: "+H13fF",
    description: "Title for the edit award experience page",
  },
  addSubtitle: {
    defaultMessage:
      "Share specific awards and recognition you've received for going above and beyond.",
    id: "/WGk7k",
    description: "Subtitle for the add award experience page",
  },
  heading: {
    defaultMessage: "Award details",
    id: "gxzuJU",
    description: "Heading for the award experience form",
  },
  intro: {
    defaultMessage:
      "Let's add new award experience to your profile. When adding experience, it's important to remember the classic framework of who, when, where, what, why, and how. You'll start by answering a few standard questions about the award and then explore the skills that led to you achieving the award.",
    id: "P6BFHK",
    description: "Introduction for the award experience form",
  },
});

export const AwardExperienceForm_Fragment = graphql(/* GraphQL */ `
  fragment AwardExperienceForm on AwardExperience {
    ...ExperienceFormLayout
    id
    details
    title
    issuedBy
    awardedDate
    awardedTo {
      value
      label {
        en
        fr
      }
    }
    awardedScope {
      value
      label {
        en
        fr
      }
    }
    projectName
    relatedExperience {
      ... on CommunityExperience {
        id
      }
      ... on EducationExperience {
        id
      }
      ... on PersonalExperience {
        id
      }
      ... on WorkExperience {
        id
      }
    }
  }
`);

interface AwardExperienceFormProps extends ExperienceTypeFormProps {
  experienceQuery?: FragmentType<typeof AwardExperienceForm_Fragment>;
}

const AwardExperienceForm = ({
  edit,
  experienceQuery,
  organizationSuggestions,
  ...rest
}: AwardExperienceFormProps) => {
  const intl = useIntl();
  const experience = getFragment(AwardExperienceForm_Fragment, experienceQuery);

  return (
    <ExperienceFormLayout
      edit={edit}
      experienceType="award"
      experienceQuery={experience}
      detailsDefaultValues={
        experience ? queryResultToDefaultValues("award", experience) : undefined
      }
      title={intl.formatMessage(edit ? messages.editTitle : messages.addTitle)}
      subtitle={intl.formatMessage(edit ? editSubTitle : messages.addSubtitle)}
      heading={intl.formatMessage(messages.heading)}
      intro={intl.formatMessage(messages.intro)}
      icon={StarIcon}
      {...rest}
    >
      <AwardFields
        labels={getExperienceFormLabels(intl, "award")}
        organizationSuggestions={organizationSuggestions}
      />
    </ExperienceFormLayout>
  );
};

export default AwardExperienceForm;
