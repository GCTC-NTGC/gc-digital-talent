import { useIntl } from "react-intl";
import { useMutation, useQuery } from "urql";
import {
  FormProvider,
  SubmitHandler,
  useForm,
  useFormContext,
} from "react-hook-form";

import { CardBasic, Pending } from "@gc-digital-talent/ui";
import { ROLE_NAME, useAuthorization } from "@gc-digital-talent/auth";
import {
  CreateCommunityInterestInput,
  FragmentType,
  getFragment,
  graphql,
} from "@gc-digital-talent/graphql";
import { errorMessages, navigationMessages } from "@gc-digital-talent/i18n";
import { toast } from "@gc-digital-talent/toast";

import SEO from "~/components/SEO/SEO";
import RequireAuth from "~/components/RequireAuth/RequireAuth";
import Hero from "~/components/Hero";
import useRoutes from "~/hooks/useRoutes";
import useBreadcrumbs from "~/hooks/useBreadcrumbs";

import { messages } from "./messages";
import FindANewCommunity, {
  SubformValues as FindANewCommunitySubformValues,
} from "../sections/FindANewCommunity";
import TrainingAndDevelopmentOpportunities, {
  SubformValues as TrainingAndDevelopmentOpportunitiesSubformValues,
} from "../sections/TrainingAndDevelopmentOpportunities";
import AdditionalInformation, {
  SubformValues as AdditionalInformationSubformValues,
} from "../sections/AdditionalInformation";
import ReviewAndSubmit, {
  SubformValues as ReviewAndSubmitSubformValues,
} from "../sections/ReviewAndSubmit";
import { formValuesToApiInput } from "./form";

const CreateCommunityInterest_Fragment = graphql(/* GraphQL */ `
  fragment CreateCommunityInterest_Fragment on Query {
    ...FindANewCommunityOptions_Fragment
    ...TrainingAndDevelopmentOpportunitiesOptions_Fragment
  }
`);

export interface FormValues
  extends FindANewCommunitySubformValues,
    TrainingAndDevelopmentOpportunitiesSubformValues,
    AdditionalInformationSubformValues,
    ReviewAndSubmitSubformValues {
  userId: string | null | undefined;
}

interface CreateCommunityInterestFormProps {
  query: FragmentType<typeof CreateCommunityInterest_Fragment>;
  formDisabled: boolean;
}

const CreateCommunityInterestForm = ({
  query,
  formDisabled,
}: CreateCommunityInterestFormProps) => {
  const data = getFragment(CreateCommunityInterest_Fragment, query);
  const { watch } = useFormContext<FormValues>();
  const selectedCommunityId = watch("communityId");

  return (
    <CardBasic
      data-h2-display="base(flex)"
      data-h2-flex-direction="base(column)"
      data-h2-gap="base(x5)"
    >
      <div
        data-h2-display="base(flex)"
        data-h2-flex-direction="base(column)"
        data-h2-gap="base(x2)"
      >
        <FindANewCommunity optionsQuery={data} formDisabled={formDisabled} />
        {/* other sections hidden until a community is selected */}
        {selectedCommunityId && (
          <>
            <TrainingAndDevelopmentOpportunities
              optionsQuery={data}
              formDisabled={formDisabled}
            />
            <AdditionalInformation />
            <ReviewAndSubmit formDisabled={formDisabled} />
          </>
        )}
      </div>
    </CardBasic>
  );
};

const CreateCommunityInterestPage_Query = graphql(/* GraphQL */ `
  query CreateCommunityInterestPage_Query {
    ...CreateCommunityInterest_Fragment
  }
`);

const CreateCommunityInterestPage_Mutation = graphql(/* GraphQL */ `
  mutation CreateCommunityInterest(
    $communityInterest: CreateCommunityInterestInput!
  ) {
    createCommunityInterest(communityInterest: $communityInterest) {
      id
    }
  }
`);

export const CreateCommunityInterestPage = () => {
  const [{ data: queryData, fetching: queryFetching, error: queryError }] =
    useQuery({
      query: CreateCommunityInterestPage_Query,
    });
  const [{ fetching: mutationFetching }, executeCreateMutation] = useMutation(
    CreateCommunityInterestPage_Mutation,
  );
  const intl = useIntl();
  const routes = useRoutes();
  const { userAuthInfo } = useAuthorization();
  const formMethods = useForm<FormValues>();
  const formattedPageTitle = intl.formatMessage(messages.pageTitle);
  const formattedPageSubtitle = intl.formatMessage(messages.pageSubtitle);

  const crumbs = useBreadcrumbs({
    crumbs: [
      {
        label: intl.formatMessage(navigationMessages.profileAndApplications),
        url: routes.applicantDashboard(),
      },

      {
        label: intl.formatMessage(messages.pageTitle),
        url: routes.createCommunityInterest(),
      },
    ],
  });

  const submitForm: SubmitHandler<FormValues> = async (
    formValues: FormValues,
  ) => {
    const mutationInput: CreateCommunityInterestInput =
      formValuesToApiInput(formValues);
    const mutationPromise = executeCreateMutation({
      communityInterest: mutationInput,
    }).then((response) => {
      // confirmed error
      if (response.error) {
        throw new Error(response.error.message);
      }
      // confirmed success
      if (response.data?.createCommunityInterest?.id) {
        return; //success
      }
      // unexpected outcome
      throw new Error(intl.formatMessage(errorMessages.error));
    });

    return mutationPromise
      .then(() => {
        toast.success(
          intl.formatMessage({
            defaultMessage: "Community interest created successfully",
            id: "oDnMMb",
            description: "Toast for successful community interest creation",
          }),
        );
      })
      .catch(() => {
        toast.error(
          intl.formatMessage({
            defaultMessage: "Failed to create community interest",
            id: "e+6lnP",
            description: "Toast for error during community interest creation",
          }),
        );
      });
  };

  return (
    <Pending fetching={queryFetching} error={queryError}>
      <SEO title={formattedPageTitle} description={formattedPageSubtitle} />
      <Hero
        title={formattedPageTitle}
        subtitle={formattedPageSubtitle}
        crumbs={crumbs}
        centered
        overlap
      >
        <div data-h2-margin-bottom="base(x3)">
          {!!queryData && (
            <FormProvider {...formMethods}>
              <form onSubmit={formMethods.handleSubmit(submitForm)}>
                <input
                  type="hidden"
                  {...formMethods.register(`userId`)}
                  value={userAuthInfo?.id}
                />
                <CreateCommunityInterestForm
                  query={queryData}
                  formDisabled={queryFetching || mutationFetching}
                />
              </form>
            </FormProvider>
          )}
        </div>
      </Hero>
    </Pending>
  );
};

export const Component = () => (
  <RequireAuth roles={[ROLE_NAME.Applicant]}>
    <CreateCommunityInterestPage />
  </RequireAuth>
);

Component.displayName = "CreateCommunityInterestPage";
