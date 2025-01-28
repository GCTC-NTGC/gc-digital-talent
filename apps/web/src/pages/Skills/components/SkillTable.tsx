import { useEffect, useMemo, useState } from "react";
import {
  ColumnDef,
  PaginationState,
  createColumnHelper,
} from "@tanstack/react-table";
import { createIntl, createIntlCache, useIntl } from "react-intl";
import { OperationContext, useQuery } from "urql";
import { useLocation, useSearchParams } from "react-router";
import { SubmitHandler } from "react-hook-form";

import {
  commonMessages,
  getLocalizedName,
  useIntlLanguages,
} from "@gc-digital-talent/i18n";
import { notEmpty, unpackMaybes } from "@gc-digital-talent/helpers";
import { Link, LoadingErrorMessage } from "@gc-digital-talent/ui";
import { Skill, SkillCategory, graphql } from "@gc-digital-talent/graphql";

import useRoutes from "~/hooks/useRoutes";
import Table from "~/components/Table/ResponsiveTable/ResponsiveTable";
import adminMessages from "~/messages/adminMessages";
import { normalizedText } from "~/components/Table/sortingFns";
import {
  INITIAL_STATE,
  SEARCH_PARAM_KEY,
} from "~/components/Table/ResponsiveTable/constants";
import messages from "~/lang/frCompiled.json";

import {
  categoryAccessor,
  familiesAccessor,
  skillFamiliesCell,
} from "./tableHelpers";
import SkillFilterDialog, { FormValues } from "./SkillFilterDialog";
import { getSkillCsvData, getSkillCsvHeaders } from "./skillCsv";

type SkillFilterInput = FormValues;

function stringToEnumSkillCategory(
  selection: string,
): SkillCategory | undefined {
  if (Object.values(SkillCategory).includes(selection as SkillCategory)) {
    return selection as SkillCategory;
  }
  return undefined;
}

function transformFormValuesToSkillFilterInput(
  data: FormValues,
): SkillFilterInput {
  return {
    skillCategories: data.skillCategories?.length
      ? data.skillCategories.map(stringToEnumSkillCategory).filter(notEmpty)
      : undefined,
    skillFamilies: data.skillFamilies?.length ? data.skillFamilies : undefined,
  };
}

function transformSkillFilterInputToFormValues(
  input: SkillFilterInput | undefined,
): FormValues {
  return {
    skillCategories: input?.skillCategories?.filter(notEmpty) ?? [],
    skillFamilies: input?.skillFamilies?.filter(notEmpty) ?? [],
  };
}

const columnHelper = createColumnHelper<Skill>();

const SkillTableSkills_Query = graphql(/* GraphQL */ `
  query SkillTableSkills {
    skills {
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
      description {
        en
        fr
      }
      keywords {
        en
        fr
      }
      families {
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
      }
    }
    skillFamilies {
      id
      key
      name {
        en
        fr
      }
    }
  }
`);

const context: Partial<OperationContext> = {
  additionalTypenames: ["Skill", "SkillFamily"], // This lets urql know when to invalidate cache if request returns empty list. https://formidable.com/open-source/urql/docs/basics/document-caching/#document-cache-gotchas
  requestPolicy: "cache-first", // The list of skills will rarely change, so we override default request policy to avoid unnecessary cache updates.
};

interface SkillTableProps {
  title: string;
  paginationState?: PaginationState;
  addButton?: boolean;
  csvDownload?: boolean;
  isPublic?: boolean;
}

const SkillTable = ({
  title,
  paginationState,
  addButton,
  csvDownload,
  isPublic,
}: SkillTableProps) => {
  const intl = useIntl();
  const cache = createIntlCache();
  const englishMessages = useIntlLanguages("en", messages);
  const frenchMessages = useIntlLanguages("fr", messages);
  const intlEn = createIntl(
    {
      locale: "en",
      messages: englishMessages,
    },
    cache,
  );
  const intlFr = createIntl(
    {
      locale: "fr",
      messages: frenchMessages,
    },
    cache,
  );
  const [{ data, fetching, error }] = useQuery({
    query: SkillTableSkills_Query,
    context,
  });

  const skills = useMemo(() => unpackMaybes(data?.skills), [data?.skills]);
  const skillFamilies = unpackMaybes(data?.skillFamilies);

  const paths = useRoutes();
  const [searchParams] = useSearchParams();
  const filtersEncoded = searchParams.get(SEARCH_PARAM_KEY.FILTERS);
  const initialFilters = useMemo(
    () =>
      filtersEncoded ? (JSON.parse(filtersEncoded) as SkillFilterInput) : {},
    [filtersEncoded],
  );

  const [filterState, setFilterState] =
    useState<SkillFilterInput>(initialFilters);

  const [dataState, setDataState] = useState<Skill[]>(skills);

  const handleFilterSubmit: SubmitHandler<FormValues> = (values) => {
    const transformedData = transformFormValuesToSkillFilterInput(values);
    setFilterState(transformedData);
  };

  const columns = [
    columnHelper.accessor("id", {
      id: "id",
      enableColumnFilter: false,
      header: intl.formatMessage(adminMessages.id),
    }),
    columnHelper.accessor((skill) => getLocalizedName(skill.name, intl), {
      id: "name",
      header: intl.formatMessage(commonMessages.name),
      sortingFn: normalizedText,
      meta: {
        isRowTitle: true,
      },
      cell: ({ row: { original: skill } }) => {
        const skillName = getLocalizedName(skill.name, intl);
        return isPublic ? (
          skillName
        ) : (
          <Link href={paths.skillView(skill.id)}>{skillName}</Link>
        );
      },
    }),
    columnHelper.accessor(
      (skill) => getLocalizedName(skill.description, intl, true),
      {
        id: "description",
        sortingFn: normalizedText,
        header: intl.formatMessage(commonMessages.description),
      },
    ),
    columnHelper.accessor((skill) => familiesAccessor(skill, intl), {
      id: "skillFamilies",
      sortingFn: normalizedText,
      header: intl.formatMessage(adminMessages.skillFamilies),
      cell: ({ row: { original: skill } }) =>
        skillFamiliesCell(skill.families, intl),
    }),
    columnHelper.accessor(({ category }) => categoryAccessor(category, intl), {
      id: "category",
      sortingFn: normalizedText,
      header: intl.formatMessage(adminMessages.category),
    }),
  ] as ColumnDef<Skill>[];

  useEffect(() => {
    let filteredData = skills;
    // filter by skill family
    if (filterState?.skillFamilies)
      filteredData = filteredData.filter((skill) =>
        skill.families?.find((skillFamily) =>
          filterState.skillFamilies?.includes(skillFamily.key),
        ),
      );

    // filter by skill category
    if (filterState?.skillCategories)
      filteredData = filteredData?.filter(
        (skill) =>
          skill.category.value ===
          filterState.skillCategories?.find(
            (category) => category === skill.category.value,
          ),
      );

    setDataState(filteredData);
  }, [filterState, skills]);

  const { pathname, search, hash } = useLocation();
  const currentUrl = `${pathname}${search}${hash}`;

  if (error) {
    return <LoadingErrorMessage error={error} />;
  }

  return (
    <Table<Skill>
      caption={title}
      isLoading={fetching}
      data={dataState}
      columns={columns}
      hiddenColumnIds={["id"]}
      pagination={{
        internal: true,
        total: dataState.length,
        pageSizes: [10, 20, 50],
        initialState: paginationState ?? INITIAL_STATE.paginationState,
      }}
      sort={{
        internal: true,
        initialState: [{ id: "name", desc: false }],
      }}
      search={{
        internal: true,
        label: intl.formatMessage(adminMessages.searchByKeyword),
      }}
      add={
        addButton
          ? {
              linkProps: {
                href: paths.skillCreate(),
                label: intl.formatMessage({
                  defaultMessage: "Create skill",
                  id: "71mPNh",
                  description: "Title for Create skill",
                }),
                from: currentUrl,
              },
            }
          : undefined
      }
      nullMessage={{
        description: intl.formatMessage({
          defaultMessage: 'Use the "Create skill" button to get started.',
          id: "0jwdac",
          description: "Instructions for adding a skill item.",
        }),
      }}
      filter={{
        state: filterState,
        component: (
          <SkillFilterDialog
            skillFamilies={skillFamilies}
            fetching={fetching}
            onSubmit={handleFilterSubmit}
            resetValues={transformSkillFilterInputToFormValues({})}
            initialValues={transformSkillFilterInputToFormValues(
              initialFilters,
            )}
          />
        ),
      }}
      download={
        csvDownload
          ? {
              all: {
                csv: {
                  headers: getSkillCsvHeaders(intl),
                  data: () => {
                    return getSkillCsvData(skills, intlEn, intlFr);
                  },
                  fileName: intl.formatMessage({
                    defaultMessage: "GC Digital Talent - All skills.csv",
                    id: "4tIdsX",
                    description: "Filename for skills CSV file download",
                  }),
                },
                label: intl.formatMessage({
                  defaultMessage: "Download all skills (CSV)",
                  id: "XovI8x",
                  description:
                    "Text label for button to download a csv file of all skills.",
                }),
              },
            }
          : undefined
      }
    />
  );
};

export default SkillTable;
