import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { useIntl } from "react-intl";
import { useLocation } from "react-router";
import { useQuery } from "urql";

import { unpackMaybes } from "@gc-digital-talent/helpers";
import { commonMessages, getLocalizedName } from "@gc-digital-talent/i18n";
import { Chip, Link, Pending } from "@gc-digital-talent/ui";
import {
  graphql,
  JobPosterTemplateTableRowFragment,
  FragmentType,
  getFragment,
} from "@gc-digital-talent/graphql";

import useRoutes from "~/hooks/useRoutes";
import Table from "~/components/Table/ResponsiveTable/ResponsiveTable";
import { normalizedText, numeric } from "~/components/Table/sortingFns";
import adminMessages from "~/messages/adminMessages";

import labels from "../labels";

const columnHelper = createColumnHelper<JobPosterTemplateTableRowFragment>();

export const JobPosterTemplateTableRow_Fragment = graphql(/* GraphQL */ `
  fragment JobPosterTemplateTableRow on JobPosterTemplate {
    id
    workStream {
      id
      name {
        en
        fr
      }
    }
    supervisoryStatus {
      label {
        localized
      }
    }
    name {
      en
      fr
    }
    classification {
      group
      level
    }
    skills {
      id
    }
  }
`);

interface JobPosterTemplateTableProps {
  jobPosterTemplatesQuery: FragmentType<
    typeof JobPosterTemplateTableRow_Fragment
  >[];
  title: string;
}

export const JobPosterTemplateTable = ({
  jobPosterTemplatesQuery,
  title,
}: JobPosterTemplateTableProps) => {
  const intl = useIntl();
  const paths = useRoutes();
  const jobPosterTemplates = getFragment(
    JobPosterTemplateTableRow_Fragment,
    jobPosterTemplatesQuery,
  );
  const columns = [
    columnHelper.accessor((row) => getLocalizedName(row.name, intl), {
      id: "jobTitle",
      sortingFn: normalizedText,
      header: intl.formatMessage(labels.jobTitle),
      cell: ({ row: { original: template } }) => (
        <Link href={paths.jobPosterTemplateView(template.id)}>
          {getLocalizedName(template.name, intl)}
        </Link>
      ),
      meta: {
        isRowTitle: true,
      },
    }),
    columnHelper.accessor((row) => row.classification?.group, {
      id: "classificationGroup",
      filterFn: "weakEquals",
      header: intl.formatMessage(commonMessages.group),
    }),
    columnHelper.accessor((row) => row.classification?.level, {
      id: "classificationLevel",
      filterFn: "weakEquals",
      header: intl.formatMessage(commonMessages.level),
    }),
    columnHelper.accessor(
      (row) => getLocalizedName(row.workStream?.name, intl),
      {
        id: "workStreamName",
        sortingFn: normalizedText,
        header: intl.formatMessage(labels.workStream),
      },
    ),
    columnHelper.accessor((row) => row.supervisoryStatus?.label.localized, {
      id: "role",
      sortingFn: normalizedText,
      header: intl.formatMessage(commonMessages.role),
    }),
    columnHelper.accessor((row) => row.skills?.length ?? 0, {
      id: "skillCount",
      sortingFn: numeric,
      header: intl.formatMessage(adminMessages.skills),
    }),
  ] as ColumnDef<JobPosterTemplateTableRowFragment>[];

  const data = unpackMaybes(jobPosterTemplates);

  const { pathname, search, hash } = useLocation();
  const currentUrl = `${pathname}${search}${hash}`;

  return (
    <Table<JobPosterTemplateTableRowFragment>
      data={data}
      caption={title}
      columns={columns}
      sort={{
        internal: true,
      }}
      pagination={{
        internal: true,
        total: data.length,
        pageSizes: [10, 20, 50],
      }}
      search={{
        internal: true,
        label: intl.formatMessage(adminMessages.searchByKeyword),
      }}
      add={{
        linkProps: {
          href: paths.jobPosterTemplateCreate(),
          label: intl.formatMessage({
            defaultMessage: "Create a template",
            id: "96/yI/",
            description: "Heading displayed above the Create a template form.",
          }),
          from: currentUrl,
        },
      }}
      nullMessage={{
        description: intl.formatMessage({
          defaultMessage: 'Use the "Create a template" button to get started.',
          id: "g3DJi0",
          description: "Instructions for adding a job poster template item.",
        }),
      }}
    />
  );
};

const JobPosterTemplateTable_Query = graphql(/* GraphQL */ `
  query JobPosterTemplateTable {
    jobPosterTemplates {
      ...JobPosterTemplateTableRow
    }
  }
`);

const JobPosterTemplateTableApi = ({ title }: { title: string }) => {
  const [{ data, fetching, error }] = useQuery({
    query: JobPosterTemplateTable_Query,
  });

  return (
    <Pending fetching={fetching} error={error}>
      <JobPosterTemplateTable
        jobPosterTemplatesQuery={unpackMaybes(data?.jobPosterTemplates)}
        title={title}
      />
    </Pending>
  );
};

export default JobPosterTemplateTableApi;
