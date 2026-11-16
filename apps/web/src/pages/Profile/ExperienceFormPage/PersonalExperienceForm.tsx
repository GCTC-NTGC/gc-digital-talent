import { defineMessages, useIntl } from "react-intl";
import LightBulbIcon from "@heroicons/react/24/outline/LightBulbIcon";

import type { FragmentType } from "@gc-digital-talent/graphql";
import { getFragment, graphql } from "@gc-digital-talent/graphql";

import PersonalFields from "~/components/ExperienceFormFields/PersonalFields";
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
    defaultMessage: "Add personal learning",
    id: "G/TtJA",
    description: "Title for the add personal learning experience page",
  },
  editTitle: {
    defaultMessage: "Edit personal learning",
    id: "ylpJ8+",
    description: "Title for the edit personal learning experience page",
  },
  addSubtitle: {
    defaultMessage:
      "Share how other life events have helped you grow and develop your skills, including family, hobbies, and extracurriculars.",
    id: "iS0pd+",
    description: "Subtitle for the add personal learning experience page",
  },
  heading: {
    defaultMessage: "Personal learning details",
    id: "6KUgGR",
    description: "Heading for the personal learning experience form",
  },
  intro: {
    defaultMessage:
      "Let's add new personal learning experience to your profile. When adding experience, it's important to remember the classic framework of who, when, where, what, why, and how. You'll start by answering a few standard questions about the experience, describe how you participated, and finally, how you applied various skills during the opportunity.",
    id: "9O3rOx",
    description: "Introduction for the personal learning experience form",
  },
});

export const PersonalExperienceForm_Fragment = graphql(/* GraphQL */ `
  fragment PersonalExperienceForm on PersonalExperience {
    ...ExperienceFormLayout
    id
    awardExperiences {
      id
    }
    title
    startDate
    endDate
    learningDescription
    organization
  }
`);

interface PersonalExperienceFormProps extends ExperienceTypeFormProps {
  experienceQuery?: FragmentType<typeof PersonalExperienceForm_Fragment>;
}

const PersonalExperienceForm = ({
  edit,
  experienceQuery,
  organizationSuggestions,
  ...rest
}: PersonalExperienceFormProps) => {
  const intl = useIntl();
  const experience = getFragment(
    PersonalExperienceForm_Fragment,
    experienceQuery,
  );

  return (
    <ExperienceFormLayout
      edit={edit}
      experienceType="personal"
      experienceQuery={experience}
      hasRelatedAwards={!!experience?.awardExperiences?.length}
      detailsDefaultValues={
        experience
          ? queryResultToDefaultValues("personal", experience)
          : undefined
      }
      title={intl.formatMessage(edit ? messages.editTitle : messages.addTitle)}
      subtitle={intl.formatMessage(edit ? editSubTitle : messages.addSubtitle)}
      heading={intl.formatMessage(messages.heading)}
      intro={intl.formatMessage(messages.intro)}
      icon={LightBulbIcon}
      {...rest}
    >
      <PersonalFields
        labels={getExperienceFormLabels(intl, "personal")}
        organizationSuggestions={organizationSuggestions}
      />
    </ExperienceFormLayout>
  );
};

export default PersonalExperienceForm;
