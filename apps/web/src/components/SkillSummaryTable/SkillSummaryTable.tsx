import React from "react";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { useIntl } from "react-intl";
import XCircleIcon from "@heroicons/react/24/solid/XCircleIcon";
import CheckCircleIcon from "@heroicons/react/20/solid/CheckCircleIcon";
import CheckIcon from "@heroicons/react/20/solid/CheckIcon";

import {
  commonMessages,
  getAssessmentStepType,
  getLocalizedName,
  getPoolSkillType,
  getSkillCategory,
} from "@gc-digital-talent/i18n";
import {
  AssessmentStep,
  AssessmentStepType,
  PoolSkill,
  SkillCategory,
} from "@gc-digital-talent/graphql";
import { unpackMaybes } from "@gc-digital-talent/forms";

import Table from "~/components/Table/ResponsiveTable/ResponsiveTable";
import cells from "~/components/Table/cells";

const columnHelper = createColumnHelper<PoolSkill>();

export interface SkillSummaryTableProps {
  poolSkills: Array<PoolSkill>;
  assessmentSteps: Array<AssessmentStep>;
  title: string;
}

const SkillSummaryTable = ({
  title,
  poolSkills,
  assessmentSteps,
}: SkillSummaryTableProps) => {
  const intl = useIntl();

  const CheckCircleIconElement = (
    <CheckCircleIcon
      data-h2-width="base(x1)"
      data-h2-display="base(inline-block)"
      data-h2-vertical-align="base(bottom)"
      data-h2-margin="base(0, x.25, 0, 0) p-tablet(0, x0.5, 0, 0)"
      data-h2-color="base(success)"
    />
  );
  const XCircleIconElement = (
    <XCircleIcon
      data-h2-width="base(x1)"
      data-h2-display="base(inline-block)"
      data-h2-vertical-align="base(bottom)"
      data-h2-margin="base(0, x.25, 0, 0) p-tablet(0, x0.5, 0, 0)"
      data-h2-color="base(error)"
    />
  );
  const CheckIconElement = (
    <CheckIcon
      data-h2-width="base(x1)"
      data-h2-display="base(inline-block)"
      data-h2-vertical-align="base(bottom)"
      data-h2-margin="base(0, x.25, 0, 0) p-tablet(0, x0.5, 0, 0)"
    />
  );

  const generateAssessmentStepHeader = (
    assessmentStep: AssessmentStep,
  ): string => {
    if (assessmentStep.title && assessmentStep.type) {
      return `${getLocalizedName(
        assessmentStep.title,
        intl,
      )} (${intl.formatMessage(getAssessmentStepType(assessmentStep.type))})`;
    }

    if (!assessmentStep.title && assessmentStep.type) {
      return intl.formatMessage(getAssessmentStepType(assessmentStep.type));
    }

    if (assessmentStep.title && !assessmentStep.type) {
      return getLocalizedName(assessmentStep.title, intl);
    }

    return intl.formatMessage(commonMessages.notAvailable);
  };

  const plannedAssessmentCell = (poolSkill: PoolSkill): JSX.Element => {
    return poolSkill.assessmentSteps && poolSkill.assessmentSteps.length > 0
      ? CheckCircleIconElement
      : XCircleIconElement;
  };

  const assessmentStepCell = (
    poolSkill: PoolSkill,
    assessmentStep: AssessmentStep,
  ): JSX.Element => {
    // return early with specific message for certain combination
    if (
      poolSkill.skill?.category === SkillCategory.Behavioural &&
      assessmentStep.type === AssessmentStepType.ApplicationScreening
    ) {
      return <span>{intl.formatMessage(commonMessages.notApplicable)}</span>;
    }

    const poolSkillsAssessmentTypes = poolSkill.assessmentSteps
      ? poolSkill.assessmentSteps.map((instance) =>
          instance && instance.type ? instance.type : undefined,
        )
      : [];
    const filteredPoolSkillsAssessments = unpackMaybes(
      poolSkillsAssessmentTypes,
    );
    if (
      assessmentStep.type &&
      filteredPoolSkillsAssessments.includes(assessmentStep.type)
    ) {
      return CheckIconElement;
    }
    return <span />;
  };

  const initialColumns = [
    columnHelper.display({
      id: "plannedAssessment",
      header: intl.formatMessage({
        defaultMessage: "Planned assessment",
        id: "AxKi2s",
        description:
          "Title for a column that displays a complete or not state.",
      }),
      cell: ({ row: { original: poolSkill } }) =>
        cells.jsx(plannedAssessmentCell(poolSkill)),
      enableHiding: false,
    }),
    columnHelper.accessor((row) => getLocalizedName(row.skill?.name, intl), {
      id: "skillName",
      header: intl.formatMessage({
        defaultMessage: "Skill name",
        id: "hjxxaQ",
        description: "Skill name column header for the skill library table",
      }),
      enableHiding: false,
    }),
    columnHelper.accessor(
      (row) => (row.type ? intl.formatMessage(getPoolSkillType(row.type)) : ""),
      {
        id: "type",
        header: intl.formatMessage({
          defaultMessage: "Requirement type",
          id: "o5g1d/",
          description:
            "Column title for whether a skill is either required or just an asset.",
        }),
        enableHiding: false,
      },
    ),
    columnHelper.accessor(
      (row) =>
        row.skill
          ? intl.formatMessage(getSkillCategory(row.skill.category))
          : "",
      {
        id: "skillCategory",
        header: intl.formatMessage({
          defaultMessage: "Skill category",
          id: "piZjS+",
          description: "Label for the skill category filter field",
        }),
        enableHiding: false,
      },
    ),
  ] as ColumnDef<PoolSkill>[];

  let columns = initialColumns;
  // ensure array of assessments is sorted by sortOrder, if null bump to end, then add them to the core columns
  const sortedAssessmentSteps = assessmentSteps.sort((a, b) => {
    const aPosition = a.sortOrder ?? 100;
    const bPosition = b.sortOrder ?? 100;
    return aPosition > bPosition ? 1 : -1;
  });
  sortedAssessmentSteps.forEach((element) => {
    const headerName = generateAssessmentStepHeader(element);
    const newColumn = columnHelper.display({
      id: element.type ?? element.id,
      header: headerName,
      cell: ({ row: { original: poolSkill } }) =>
        cells.jsx(assessmentStepCell(poolSkill, element)),
      enableHiding: false,
    });
    columns = [...columns, newColumn];
  });

  return (
    <Table<PoolSkill> data={poolSkills} caption={title} columns={columns} />
  );
};

export default SkillSummaryTable;
