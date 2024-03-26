import React from "react";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { IntlShape, useIntl } from "react-intl";
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
  Maybe,
  PoolSkill,
  PoolSkillType,
  Skill,
  SkillCategory,
} from "@gc-digital-talent/graphql";
import { Chip } from "@gc-digital-talent/ui";

import Table from "~/components/Table/ResponsiveTable/ResponsiveTable";
import cells from "~/components/Table/cells";

import { assessmentStepDisplayName } from "../utils";

const columnHelper = createColumnHelper<PoolSkill>();

export interface SkillSummaryTableProps {
  poolSkills: Array<PoolSkill>;
  assessmentSteps: Array<AssessmentStep>;
  title: string;
}

const CheckIconElement = (
  skill: Skill | null | undefined,
  assessmentStepType: Maybe<AssessmentStepType> | undefined,
): JSX.Element | null => {
  const intl = useIntl();
  if (!skill) {
    return null;
  }
  const { name } = skill;
  const localizedName = getLocalizedName(name, intl);
  const assessmentStepTypeLocalized = intl.formatMessage(
    assessmentStepType
      ? getAssessmentStepType(assessmentStepType)
      : commonMessages.nameNotLoaded,
  );

  return (
    <CheckIcon
      data-h2-width="base(x1)"
      data-h2-display="base(inline-block)"
      data-h2-vertical-align="base(bottom)"
      data-h2-margin="base(0, x.25, 0, 0) p-tablet(0, x0.5, 0, 0)"
      aria-label={intl.formatMessage(
        {
          defaultMessage:
            "{localizedName} assessed by {assessmentStepTypeLocalized}",
          description:
            "Aria text for icon indicating a skill to assessment step connection.",
          id: "4LVc9T",
        },
        { localizedName, assessmentStepTypeLocalized },
      )}
    />
  );
};

const plannedAssessmentCell = (
  poolSkill: PoolSkill,
  assessmentSteps: AssessmentStep[],
  intl: IntlShape,
): JSX.Element | null => {
  const assessmentCount = assessmentSteps.filter((assessmentStep) =>
    assessmentStep.poolSkills?.some(
      (assessmentStepPoolSkill) => assessmentStepPoolSkill?.id === poolSkill.id,
    ),
  );
  return (
    <Chip color={assessmentCount.length > 0 ? "success" : "error"}>
      {assessmentCount.length > 0
        ? intl.formatMessage(
            {
              defaultMessage:
                "{count, plural, =1 {# assessment} other {# assessments}}",
              id: "XOFVsC",
              description: "Number of assessments for a skill",
            },
            {
              count: assessmentCount.length,
            },
          )
        : intl.formatMessage({
            defaultMessage: "Missing assessments",
            id: "O2QLD8",
            description: "No assessments for a skill",
          })}
    </Chip>
  );
};

const SkillSummaryTable = ({
  title,
  poolSkills,
  assessmentSteps,
}: SkillSummaryTableProps) => {
  const intl = useIntl();

  const requirementTypeCell = (poolSkill: PoolSkill): JSX.Element | null => {
    if (poolSkill?.type) {
      return poolSkill.type === PoolSkillType.Essential ? (
        <span
          data-h2-color="base(primary.darker)"
          data-h2-font-weight="base(700)"
        >
          {intl.formatMessage(getPoolSkillType(poolSkill.type))}
        </span>
      ) : (
        <span>{intl.formatMessage(getPoolSkillType(poolSkill.type))}</span>
      );
    }
    return null;
  };

  const assessmentStepCell = (
    poolSkill: PoolSkill,
    assessmentStep: AssessmentStep,
  ): JSX.Element | null => {
    // return early with specific message for certain combination
    if (
      poolSkill.skill?.category === SkillCategory.Behavioural &&
      assessmentStep.type === AssessmentStepType.ApplicationScreening
    ) {
      return <span>{intl.formatMessage(commonMessages.notApplicable)}</span>;
    }

    if (
      assessmentStep.poolSkills?.some(
        (assessmentStepPoolSkill) =>
          assessmentStepPoolSkill?.id === poolSkill.id,
      )
    ) {
      return CheckIconElement(poolSkill.skill, assessmentStep.type);
    }
    return null;
  };

  const initialColumns = [
    columnHelper.accessor((row) => getLocalizedName(row.skill?.name, intl), {
      id: "skillName",
      header: intl.formatMessage({
        defaultMessage: "Skill name",
        id: "hjxxaQ",
        description: "Skill name column header for the skill library table",
      }),
      enableHiding: false,
    }),
    columnHelper.display({
      id: "plannedAssessment",
      header: intl.formatMessage({
        defaultMessage: "No. of assessments",
        id: "ofU598",
        description:
          "Title for a column that displays the numer of assessments planned for a skill.",
      }),
      cell: ({ row: { original: poolSkill } }) =>
        cells.jsx(plannedAssessmentCell(poolSkill, assessmentSteps, intl)),
      enableHiding: false,
    }),
    columnHelper.display({
      id: "type",
      header: intl.formatMessage({
        defaultMessage: "Requirement type",
        id: "o5g1d/",
        description:
          "Column title for whether a skill is either required or just an asset.",
      }),
      enableHiding: false,
      cell: ({ row: { original: poolSkill } }) =>
        cells.jsx(requirementTypeCell(poolSkill)),
    }),
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
  assessmentSteps.sort((a, b) => {
    const aPosition = a.sortOrder ?? 100;
    const bPosition = b.sortOrder ?? 100;
    return aPosition > bPosition ? 1 : -1;
  });
  assessmentSteps.forEach((assessmentStep) => {
    const headerName = assessmentStepDisplayName(assessmentStep, intl);
    const newColumn = columnHelper.display({
      id: assessmentStep.type ?? assessmentStep.id,
      header: headerName,
      cell: ({ row: { original: poolSkill } }) =>
        cells.jsx(assessmentStepCell(poolSkill, assessmentStep)),
      enableHiding: false,
    });
    columns = [...columns, newColumn];
  });

  return (
    <Table<PoolSkill> data={poolSkills} caption={title} columns={columns} />
  );
};

export default SkillSummaryTable;
