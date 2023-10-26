import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useIntl } from "react-intl";
import debounce from "lodash/debounce";

import {
  Classification,
  Pool,
  ApplicantFilterInput,
  Skill,
  useGetSearchFormDataAcrossAllPoolsQuery,
} from "@gc-digital-talent/graphql";
import { Heading, Pending, Separator } from "@gc-digital-talent/ui";
import { unpackMaybes } from "@gc-digital-talent/forms";

import { FormValues } from "~/types/searchRequest";

import {
  getAvailableClassifications,
  classificationToKey,
  mapObjectsByKey,
  formValuesToData,
} from "../utils";
import { useCandidateCount, useInitialFilters } from "../hooks";
import FormFields from "./FormFields";
import EstimatedCandidates from "./EstimatedCandidates";
import SearchFilterAdvice from "./SearchFilterAdvice";

const testId = (chunks: React.ReactNode) => (
  <span data-testid="candidateCount">{chunks}</span>
);

interface SearchFormProps {
  pools: Pool[];
  classifications: Classification[];
  skills: Skill[];
}

const SearchForm = ({ pools, classifications, skills }: SearchFormProps) => {
  const intl = useIntl();
  const { formValues: defaultValues, filters: initialFilters } =
    useInitialFilters(pools);
  const classificationMap = React.useMemo(() => {
    return mapObjectsByKey(classificationToKey, classifications);
  }, [classifications]);

  const [applicantFilter, setApplicantFilter] =
    React.useState<ApplicantFilterInput>(initialFilters);

  const { fetching, candidateCount, results } =
    useCandidateCount(applicantFilter);

  const methods = useForm<FormValues>({
    defaultValues,
    mode: "onSubmit",
    reValidateMode: "onSubmit",
  });
  const { watch } = methods;

  React.useEffect(() => {
    const subscription = watch((newValues) => {
      const newFilters = formValuesToData(
        newValues as FormValues,
        pools,
        classificationMap,
      );
      setApplicantFilter(newFilters);
    });

    return () => subscription.unsubscribe();
  }, [classificationMap, pools, watch]);

  const handleSubmit = (values: FormValues) => {
    console.log(values);
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(handleSubmit)}>
        <div data-h2-margin="base(0, 0, x3, 0)">
          <div data-h2-container="base(center, large, x1) p-tablet(center, large, x2)">
            <div data-h2-flex-grid="base(stretch, x3)">
              <div data-h2-flex-item="base(1of1) p-tablet(3of5)">
                <div>
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
                </div>
                <FormFields skills={skills} classifications={classifications} />
              </div>
              <div
                data-h2-display="base(none) p-tablet(block)"
                data-h2-flex-item="base(1of1) p-tablet(2of5)"
              >
                <EstimatedCandidates
                  candidateCount={candidateCount}
                  updatePending={fetching}
                />
              </div>
            </div>
          </div>
          <div
            data-h2-container="base(center, large, x1) p-tablet(center, large, x2)"
            id="results"
          >
            <Separator
              decorative
              orientation="horizontal"
              data-h2-margin="base(x3, 0, 0, 0)"
              data-h2-background-color="base(gray)"
            />
            <div>
              <Heading level="h3" size="h4">
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
            </div>
          </div>
        </div>
      </form>
    </FormProvider>
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
