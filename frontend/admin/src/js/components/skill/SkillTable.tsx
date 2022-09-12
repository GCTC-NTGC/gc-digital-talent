import React, { useMemo } from "react";
import { useIntl } from "react-intl";
import { getLocale } from "@common/helpers/localize";
import { useLocation } from "@common/helpers/router";
import { notEmpty } from "@common/helpers/util";
import { FromArray } from "@common/types/utilityTypes";
import { Pill } from "@common/components";
import Pending from "@common/components/Pending";
import { AllSkillsQuery, useAllSkillsQuery } from "../../api/generated";
import Table, { ColumnsOf, tableEditButtonAccessor } from "../Table";
import { useAdminRoutes } from "../../adminRoutes";

type Data = NonNullable<FromArray<AllSkillsQuery["skills"]>>;

export const SkillTable: React.FC<AllSkillsQuery & { editUrlRoot: string }> = ({
  skills,
  editUrlRoot,
}) => {
  const intl = useIntl();
  const locale = getLocale(intl);
  const paths = useAdminRoutes();
  const columns = useMemo<ColumnsOf<Data>>(
    () => [
      {
        Header: intl.formatMessage({
          defaultMessage: "ID",
          id: "Z6o8ym",
          description: "Title displayed on the Skill table ID column.",
        }),
        accessor: "id",
      },
      {
        Header: intl.formatMessage({
          defaultMessage: "Name",
          id: "BOeBpE",
          description: "Title displayed for the skill table Name column.",
        }),
        accessor: (skill) => skill.name?.[locale],
      },
      {
        Header: intl.formatMessage({
          defaultMessage: "Description",
          id: "9yGJ6k",
          description:
            "Title displayed for the skill table Description column.",
        }),
        accessor: (skill) => skill.description?.[locale],
      },
      {
        Header: intl.formatMessage({
          defaultMessage: "Keywords",
          id: "I7rxxQ",
          description: "Title displayed for the skill table Keywords column.",
        }),
        // keywords[locale] throws type problems
        accessor: (skill) => {
          if (locale === "en") {
            if (skill.keywords && skill.keywords.en)
              return skill.keywords.en.join(", ");
          }
          if (locale === "fr") {
            if (skill.keywords && skill.keywords.fr)
              return skill.keywords.fr.join(", ");
          }
          return "";
        },
      },
      {
        Header: intl.formatMessage({
          defaultMessage: "Skill Families",
          id: "KB+xr6",
          description:
            "Title displayed for the skill table Skill Families column.",
        }),
        accessor: (skill) =>
          skill.families?.map((family) => (
            <Pill color="primary" mode="outline" key={family?.key}>
              {family?.name?.[locale]}
            </Pill>
          )),
      },
      {
        Header: intl.formatMessage({
          defaultMessage: "Edit",
          id: "X4nVv/",
          description: "Title displayed for the skill table Edit column.",
        }),
        accessor: (skill) => tableEditButtonAccessor(skill.id, editUrlRoot), // callback extracted to separate function to stabilize memoized component
      },
    ],
    [editUrlRoot, intl, locale],
  );

  const data = useMemo(() => skills.filter(notEmpty), [skills]);

  return (
    <Table
      data={data}
      columns={columns}
      addBtn={{
        path: paths.skillCreate(),
        label: intl.formatMessage({
          defaultMessage: "Create Skill",
          id: "lFrPv1",
          description: "Heading displayed above the Create Skill form.",
        }),
      }}
    />
  );
};

export const SkillTableApi: React.FunctionComponent = () => {
  const [result] = useAllSkillsQuery();
  const { data, fetching, error } = result;
  const { pathname } = useLocation();

  return (
    <Pending fetching={fetching} error={error}>
      <SkillTable skills={data?.skills ?? []} editUrlRoot={pathname} />
    </Pending>
  );
};
