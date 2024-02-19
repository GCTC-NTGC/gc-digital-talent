import * as React from "react";
import uniqueId from "lodash/uniqueId";
import { defineMessages, useIntl } from "react-intl";

import { Checklist, CheckboxOption } from "@gc-digital-talent/forms";
import { errorMessages } from "@gc-digital-talent/i18n";
import { Heading, Link, Well } from "@gc-digital-talent/ui";
import {
  EducationRequirementOption,
  Experience,
} from "@gc-digital-talent/graphql";

import {
  isAwardExperience,
  isCommunityExperience,
  isEducationExperience,
  isPersonalExperience,
  isWorkExperience,
} from "~/utils/experienceUtils";
import { ClassificationGroup } from "~/utils/poolUtils";

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

const ExperienceChecklist = ({ items }: { items: CheckboxOption[] }) => {
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

interface LinkCareerTimelineProps {
  experiences: Experience[];
  watchEducationRequirement: EducationRequirementOption;
  previousStepPath: string;
  classificationGroup?: ClassificationGroup;
}

const LinkCareerTimeline = ({
  experiences,
  watchEducationRequirement,
  previousStepPath,
  classificationGroup,
}: LinkCareerTimelineProps) => {
  const intl = useIntl();
  const previousStepLink = (chunks: React.ReactNode) => (
    <Link href={previousStepPath}>{chunks}</Link>
  );
  const experienceItems = experiences.reduce(
    (
      checklistItems: {
        educationExperiences: CheckboxOption[];
        allExperiences: CheckboxOption[];
      },
      experience: Experience,
    ): {
      educationExperiences: CheckboxOption[];
      allExperiences: CheckboxOption[];
    } => {
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

  const checkListSection = (): React.ReactNode => {
    // decide whether to show the "select experiences in" helper list
    const showEssentialExperienceMessage: boolean =
      classificationGroup !== "EC";
    switch (watchEducationRequirement) {
      // If "I meet the applied work experience" option is selected, checkboxes are displayed for every experience.
      case EducationRequirementOption.AppliedWork:
      case EducationRequirementOption.ProfessionalDesignation:
        return (
          <>
            {showEssentialExperienceMessage && (
              <>
                <p data-h2-margin="base(0, 0, x.5, 0)">
                  {intl.formatMessage({
                    defaultMessage: "Please select experiences in:",
                    id: "6Q1N7Z",
                    description:
                      "Message before skills list in application education page.",
                  })}
                </p>
                <ul data-h2-margin="base(0, 0, x1, 0)">
                  {Object.values(essentialExperienceMessages).map((value) => (
                    <li key={uniqueId()} data-h2-margin="base(0, 0, x.25, 0)">
                      {intl.formatMessage(value)}
                    </li>
                  ))}
                </ul>
              </>
            )}
            {experienceItems.allExperiences.length === 0 ? (
              <Well>
                <p
                  data-h2-text-align="base(center)"
                  data-h2-margin-bottom="base(x.5)"
                >
                  {intl.formatMessage({
                    defaultMessage:
                      "<strong>It looks like you haven't added any experiences to your career timeline yet.</strong>",
                    id: "Q83U92",
                    description:
                      "Alert message informing user to add experience in application education page.",
                  })}
                </p>
                <p data-h2-text-align="base(center)">
                  {intl.formatMessage(
                    {
                      defaultMessage:
                        "You can add experiences when <link>creating a new career timeline experience in the previous step.</link>",
                      id: "G1OWMo",
                      description:
                        "Secondary alert message informing user to add experience in application education page.",
                    },
                    {
                      link: previousStepLink,
                    },
                  )}
                </p>
              </Well>
            ) : (
              <ExperienceChecklist items={experienceItems.allExperiences} />
            )}
          </>
        );
      // If "I meet the post-secondary option" is selected, checkboxes for all the user's Education experiences are shown.
      case EducationRequirementOption.Education:
        return (
          <div data-h2-margin="base(x1, 0, 0, 0)">
            {experienceItems.educationExperiences.length === 0 ? (
              <Well>
                <p
                  data-h2-text-align="base(center)"
                  data-h2-margin-bottom="base(x.5)"
                >
                  {intl.formatMessage({
                    defaultMessage:
                      "<strong>It looks like you haven't added any education experiences to your career timeline yet.</strong>",
                    id: "QagkWo",
                    description:
                      "Alert message informing user to add education experience in application education page.",
                  })}
                </p>
                <p data-h2-text-align="base(center)">
                  {intl.formatMessage(
                    {
                      defaultMessage: `You can add education-specific experiences by selecting the "Education and certificates" option when <link>creating a new career timeline experience in the previous step.</link>`,
                      id: "81Bib7",
                      description:
                        "Secondary alert message informing user to add education experience in application education page.",
                    },
                    {
                      link: previousStepLink,
                    },
                  )}
                </p>
              </Well>
            ) : (
              <ExperienceChecklist
                items={experienceItems.educationExperiences}
              />
            )}
          </div>
        );
      // Otherwise, show null state
      default:
        return (
          <Well data-h2-margin="base(x1, 0, 0, 0)">
            <p data-h2-text-align="base(center)">
              {intl.formatMessage({
                defaultMessage: "Please select an option to continue.",
                id: "cT6KeA",
                description:
                  "Alert message informing user to select an option first in application education page.",
              })}
            </p>
          </Well>
        );
    }
  };
  return (
    <>
      <Heading
        level="h6"
        data-h2-margin="base(x2, 0, x.5, 0)"
        data-h2-font-weight="base(700)"
      >
        {intl.formatMessage({
          defaultMessage: "Link your career timeline",
          id: "K6Tzh1",
          description:
            "Heading for checklist section in application education page.",
        })}
      </Heading>
      <p data-h2-margin="base(0, 0, x.5, 0)">
        {intl.formatMessage({
          defaultMessage:
            "Once you’ve selected the criteria you meet, this section asks you to tell us which of the specific items in your career timeline meet that option. If you need to add something to your career timeline, you can do so by returning to the career timeline step in the application.",
          id: "sQkwFY",
          description:
            "Description for checklist section in application education page.",
        })}
      </p>
      {checkListSection()}
    </>
  );
};

export default LinkCareerTimeline;
