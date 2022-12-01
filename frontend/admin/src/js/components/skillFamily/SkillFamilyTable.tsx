import React, { useMemo } from "react";
import { IntlShape, useIntl } from "react-intl";
import { getLocale } from "@common/helpers/localize";
import { useLocation } from "react-router-dom";
import { notEmpty } from "@common/helpers/util";
import { FromArray } from "@common/types/utilityTypes";
import { getSkillCategory } from "@common/constants/localizedConstants";
import { SkillCategory } from "@common/api/generated";
import Pending from "@common/components/Pending";
import {
  AllSkillFamiliesQuery,
  useAllSkillFamiliesQuery,
} from "../../api/generated";
import Table, { ColumnsOf, tableEditButtonAccessor } from "../Table";
import { useAdminRoutes } from "../../adminRoutes";

type Data = NonNullable<FromArray<AllSkillFamiliesQuery["skillFamilies"]>>;

// callbacks extracted to separate function to stabilize memoized component
const categoryAccessor = (
  category: SkillCategory | null | undefined,
  intl: IntlShape,
) => (
  <span>
    {category ? intl.formatMessage(getSkillCategory(category as string)) : ""}
  </span>
);

export const SkillFamilyTable: React.FC<
  AllSkillFamiliesQuery & { editUrlRoot: string }
> = ({ skillFamilies, editUrlRoot }) => {
  const intl = useIntl();
  const locale = getLocale(intl);
  const paths = useAdminRoutes();
  const columns = useMemo<ColumnsOf<Data>>(
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
        accessor: (sf) =>
          tableEditButtonAccessor(sf.id, editUrlRoot, sf.name?.[locale]), // callback extracted to separate function to stabilize memoized component
      },
    ],
    [editUrlRoot, intl, locale],
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
    />
  );
};

export const SkillFamilyTableApi: React.FunctionComponent = () => {
  const [result] = useAllSkillFamiliesQuery();
  const { data, fetching, error } = result;
  const { pathname } = useLocation();

  return (
    <Pending fetching={fetching} error={error}>
      <SkillFamilyTable
        skillFamilies={data?.skillFamilies ?? []}
        editUrlRoot={pathname}
      />
    </Pending>
  );
};
