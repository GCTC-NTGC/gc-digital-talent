import { useIntl } from "react-intl";
import { useMutation, useQuery } from "urql";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router";

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
import { FormValues, formValuesToApiInput } from "../form";

const UpdateCommunityInterest_Fragment = graphql(/* GraphQL */ `
  fragment UpdateCommunityInterest_Fragment on Query {
    ...FindANewCommunityOptions_Fragment
    ...TrainingAndDevelopmentOpportunitiesOptions_Fragment
  }
`);

interface UpdateCommunityInterestFormProps {
  query: FragmentType<typeof UpdateCommunityInterest_Fragment>;
  formDisabled: boolean;
}

const UpdateCommunityInterestForm = ({
  query,
  formDisabled,
}: UpdateCommunityInterestFormProps) => {
  const data = getFragment(UpdateCommunityInterest_Fragment, query);
  return (
    <CardBasic>
      Hello update
      {/* <FindANewCommunity />
      <TrainingAndDevelopmentOpportunities />
      <AdditionalInformation /> */}
    </CardBasic>
  );
};

const UpdateCommunityInterestPage_Query = graphql(/* GraphQL */ `
  query UpdateCommunityInterestPage_Query {
    ...UpdateCommunityInterest_Fragment
  }
`);

const UpdateCommunityInterestPage_Mutation = graphql(/* GraphQL */ `
  mutation CreateCommunityInterest(
    $communityInterest: CreateCommunityInterestInput!
  ) {
    createCommunityInterest(communityInterest: $communityInterest) {
      id
    }
  }
`);

export const UpdateCommunityInterestPage = () => {
  const [{ data: queryData, fetching: queryFetching, error: queryError }] =
    useQuery({
      query: UpdateCommunityInterestPage_Query,
    });
  const [{ fetching: mutationFetching }, executeUpdateMutation] = useMutation(
    UpdateCommunityInterestPage_Mutation,
  );
  const intl = useIntl();
  const routes = useRoutes();
  const { userAuthInfo } = useAuthorization();
  const formMethods = useForm<FormValues>();
  const formattedLongPageTitle = intl.formatMessage(messages.longPageTitle);
  const formattedShortPageTitle = intl.formatMessage(messages.shortPageTitle);
  const formattedPageSubtitle = intl.formatMessage(messages.pageSubtitle);
  const navigate = useNavigate();

  const crumbs = useBreadcrumbs({
    crumbs: [
      {
        label: intl.formatMessage(navigationMessages.profileAndApplications),
        url: routes.applicantDashboard(),
      },

      {
        label: intl.formatMessage(messages.shortPageTitle),
        url: routes.updateCommunityInterest("TODO"),
      },
    ],
  });

  const submitForm: SubmitHandler<FormValues> = async (
    formValues: FormValues,
  ) => {
    const mutationInput: CreateCommunityInterestInput =
      formValuesToApiInput(formValues);
    const mutationPromise = executeUpdateMutation({
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
            defaultMessage: "Community interest updated successfully",
            id: "KwNyg8",
            description: "Toast for successful community interest update",
          }),
        );
        await navigate(routes.applicantDashboard());
      })
      .catch(() => {
        toast.error(
          intl.formatMessage({
            defaultMessage: "Failed to update community interest",
            id: "mjGat+",
            description: "Toast for error during community interest update",
          }),
        );
      });
  };

  return (
    <Pending fetching={queryFetching} error={queryError}>
      <SEO
        title={formattedShortPageTitle}
        description={formattedPageSubtitle}
      />
      <Hero
        title={formattedLongPageTitle}
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
                <UpdateCommunityInterestForm
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
    <UpdateCommunityInterestPage />
  </RequireAuth>
);

Component.displayName = "UpdateCommunityInterestPage";
