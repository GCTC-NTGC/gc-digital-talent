import { defineMessages, useIntl } from "react-intl";
import UserGroupIcon from "@heroicons/react/24/outline/UserGroupIcon";

import type { FragmentType } from "@gc-digital-talent/graphql";
import { getFragment, graphql } from "@gc-digital-talent/graphql";

import CommunityFields from "~/components/ExperienceFormFields/CommunityFields";
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
    defaultMessage: "Add community participation",
    id: "37xkir",
    description: "Title for the add community participation experience page",
  },
  editTitle: {
    defaultMessage: "Edit community participation",
    id: "3fHWz1",
    description: "Title for the edit community participation experience page",
  },
  addSubtitle: {
    defaultMessage:
      "Share how participating in your community has helped you grow, including volunteering, ceremony, events, and virtual collaboration.",
    id: "giyIGK",
    description: "Subtitle for the add community participation experience page",
  },
  heading: {
    defaultMessage: "Community participation details",
    id: "XI0wfo",
    description: "Heading for the community participation experience form",
  },
  intro: {
    defaultMessage:
      "Let's add new community participation to your profile. When adding experience, it's important to remember the classic framework of who, when, where, what, why, and how. You'll start by answering a few standard questions about the experience, describe how you participated, and finally, how you applied various skills during the opportunity.",
    id: "ZZeEGE",
    description: "Introduction for the community participation experience form",
  },
});

export const CommunityExperienceForm_Fragment = graphql(/* GraphQL */ `
  fragment CommunityExperienceForm on CommunityExperience {
    ...ExperienceFormLayout
    id
    awardExperiences {
      id
    }
    details
    title
    organization
    project
    startDate
    endDate
  }
`);

interface CommunityExperienceFormProps extends ExperienceTypeFormProps {
  experienceQuery?: FragmentType<typeof CommunityExperienceForm_Fragment>;
}

const CommunityExperienceForm = ({
  edit,
  experienceQuery,
  organizationSuggestions,
  ...rest
}: CommunityExperienceFormProps) => {
  const intl = useIntl();
  const experience = getFragment(
    CommunityExperienceForm_Fragment,
    experienceQuery,
  );

  return (
    <ExperienceFormLayout
      edit={edit}
      experienceType="community"
      experienceQuery={experience}
      hasRelatedAwards={!!experience?.awardExperiences?.length}
      detailsDefaultValues={
        experience
          ? queryResultToDefaultValues("community", experience)
          : undefined
      }
      title={intl.formatMessage(edit ? messages.editTitle : messages.addTitle)}
      subtitle={intl.formatMessage(edit ? editSubTitle : messages.addSubtitle)}
      heading={intl.formatMessage(messages.heading)}
      intro={intl.formatMessage(messages.intro)}
      icon={UserGroupIcon}
      {...rest}
    >
      <CommunityFields
        labels={getExperienceFormLabels(intl, "community")}
        organizationSuggestions={organizationSuggestions}
      />
    </ExperienceFormLayout>
  );
};

export default CommunityExperienceForm;
