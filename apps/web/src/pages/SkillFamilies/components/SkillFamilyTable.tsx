import React, { useMemo } from "react";
import { IntlShape, useIntl } from "react-intl";

import { getLocale, getSkillCategory } from "@gc-digital-talent/i18n";
import { notEmpty } from "@gc-digital-talent/helpers";
import { Pending } from "@gc-digital-talent/ui";

import useRoutes from "~/hooks/useRoutes";
import {
  SkillCategory,
  SkillFamily,
  useAllSkillFamiliesQuery,
} from "~/api/generated";
import Table, {
  ColumnsOf,
  tableEditButtonAccessor,
  Cell,
} from "~/components/Table/ClientManagedTable";

// callbacks extracted to separate function to stabilize memoized component
const categoryAccessor = (
  category: SkillCategory | null | undefined,
  intl: IntlShape,
) => (category ? intl.formatMessage(getSkillCategory(category as string)) : "");

type SkillFamilyCell = Cell<SkillFamily>;

interface SkillFamilyTableProps {
  skillFamilies: Array<SkillFamily>;
  title: string;
}

export const SkillFamilyTable = ({
  skillFamilies,
  title,
}: SkillFamilyTableProps) => {
  const intl = useIntl();
  const locale = getLocale(intl);
  const paths = useRoutes();
  const columns = useMemo<ColumnsOf<SkillFamily>>(
    () => [
      {
        Header: intl.formatMessage({
          defaultMessage: "ID",
          id: "ZobKCk",
          description: "Title displayed on the Skill Family table ID column.",
        }),
        accessor: "id",
      },
      {
        Header: intl.formatMessage({
          defaultMessage: "Name",
          id: "VphXhu",
          description:
            "Title displayed for the Skill Family table Name column.",
        }),
        accessor: (sf) => sf.name?.[locale],
      },
      {
        Header: intl.formatMessage({
          defaultMessage: "Description",
          id: "XSo129",
          description:
            "Title displayed for the Skill Family table Description column.",
        }),
        accessor: (sf) => sf.description?.[locale],
      },
      {
        Header: intl.formatMessage({
          defaultMessage: "Category",
          id: "m5RwGF",
          description:
            "Title displayed for the Skill Family table Category column.",
        }),
        accessor: ({ category }) => categoryAccessor(category, intl),
      },
      {
        Header: intl.formatMessage({
          defaultMessage: "Edit",
          id: "rJ36SS",
          description:
            "Title displayed for the Skill Family table Edit column.",
        }),
        id: "edit",
        accessor: (d) => `Edit ${d.id}`,
        disableGlobalFilter: true,
        Cell: ({ row: { original: skillFamily } }: SkillFamilyCell) =>
          tableEditButtonAccessor(
            skillFamily.id,
            paths.skillFamilyTable(),
            skillFamily.name?.[locale],
          ),
      },
    ],
    [paths, intl, locale],
  );

  const data = useMemo(() => skillFamilies.filter(notEmpty), [skillFamilies]);

  return (
    <Table
      data={data}
      columns={columns}
      addBtn={{
        path: paths.skillFamilyCreate(),
        label: intl.formatMessage({
          defaultMessage: "Create Skill Family",
          id: "TRqbR/",
          description: "Heading displayed above the Create Skill Family form.",
        }),
      }}
      title={title}
    />
  );
};

const SkillFamilyTableApi = ({ title }: { title: string }) => {
  const [result] = useAllSkillFamiliesQuery();
  const { data, fetching, error } = result;

  const skillFamilies = data?.skillFamilies.filter(notEmpty);

  return (
    <Pending fetching={fetching} error={error}>
      <SkillFamilyTable skillFamilies={skillFamilies || []} title={title} />
    </Pending>
  );
};

export default SkillFamilyTableApi;
