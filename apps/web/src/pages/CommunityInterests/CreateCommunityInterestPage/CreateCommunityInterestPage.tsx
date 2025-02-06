import { useIntl } from "react-intl";
import { useMutation, useQuery } from "urql";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router";

import { CardBasic, CardSeparator, Pending } from "@gc-digital-talent/ui";
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
import { FormValues, formValuesToApiCreateInput } from "../form";
import FindANewCommunity from "../sections/FindANewCommunity";
import ReviewAndSubmit from "../sections/ReviewAndSubmit";
import AdditionalInformation from "../sections/AdditionalInformation";
import TrainingAndDevelopmentOpportunities from "../sections/TrainingAndDevelopmentOpportunities";

// options data for form controls
const CreateCommunityInterestFormOptions_Fragment = graphql(/* GraphQL */ `
  fragment CreateCommunityInterestFormOptions_Fragment on Query {
    ...FindANewCommunityOptions_Fragment
    ...TrainingAndDevelopmentOpportunitiesOptions_Fragment
  }
`);

interface CreateCommunityInterestFormProps {
  formOptionsQuery: FragmentType<
    typeof CreateCommunityInterestFormOptions_Fragment
  >;
  userId: string;
  formDisabled: boolean;
  onSubmit: SubmitHandler<FormValues>;
}

const CreateCommunityInterestForm = ({
  formOptionsQuery,
  userId,
  formDisabled,
  onSubmit,
}: CreateCommunityInterestFormProps) => {
  const formOptions = getFragment(
    CreateCommunityInterestFormOptions_Fragment,
    formOptionsQuery,
  );
  const formMethods = useForm<FormValues>();
  const selectedCommunityId = formMethods.watch("communityId");

  return (
    <>
      <FormProvider {...formMethods}>
        <form onSubmit={formMethods.handleSubmit(onSubmit)}>
          <input
            type="hidden"
            {...formMethods.register(`userId`)}
            value={userId}
          />
          <CardBasic data-h2-padding="base(x1 x1) l-tablet(x1 x1.5)">
            <div
              data-h2-display="base(flex)"
              data-h2-flex-direction="base(column)"
              data-h2-gap="base(x2)"
            >
              <FindANewCommunity
                optionsQuery={formOptions}
                formDisabled={formDisabled}
                mode="create"
              />
              {/* other sections hidden until a community is selected */}
              {selectedCommunityId && (
                <>
                  <CardSeparator space="none" />
                  <TrainingAndDevelopmentOpportunities
                    optionsQuery={formOptions}
                    formDisabled={formDisabled}
                  />
                  <CardSeparator space="none" />
                  <AdditionalInformation formDisabled={formDisabled} />
                  <CardSeparator space="none" />
                  <ReviewAndSubmit formDisabled={formDisabled} />
                </>
              )}
            </div>
          </CardBasic>
        </form>
      </FormProvider>
    </>
  );
};

// Complete query for the page
const CreateCommunityInterestPage_Query = graphql(/* GraphQL */ `
  query CreateCommunityInterestPage_Query {
    ...CreateCommunityInterestFormOptions_Fragment
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
  const intl = useIntl();
  const routes = useRoutes();
  const { userAuthInfo } = useAuthorization();

  const navigate = useNavigate();
  const [{ data: queryData, fetching: queryFetching, error: queryError }] =
    useQuery({
      query: CreateCommunityInterestPage_Query,
    });
  const [{ fetching: mutationFetching }, executeCreateMutation] = useMutation(
    CreateCommunityInterestPage_Mutation,
  );
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
      formValuesToApiCreateInput(formValues);
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
      .then(async () => {
        toast.success(
          intl.formatMessage({
            defaultMessage: "Community interest created successfully",
            id: "oDnMMb",
            description: "Toast for successful community interest creation",
          }),
        );
        await navigate(routes.applicantDashboard());
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
        {!!queryData && !!userAuthInfo?.id && (
          <div data-h2-margin-bottom="base(x3)">
            <CreateCommunityInterestForm
              formOptionsQuery={queryData}
              userId={userAuthInfo.id}
              formDisabled={queryFetching || mutationFetching}
              onSubmit={submitForm}
            />
          </div>
        )}
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
