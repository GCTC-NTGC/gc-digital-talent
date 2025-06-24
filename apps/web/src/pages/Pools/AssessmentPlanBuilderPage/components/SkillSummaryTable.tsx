import { JSX } from "react";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { IntlShape, useIntl } from "react-intl";
import CheckIcon from "@heroicons/react/20/solid/CheckIcon";

import { commonMessages, getLocalizedName } from "@gc-digital-talent/i18n";
import {
  AssessmentStepType,
  FragmentType,
  LocalizedAssessmentStepType,
  Maybe,
  PoolSkillType,
  Skill,
  SkillCategory,
  getFragment,
  graphql,
  SkillSummaryPoolSkillFragment as SkillSummaryPoolSkillFragmentType,
  SkillSummaryTableAssessmentStepFragment as SkillSummaryAssessmentStepFragmentType,
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
        en
        fr
      }
    }
    skill {
      id
      key
      category {
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
    }
  }
`);

export const SkillSummaryTableAssessmentStep_Fragment = graphql(/* GraphQL */ `
  fragment SkillSummaryTableAssessmentStep on AssessmentStep {
    id
    type {
      value
      label {
        en
        fr
      }
    }
    sortOrder
    title {
      en
      fr
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
  skill: Skill | null | undefined,
  assessmentStepType: Maybe<LocalizedAssessmentStepType> | undefined,
): JSX.Element | null => {
  const intl = useIntl();
  if (!skill) {
    return null;
  }
  const { name } = skill;
  const localizedName = getLocalizedName(name, intl);
  const assessmentStepTypeLocalized = getLocalizedName(
    assessmentStepType?.label,
    intl,
  );

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
        { localizedName, assessmentStepTypeLocalized },
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
    return CheckIconElement(poolSkill.skill, assessmentStep.type);
  }
  return null;
};

const requirementTypeCell = ({ poolSkill, intl }: RequirementTypeCellProps) => {
  if (!poolSkill.type) return null;
  return poolSkill.type.value === PoolSkillType.Essential ? (
    <span className="font-bold text-secondary-600 dark:text-secondary-200">
      {getLocalizedName(poolSkill.type.label, intl)}
    </span>
  ) : (
    <span>{getLocalizedName(poolSkill.type.label, intl)}</span>
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
      ({ skill }) => getLocalizedName(skill?.category.label, intl),
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
      { type: assessmentStep.type, title: assessmentStep.title },
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
