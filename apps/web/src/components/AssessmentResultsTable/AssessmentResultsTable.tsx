/* eslint-disable formatjs/no-literal-string-in-jsx */
import { useIntl } from "react-intl";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import uniqueId from "lodash/uniqueId";

import { getLocale, getLocalizedName } from "@gc-digital-talent/i18n";
import {
  AssessmentResultType,
  AssessmentStep,
  FragmentType,
  getFragment,
  graphql,
  PoolSkillType,
  AssessmentResultsTableFragment as AssessmentResultsTableFragmentType,
  Experience,
} from "@gc-digital-talent/graphql";
import { notEmpty, unpackMaybes } from "@gc-digital-talent/helpers";
import { Well } from "@gc-digital-talent/ui";

import Table from "~/components/Table/ResponsiveTable/ResponsiveTable";
import adminMessages from "~/messages/adminMessages";
import { getOrderedSteps } from "~/utils/poolCandidate";
import processMessages from "~/messages/processMessages";

import cells from "../Table/cells";
import { buildColumn, columnHeader, columnStatus } from "./utils";
import {
  AssessmentResultsTableFragmentStepType,
  AssessmentTableRow,
} from "./types";

const columnHelper = createColumnHelper<AssessmentTableRow>();

export const AssessmentResultsTable_Fragment = graphql(/* GraphQL */ `
  fragment AssessmentResultsTable on PoolCandidate {
    id
    profileSnapshot
    educationRequirementOption {
      value
      label {
        en
        fr
      }
    }
    educationRequirementExperiences {
      id
    }
    screeningQuestionResponses {
      id
      answer
      screeningQuestion {
        id
        question {
          en
          fr
        }
      }
    }
    assessmentStatus {
      currentStep
      overallAssessmentStatus
    }
    assessmentResults {
      id
      assessmentDecision {
        value
        label {
          en
          fr
        }
      }
      assessmentDecisionLevel {
        value
        label {
          en
          fr
        }
      }
      assessmentResultType
      assessmentStep {
        id
        type {
          value
          label {
            en
            fr
          }
        }
        title {
          en
          fr
        }
      }
      justifications {
        value
        label {
          en
          fr
        }
      }
      assessmentDecisionLevel {
        value
        label {
          en
          fr
        }
      }
      skillDecisionNotes
      poolSkill {
        id
      }
    }
    pool {
      id
      publishingGroup {
        value
        label {
          en
          fr
        }
      }
      name {
        en
        fr
      }
      classification {
        id
        group
        level
      }
      assessmentSteps {
        id
        title {
          en
          fr
        }
        type {
          value
          label {
            en
            fr
          }
        }
        sortOrder
        poolSkills {
          id
        }
      }
      poolSkills {
        id
        type {
          value
          label {
            en
            fr
          }
        }
        skill {
          id
          category {
            value
            label {
              en
              fr
            }
          }
          key
          name {
            en
            fr
          }
        }
      }
    }
  }
`);

interface AssessmentResultsTableProps {
  poolCandidateQuery: FragmentType<typeof AssessmentResultsTable_Fragment>;
  experiences: Omit<Experience, "user">[];
}

const AssessmentResultsTable = ({
  poolCandidateQuery,
  experiences,
}: AssessmentResultsTableProps) => {
  const intl = useIntl();
  const locale = getLocale(intl);
  const poolCandidate = getFragment(
    AssessmentResultsTable_Fragment,
    poolCandidateQuery,
  );

  // Get assessment steps from pool
  const assessmentSteps: AssessmentStep[] = unpackMaybes(
    poolCandidate?.pool?.assessmentSteps,
  );

  if (!assessmentSteps.length) {
    return (
      <Well>
        <p>{intl.formatMessage(processMessages.noAssessmentPlan)}</p>
      </Well>
    );
  }

  // Get pool skills from pool
  const poolSkills = unpackMaybes(poolCandidate?.pool?.poolSkills);

  // Get assessment results from pool candidate
  const assessmentResultsMaybes: AssessmentResultsTableFragmentType["assessmentResults"] =
    unpackMaybes(poolCandidate?.assessmentResults);
  const assessmentResults = assessmentResultsMaybes.filter(notEmpty);

  // Create data for table containing pool skill with matching results and sort pool skills
  const assessmentTableRows: AssessmentTableRow[] = poolSkills
    .map((poolSkill) => {
      const matchingAssessmentResults = assessmentResults.filter(
        (result) => result.poolSkill?.id === poolSkill.id,
      );
      return {
        poolSkill,
        assessmentResults: matchingAssessmentResults,
      };
    })
    .sort((a, b) => {
      if (
        a.poolSkill.type?.value === PoolSkillType.Essential &&
        b.poolSkill.type?.value === PoolSkillType.Nonessential
      ) {
        return -1;
      }

      if (
        a.poolSkill.type?.value === PoolSkillType.Nonessential &&
        b.poolSkill.type?.value === PoolSkillType.Essential
      ) {
        return 1;
      }

      return Intl.Collator().compare(
        a.poolSkill.skill?.name?.[locale] ?? "",
        b.poolSkill.skill?.name?.[locale] ?? "",
      );
    });

  const educationResults = assessmentResults.filter(
    (assessmentResult) =>
      assessmentResult.assessmentResultType === AssessmentResultType.Education,
  );

  // Create the education requirement assessment table row
  const educationTableRow: AssessmentTableRow = {
    poolSkill: undefined,
    assessmentResults: educationResults ?? [],
  };

  // Sort the pools assessment steps then build columns for the poolCandidates assessment results
  const sortedAssessmentSteps: AssessmentResultsTableFragmentStepType[] =
    getOrderedSteps(assessmentSteps);
  const assessmentStepColumns = sortedAssessmentSteps.reduce(
    (
      accumulator: ColumnDef<AssessmentTableRow>[],
      assessmentStep: AssessmentResultsTableFragmentStepType,
    ) => {
      const type = assessmentStep.type?.value ?? null;
      const id = uniqueId("results-table-column");
      const status = columnStatus(
        { id: assessmentStep.id },
        poolCandidate?.assessmentStatus,
      );

      const header = columnHeader(
        getLocalizedName(assessmentStep.type?.label, intl),
        status,
        type,
        intl,
      );

      return [
        ...accumulator,
        buildColumn({
          id,
          header,
          poolCandidate,
          experiences,
          assessmentStep: {
            id: assessmentStep.id,
            type: assessmentStep.type,
            title: assessmentStep.title,
            poolSkills: assessmentStep.poolSkills,
          },
          intl,
        }),
      ];
    },
    [],
  );

  // Insert skills header at top of columns order
  const requirementsColumn = columnHelper.accessor(
    ({ poolSkill }) => getLocalizedName(poolSkill?.skill?.name, intl),
    {
      id: "requirement",
      header: intl.formatMessage({
        defaultMessage: "Requirement",
        id: "jAWP0X",
        description:
          "Header for requirement section of assessment results table",
      }),
      cell: ({ row: { original } }) =>
        cells.jsx(
          <span>
            {original.poolSkill ? (
              <>
                <span data-h2-font-weight="base(bold)">
                  {getLocalizedName(original.poolSkill?.skill?.name, intl)}{" "}
                </span>
                <span>
                  ({getLocalizedName(original.poolSkill.type?.label, intl)})
                </span>
              </>
            ) : (
              <span data-h2-font-weight="base(bold)">
                {intl.formatMessage(processMessages.educationRequirement)}
              </span>
            )}
          </span>,
        ),
    },
  ) as ColumnDef<AssessmentTableRow>;

  const data = [educationTableRow, ...assessmentTableRows];
  const columns = [requirementsColumn, ...assessmentStepColumns];

  return (
    <Table<AssessmentTableRow>
      data={data}
      caption={intl.formatMessage(adminMessages.assessmentResults)}
      columns={columns}
    />
  );
};

export default AssessmentResultsTable;
