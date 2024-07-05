import { useIntl } from "react-intl";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import uniqueId from "lodash/uniqueId";

import { getLocale, getLocalizedName } from "@gc-digital-talent/i18n";
import {
  AssessmentResult,
  AssessmentResultType,
  AssessmentStep,
  PoolCandidate,
  PoolSkill,
  PoolSkillType,
} from "@gc-digital-talent/graphql";
import { unpackMaybes } from "@gc-digital-talent/helpers";
import { Well } from "@gc-digital-talent/ui";

import Table from "~/components/Table/ResponsiveTable/ResponsiveTable";
import adminMessages from "~/messages/adminMessages";
import { getOrderedSteps } from "~/utils/poolCandidate";
import processMessages from "~/messages/processMessages";

import cells from "../Table/cells";
import { buildColumn, columnHeader, columnStatus } from "./utils";
import { AssessmentTableRow } from "./types";

const columnHelper = createColumnHelper<AssessmentTableRow>();

interface AssessmentResultsTableProps {
  poolCandidate: PoolCandidate;
}

const AssessmentResultsTable = ({
  poolCandidate,
}: AssessmentResultsTableProps) => {
  const intl = useIntl();
  const locale = getLocale(intl);

  // Get assessment steps from pool
  const assessmentSteps: Array<AssessmentStep> = unpackMaybes(
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
  const poolSkills: Array<PoolSkill> = unpackMaybes(
    poolCandidate?.pool?.poolSkills,
  );

  // Get assessment results from pool candidate
  const assessmentResults: Array<AssessmentResult> = unpackMaybes(
    poolCandidate?.assessmentResults,
  );

  // Create data for table containing pool skill with matching results and sort pool skills
  const assessmentTableRows: Array<AssessmentTableRow> = poolSkills
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
        a.poolSkill.skill?.name?.[locale] || "",
        b.poolSkill.skill?.name?.[locale] || "",
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
  const sortedAssessmentSteps = getOrderedSteps(assessmentSteps);
  const assessmentStepColumns = sortedAssessmentSteps.reduce(
    (
      accumulator: ColumnDef<AssessmentTableRow>[],
      assessmentStep: AssessmentStep,
    ) => {
      const type = assessmentStep.type?.value ?? null;
      const id = uniqueId("results-table-column");
      const status = columnStatus(assessmentStep, [
        ...educationResults,
        ...assessmentResults,
      ]);
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
          assessmentStep,
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
                {/* TODO: ADD PoolSkill.skillLevel here --> {original.poolSkill.type === PoolSkillType.Essential && <span>{intl.formatMessage(getTechnicalSkillLevel(original.poolSkill.skillLevel))}</span> */}
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
