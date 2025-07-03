import { defineMessage, useIntl } from "react-intl";

import { Accordion, Heading } from "@gc-digital-talent/ui";
import { unpackMaybes } from "@gc-digital-talent/helpers";
import { FragmentType, getFragment, graphql } from "@gc-digital-talent/graphql";

import { PAGE_SECTION_ID } from "../navigation";
import SkillSummaryTable from "./SkillSummaryTable";

export const sectionTitle = defineMessage({
  defaultMessage: "Skill summary",
  id: "iNIXQ9",
  description:
    "Title for the skill summary section in the assessment plan builder",
});

const SkillSummarySectionPool_Fragment = graphql(/* GraphQL */ `
  fragment SkillSummarySectionPool on Pool {
    id
    poolSkills {
      ...SkillSummaryPoolSkill
    }
    assessmentSteps {
      ...SkillSummaryTableAssessmentStep
    }
  }
`);

interface SkillSummarySectionProps {
  poolQuery: FragmentType<typeof SkillSummarySectionPool_Fragment>;
}

const SkillSummarySection = ({ poolQuery }: SkillSummarySectionProps) => {
  const intl = useIntl();
  const pool = getFragment(SkillSummarySectionPool_Fragment, poolQuery);
  return (
    <>
      <Heading
        level="h3"
        id={PAGE_SECTION_ID.SKILL_SUMMARY}
        className="mt-18 mb-6"
      >
        {intl.formatMessage(sectionTitle)}
      </Heading>
      <p className="my-6">
        {intl.formatMessage({
          defaultMessage:
            "Overview of all skills and assessments planned for this process.",
          id: "S/R0ne",
          description:
            "introduction to the skill summary section in the assessment plan builder",
        })}
      </p>
      <Accordion.Root type="multiple" size="sm">
        <Accordion.Item value="one">
          <Accordion.Trigger as="h4">
            {intl.formatMessage({
              defaultMessage:
                "Why are most behavioral skills left out of the initial application?",
              id: "dVZRH3",
              description:
                "first question in the skill summary section in the assessment plan builder",
            })}
          </Accordion.Trigger>
          <Accordion.Content>
            <p className="mb-3">
              {intl.formatMessage({
                defaultMessage:
                  "On the initial application, only technical information is collected from the applicants, except for a few very special behavioural skills. This means that as the reviewer, when you see the application information, you'll only have experience data related to the technical skills and a few very specific behavioural skills. This is done for two reasons.",
                id: "U9jw1M",
                description:
                  "First paragraph of first answer of the Frequently Asked Questions for logging in",
              })}
            </p>
            <p className="mb-3">
              {intl.formatMessage({
                defaultMessage:
                  "Firstly, asking for too much information on a job application can drive away strong candidates who feel the process is too cumbersome. You'll need to find a balance between how much you want to ask for and how long it will take an applicant to complete the process if you want the chance to recruit top candidates.",
                id: "Ag8BE0",
                description:
                  "Second paragraph of first answer of the Frequently Asked Questions for logging in",
              })}
            </p>
            <p>
              {intl.formatMessage({
                defaultMessage:
                  "Secondly, after a year-long live pilot test, managers reported that they didn't find the self-reported information on behavioural skills to be useful. Instead, they found other forms of assessment (such as reference checks and interviews) to be far better predictors than long paragraphs about how collaborative, positive or inclusive a candidate self-assessed as being.",
                id: "zrEIiB",
                description:
                  "Third paragraph of first answer of the Frequently Asked Questions for logging in",
              })}
            </p>
          </Accordion.Content>
        </Accordion.Item>
      </Accordion.Root>
      <div className="mt-6">
        <SkillSummaryTable
          poolSkillsQuery={unpackMaybes(pool.poolSkills)}
          assessmentStepsQuery={unpackMaybes(pool.assessmentSteps)}
          title={intl.formatMessage(sectionTitle)}
        />
      </div>
    </>
  );
};

export default SkillSummarySection;
