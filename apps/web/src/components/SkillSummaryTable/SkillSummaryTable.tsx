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
  PoolSkillType,
  Skill,
  SkillCategory,
} from "@gc-digital-talent/graphql";
import { unpackMaybes } from "@gc-digital-talent/helpers";

import Table from "~/components/Table/ResponsiveTable/ResponsiveTable";
import cells from "~/components/Table/cells";

const columnHelper = createColumnHelper<PoolSkill>();

export interface SkillSummaryTableProps {
  poolSkills: Array<PoolSkill>;
  assessmentSteps: Array<AssessmentStep>;
  title: string;
}

const CheckCircleIconElement = (
  skill: Skill | null | undefined,
): JSX.Element | null => {
  const intl = useIntl();
  if (!skill) {
    return null;
  }
  const { name } = skill;
  const localizedName = getLocalizedName(name, intl);

  return (
    <CheckCircleIcon
      data-h2-width="base(x1)"
      data-h2-display="base(inline-block)"
      data-h2-vertical-align="base(bottom)"
      data-h2-margin="base(0, x.25, 0, 0) p-tablet(0, x0.5, 0, 0)"
      data-h2-color="base(success)"
      aria-label={intl.formatMessage(
        {
          defaultMessage: "{localizedName} has assessments",
          description:
            "Aria text for icon confirming a skill is connected to assessments.",
          id: "1WVTN6",
        },
        { localizedName },
      )}
    />
  );
};

const XCircleIconElement = (
  skill: Skill | null | undefined,
): JSX.Element | null => {
  const intl = useIntl();
  if (!skill) {
    return null;
  }
  const { name } = skill;
  const localizedName = getLocalizedName(name, intl);

  return (
    <XCircleIcon
      data-h2-width="base(x1)"
      data-h2-display="base(inline-block)"
      data-h2-vertical-align="base(bottom)"
      data-h2-margin="base(0, x.25, 0, 0) p-tablet(0, x0.5, 0, 0)"
      data-h2-color="base(error)"
      aria-label={intl.formatMessage(
        {
          defaultMessage: "{localizedName} missing assessments",
          description:
            "Aria text for icon indicating a skill is not connected to assessments.",
          id: "guN1wV",
        },
        { localizedName },
      )}
    />
  );
};

const CheckIconElement = (
  skill: Skill | null | undefined,
  assessmentStepType: AssessmentStepType,
): JSX.Element | null => {
  const intl = useIntl();
  if (!skill) {
    return null;
  }
  const { name } = skill;
  const localizedName = getLocalizedName(name, intl);
  const assessmentStepTypeLocalized = intl.formatMessage(
    getAssessmentStepType(assessmentStepType),
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

const SkillSummaryTable = ({
  title,
  poolSkills,
  assessmentSteps,
}: SkillSummaryTableProps) => {
  const intl = useIntl();

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

  const plannedAssessmentCell = (poolSkill: PoolSkill): JSX.Element | null => {
    return poolSkill.assessmentSteps && poolSkill.assessmentSteps.length > 0
      ? CheckCircleIconElement(poolSkill.skill)
      : XCircleIconElement(poolSkill.skill);
  };

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
      return CheckIconElement(poolSkill.skill, assessmentStep.type);
    }
    return null;
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
