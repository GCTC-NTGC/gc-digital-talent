import { defineMessages, useIntl } from "react-intl";
import BookOpenIcon from "@heroicons/react/24/outline/BookOpenIcon";

import type { FragmentType } from "@gc-digital-talent/graphql";
import { getFragment, graphql } from "@gc-digital-talent/graphql";

import EducationFields from "~/components/ExperienceFormFields/EducationFields/EducationFields";
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
    defaultMessage: "Add education or a certificate",
    id: "M0V9+t",
    description: "Title for the add education experience page",
  },
  editTitle: {
    defaultMessage: "Edit education or a certificate",
    id: "EmCkeP",
    description: "Title for the edit education experience page",
  },
  addSubtitle: {
    defaultMessage:
      "Share your diplomas, certificates, online courses, apprenticeships, licenses, or alternative credentials received from educational institutions.",
    id: "m5YNK0",
    description: "Subtitle for the add education experience page",
  },
  heading: {
    defaultMessage: "Education details",
    id: "DWrzhf",
    description: "Heading for the education experience form",
  },
  intro: {
    defaultMessage:
      "Let's add new education experience to your profile. When adding experience, it's important to remember the classic framework of who, when, where, what, why, and how. You'll start by answering a few standard questions about the type of education or certificate, then provide details about the institution, area of study and other relevant information, and finally, how you applied various skills during this experience.",
    id: "zggxVs",
    description: "Introduction for the education experience form",
  },
});

export const EducationExperienceForm_Fragment = graphql(/* GraphQL */ `
  fragment EducationExperienceForm on EducationExperience {
    ...ExperienceFormLayout
    id
    awardExperiences {
      id
    }
    details
    institution
    areaOfStudy
    thesisTitle
    startDate
    endDate
    otherEducationType
    licenseOrAccreditation
    certification
    courseName
    otherFellowshipType
    prospectiveEndDate
    educationType {
      value
      label {
        localized
      }
    }
    degreeType {
      value
      label {
        localized
      }
    }
    fellowshipType {
      value
      label {
        localized
      }
    }
    status {
      value
      label {
        localized
      }
    }
  }
`);

interface EducationExperienceFormProps extends ExperienceTypeFormProps {
  experienceQuery?: FragmentType<typeof EducationExperienceForm_Fragment>;
}

const EducationExperienceForm = ({
  edit,
  experienceQuery,
  organizationSuggestions,
  ...rest
}: EducationExperienceFormProps) => {
  const intl = useIntl();
  const experience = getFragment(
    EducationExperienceForm_Fragment,
    experienceQuery,
  );

  return (
    <ExperienceFormLayout
      edit={edit}
      experienceType="education"
      experienceQuery={experience}
      hasRelatedAwards={!!experience?.awardExperiences?.length}
      detailsDefaultValues={
        experience
          ? queryResultToDefaultValues("education", experience)
          : undefined
      }
      title={intl.formatMessage(edit ? messages.editTitle : messages.addTitle)}
      subtitle={intl.formatMessage(edit ? editSubTitle : messages.addSubtitle)}
      heading={intl.formatMessage(messages.heading)}
      intro={intl.formatMessage(messages.intro)}
      icon={BookOpenIcon}
      {...rest}
    >
      <EducationFields
        labels={getExperienceFormLabels(intl, "education")}
        organizationSuggestions={organizationSuggestions}
      />
    </ExperienceFormLayout>
  );
};

export default EducationExperienceForm;
