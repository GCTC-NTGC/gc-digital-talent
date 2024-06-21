import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { useIntl } from "react-intl";
import { useLocation } from "react-router-dom";
import { useQuery } from "urql";

import { commonMessages, getLocalizedName } from "@gc-digital-talent/i18n";
import { notEmpty, unpackMaybes } from "@gc-digital-talent/helpers";
import { Pending } from "@gc-digital-talent/ui";
import { SkillFamily, graphql } from "@gc-digital-talent/graphql";

import useRoutes from "~/hooks/useRoutes";
import Table from "~/components/Table/ResponsiveTable/ResponsiveTable";
import cells from "~/components/Table/cells";
import adminMessages from "~/messages/adminMessages";
import { normalizedText } from "~/components/Table/sortingFns";

const columnHelper = createColumnHelper<SkillFamily>();

interface SkillFamilyTableProps {
  skillFamilies: Array<SkillFamily>;
  title: string;
}

export const SkillFamilyTable = ({
  skillFamilies,
  title,
}: SkillFamilyTableProps) => {
  const intl = useIntl();
  const paths = useRoutes();
  const columns = [
    columnHelper.accessor("id", {
      id: "id",
      enableColumnFilter: false,
      header: intl.formatMessage(adminMessages.id),
    }),
    columnHelper.accessor(
      (skillFamily) => getLocalizedName(skillFamily.name, intl),
      {
        id: "name",
        sortingFn: normalizedText,
        header: intl.formatMessage(commonMessages.name),
        meta: {
          isRowTitle: true,
        },
      },
    ),
    columnHelper.accessor(
      (skillFamily) => getLocalizedName(skillFamily.description, intl, true),
      {
        id: "description",
        sortingFn: normalizedText,
        header: intl.formatMessage({
          defaultMessage: "Description",
          id: "XSo129",
          description:
            "Title displayed for the Skill Family table Description column.",
        }),
      },
    ),
    columnHelper.display({
      id: "edit",
      header: intl.formatMessage(commonMessages.edit),
      cell: ({ row: { original: skillFamily } }) =>
        cells.edit(
          skillFamily.id,
          paths.skillFamilyTable(),
          getLocalizedName(skillFamily.name, intl),
        ),
    }),
  ] as ColumnDef<SkillFamily>[];

  const data = skillFamilies.filter(notEmpty);

  const { pathname, search, hash } = useLocation();
  const currentUrl = `${pathname}${search}${hash}`;

  return (
    <Table<SkillFamily>
      caption={title}
      data={data}
      columns={columns}
      hiddenColumnIds={["id"]}
      pagination={{
        internal: true,
        total: data.length,
        pageSizes: [10, 20, 50],
      }}
      sort={{
        internal: true,
      }}
      search={{
        internal: true,
        label: intl.formatMessage({
          defaultMessage: "Search skill families",
          id: "yXwlJw",
          description: "Label for the skill families table search input",
        }),
      }}
      add={{
        linkProps: {
          href: paths.skillFamilyCreate(),
          label: intl.formatMessage({
            defaultMessage: "Create Skill Family",
            id: "TRqbR/",
            description:
              "Heading displayed above the Create Skill Family form.",
          }),
          from: currentUrl,
        },
      }}
    />
  );
};

const SkillFamilies_Query = graphql(/* GraphQL */ `
  query SkillFamilies {
    skillFamilies {
      id
      key
      name {
        en
        fr
      }
      description {
        en
        fr
      }
      skills {
        id
        key
        name {
          en
          fr
        }
        category {
          value
        }
      }
    }
  }
`);

const SkillFamilyTableApi = ({ title }: { title: string }) => {
  const [{ data, fetching, error }] = useQuery({
    query: SkillFamilies_Query,
  });

  return (
    <Pending fetching={fetching} error={error}>
      <SkillFamilyTable
        skillFamilies={unpackMaybes(data?.skillFamilies)}
        title={title}
      />
    </Pending>
  );
};

export default SkillFamilyTableApi;
