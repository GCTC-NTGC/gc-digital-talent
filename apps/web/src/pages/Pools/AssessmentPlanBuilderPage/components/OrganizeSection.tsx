import React from "react";
import { defineMessage, useIntl } from "react-intl";

import { Accordion, Heading } from "@gc-digital-talent/ui";
import { AssessmentStep, Pool } from "@gc-digital-talent/graphql";
import { notEmpty } from "@gc-digital-talent/helpers";
import { getLocalizedName } from "@gc-digital-talent/i18n";

import AssessmentDetailsDialog from "./AssessmentDetailsDialog";
import { PAGE_SECTION_ID } from "../navigation";

const MAX_ASSESSMENT_STEPS = 6;

const sectionTitle = defineMessage({
  defaultMessage: "Organize assessment approach",
  id: "qFY+K4",
  description: "Title for the organize section in the assessment plan builder",
});

export interface OrganizeSectionProps {
  pool: Pool;
}

const OrganizeSection = ({ pool }: OrganizeSectionProps) => {
  const intl = useIntl();
  return (
    <>
      <Heading level="h3" id={PAGE_SECTION_ID.ORGANIZE_ASSESSMENT_APPROACH}>
        {intl.formatMessage(sectionTitle)}
      </Heading>
      <p>
        {intl.formatMessage({
          defaultMessage:
            "Use this section to define which assessments will be used as part of your assessment process. You can also change the order in which you plan to perform these evaluations. The only exceptions are the “Application screening” and the “Screening questions (at the time of application)” assessments which will always be the first and second steps in any pool advertisement.",
          id: "F46Sel",
          description:
            "introduction to the organize section in the assessment plan builder",
        })}
      </p>
      <Accordion.Root type="multiple" mode="simple">
        <Accordion.Item value="one">
          <Accordion.Header
            headingAs="h4"
            data-h2-font-size="base(copy)"
            data-h2-text-decoration="base(underline)"
          >
            <Accordion.Trigger data-h2-font-weight="base(700)">
              {intl.formatMessage({
                defaultMessage: "How many assessments should I include?",
                id: "WhQFXx",
                description:
                  "first question in the organize section in the assessment plan builder",
              })}
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content>
            <p>
              {intl.formatMessage({
                defaultMessage:
                  "Every skill you have identified on your poster needs to be assessed through at least one method. In cases where you are relying on claims made by a candidate (e.g. the initial application) you need to select an additional assessment method to test or validate the applicant's claim to have a skill. In most cases this will mean that you have two to three additional assessment methods beyond the initial application.",
                id: "Y+GgIV",
                description:
                  "First paragraph of first answer of the Frequently Asked Questions for logging in",
              })}
            </p>
            <p data-h2-margin-top="base(x.5)">
              {intl.formatMessage({
                defaultMessage:
                  "You do not need to assess each essential criteria through each assessment method. For example, technical skills claims from applicants are often best validated through some form of exam or technical interview question, while behavioural skills are often best validated through interview or reference check.",
                id: "VAI+TU",
                description:
                  "Second paragraph of second answer of the Frequently Asked Questions for logging in",
              })}
            </p>
          </Accordion.Content>
        </Accordion.Item>
        <Accordion.Item value="two">
          <Accordion.Header
            headingAs="h4"
            data-h2-font-size="base(copy)"
            data-h2-text-decoration="base(underline)"
          >
            <Accordion.Trigger data-h2-font-weight="base(700)">
              {intl.formatMessage(
                {
                  defaultMessage:
                    "What if I need more than {maxSteps} assessment methods?",
                  id: "LphzpW",
                  description:
                    "second question in the organize section in the assessment plan builder",
                },
                {
                  maxSteps: MAX_ASSESSMENT_STEPS,
                },
              )}
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content>
            <p>
              {intl.formatMessage(
                {
                  defaultMessage:
                    'Ultimately, it\'s the decision of the hiring panel or manager to determine how many assessment methods are appropriate. If you have more than {maxSteps}, select "Additional Assessment" for your last choice, and then reach out to our team. We can walk you through how these additional assessments can be handled on the platform.',
                  id: "9IMcqY",
                  description:
                    "First paragraph of second answer of the Frequently Asked Questions for logging in",
                },
                {
                  maxSteps: MAX_ASSESSMENT_STEPS,
                },
              )}
            </p>
          </Accordion.Content>
        </Accordion.Item>
      </Accordion.Root>
      <div data-h2-margin-top="base(x1)">
        {/* TODO: replace with repeater cards */}
        {pool.assessmentSteps
          ?.filter(notEmpty)
          .sort((a: AssessmentStep, b: AssessmentStep) =>
            (a.sortOrder ?? 0) > (b.sortOrder ?? 0) ? 1 : -1,
          )
          .map((step: AssessmentStep) => (
            <div key={step.id}>
              <p>{step.type}</p>
              <p>{getLocalizedName(step.title, intl)}</p>
            </div>
          ))}
        {/* TODO: Adding some strings for translation that will be needed later */}
        {intl.formatMessage({
          defaultMessage: "Add a new assessment",
          id: "VWLWLY",
          description:
            "Button text to add a new assessment to the assessment plan",
        })}
        {intl.formatMessage({
          defaultMessage: "You have too few assessments",
          id: "ypxaI2",
          description:
            "Title for warning message when the user has few assessments to the assessment plan",
        })}
        {intl.formatMessage({
          defaultMessage:
            "Consider adding at least one assessment method to strengthen the quality of your candidate pool.",
          id: "xCoGIm",
          description:
            "Description for warning message when the user has few assessments to the assessment plan",
        })}
        {intl.formatMessage({
          defaultMessage: "You are approaching the limit!",
          id: "1moJ8r",
          description:
            "Title for warning message when the user has added many assessments to the assessment plan",
        })}
        {intl.formatMessage(
          {
            defaultMessage:
              "You can add up to {maxSteps} assessment methods, but you don't need to. You are covered as long as every skill has been taken into account. Choosing too many assessment methods can delay the staffing process and reduce the chances of a successful hire.",
            id: "J/JdxQ",
            description:
              "Description for warning message when the user has added many assessments to the assessment plan",
          },
          {
            maxSteps: MAX_ASSESSMENT_STEPS,
          },
        )}
        <AssessmentDetailsDialog
          mode="regular"
          allPoolSkills={pool.poolSkills?.filter(notEmpty) ?? []}
        />
        <AssessmentDetailsDialog
          mode="screening_question"
          allPoolSkills={pool.poolSkills?.filter(notEmpty) ?? []}
        />
      </div>
    </>
  );
};

export default OrganizeSection;
