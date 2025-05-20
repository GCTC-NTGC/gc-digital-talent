import uniqueId from "lodash/uniqueId";
import { defineMessages, useIntl } from "react-intl";
import { useWatch } from "react-hook-form";
import { ReactNode } from "react";

import { errorMessages } from "@gc-digital-talent/i18n";
import { Heading, Link, Well } from "@gc-digital-talent/ui";
import {
  Classification,
  EducationRequirementOption,
} from "@gc-digital-talent/graphql";
import Checklist, { CheckboxOption } from "@gc-digital-talent/forms/Checklist";

import {
  getExperienceName,
  isAwardExperience,
  isCommunityExperience,
  isEducationExperience,
  isPersonalExperience,
  isWorkExperience,
  SimpleAnyExperience,
} from "~/utils/experienceUtils";

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

const previousStepLink = (chunks: ReactNode, path: string) => (
  <Link href={path}>{chunks}</Link>
);

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

interface ExperienceItems {
  educationExperiences: CheckboxOption[];
  allExperiences: CheckboxOption[];
}

interface CheckListSectionProps {
  group?: Classification["group"];
  experiences: ExperienceItems;
  path: string;
}

const CheckListSection = ({
  experiences,
  group,
  path,
}: CheckListSectionProps) => {
  const intl = useIntl();
  const educationRequirement = useWatch<{
    educationRequirement: EducationRequirementOption;
  }>({ name: "educationRequirement" });
  // decide whether to show the "select experiences in" helper list
  const showEssentialExperienceMessage: boolean = group !== "EC";
  switch (educationRequirement) {
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
          {experiences.allExperiences.length === 0 ? (
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
                    link: (chunks: ReactNode) => previousStepLink(chunks, path),
                  },
                )}
              </p>
            </Well>
          ) : (
            <ExperienceChecklist items={experiences.allExperiences} />
          )}
        </>
      );
    // If "I meet the post-secondary option" is selected, checkboxes for all the user's Education experiences are shown.
    case EducationRequirementOption.Education:
      return (
        <div data-h2-margin="base(x1, 0, 0, 0)">
          {experiences.educationExperiences.length === 0 ? (
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
                    link: (chunks: ReactNode) => previousStepLink(chunks, path),
                  },
                )}
              </p>
            </Well>
          ) : (
            <ExperienceChecklist items={experiences.educationExperiences} />
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

interface LinkCareerTimelineProps {
  experiences: SimpleAnyExperience[];
  previousStepPath: string;
  classificationGroup?: string;
}

const LinkCareerTimeline = ({
  experiences,
  previousStepPath,
  classificationGroup,
}: LinkCareerTimelineProps) => {
  const intl = useIntl();
  const experienceItems = experiences.reduce(
    (
      checklistItems: ExperienceItems,
      experience: SimpleAnyExperience,
    ): ExperienceItems => {
      if (isEducationExperience(experience)) {
        const educationExperience = {
          value: experience.id,
          label: getExperienceName(experience, intl),
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
          label: getExperienceName(experience, intl),
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
              label: experience.title ?? "",
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

  return (
    <>
      <Heading
        level="h3"
        size="h6"
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
      <CheckListSection
        experiences={experienceItems}
        group={classificationGroup}
        path={previousStepPath}
      />
    </>
  );
};

export default LinkCareerTimeline;
