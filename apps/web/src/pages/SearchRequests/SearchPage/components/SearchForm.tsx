import { FormProvider, useForm } from "react-hook-form";
import { useIntl } from "react-intl";
import { useNavigate } from "react-router";
import { useQuery } from "urql";
import { ReactNode, useState, useEffect } from "react";

import {
  Button,
  Card,
  Container,
  Heading,
  Link,
  Loading,
  Pending,
  Separator,
} from "@gc-digital-talent/ui";
import {
  unpackMaybes,
  notEmpty,
  buildMailToUri,
} from "@gc-digital-talent/helpers";
import {
  graphql,
  Classification,
  ApplicantFilterInput,
  Skill,
  WorkStream,
} from "@gc-digital-talent/graphql";
import { commonMessages } from "@gc-digital-talent/i18n";
import { useLogger } from "@gc-digital-talent/logger";

import { FormValues } from "~/types/searchRequest";
import useRoutes from "~/hooks/useRoutes";
import { isClassificationGroup } from "~/types/classificationGroup";

import { formValuesToData } from "../utils";
import { useCandidateCount, useInitialFilters } from "../hooks";
import FormFields from "./FormFields";
import EstimatedCandidates from "./EstimatedCandidates";
import SearchFilterAdvice from "./SearchFilterAdvice";
import NoResults from "./NoResults";
import SearchResultCard from "./SearchResultCard";

const testId = (chunks: ReactNode) => (
  <span data-testid="candidateCount">{chunks}</span>
);

const styledCount = (chunks: ReactNode) => (
  <span className="font-bold text-primary-500 dark:text-primary-300">
    {chunks}
  </span>
);

interface SearchFormProps {
  classifications: Pick<Classification, "group" | "level" | "id">[];
  skills: Skill[];
  workStreams: WorkStream[];
}

export const SearchForm = ({
  classifications,
  skills,
  workStreams,
}: SearchFormProps) => {
  const intl = useIntl();
  const navigate = useNavigate();
  const paths = useRoutes();
  const logger = useLogger();
  const { defaultValues, initialFilters } = useInitialFilters();

  classifications.forEach(({ group }) => {
    if (!isClassificationGroup(group)) {
      logger.error(`Unexpected classification: ${group}`);
    }
  });

  const [applicantFilter, setApplicantFilter] =
    useState<ApplicantFilterInput>(initialFilters);

  const { fetching, candidateCount, results } =
    useCandidateCount(applicantFilter);

  const methods = useForm<FormValues>({
    defaultValues,
    mode: "onSubmit",
    reValidateMode: "onBlur",
  });
  const { watch, register, setValue } = methods;
  const poolSubmitProps = register("pool");

  useEffect(() => {
    const subscription = watch((newValues) => {
      const newFilters = formValuesToData(
        newValues as FormValues,
        classifications,
      );
      setApplicantFilter(newFilters);
    });

    return () => subscription.unsubscribe();
  }, [classifications, watch]);

  const handleSubmit = async (values: FormValues) => {
    const poolIds = values.pool ? [{ id: values.pool }] : [];

    await navigate(paths.request(), {
      state: {
        applicantFilter: {
          ...applicantFilter,
          pools: poolIds,
        },
        allPools: values.allPools,
        candidateCount: values.count,
        selectedClassifications:
          applicantFilter?.qualifiedClassifications?.filter(notEmpty),
      },
    });
  };

  const handleSubmitAllPools = () => {
    setValue("allPools", true);
    setValue("pool", "");
    setValue("count", candidateCount);
  };

  const hireAnApprenticeEmailUri = buildMailToUri(
    "edsc.patipa.jumelage.emplois-itapip.job.matching.esdc@hrsdc-rhdcc.gc.ca",
    intl.formatMessage({
      defaultMessage: "I'm interested in offering an apprenticeship",
      id: "HqtjhD",
      description: "Subject line of a manager's email for apprenticeship",
    }),
    [
      intl.formatMessage({
        defaultMessage:
          "To best support you in your journey to hire an IT Apprentice, please let us know if you",
        id: "ZKss5S",
        description: "Paragraph 1 of a manager's email for apprenticeship",
      }),
      intl.formatMessage({
        defaultMessage:
          "1. are interested in hiring an Apprentice and would like to learn more about the IT Apprenticeship Program for Indigenous Peoples",
        id: "ipKAvI",
        description: "Paragraph 2 of a manager's email for apprenticeship",
      }),
      intl.formatMessage({
        defaultMessage:
          "2. have reviewed the checklist in the manager’s package and have positions available to hire an IT Apprentice",
        id: "18pJdz",
        description: "Paragraph 3 of a manager's email for apprenticeship",
      }),
      intl.formatMessage({
        defaultMessage: "3. Other…",
        id: "Fz49kD",
        description: "Paragraph 4 of a manager's email for apprenticeship",
      }),
      intl.formatMessage({
        defaultMessage:
          "A team member from the Office of Indigenous Initiatives will be in touch shortly.",
        id: "x45gSl",
        description: "Paragraph 5 of a manager's email for apprenticeship",
      }),
    ].join("\n"),
  );

  const selectedClassificationIsIT1 = applicantFilter.qualifiedClassifications
    ?.filter(notEmpty)
    .some(
      (classification) =>
        classification.group === "IT" && classification.level === 1,
    );

  return (
    <Container className="my-18">
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(handleSubmit)}>
          <div className="grid gap-12 xs:grid-cols-[1fr_22rem]">
            <div>
              <Heading level="h2" size="h3" className="font-normal">
                {intl.formatMessage({
                  defaultMessage: "How to use this tool",
                  id: "HvD7jI",
                  description:
                    "Heading displayed in the How To area of the hero section of the Search page.",
                })}
              </Heading>
              <p className="mb-6">
                {intl.formatMessage({
                  defaultMessage:
                    "If you are looking for talent, you have found the right place. Our talent database is open to most departments and agencies. Complete a request to find qualified candidates. All candidates in pools were assessed and successfully qualified.",
                  id: "Il8ztR",
                  description:
                    "Content displayed in the find talent page explaining the page and what it offers to users.",
                })}
              </p>
              <p className="mb-6">
                {intl.formatMessage({
                  defaultMessage:
                    "Use the filters to specify your requirements. We will show you an estimated number of qualified candidates who match your criteria as you enter your information. Select “Request candidates” when you are done. Doing so will bring you to a form where you can provide your contact information and submit your request.",
                  id: "KhOXZ3",
                  description:
                    "Content displayed in the How To area of the hero section of the Search page.",
                })}
              </p>
              <FormFields
                skills={skills}
                classifications={classifications}
                workStreams={workStreams}
              />
            </div>
            <div className="hidden sm:block">
              <EstimatedCandidates
                candidateCount={candidateCount}
                updatePending={fetching}
              />
            </div>
          </div>
          <Separator />
          {fetching ? (
            <Loading inline />
          ) : (
            <>
              <Heading level="h3" size="h4" id="results">
                {intl.formatMessage(
                  {
                    defaultMessage: `Results: {totalCandidateCount, plural,
                      =0 {<testId><b>#</b></testId> matching candidates}
                      one {<testId><b>#</b></testId> matching candidate}
                      other {<testId><b>#</b></testId> matching candidates} } across {numPools, plural,
                      =0 {<b>#</b> pools}
                      one {<b>#</b> pool}
                      other {<b>#</b> pools} }`,
                    id: "e5N39X",
                    description:
                      "Heading for total matching candidates across a certain number of pools in results section of search page.",
                  },
                  {
                    testId,
                    b: styledCount,
                    totalCandidateCount: candidateCount,
                    numPools: results?.length ?? 0,
                  },
                )}
              </Heading>
              <SearchFilterAdvice filters={applicantFilter} />
              {results?.length && candidateCount > 0 ? (
                <>
                  <p className="my-6">
                    <Button
                      color="secondary"
                      type="submit"
                      {...poolSubmitProps}
                      value=""
                      onClick={handleSubmitAllPools}
                    >
                      {intl.formatMessage({
                        defaultMessage: "Request candidates from all pools",
                        id: "DxNuJ9",
                        description:
                          "Button text to submit search request for candidates across all pools",
                      })}
                    </Button>
                  </p>
                  <p className="mt-9 mb-1.5 text-2xl lg:text-3xl">
                    {intl.formatMessage({
                      defaultMessage: "Or request candidates by pool",
                      id: "l1f8zy",
                      description:
                        "Lead-in text to list of pools managers can request candidates from",
                    })}
                    {intl.formatMessage(commonMessages.dividingColon)}
                  </p>
                  <div className="flex flex-col gap-y-6">
                    {selectedClassificationIsIT1 && (
                      <Card className="rounded-l-none border-l-12 border-l-error">
                        <p className="text-lg font-bold lg:text-xl">
                          {intl.formatMessage({
                            defaultMessage:
                              "Have you considered hiring an Indigenous IT apprentice?",
                            id: "kyM6sV",
                            description:
                              "Title for IT Apprenticeship Program for Indigenous Peoples search card",
                          })}
                        </p>
                        <p className="mt-5 mb-6 flex gap-x-3">
                          {intl.formatMessage({
                            defaultMessage:
                              "The IT Apprenticeship Program for Indigenous Peoples aims to help address and remove barriers Indigenous peoples face when it comes to finding employment in the Government of Canada's digital workforce. Become a hiring partner today and discover how you can strengthen your team with Indigenous IT talent and help build a more inclusive public service. Your participation contributes to the broader goal of inclusion, equity, and reconciliation in Canada.",
                            id: "ifqj46",
                            description:
                              "Paragraph for IT Apprenticeship Program for Indigenous Peoples search card",
                          })}
                        </p>
                        <Separator space="sm" />
                        <div className="mt-6 flex flex-wrap items-center gap-6">
                          <Link
                            mode="solid"
                            color="error"
                            href={hireAnApprenticeEmailUri}
                          >
                            {intl.formatMessage({
                              defaultMessage: "Contact the team",
                              id: "gJ7CQw",
                              description: "Link to send an email to the team",
                            })}
                          </Link>
                          <Link
                            mode="inline"
                            color="error"
                            href={paths.iapManager()}
                          >
                            {intl.formatMessage({
                              defaultMessage:
                                "Visit the IT Apprenticeship Program for Indigenous Peoples manager page",
                              id: "zVGzWa",
                              description:
                                "Link to visit IT Apprenticeship Program for Indigenous Peoples manager page",
                            })}
                          </Link>
                        </div>
                      </Card>
                    )}
                    {results.map(({ pool, candidateCount: resultsCount }) => (
                      <SearchResultCard
                        key={pool.id}
                        candidateCount={resultsCount}
                        pool={pool}
                      />
                    ))}
                  </div>
                </>
              ) : (
                <NoResults />
              )}
            </>
          )}
        </form>
      </FormProvider>
    </Container>
  );
};

const SearchForm_Query = graphql(/* GraphQL */ `
  query SearchForm {
    classifications(availableInSearch: true) {
      id
      group
      level
    }
    workStreams(talentSearchable: true) {
      id
      name {
        en
        fr
      }
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
      }
    }
  }
`);

const SearchFormAPI = () => {
  const [{ data, fetching, error }] = useQuery({ query: SearchForm_Query });

  const skills = unpackMaybes<Skill>(data?.skills);
  const classifications = unpackMaybes(data?.classifications);
  const workStreams = unpackMaybes(data?.workStreams);

  return (
    <Pending fetching={fetching} error={error}>
      <SearchForm
        skills={skills}
        classifications={classifications}
        workStreams={workStreams}
      />
    </Pending>
  );
};

export default SearchFormAPI;
