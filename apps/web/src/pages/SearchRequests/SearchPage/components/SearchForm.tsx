import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useIntl } from "react-intl";
import { useNavigate } from "react-router-dom";
import { useQuery } from "urql";

import { Button, Heading, Pending, Separator } from "@gc-digital-talent/ui";
import { unpackMaybes, notEmpty } from "@gc-digital-talent/helpers";
import {
  graphql,
  Classification,
  Pool,
  ApplicantFilterInput,
  Skill,
} from "@gc-digital-talent/graphql";
import { commonMessages } from "@gc-digital-talent/i18n";

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
  const { watch, register, setValue } = methods;
  const poolSubmitProps = register("pool");

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
        allPools: values.allPools,
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
            data-h2-grid-template-columns="base(1fr) p-tablet(1fr x15)"
            data-h2-gap="base(x2)"
          >
            <div>
              <Heading
                data-h2-margin="base(x3, 0, x1, 0)"
                data-h2-font-weight="base(400)"
                level="h2"
                size="h3"
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
                    "If you are looking for talent, you have found the right place. Our talent database is open to most departments and agencies. Complete a request to find qualified candidates. Candidates are assessed for their skills and grouped into pools to meet your staffing needs.",
                  id: "F+LDbs",
                  description:
                    "Content displayed in the find talent page explaining the page and what it offers to users.",
                })}
              </p>
              <p data-h2-margin-top="base(x.5)">
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
            <div data-h2-display="base(none) p-tablet(block)">
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
            data-h2-background-color="base(gray)"
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
          <p data-h2-margin="base(x1, 0)">
            <Button
              color="primary"
              type="submit"
              {...poolSubmitProps}
              value=""
              onClick={() => {
                setValue("allPools", true);
                setValue("pool", "");
                setValue("count", candidateCount);
              }}
            >
              {intl.formatMessage({
                defaultMessage: "Request candidates from all pools",
                id: "DxNuJ9",
                description:
                  "Button text to submit search request for candidates across all pools",
              })}
            </Button>
          </p>
          <p
            data-h2-font-size="base(h4)"
            data-h2-margin="base(x1.5, 0, x.25, 0)"
          >
            {intl.formatMessage({
              defaultMessage: "Or request candidates by pool",
              id: "l1f8zy",
              description:
                "Lead-in text to list of pools managers can request candidates from",
            })}
            {intl.formatMessage(commonMessages.dividingColon)}
          </p>
          <div
            data-h2-display="base(flex)"
            data-h2-flex-direction="base(column)"
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

const SearchForm_Query = graphql(/* GraphQL */ `
  query SearchForm {
    publishedPools {
      id
      owner {
        id
        email
        firstName
        lastName
      }
      name {
        en
        fr
      }
      classifications {
        id
        group
        level
      }
      stream
    }
    skills {
      id
      key
      name {
        en
        fr
      }
      category
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
