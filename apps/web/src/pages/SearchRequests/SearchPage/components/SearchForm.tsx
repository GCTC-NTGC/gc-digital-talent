import { FormProvider, useForm } from "react-hook-form";
import { useIntl } from "react-intl";
import { useNavigate } from "react-router";
import { useQuery } from "urql";
import { useState, useEffect } from "react";

import {
  Container,
  Heading,
  Loading,
  Pending,
  Separator,
} from "@gc-digital-talent/ui";
import { unpackMaybes, notEmpty } from "@gc-digital-talent/helpers";
import type {
  Classification,
  ApplicantFilterInput,
  Skill,
  WorkStream,
} from "@gc-digital-talent/graphql";
import {
  graphql,
  FlexibleWorkLocation,
  TalentRequestSource,
} from "@gc-digital-talent/graphql";
import { commonMessages, getLocalizedName } from "@gc-digital-talent/i18n";

import type { FormValues } from "~/types/searchRequest";
import useRoutes from "~/hooks/useRoutes";

import { formValuesToData } from "../utils";
import { useCandidateCount, useInitialFilters } from "../hooks";
import FormFields from "./FormFields";
import EstimatedCandidates from "./EstimatedCandidates";
import SearchFilterAdvice from "./SearchFilterAdvice";
import NoResults from "./NoResults";
import SearchResultCard from "./SearchResultCard";
import CommunityResultCard from "./CommunityResultCard";

interface SearchFormProps {
  classifications: Classification[];
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
  const { defaultValues, initialFilters } = useInitialFilters();

  // set some fields to a desired default (form)
  const defaultValuesAdjusted = {
    ...defaultValues,
    flexibleWorkLocations: [
      FlexibleWorkLocation.Remote,
      FlexibleWorkLocation.Hybrid,
    ],
  };

  // set some fields to a desired default (query)
  const initialFiltersAdjusted = {
    ...initialFilters,
    flexibleWorkLocations: [
      FlexibleWorkLocation.Remote,
      FlexibleWorkLocation.Hybrid,
    ],
  };

  const [applicantFilter, setApplicantFilter] = useState<ApplicantFilterInput>(
    initialFiltersAdjusted,
  );

  const { fetching, candidateCount, results, communities } =
    useCandidateCount(applicantFilter);

  const methods = useForm<FormValues>({
    defaultValues: defaultValuesAdjusted,
    mode: "onSubmit",
    reValidateMode: "onBlur",
  });
  const { watch } = methods;

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

  // An empty selection means "all sources" on the backend (TalentRequestSource::selected()),
  // so show both breakdown lines until the user narrows it down to one.
  const hasTalentSourceSelection = !!applicantFilter?.talentSources?.length;
  const showQualifiedInPool =
    !hasTalentSourceSelection ||
    !!applicantFilter?.talentSources?.includes(
      TalentRequestSource.QualifiedInPool,
    );
  const showAtLevel =
    !hasTalentSourceSelection ||
    !!applicantFilter?.talentSources?.includes(TalentRequestSource.AtLevel);

  const selectedWorkStream = workStreams.find(
    (workStream) =>
      workStream.id === applicantFilter?.qualifiedInWorkStreams?.[0]?.id,
  );
  const selectedWorkStreamName = selectedWorkStream
    ? getLocalizedName(selectedWorkStream.name, intl)
    : undefined;

  const handleSubmit = async (values: FormValues) => {
    let poolIds: { id: string }[] = [];
    let community: { id: string } | undefined;

    if (values.communityId) {
      poolIds = (results ?? [])
        .filter((result) => result.pool.community?.id === values.communityId)
        .map((result) => ({ id: result.pool.id }));
      community = { id: values.communityId };
    } else if (values.pool) {
      poolIds = [{ id: values.pool }];
      const clickedPool = results?.find(
        (result) => result.pool.id === values.pool,
      )?.pool;
      community = clickedPool?.community?.id
        ? { id: clickedPool.community.id }
        : undefined;
    }

    await navigate(paths.request(), {
      state: {
        applicantFilter: {
          ...applicantFilter,
          pools: poolIds,
          community,
        },
        candidateCount: values.count,
        selectedClassifications:
          applicantFilter?.qualifiedInClassifications?.filter(notEmpty),
      },
    });
  };

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
                    "If you're looking for talent, you've come to the right place. Our talent database is open to most departments and agencies. Complete a request to find qualified candidates. All candidates in these recruitment processes have been assessed and successfully qualified.",
                  id: "vjZ960",
                  description:
                    "Content displayed in the find talent page explaining the page and what it offers to users.",
                })}
              </p>
              <p className="mb-6">
                {intl.formatMessage({
                  defaultMessage:
                    "Based on your filters, we’ll show you an estimated number of qualified candidates who match your criteria.",
                  id: "q3JL9y",
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
                {intl.formatMessage({
                  defaultMessage: "Results:",
                  id: "7TvpUE",
                  description:
                    "Heading for the results section of search page.",
                })}
              </Heading>
              <SearchFilterAdvice filters={applicantFilter} />
              {communities.length ? (
                <>
                  <div className="flex flex-col gap-y-6">
                    {communities.map(
                      ({
                        community,
                        qualifiedInPoolCount,
                        atLevelCount,
                        count: communityCount,
                      }) => (
                        <CommunityResultCard
                          key={community.id}
                          community={community}
                          workStreamName={selectedWorkStreamName}
                          qualifiedInPoolCount={qualifiedInPoolCount}
                          atLevelCount={atLevelCount}
                          count={communityCount}
                          showQualifiedInPool={showQualifiedInPool}
                          showAtLevel={showAtLevel}
                        />
                      ),
                    )}
                  </div>
                  {results?.length ? (
                    <>
                      <p className="mt-9 mb-1.5 text-2xl lg:text-3xl">
                        {intl.formatMessage({
                          defaultMessage: "Results by pool",
                          id: "p4hCip",
                          description:
                            "Lead-in text to list of pools managers can request candidates from",
                        })}
                        {intl.formatMessage(commonMessages.dividingColon)}
                      </p>
                      <div className="flex flex-col gap-y-6">
                        {results.map(({ pool, count: resultsCount }) => (
                          <SearchResultCard
                            key={pool.id}
                            candidateCount={resultsCount}
                            pool={pool}
                          />
                        ))}
                      </div>
                    </>
                  ) : null}
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
      name {
        localized
      }
      groupAndLevel
      displayName
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
