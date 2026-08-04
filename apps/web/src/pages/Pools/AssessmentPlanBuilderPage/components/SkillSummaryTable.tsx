import type { JSX } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { createColumnHelper } from "@tanstack/react-table";
import type { IntlShape } from "react-intl";
import { useIntl } from "react-intl";
import CheckIcon from "@heroicons/react/20/solid/CheckIcon";

import { commonMessages } from "@gc-digital-talent/i18n";
import type {
  FragmentType,
  SkillSummaryPoolSkillFragment as SkillSummaryPoolSkillFragmentType,
  SkillSummaryTableAssessmentStepFragment as SkillSummaryAssessmentStepFragmentType,
} from "@gc-digital-talent/graphql";
import {
  AssessmentStepType,
  PoolSkillType,
  SkillCategory,
  getFragment,
  graphql,
} from "@gc-digital-talent/graphql";
import { Chip } from "@gc-digital-talent/ui";

import Table from "~/components/Table/ResponsiveTable/ResponsiveTable";
import cells from "~/components/Table/cells";

import { assessmentStepDisplayName } from "../utils";

export const SkillSummaryTablePoolSkill_Fragment = graphql(/* GraphQL */ `
  fragment SkillSummaryPoolSkill on PoolSkill {
    id
    type {
      value
      label {
        localized
      }
    }
    skill {
      id
      key
      category {
        value
        label {
          localized
        }
      }
      name {
        localized
      }
    }
  }
`);

export const SkillSummaryTableAssessmentStep_Fragment = graphql(/* GraphQL */ `
  fragment SkillSummaryTableAssessmentStep on AssessmentStep {
    id
    type {
      value
      label {
        localized
      }
    }
    sortOrder
    title {
      localized
    }
    poolSkills {
      id
    }
  }
`);

const columnHelper = createColumnHelper<SkillSummaryPoolSkillFragmentType>();

interface SkillSummaryTableProps {
  poolSkillsQuery: FragmentType<typeof SkillSummaryTablePoolSkill_Fragment>[];
  assessmentStepsQuery: FragmentType<
    typeof SkillSummaryTableAssessmentStep_Fragment
  >[];
  title: string;
}

const CheckIconElement = (
  localizedName: string | null | undefined,
  assessmentStepTypeLocalized: string | null | undefined,
): JSX.Element => {
  const intl = useIntl();
  const notAvailable = intl.formatMessage(commonMessages.notAvailable);

  return (
    <CheckIcon
      className="mr-1.5 inline-block size-6 align-bottom xs:mr-3"
      aria-label={intl.formatMessage(
        {
          defaultMessage:
            "{localizedName} assessed by {assessmentStepTypeLocalized}",
          description:
            "Aria text for icon indicating a skill to assessment step connection.",
          id: "4LVc9T",
        },
        {
          localizedName: localizedName ?? notAvailable,
          assessmentStepTypeLocalized:
            assessmentStepTypeLocalized ?? notAvailable,
        },
      )}
    />
  );
};

const plannedAssessmentCell = (
  poolSkill: SkillSummaryPoolSkillFragmentType,
  assessmentSteps: readonly SkillSummaryAssessmentStepFragmentType[],
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
                "{count, plural, one {# assessment} other {# assessments}}",
              id: "DEdQkH",
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

interface RequirementTypeCellProps {
  poolSkill: SkillSummaryPoolSkillFragmentType;
  intl: IntlShape;
}

const assessmentStepCell = (
  poolSkill: SkillSummaryPoolSkillFragmentType,
  assessmentStep: SkillSummaryAssessmentStepFragmentType,
  intl: IntlShape,
): JSX.Element | null => {
  // return early with specific message for certain combination
  if (
    poolSkill.skill?.category.value === SkillCategory.Behavioural &&
    assessmentStep.type?.value === AssessmentStepType.ApplicationScreening
  ) {
    return <span>{intl.formatMessage(commonMessages.notApplicable)}</span>;
  }

  if (
    assessmentStep.poolSkills?.some(
      (assessmentStepPoolSkill) => assessmentStepPoolSkill?.id === poolSkill.id,
    )
  ) {
    return CheckIconElement(
      poolSkill.skill?.name?.localized,
      assessmentStep.type?.label?.localized,
    );
  }
  return null;
};

const requirementTypeCell = ({ poolSkill, intl }: RequirementTypeCellProps) => {
  if (!poolSkill.type) return null;
  const label =
    poolSkill.type.label?.localized ??
    intl.formatMessage(commonMessages.notAvailable);
  return poolSkill.type.value === PoolSkillType.Essential ? (
    <span className="font-bold text-secondary-600 dark:text-secondary-200">
      {label}
    </span>
  ) : (
    <span>{label}</span>
  );
};

const SkillSummaryTable = ({
  title,
  poolSkillsQuery,
  assessmentStepsQuery,
}: SkillSummaryTableProps) => {
  const intl = useIntl();
  const poolSkills = getFragment(
    SkillSummaryTablePoolSkill_Fragment,
    poolSkillsQuery,
  );
  const assessmentSteps = getFragment(
    SkillSummaryTableAssessmentStep_Fragment,
    assessmentStepsQuery,
  );

  const initialColumns = [
    columnHelper.accessor(
      (row) =>
        row.skill?.name?.localized ??
        intl.formatMessage(commonMessages.notAvailable),
      {
        id: "skillName",
        header: intl.formatMessage({
          defaultMessage: "Skill name",
          id: "hjxxaQ",
          description: "Skill name column header for the skill library table",
        }),
        enableHiding: false,
      },
    ),
    columnHelper.display({
      id: "plannedAssessment",
      header: intl.formatMessage({
        defaultMessage: "Number of assessments",
        id: "9t56Ev",
        description:
          "Title for a column that displays the number of assessments planned for a skill.",
      }),
      cell: ({ row: { original: poolSkill } }) =>
        cells.jsx(
          plannedAssessmentCell({ id: poolSkill.id }, assessmentSteps, intl),
        ),
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
        cells.jsx(requirementTypeCell({ poolSkill, intl })),
    }),
    columnHelper.accessor(
      ({ skill }) =>
        skill?.category.label?.localized ??
        intl.formatMessage(commonMessages.notAvailable),
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
  ] as ColumnDef<SkillSummaryPoolSkillFragmentType>[];

  let columns = initialColumns;
  // ensure array of assessments is sorted by sortOrder, if null bump to end, then add them to the core columns
  const sortedAssessmentSteps = [...assessmentSteps].sort((a, b) => {
    const aPosition = a.sortOrder ?? 100;
    const bPosition = b.sortOrder ?? 100;
    return aPosition > bPosition ? 1 : -1;
  });
  sortedAssessmentSteps.forEach((assessmentStep) => {
    const headerName = assessmentStepDisplayName(
      assessmentStep.title?.localized,
      assessmentStep.type?.label?.localized,
      intl,
    );
    const newColumn = columnHelper.display({
      id: assessmentStep.type?.value ?? assessmentStep.id,
      header: headerName,
      cell: ({ row: { original: poolSkill } }) =>
        cells.jsx(
          assessmentStepCell(
            { id: poolSkill.id, skill: poolSkill.skill },
            {
              id: assessmentStep.id,
              type: assessmentStep.type,
              poolSkills: assessmentStep.poolSkills,
            },
            intl,
          ),
        ),
      enableHiding: false,
    });
    columns = [...columns, newColumn];
  });

  return (
    <Table<SkillSummaryPoolSkillFragmentType>
      data={[...poolSkills]}
      caption={title}
      columns={columns}
    />
  );
};

export default SkillSummaryTable;
