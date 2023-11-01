import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useIntl } from "react-intl";
import { useNavigate } from "react-router-dom";

import {
  Classification,
  Pool,
  ApplicantFilterInput,
  Skill,
  useGetSearchFormDataAcrossAllPoolsQuery,
} from "@gc-digital-talent/graphql";
import { Heading, Pending, Separator } from "@gc-digital-talent/ui";
import { unpackMaybes, notEmpty } from "@gc-digital-talent/helpers";

import { FormValues } from "~/types/searchRequest";
import useRoutes from "~/hooks/useRoutes";

import { getAvailableClassifications, formValuesToData } from "../utils";
import { useCandidateCount, useInitialFilters } from "../hooks";
import FormFields from "./FormFields";
import EstimatedCandidates from "./EstimatedCandidates";
import SearchFilterAdvice from "./SearchFilterAdvice";
import NoResults from "./NoResults";
import SearchResultCard from "./SearchResultCard";

const testId = (chunks: React.ReactNode) => (
  <span data-testid="candidateCount">{chunks}</span>
);

interface SearchFormProps {
  pools: Pool[];
  classifications: Classification[];
  skills: Skill[];
}

export const SearchForm = ({
  pools,
  classifications,
  skills,
}: SearchFormProps) => {
  const intl = useIntl();
  const navigate = useNavigate();
  const paths = useRoutes();
  const { defaultValues, initialFilters } = useInitialFilters(pools);

  const [applicantFilter, setApplicantFilter] =
    React.useState<ApplicantFilterInput>(initialFilters);

  const { fetching, candidateCount, results } =
    useCandidateCount(applicantFilter);

  const methods = useForm<FormValues>({
    defaultValues,
    mode: "onSubmit",
    reValidateMode: "onBlur",
  });
  const { watch } = methods;

  React.useEffect(() => {
    const subscription = watch((newValues) => {
      const newFilters = formValuesToData(
        newValues as FormValues,
        pools,
        classifications,
      );
      setApplicantFilter(newFilters);
    });

    return () => subscription.unsubscribe();
  }, [classifications, pools, watch]);

  const handleSubmit = (values: FormValues) => {
    const poolIds = values.pool ? [{ id: values.pool }] : [];
    const selectedPool = pools.find((pool) => pool.id === values.pool);

    navigate(paths.request(), {
      state: {
        applicantFilter: {
          ...applicantFilter,
          pools: poolIds,
        },
        candidateCount: values.count,
        selectedClassifications: selectedPool
          ? selectedPool.classifications?.filter(notEmpty)
          : applicantFilter?.qualifiedClassifications?.filter(notEmpty),
      },
    });
  };

  return (
    <div
      data-h2-container="base(center, large, x1) p-tablet(center, large, x2)"
      data-h2-margin-bottom="base(x3)"
    >
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(handleSubmit)}>
          <div
            data-h2-display="base(grid)"
            data-h2-grid-template-columns="base(1fr) p-tablet(repeat(5, 1fr))"
            data-h2-gap="base(x2)"
          >
            <div data-h2-grid-column="p-tablet(span 3)">
              <Heading
                data-h2-margin="base(x3, 0, x1, 0)"
                data-h2-font-weight="base(300)"
                level="h2"
              >
                {intl.formatMessage({
                  defaultMessage: "How to use this tool",
                  id: "HvD7jI",
                  description:
                    "Heading displayed in the How To area of the hero section of the Search page.",
                })}
              </Heading>
              <p>
                {intl.formatMessage({
                  defaultMessage:
                    "Use the filters to specify your requirements. We will show you an estimated number of candidates who match your criteria as you enter your information. Select “<strong>Request candidates</strong>” when you are done. Doing so will bring you to a form where you can provide your contact information and submit your request.",
                  id: "1pCzp1",
                  description:
                    "Content displayed in the How To area of the hero section of the Search page.",
                })}
              </p>
              <FormFields skills={skills} classifications={classifications} />
            </div>
            <div
              data-h2-display="base(none) p-tablet(block)"
              data-h2-grid-column="p-tablet(span 2)"
            >
              <EstimatedCandidates
                candidateCount={candidateCount}
                updatePending={fetching}
              />
            </div>
          </div>
          <Separator
            decorative
            orientation="horizontal"
            data-h2-margin="base(x2, 0)"
            data-h2-background-color="base(gray.lighter)"
          />
          <Heading level="h3" size="h4" id="results">
            {intl.formatMessage(
              {
                defaultMessage: `{totalCandidateCount, plural,
                  =0 {Results: <testId>{totalCandidateCount}</testId> matching candidates}
                  =1 {Results: <testId>{totalCandidateCount}</testId> matching candidate}
                  other {Results: <testId>{totalCandidateCount}</testId> matching candidates}
                }`,
                id: "eeWkWi",
                description:
                  "Heading for total matching candidates in results section of search page.",
              },
              {
                testId,
                totalCandidateCount: candidateCount,
              },
            )}
          </Heading>
          <SearchFilterAdvice filters={applicantFilter} />
          <div
            data-h2-display="base(flex)"
            data-h2-flex-direction="base(column)"
            data-h2-gap="base(x1 0)"
          >
            {results?.length && candidateCount > 0 ? (
              results.map(({ pool, candidateCount: resultsCount }) => (
                <SearchResultCard
                  key={pool.id}
                  candidateCount={resultsCount}
                  pool={pool}
                />
              ))
            ) : (
              <NoResults />
            )}
          </div>
        </form>
      </FormProvider>
    </div>
  );
};

const SearchFormAPI = () => {
  const [{ data, fetching, error }] = useGetSearchFormDataAcrossAllPoolsQuery();

  const skills = unpackMaybes<Skill>(data?.skills);
  const pools = unpackMaybes<Pool>(data?.publishedPools);
  const classifications = getAvailableClassifications(pools);

  return (
    <Pending fetching={fetching} error={error}>
      <SearchForm
        skills={skills}
        pools={pools}
        classifications={classifications}
      />
    </Pending>
  );
};

export default SearchFormAPI;
