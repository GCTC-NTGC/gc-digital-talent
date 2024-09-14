import RectangleStackIcon from "@heroicons/react/24/outline/RectangleStackIcon";
import { defineMessage, IntlShape, useIntl } from "react-intl";
import { FormProvider, useForm } from "react-hook-form";
import { useQuery } from "urql";
import { useCallback, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import debounce from "lodash/debounce";

import {
  Button,
  CardBasic,
  Heading,
  Link,
  Loading,
  PreviewList,
  Separator,
  Sidebar,
  Well,
  type PreviewMetaData,
} from "@gc-digital-talent/ui";
import {
  Classification,
  graphql,
  LocalizedPoolStream,
  Maybe,
  PoolStream,
  SupervisoryStatus,
} from "@gc-digital-talent/graphql";
import {
  Checklist,
  Input,
  localizedEnumToOptions,
} from "@gc-digital-talent/forms";
import { unpackMaybes } from "@gc-digital-talent/helpers";
import { getLocale, getLocalizedName } from "@gc-digital-talent/i18n";

import Hero from "~/components/Hero";
import SEO from "~/components/SEO/SEO";
import useBreadcrumbs from "~/hooks/useBreadcrumbs";
import useRoutes from "~/hooks/useRoutes";
import processMessages from "~/messages/processMessages";

interface FormValues {
  keyword: string;
  classifications: string[];
  supervisoryStatuses: SupervisoryStatus[];
  streams: PoolStream[];
}

const defaultValues = {
  keyword: "",
  classifications: [],
  supervisoryStatuses: [],
  streams: [],
} satisfies FormValues;

const pageTitle = defineMessage({
  defaultMessage: "Job advertisement templates",
  id: "58+Hom",
  description: "Heading for the page showing list of job poster templates",
});

const pageDescription = defineMessage({
  defaultMessage:
    "Browse a library of pre-built job advertisements that include suggestions for key tasks, required, and optional skills.",
  id: "s7jEFt",
  description: "Description for the page showing list of job poster templates",
});

const JobPosterTemplates_Query = graphql(/* GraphQL */ `
  query JobPosterTemplates {
    classifications {
      id
      group
      level
    }
    supervisoryStatuses: localizedEnumStrings(enumName: "SupervisoryStatus") {
      value
      label {
        en
        fr
      }
    }
    poolStreams: localizedEnumStrings(enumName: "PoolStream") {
      value
      label {
        en
        fr
      }
    }
    jobPosterTemplates {
      id
      stream {
        value
        label {
          en
          fr
        }
      }
      supervisoryStatus
      keywords {
        en
        fr
      }
      name {
        en
        fr
      }
      description {
        en
        fr
      }
      classification {
        id
        group
        level
      }
    }
  }
`);

function assertIncludes(haystack: string[], needle?: Maybe<string>): boolean {
  if (!haystack.length || (needle && haystack.includes(needle))) return true;

  return false;
}

function previewMetaData(
  intl: IntlShape,
  classification?: Maybe<Classification>,
  stream?: Maybe<LocalizedPoolStream>,
): PreviewMetaData[] {
  const metaData = [];
  if (classification) {
    metaData.push({
      key: classification.id,
      type: "chip",
      children: `${classification.group}-0${classification.level}`,
    } satisfies PreviewMetaData);
  }

  if (stream) {
    metaData.push({
      key: stream.value,
      type: "text",
      children: getLocalizedName(stream.label, intl),
    } satisfies PreviewMetaData);
  }

  return metaData;
}

function searchParamHref(
  name: string,
  value: string | number,
  params: URLSearchParams,
): string {
  const hrefParams = new URLSearchParams(params);
  hrefParams.set(name, String(value));
  return `?${hrefParams.toString()}`;
}

const PAGE_SIZE = 1;

type SortKey = "classification" | "title";

const JobPosterTemplatesPage = () => {
  const intl = useIntl();
  const locale = getLocale(intl);
  const paths = useRoutes();
  const [searchParams, setSearchParams] = useSearchParams();
  const sortBy = (searchParams.get("sortBy") ?? "classification") as SortKey;
  const page = parseInt(searchParams.get("page") ?? "1");
  const [{ data, fetching }] = useQuery({
    query: JobPosterTemplates_Query,
  });

  const crumbs = useBreadcrumbs({
    crumbs: [
      {
        label: intl.formatMessage(pageTitle),
        url: paths.jobPosterTemplates(),
      },
    ],
  });

  const methods = useForm<FormValues>({ defaultValues });
  const { reset, watch } = methods;
  const formData = watch();

  const jobPosterTemplates = unpackMaybes(data?.jobPosterTemplates);
  const total = jobPosterTemplates.length;
  let maxShown = PAGE_SIZE * page;
  if (maxShown > total) maxShown = total;
  const hasMore = total > maxShown;
  const filteredJobPosterTemplates = useMemo(() => {
    const allTemplates = jobPosterTemplates.filter((jobPosterTemplate) => {
      let show = true;

      if (formData.keyword.length) {
        const keywords = formData.keyword.split(",");
        show =
          show &&
          keywords.some((term) => {
            const sanitizedTerm = term.toLowerCase().trim();
            return jobPosterTemplate.keywords?.[locale]?.some((keyword) => {
              return keyword.toLowerCase().trim().includes(sanitizedTerm);
            });
          });
      }

      show =
        show &&
        assertIncludes(
          formData.classifications,
          jobPosterTemplate?.classification?.id,
        );
      show =
        show &&
        assertIncludes(
          formData.supervisoryStatuses,
          jobPosterTemplate.supervisoryStatus,
        );
      show =
        show &&
        assertIncludes(formData.streams, jobPosterTemplate?.stream?.value);

      return show;
    });

    return allTemplates.splice(0, maxShown).sort((a, b) => {
      if (sortBy === "classification") {
        return (
          (a.classification?.group ?? "").localeCompare(
            b.classification?.group ?? "",
          ) || (a?.classification?.level ?? 0) - (b?.classification?.level ?? 0)
        );
      }

      const aName = getLocalizedName(a.name, intl, true);
      const bName = getLocalizedName(b.name, intl, true);

      return aName.localeCompare(bName);
    });
  }, [
    jobPosterTemplates,
    maxShown,
    formData.keyword,
    formData.classifications,
    formData.supervisoryStatuses,
    formData.streams,
    locale,
    sortBy,
    intl,
  ]);

  const showing = Math.min(filteredJobPosterTemplates.length, maxShown);

  const debouncedResetPage = useMemo(
    () =>
      debounce(() => {
        methods.handleSubmit(() => {
          const newParams = new URLSearchParams(searchParams);
          newParams.set("page", "1");
          setSearchParams(newParams);
        })();
      }, 100),
    [methods, searchParams, setSearchParams],
  );

  const handleSubmit = useCallback(
    () => debouncedResetPage(),
    [debouncedResetPage],
  );

  useEffect(() => {
    if (methods.formState.isDirty) {
      handleSubmit();
    }
  }, [
    formData.keyword,
    formData.classifications,
    formData.streams,
    formData.supervisoryStatuses,
    handleSubmit,
    methods.formState.isDirty,
  ]);

  return (
    <>
      <SEO
        title={intl.formatMessage(pageTitle)}
        description={intl.formatMessage(pageDescription)}
      />
      <Hero
        title={intl.formatMessage(pageTitle)}
        subtitle={intl.formatMessage(pageDescription)}
        crumbs={crumbs}
      />
      <div data-h2-wrapper="base(center, large, x1) p-tablet(center, large, x2)">
        <Heading level="h2" size="h3" color="primary" Icon={RectangleStackIcon}>
          {intl.formatMessage({
            defaultMessage: "Find a template",
            id: "XIDaGg",
            description: "Heading for the form to filter job poster templates",
          })}
        </Heading>
        <p data-h2-margin="base(x1 0)">
          {intl.formatMessage({
            defaultMessage:
              "This library contains a series of templates for common jobs across the communities we support. These templates include suggested information and recommendations for elements such as job title, common tasks in the role, essential and asset skills, and more. Feel free to browse the full list, or, if you have an idea of the type of role you're hiring for, you can use the search bar or filters to find templates that align with the job’s specific details.",
            id: "8dUPjb",
            description:
              "Description of how to use the form to filter job poster templates",
          })}
        </p>
        <Sidebar.Wrapper>
          <Sidebar.Sidebar>
            <FormProvider {...methods}>
              <div
                data-h2-display="base(flex)"
                data-h2-flex-direction="base(column)"
                data-h2-gap="base(x1)"
              >
                <Input
                  id="keyword"
                  name="keyword"
                  type="text"
                  label={intl.formatMessage({
                    defaultMessage: "Search by keyword",
                    id: "PYMFoh",
                    description: "Label for the keyword search input",
                  })}
                />
                {fetching ? (
                  <Loading inline />
                ) : (
                  <>
                    <Checklist
                      idPrefix="classifications"
                      name="classifications"
                      legend={intl.formatMessage({
                        defaultMessage: "Filter by levels",
                        id: "SaPE+p",
                        description: "Label for the classification input",
                      })}
                      items={unpackMaybes(data?.classifications)
                        .filter(
                          (classification) => classification.group === "IT",
                        )
                        .map((classification) => ({
                          value: classification.id,
                          label: `${classification.group}-0${classification.level}`,
                        }))}
                    />
                    <Checklist
                      idPrefix="supervisoryStatuses"
                      name="supervisoryStatuses"
                      items={localizedEnumToOptions(
                        unpackMaybes(data?.supervisoryStatuses),
                        intl,
                      )}
                      legend={intl.formatMessage({
                        defaultMessage: "Filter by type of role",
                        id: "vjbsDe",
                        description: "Legend for supervisory status input",
                      })}
                    />
                    <Checklist
                      idPrefix="streams"
                      name="streams"
                      items={localizedEnumToOptions(
                        unpackMaybes(data?.poolStreams),
                        intl,
                      )}
                      legend={intl.formatMessage({
                        defaultMessage: "Filter by work streams",
                        id: "eeU13V",
                        description: "Legend for pool streams input",
                      })}
                    />
                  </>
                )}
                <Separator decorative orientation="horizontal" space="sm" />
                <Button
                  type="reset"
                  mode="inline"
                  color="secondary"
                  block
                  onClick={() => reset()}
                >
                  {intl.formatMessage({
                    defaultMessage: "Reset all filters",
                    id: "0/jj1v",
                    description: "Button text to reset a filter form",
                  })}
                </Button>
              </div>
            </FormProvider>
          </Sidebar.Sidebar>
          <Sidebar.Content>
            {filteredJobPosterTemplates.length ? (
              <>
                <div
                  data-h2-margin-bottom="base(x.25)"
                  data-h2-display="base(flex)"
                  data-h2-flex-direction="base(column) l-tablet(row)"
                  data-h2-gap="base(x.25)"
                  data-h2-justify-content="base(space-between)"
                >
                  <div
                    data-h2-display="base(flex)"
                    data-h2-column-gap="base(x.25)"
                  >
                    <span id="sortBy">
                      {intl.formatMessage({
                        defaultMessage: "Sory by",
                        id: "58Pfbo",
                        description:
                          "Label for the links to change how the list is sorted",
                      })}
                    </span>
                    <Link
                      aria-describedby="sortBy"
                      href={searchParamHref(
                        "sortBy",
                        "classification",
                        searchParams,
                      )}
                      {...(sortBy === "classification"
                        ? { color: "secondary", mode: "inline" }
                        : { color: "black", mode: "text" })}
                    >
                      {intl.formatMessage(processMessages.classification)}
                    </Link>
                    <Link
                      aria-describedby="sortBy"
                      href={searchParamHref("sortBy", "title", searchParams)}
                      {...(sortBy === "title"
                        ? { color: "secondary", mode: "inline" }
                        : { color: "black", mode: "text" })}
                    >
                      {intl.formatMessage({
                        defaultMessage: "Job title",
                        id: "zDYHRr",
                        description: "Link text to sort by job title",
                      })}
                    </Link>
                  </div>
                  <span data-h2-font-weight="base(700)">
                    {intl.formatMessage(
                      {
                        defaultMessage:
                          "Showing {showing} of {total} available template(s)",
                        id: "vCRIuq",
                        description:
                          "Number of job poster templates being displayed in the list",
                      },
                      { showing, total },
                    )}
                  </span>
                </div>
                <CardBasic>
                  <PreviewList.Root>
                    {filteredJobPosterTemplates.map((jobPosterTemplate) => (
                      <PreviewList.Item
                        key={jobPosterTemplate.id}
                        title={
                          <Link
                            href={paths.jobPosterTemplate(jobPosterTemplate.id)}
                            color="black"
                          >
                            {getLocalizedName(jobPosterTemplate.name, intl)}
                          </Link>
                        }
                        headingAs="h3"
                        metaData={previewMetaData(
                          intl,
                          jobPosterTemplate.classification,
                          jobPosterTemplate.stream,
                        )}
                      >
                        {jobPosterTemplate.description && (
                          <p data-h2-margin-bottom="base(x1)">
                            {getLocalizedName(
                              jobPosterTemplate.description,
                              intl,
                              true,
                            )}
                          </p>
                        )}
                      </PreviewList.Item>
                    ))}
                  </PreviewList.Root>
                </CardBasic>
                {hasMore && (
                  <>
                    <Separator orientation="horizontal" decorative space="md" />
                    <Link
                      mode="solid"
                      color="secondary"
                      href={searchParamHref(
                        "page",
                        Math.min(page + 1, total),
                        searchParams,
                      )}
                    >
                      {intl.formatMessage({
                        defaultMessage: "Load more results",
                        id: "HuA8aL",
                        description:
                          "Button text to load the next set of results",
                      })}
                    </Link>
                  </>
                )}
              </>
            ) : (
              <Well data-h2-text-align="base(center)">
                <p>
                  {intl.formatMessage({
                    defaultMessage: "No job advertisement templates found.",
                    id: "L47tv9",
                    description:
                      "Message displayed when there are no job poster templates meeting a specific criteria",
                  })}
                </p>
              </Well>
            )}
          </Sidebar.Content>
        </Sidebar.Wrapper>
      </div>
    </>
  );
};

export const Component = () => <JobPosterTemplatesPage />;

Component.displayName = "JobPosterTemplatesPage";

export default JobPosterTemplatesPage;
