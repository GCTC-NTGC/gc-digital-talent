import React, { useMemo } from "react";
import { useIntl } from "react-intl";
import { OperationContext } from "urql";

import { getLocale } from "@gc-digital-talent/i18n";
import { notEmpty } from "@gc-digital-talent/helpers";
import { Pill, Pending } from "@gc-digital-talent/ui";

import useRoutes from "~/hooks/useRoutes";
import { Maybe, Skill, SkillFamily, useAllSkillsQuery } from "~/api/generated";
import Table, {
  ColumnsOf,
  tableEditButtonAccessor,
  Cell,
} from "~/components/Table/ClientManagedTable";

const skillFamiliesCell = (
  skillFamilies: Maybe<Maybe<SkillFamily>[]>,
  locale: "en" | "fr",
) => {
  const families = skillFamilies?.filter(notEmpty).map((family) => (
    <Pill color="primary" mode="outline" key={family?.key}>
      {family?.name?.[locale]}
    </Pill>
  ));

  return families ? <span>{families}</span> : null;
};

type SkillCell = Cell<Skill>;

interface SkillTableProps {
  skills: Array<Skill>;
}

export const SkillTable = ({ skills }: SkillTableProps) => {
  const intl = useIntl();
  const locale = getLocale(intl);
  const paths = useRoutes();
  const columns = useMemo<ColumnsOf<Skill>>(
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
        Cell: ({ row: { original: skill } }: SkillCell) =>
          skillFamiliesCell(skill.families, locale),
        accessor: (skill) =>
          skill.families
            ?.map((family) => family?.name?.[locale])
            .filter(notEmpty)
            .sort()
            .join(", "),
      },
      {
        Header: intl.formatMessage({
          defaultMessage: "Edit",
          id: "X4nVv/",
          description: "Title displayed for the skill table Edit column.",
        }),
        id: "edit",
        accessor: (d) => `Edit ${d.id}`,
        disableGlobalFilter: true,
        Cell: ({ row: { original: skill } }: SkillCell) =>
          tableEditButtonAccessor(
            skill.id,
            paths.skillTable(),
            skill.name?.[locale],
          ),
      },
    ],
    [paths, intl, locale],
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

const context: Partial<OperationContext> = {
  additionalTypenames: ["Skill", "SkillFamily"], // This lets urql know when to invalidate cache if request returns empty list. https://formidable.com/open-source/urql/docs/basics/document-caching/#document-cache-gotchas
  requestPolicy: "cache-first", // The list of skills will rarely change, so we override default request policy to avoid unnecessary cache updates.
};

const SkillTableApi = () => {
  const [result] = useAllSkillsQuery({
    context,
  });
  const { data, fetching, error } = result;

  const skills = data?.skills.filter(notEmpty);

  return (
    <Pending fetching={fetching} error={error}>
      <SkillTable skills={skills || []} />
    </Pending>
  );
};

export default SkillTableApi;
