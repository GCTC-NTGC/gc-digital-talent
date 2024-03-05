import React, { useEffect, useMemo, useState } from "react";
import { PaginationState, createColumnHelper } from "@tanstack/react-table";
import { useIntl } from "react-intl";
import { OperationContext, useQuery } from "urql";
import { useLocation, useSearchParams } from "react-router-dom";
import { SubmitHandler } from "react-hook-form";

import { commonMessages, getLocalizedName } from "@gc-digital-talent/i18n";
import { notEmpty, unpackMaybes } from "@gc-digital-talent/helpers";
import { Pending } from "@gc-digital-talent/ui";
import {
  Skill,
  SkillCategory,
  SkillFamily,
  graphql,
} from "@gc-digital-talent/graphql";

import useRoutes from "~/hooks/useRoutes";
import Table from "~/components/Table/ResponsiveTable/ResponsiveTable";
import cells from "~/components/Table/cells";
import adminMessages from "~/messages/adminMessages";
import { normalizedText } from "~/components/Table/sortingFns";
import {
  INITIAL_STATE,
  SEARCH_PARAM_KEY,
} from "~/components/Table/ResponsiveTable/constants";

import {
  categoryAccessor,
  familiesAccessor,
  skillFamiliesCell,
} from "./tableHelpers";
import SkillFilterDialog, { FormValues } from "./SkillFilterDialog";

export type SkillFilterInput = FormValues;

export function stringToEnumSkillCategory(
  selection: string,
): SkillCategory | undefined {
  if (Object.values(SkillCategory).includes(selection as SkillCategory)) {
    return selection as SkillCategory;
  }
  return undefined;
}

export function transformFormValuesToSkillFilterInput(
  data: FormValues,
): SkillFilterInput {
  return {
    skillCategories: data.skillCategories?.length
      ? data.skillCategories.map(stringToEnumSkillCategory).filter(notEmpty)
      : undefined,
    skillFamilies: data.skillFamilies?.length ? data.skillFamilies : undefined,
  };
}

export function transformSkillFilterInputToFormValues(
  input: SkillFilterInput | undefined,
): FormValues {
  return {
    skillCategories: input?.skillCategories?.filter(notEmpty) ?? [],
    skillFamilies: input?.skillFamilies?.filter(notEmpty) ?? [],
  };
}

const columnHelper = createColumnHelper<Skill>();

interface SkillTableProps {
  skills: Array<Skill>;
  skillFamilies: SkillFamily[];
  title: string;
  paginationState?: PaginationState;
  addButton?: boolean;
  fetching?: boolean;
}

export const SkillTable = ({
  skills,
  title,
  paginationState,
  addButton,
  skillFamilies,
  fetching,
}: SkillTableProps) => {
  const intl = useIntl();
  const paths = useRoutes();
  const [searchParams] = useSearchParams();
  const filtersEncoded = searchParams.get(SEARCH_PARAM_KEY.FILTERS);
  const initialFilters: SkillFilterInput = useMemo(
    () => (filtersEncoded ? JSON.parse(filtersEncoded) : undefined),
    [filtersEncoded],
  );

  const [filterState, setFilterState] =
    useState<SkillFilterInput>(initialFilters);

  const [dataState, setDataState] = useState<Skill[]>(skills);

  const handleFilterSubmit: SubmitHandler<FormValues> = (data) => {
    const transformedData = transformFormValuesToSkillFilterInput(data);
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
        return cells.edit(skill.id, paths.skillTable(), skillName, skillName);
      },
    }),
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
    columnHelper.accessor(
      (skill) => getLocalizedName(skill.description, intl, true),
      {
        id: "description",
        sortingFn: normalizedText,
        header: intl.formatMessage({
          defaultMessage: "Description",
          id: "9yGJ6k",
          description:
            "Title displayed for the skill table Description column.",
        }),
      },
    ),
  ];

  useEffect(() => {
    let filteredData;
    // filter by skill family
    if (filterState?.skillFamilies)
      filteredData = skills.filter((skill) =>
        skill.families?.find((skillFamily) =>
          filterState.skillFamilies?.includes(skillFamily.key),
        ),
      );

    // filter by skill category
    if (filterState?.skillCategories)
      filteredData = filteredData?.filter(
        (skill) =>
          skill.category ===
          filterState.skillCategories?.find(
            (category) => category === skill.category,
          ),
      );

    setDataState(filteredData ?? skills);
  }, [filterState, skills]);

  const { pathname, search, hash } = useLocation();
  const currentUrl = `${pathname}${search}${hash}`;

  return (
    <Table<Skill>
      caption={title}
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
        label: intl.formatMessage({
          defaultMessage: "Search skills",
          id: "cWqtEU",
          description: "Label for the skills table search input",
        }),
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
    />
  );
};

const SkillTableSkills_Query = graphql(/* GraphQL */ `
  query SkillTableSkills {
    skills {
      id
      key
      category
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

const SkillTableApi = ({
  title,
  paginationState,
  addButton,
}: {
  title: string;
  paginationState?: PaginationState;
  addButton?: boolean;
}) => {
  const [{ data, fetching, error }] = useQuery({
    query: SkillTableSkills_Query,
    context,
  });

  const skillFamilies: SkillFamily[] = unpackMaybes(data?.skillFamilies);

  return (
    <Pending fetching={fetching} error={error}>
      <SkillTable
        skills={unpackMaybes(data?.skills)}
        title={title}
        addButton={addButton}
        paginationState={paginationState}
        fetching={fetching}
        skillFamilies={skillFamilies}
      />
    </Pending>
  );
};

export default SkillTableApi;
