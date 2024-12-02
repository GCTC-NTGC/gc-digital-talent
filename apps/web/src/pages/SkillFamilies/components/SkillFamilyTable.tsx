import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { useIntl } from "react-intl";
import { useLocation } from "react-router";
import { useQuery } from "urql";

import { commonMessages, getLocalizedName } from "@gc-digital-talent/i18n";
import { notEmpty, unpackMaybes } from "@gc-digital-talent/helpers";
import { Link, Pending } from "@gc-digital-talent/ui";
import { SkillFamily, graphql } from "@gc-digital-talent/graphql";

import useRoutes from "~/hooks/useRoutes";
import Table from "~/components/Table/ResponsiveTable/ResponsiveTable";
import adminMessages from "~/messages/adminMessages";
import { normalizedText } from "~/components/Table/sortingFns";

const columnHelper = createColumnHelper<SkillFamily>();

interface SkillFamilyTableProps {
  skillFamilies: SkillFamily[];
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
        cell: ({
          getValue,
          row: {
            original: { id },
          },
        }) => (
          <Link
            color="secondary"
            mode="inline"
            href={paths.skillFamilyView(id)}
          >
            {getValue()}
          </Link>
        ),
      },
    ),
    columnHelper.accessor(
      (skillFamily) => getLocalizedName(skillFamily.description, intl, true),
      {
        id: "description",
        sortingFn: normalizedText,
        header: intl.formatMessage(commonMessages.description),
      },
    ),
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
        initialState: [{ id: "name", desc: false }],
      }}
      search={{
        internal: true,
        label: intl.formatMessage(adminMessages.searchByKeyword),
      }}
      add={{
        linkProps: {
          href: paths.skillFamilyCreate(),
          label: intl.formatMessage({
            defaultMessage: "Create skill family",
            id: "oDDr9J",
            description:
              "Heading displayed above the Create Skill family form.",
          }),
          from: currentUrl,
        },
      }}
      nullMessage={{
        description: intl.formatMessage({
          defaultMessage:
            'Use the "Create skill family" button to get started.',
          id: "4ujx9e",
          description: "Instructions for adding a skill family item.",
        }),
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
          label {
            en
            fr
          }
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
