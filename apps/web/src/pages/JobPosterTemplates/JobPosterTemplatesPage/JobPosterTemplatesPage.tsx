import RectangleStackIcon from "@heroicons/react/24/outline/RectangleStackIcon";
import { IntlShape, useIntl } from "react-intl";
import { FormProvider, useForm } from "react-hook-form";
import { useQuery } from "urql";
import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router";
import debounce from "lodash/debounce";

import {
  Button,
  Card,
  Container,
  Heading,
  Link,
  Loading,
  PreviewList,
  Separator,
  Sidebar,
  Notice,
  type PreviewMetaData,
} from "@gc-digital-talent/ui";
import {
  Classification,
  graphql,
  Maybe,
  SupervisoryStatus,
  WorkStream,
} from "@gc-digital-talent/graphql";
import {
  alphaSortOptions,
  Checklist,
  Input,
  localizedEnumToOptions,
} from "@gc-digital-talent/forms";
import { unpackMaybes } from "@gc-digital-talent/helpers";
import {
  commonMessages,
  formMessages,
  getLocale,
  getLocalizedName,
} from "@gc-digital-talent/i18n";

import Hero from "~/components/Hero";
import SEO from "~/components/SEO/SEO";
import useBreadcrumbs from "~/hooks/useBreadcrumbs";
import useRoutes from "~/hooks/useRoutes";
import processMessages from "~/messages/processMessages";
import useDeepCompareEffect from "~/hooks/useDeepCompareEffect";

import pageMessages from "./messages";

interface FormValues {
  keyword: string;
  classifications: string[];
  supervisoryStatuses: SupervisoryStatus[];
  workStreams: string[];
}

const defaultValues = {
  keyword: "",
  classifications: [],
  supervisoryStatuses: [],
  workStreams: [],
} satisfies FormValues;

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
    workStreams {
      id
      name {
        en
        fr
      }
    }
    jobPosterTemplates {
      id
      workStream {
        id
        name {
          en
          fr
        }
      }
      supervisoryStatus {
        value
      }
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
      referenceId
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
  workStream?: Maybe<WorkStream>,
): PreviewMetaData[] {
  const metaData = [];
  if (classification) {
    metaData.push({
      key: classification.id,
      type: "chip",
      children: `${classification.group}-${classification.level < 10 ? "0" : ""}${classification.level}`,
    } satisfies PreviewMetaData);
  }

  if (workStream) {
    metaData.push({
      key: workStream.id,
      type: "text",
      children: getLocalizedName(workStream.name, intl),
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

const PAGE_SIZE = 8;

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
        label: intl.formatMessage(pageMessages.breadcrumb),
        url: paths.jobPosterTemplates(),
      },
    ],
  });

  const methods = useForm<FormValues>({ defaultValues });
  const { reset, watch } = methods;
  const formData = watch();

  const jobPosterTemplates = unpackMaybes(data?.jobPosterTemplates);
  const total = jobPosterTemplates.length;
  const maxShown = Math.min(PAGE_SIZE * page, total);
  const [available, filteredJobPosterTemplates] = useMemo(() => {
    const allTemplates = jobPosterTemplates.filter((jobPosterTemplate) => {
      let show = true;

      // keyword search
      if (formData.keyword.length) {
        const keywords = formData.keyword.split(",");
        show =
          show &&
          keywords.some((term) => {
            const sanitizedTerm = term.toLowerCase().trim();
            return (
              jobPosterTemplate.name?.[locale]
                ?.toLowerCase()
                .trim()
                .includes(sanitizedTerm) ||
              jobPosterTemplate.keywords?.[locale]?.some((keyword) => {
                return keyword.toLowerCase().trim().includes(sanitizedTerm);
              }) ||
              jobPosterTemplate.referenceId
                ?.toLowerCase()
                .trim()
                .includes(sanitizedTerm)
            );
          });
      }

      // checklists
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
          jobPosterTemplate.supervisoryStatus?.value,
        );
      show =
        show &&
        assertIncludes(formData.workStreams, jobPosterTemplate?.workStream?.id);

      return show;
    });

    return [
      allTemplates.length,
      allTemplates
        .sort((a, b) => {
          if (sortBy === "classification") {
            return (
              (a.classification?.group ?? "").localeCompare(
                b.classification?.group ?? "",
              ) ||
              (a?.classification?.level ?? 0) - (b?.classification?.level ?? 0)
            );
          }

          const aName = getLocalizedName(a.name, intl, true);
          const bName = getLocalizedName(b.name, intl, true);

          return aName.localeCompare(bName);
        })
        .splice(0, maxShown),
    ];
  }, [
    jobPosterTemplates,
    maxShown,
    formData.keyword,
    formData.classifications,
    formData.supervisoryStatuses,
    formData.workStreams,
    locale,
    sortBy,
    intl,
  ]);

  const showing = Math.min(filteredJobPosterTemplates.length, maxShown);
  const hasMore = showing < total && available > showing;

  const debouncedResetPage = useMemo(
    () =>
      debounce(() => {
        const newParams = new URLSearchParams(searchParams);
        newParams.set("page", "1");
        setSearchParams(newParams);
      }, 100),
    [searchParams, setSearchParams],
  );

  const handleSubmit = useCallback(
    () => debouncedResetPage(),
    [debouncedResetPage],
  );

  useDeepCompareEffect(() => {
    if (methods.formState.isDirty) {
      handleSubmit();
      reset(formData);
    }
  }, [formData, handleSubmit, methods, reset]);

  return (
    <>
      <SEO
        title={intl.formatMessage(pageMessages.title)}
        description={intl.formatMessage(pageMessages.description)}
      />
      <Hero
        title={intl.formatMessage(pageMessages.title)}
        subtitle={intl.formatMessage(pageMessages.description)}
        crumbs={crumbs}
      />
      <Container>
        <Heading
          level="h2"
          size="h3"
          color="secondary"
          icon={RectangleStackIcon}
        >
          {intl.formatMessage({
            defaultMessage: "Find a template",
            id: "XIDaGg",
            description: "Heading for the form to filter job poster templates",
          })}
        </Heading>
        <p className="mt-6 mb-12">
          {intl.formatMessage({
            defaultMessage:
              "This library contains a series of templates for common jobs across the communities that GC Digital Talent supports. The templates include suggested information and recommendations for elements such as the job title and common tasks in the role, as well as essential and optional skills. Browse the full list or use the search bar and filters to find templates that align with the job’s specific details.",
            id: "e5BoL+",
            description:
              "Description of how to use the form to filter job poster templates",
          })}
        </p>
        <Sidebar.Wrapper>
          <Sidebar.Sidebar>
            <FormProvider {...methods}>
              <div className="flex flex-col gap-6">
                <Input
                  id="keyword"
                  name="keyword"
                  type="text"
                  placeholder={intl.formatMessage({
                    defaultMessage: "E.g., web design",
                    id: "J9l5Vd",
                    description: "Placeholder for keyword search input",
                  })}
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
                        .sort((a, b) => a.level - b.level)
                        .map((classification) => ({
                          value: classification.id,
                          label: `${classification.group}-${classification.level < 10 ? "0" : ""}${classification.level}`,
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
                      idPrefix="workStreams"
                      name="workStreams"
                      items={alphaSortOptions(
                        unpackMaybes(data?.workStreams).map((workStream) => ({
                          value: workStream.id,
                          label: getLocalizedName(workStream.name, intl),
                        })),
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
                  color="primary"
                  block
                  onClick={() => reset(defaultValues)}
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
            {fetching ? (
              <Loading inline />
            ) : (
              <>
                {filteredJobPosterTemplates.length ? (
                  <>
                    <div className="mb-1.5 flex flex-col items-center justify-between gap-1.5 sm:flex-row">
                      <div className="flex items-center gap-x-1.5">
                        <span id="sortBy">
                          {intl.formatMessage(formMessages.sortBy)}
                          {intl.formatMessage(commonMessages.dividingColon)}
                        </span>
                        <Link
                          aria-describedby="sortBy"
                          href={searchParamHref(
                            "sortBy",
                            "classification",
                            searchParams,
                          )}
                          {...(sortBy === "classification"
                            ? { color: "primary", mode: "inline" }
                            : { color: "black", mode: "text" })}
                        >
                          {intl.formatMessage(processMessages.classification)}
                        </Link>
                        <Link
                          aria-describedby="sortBy"
                          href={searchParamHref(
                            "sortBy",
                            "title",
                            searchParams,
                          )}
                          {...(sortBy === "title"
                            ? { color: "primary", mode: "inline" }
                            : { color: "black", mode: "text" })}
                        >
                          {intl.formatMessage({
                            defaultMessage: "Job title",
                            id: "zDYHRr",
                            description: "Link text to sort by job title",
                          })}
                        </Link>
                      </div>
                      <span className="font-bold">
                        {intl.formatMessage(
                          {
                            defaultMessage:
                              "Showing {showing} of {total} available templates",
                            id: "Pjfjeg",
                            description:
                              "Number of job poster templates being displayed in the list",
                          },
                          { showing, total },
                        )}
                      </span>
                    </div>
                    <Card>
                      <PreviewList.Root>
                        {filteredJobPosterTemplates.map((jobPosterTemplate) => (
                          <PreviewList.Item
                            key={jobPosterTemplate.id}
                            title={getLocalizedName(
                              jobPosterTemplate.name,
                              intl,
                            )}
                            headingAs="h3"
                            action={
                              <PreviewList.Link
                                href={paths.jobPosterTemplate(
                                  jobPosterTemplate.id,
                                )}
                                label={getLocalizedName(
                                  jobPosterTemplate.name,
                                  intl,
                                )}
                              />
                            }
                            metaData={previewMetaData(
                              intl,
                              jobPosterTemplate.classification,
                              jobPosterTemplate.workStream,
                            )}
                          >
                            {jobPosterTemplate.description && (
                              <p>
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
                    </Card>
                    {hasMore && (
                      <>
                        <Separator
                          orientation="horizontal"
                          decorative
                          space="md"
                        />
                        <Link
                          mode="solid"
                          color="primary"
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
                  <Notice.Root className="text-center">
                    <Notice.Content>
                      <p>
                        {intl.formatMessage({
                          defaultMessage:
                            "No job advertisement templates found.",
                          id: "L47tv9",
                          description:
                            "Message displayed when there are no job poster templates meeting a specific criteria",
                        })}
                      </p>
                    </Notice.Content>
                  </Notice.Root>
                )}
              </>
            )}
          </Sidebar.Content>
        </Sidebar.Wrapper>
      </Container>
    </>
  );
};

export default JobPosterTemplatesPage;
