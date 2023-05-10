import * as React from "react";
import uniqueId from "lodash/uniqueId";
import { defineMessages, useIntl } from "react-intl";

import {
  isAwardExperience,
  isCommunityExperience,
  isEducationExperience,
  isPersonalExperience,
  isWorkExperience,
} from "~/utils/experienceUtils";
import {
  EducationRequirementOption,
  Experience,
} from "@gc-digital-talent/graphql";
import Checklist, {
  Checkbox,
} from "@gc-digital-talent/forms/src/components/Checklist";
import { errorMessages } from "@gc-digital-talent/i18n";
import { Alert, Heading } from "@gc-digital-talent/ui";

const essentialExperienceMessages = defineMessages({
  computerScience: {
    defaultMessage: "<strong>computer science</strong>",
    id: "EdybCb",
    description: "Message before skills list in application education page.",
  },
  infoTechnology: {
    defaultMessage: "<strong>information technology</strong>",
    id: "h0Mrq9",
    description:
      "List item of experiences required in application education page.",
  },
  infoManagement: {
    defaultMessage: "<strong>information management</strong>, or",
    id: "72pd2Z",
    description:
      "List item of experiences required in application education page.",
  },
  other: {
    defaultMessage:
      "<strong>another specialty relevant to this advertisement</strong>",
    id: "iMAe2n",
    description:
      "List item of experiences required in application education page.",
  },
});

const ExperienceChecklist = ({ items }: { items: Checkbox[] }) => {
  const intl = useIntl();
  return (
    <Checklist
      idPrefix="education-requirement-experiences"
      legend={intl.formatMessage({
        defaultMessage: "Select relevant experiences",
        id: "EyH6FY",
        description:
          "Legend for the checklist in the application education page.",
      })}
      name="educationRequirementExperiences"
      id="consideredPositionLanguages"
      rules={{
        required: intl.formatMessage(errorMessages.required),
      }}
      items={items}
    />
  );
};

interface LinkResumeProps {
  experiences: Experience[];
  watchEducationRequirement: EducationRequirementOption;
}

const LinkResume = ({
  experiences,
  watchEducationRequirement,
}: LinkResumeProps) => {
  const intl = useIntl();

  const experienceItems = experiences.reduce(
    (
      checklistItems: {
        educationExperiences: Checkbox[];
        allExperiences: Checkbox[];
      },
      experience: Experience,
    ): { educationExperiences: Checkbox[]; allExperiences: Checkbox[] } => {
      if (isEducationExperience(experience)) {
        const educationExperience = {
          value: experience.id,
          label:
            intl.formatMessage(
              {
                defaultMessage: "{areaOfStudy} at {institution}",
                id: "UrsGGK",
                description: "Study at institution",
              },
              {
                areaOfStudy: experience.areaOfStudy,
                institution: experience.institution,
              },
            ) || "",
        };

        return {
          educationExperiences: [
            ...checklistItems.educationExperiences,
            educationExperience,
          ],
          allExperiences: [
            ...checklistItems.allExperiences,
            educationExperience,
          ],
        };
      }
      if (isWorkExperience(experience)) {
        const workExperience = {
          value: experience.id,
          label:
            intl.formatMessage(
              {
                defaultMessage: "{role} at {organization}",
                id: "wTAdQe",
                description: "Role at organization",
              },
              { role: experience.role, organization: experience.organization },
            ) || "",
        };

        return {
          educationExperiences: [...checklistItems.educationExperiences],
          allExperiences: [...checklistItems.allExperiences, workExperience],
        };
      }

      if (
        isAwardExperience(experience) ||
        isCommunityExperience(experience) ||
        isPersonalExperience(experience)
      ) {
        return {
          educationExperiences: [...checklistItems.educationExperiences],
          allExperiences: [
            ...checklistItems.allExperiences,
            {
              value: experience.id,
              label: experience.title || "",
            },
          ],
        };
      }

      return {
        ...checklistItems,
      };
    },
    {
      educationExperiences: [],
      allExperiences: [],
    },
  );

  const checkListSection = () => {
    switch (watchEducationRequirement) {
      // If "I meet the applied work experience" option is selected, checkboxes are displayed for every experience.
      case EducationRequirementOption.AppliedWork:
        return (
          <>
            <p data-h2-margin="base(0, 0, x1, 0)">
              {intl.formatMessage({
                defaultMessage: "Please select experiences in:",
                id: "6Q1N7Z",
                description:
                  "Message before skills list in application education page.",
              })}
            </p>
            <ul data-h2-margin="base(0, 0, x.75, 0)">
              {Object.values(essentialExperienceMessages).map((value) => (
                <li key={uniqueId()} data-h2-margin="base(0, 0, x.25, 0)">
                  {intl.formatMessage(value)}
                </li>
              ))}
            </ul>
            <ExperienceChecklist items={experienceItems.allExperiences} />
          </>
        );
      // If "I meet the post-secondary option" is selected, checkboxes for all the user's Education experiences are shown.
      case EducationRequirementOption.Education:
        return (
          <ExperienceChecklist items={experienceItems.educationExperiences} />
        );
      // Otherwise, show null state (need to approve design with designers)
      default:
        return (
          <Alert.Root type="warning" data-h2-margin="base(0, 0)">
            <Alert.Title>
              {intl.formatMessage({
                defaultMessage: "Select which criteria you meet above.",
                id: "3M3jg8",
                description:
                  "Alert message informing user to select an option first in application education page.",
              })}
            </Alert.Title>
          </Alert.Root>
        );
    }
  };
  return (
    <>
      <Heading
        level="h6"
        data-h2-margin="base(x2, 0, x1, 0)"
        data-h2-font-weight="base(800)"
      >
        {intl.formatMessage({
          defaultMessage: "Link your résumé",
          id: "WkjRzF",
          description:
            "Heading for checklist section in application education page.",
        })}
      </Heading>
      <p data-h2-margin="base(0, 0, x1, 0)">
        {intl.formatMessage({
          defaultMessage:
            "Once you’ve selected the criteria you meet, this section asks you to tell us which of the specific items in your résumé meet that option. If you need to add something to your résumé, you can do so by returning to the résumé step in the application.",
          id: "Vs35dN",
          description:
            "Description for checklist section in application education page.",
        })}
      </p>
      {checkListSection()}
    </>
  );
};

export default LinkResume;
