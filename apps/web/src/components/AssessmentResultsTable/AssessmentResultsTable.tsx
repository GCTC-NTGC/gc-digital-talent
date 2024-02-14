import React from "react";
import { useIntl } from "react-intl";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import uniqueId from "lodash/uniqueId";

import { commonMessages, getLocalizedName } from "@gc-digital-talent/i18n";
import { AssessmentResult } from "@gc-digital-talent/graphql";
import { notEmpty, unpackMaybes } from "@gc-digital-talent/helpers";
import {
  getAssessmentStepType,
  getPoolSkillType,
} from "@gc-digital-talent/i18n/src/messages/localizedConstants";

import Table from "~/components/Table/ResponsiveTable/ResponsiveTable";
import adminMessages from "~/messages/adminMessages";
import {
  AssessmentResultType,
  AssessmentStep,
  AssessmentStepType,
  PoolCandidate,
  PoolSkill,
} from "~/api/generated";

import cells from "../Table/cells";
import { buildColumn, columnStatus } from "./utils";
import { AssessmentStepResult } from "./types";

const columnHelper = createColumnHelper<AssessmentStepResult>();

interface AssessmentResultsTableProps {
  poolCandidate: PoolCandidate;
}

const AssessmentResultsTable = ({
  poolCandidate,
}: AssessmentResultsTableProps) => {
  const intl = useIntl();

  // Get assessment steps from pool
  const assessmentSteps: Array<AssessmentStep> = React.useMemo(() => {
    return unpackMaybes(poolCandidate?.pool?.assessmentSteps);
  }, [poolCandidate.pool.assessmentSteps]);

  // Get all pool skills from assessment steps and remove duplicates
  const poolSkills: Array<PoolSkill> = React.useMemo(() => {
    return unpackMaybes(poolCandidate?.pool?.poolSkills);
  }, [poolCandidate.pool.poolSkills]);

  // create assessment step results from pool skills
  const assessmentResults: Array<AssessmentResult> = React.useMemo(() => {
    return unpackMaybes(poolCandidate?.assessmentResults);
  }, [poolCandidate.assessmentResults]);

  // Create data for table containing pool skill with matching results
  const assessmentStepsResults: Array<AssessmentStepResult> = poolSkills.map(
    (poolSkill) => {
      const matchingAssessmentResults = assessmentResults.filter(
        (result) => result.poolSkill?.id === poolSkill.id,
      );
      return {
        poolSkill,
        assessmentResults: matchingAssessmentResults,
      };
    },
  );

  const educationResults = assessmentSteps
    .find(
      (assessmentStep) =>
        assessmentStep.type === AssessmentStepType.ApplicationScreening,
    )
    ?.assessmentResults?.filter(notEmpty)
    .filter(
      (assessmentResult) =>
        assessmentResult.assessmentResultType ===
        AssessmentResultType.Education,
    );

  // Create the education requirement assessment step result
  const educationStepResult: AssessmentStepResult = {
    poolSkill: undefined,
    assessmentResults: educationResults ?? [],
  };

  const getColumns = () => {
    // Sort the pools assessment steps then build columns for the poolCandidates assessment results
    const sortedAssessmentSteps = assessmentSteps.sort((a, b) => {
      if (a.sortOrder && b.sortOrder) {
        return a.sortOrder - b.sortOrder;
      }

      if (a.title && b.title) {
        return Intl.Collator(intl.locale).compare(
          getLocalizedName(a.title, intl),
          getLocalizedName(b.title, intl),
        );
      }

      return 0;
    });
    const columns = sortedAssessmentSteps.reduce(
      (
        accumulator: ColumnDef<AssessmentStepResult>[],
        assessmentStep: AssessmentStep,
      ) => {
        const type = assessmentStep.type ?? "unknownType"; // Should always have a type, if not return localized error
        const id =
          getAssessmentStepType(type).id ?? uniqueId("results-table-column");
        const header = intl.formatMessage(getAssessmentStepType(type));
        const status = columnStatus(assessmentStep, assessmentResults);

        return [
          ...accumulator,
          buildColumn({
            id,
            header,
            poolCandidate,
            assessmentStep,
            intl,
            status,
          }),
        ];
      },
      [],
    );

    return [
      // Insert skills header at top of columns order
      columnHelper.accessor(
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
              <div>
                {original.poolSkill ? (
                  <>
                    <p data-h2-font-weight="base(bold)">
                      {getLocalizedName(original.poolSkill?.skill?.name, intl)}
                    </p>
                    <p>
                      (
                      {intl.formatMessage(
                        original.poolSkill?.type
                          ? getPoolSkillType(original.poolSkill.type)
                          : commonMessages.notFound,
                      )}
                      )
                    </p>
                  </>
                ) : (
                  <p data-h2-font-weight="base(bold)">
                    {intl.formatMessage({
                      defaultMessage: "Education requirement",
                      id: "4xXPIe",
                      description: "Education requirement row header.",
                    })}
                  </p>
                )}
              </div>,
            ),
        },
      ) as ColumnDef<AssessmentStepResult>,
      ...columns,
    ];
  };

  const data = [educationStepResult, ...assessmentStepsResults];

  return (
    <Table<AssessmentStepResult>
      data={data}
      caption={intl.formatMessage(adminMessages.assessmentResults)}
      columns={getColumns()}
    />
  );
};

export default AssessmentResultsTable;
