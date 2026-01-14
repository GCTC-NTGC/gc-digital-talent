import { useIntl } from "react-intl";
import { useMutation, useQuery } from "urql";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router";

import { Card, Pending, ThrowNotFound } from "@gc-digital-talent/ui";
import { ROLE_NAME, useAuthorization } from "@gc-digital-talent/auth";
import {
  UpdateCommunityInterestInput,
  FragmentType,
  getFragment,
  graphql,
} from "@gc-digital-talent/graphql";
import { errorMessages, navigationMessages } from "@gc-digital-talent/i18n";
import { toast } from "@gc-digital-talent/toast";
import { NotFoundError, unpackMaybes } from "@gc-digital-talent/helpers";

import SEO from "~/components/SEO/SEO";
import RequireAuth from "~/components/RequireAuth/RequireAuth";
import Hero from "~/components/Hero";
import useRoutes from "~/hooks/useRoutes";
import useBreadcrumbs from "~/hooks/useBreadcrumbs";

import { messages } from "./messages";
import {
  apiDataToFormValues,
  FormValues,
  formValuesToApiUpdateInput,
} from "../form";
import FindANewCommunity from "../sections/FindANewCommunity";
import ReviewAndSubmit from "../sections/ReviewAndSubmit";
import AdditionalInformation from "../sections/AdditionalInformation";
import TrainingAndDevelopmentOpportunities from "../sections/TrainingAndDevelopmentOpportunities";
import DeleteCommunityInterestAlert from "./DeleteCommunityInterestAlert";

// options data for form controls
const UpdateCommunityInterestFormOptions_Fragment = graphql(/* GraphQL */ `
  fragment UpdateCommunityInterestFormOptions_Fragment on Query {
    ...FindANewCommunityOptions_Fragment
    ...TrainingAndDevelopmentOpportunitiesOptions_Fragment
    ...AdditionalInformationOptions_Fragment
    ...ReviewAndSubmitOptions_Fragment

    communities {
      id
      developmentPrograms {
        id
        name {
          localized
        }
      }
    }
  }
`);

// The shape of data needed to populate the form
export const UpdateCommunityInterestFormData_Fragment = graphql(/* GraphQL */ `
  fragment UpdateCommunityInterestFormData_Fragment on CommunityInterest {
    id
    community {
      id
    }
    jobInterest
    trainingInterest
    workStreams {
      id
    }
    additionalInformation
    interestInDevelopmentPrograms {
      developmentProgram {
        id
        name {
          localized
        }
      }
      participationStatus
      completionDate
    }
    financeIsChief
    financeAdditionalDuties {
      value
      label {
        localized
      }
    }
    financeOtherRoles {
      value
      label {
        localized
      }
    }
    financeOtherRolesOther
    ...DeleteCommunityInterestAlert
    consentToShareProfile
  }
`);

interface UpdateCommunityInterestFormProps {
  formOptionsQuery: FragmentType<
    typeof UpdateCommunityInterestFormOptions_Fragment
  >;
  formDataQuery: FragmentType<typeof UpdateCommunityInterestFormData_Fragment>;
  userId: string;
  formDisabled: boolean;
  onSubmit: SubmitHandler<FormValues>;
}

const UpdateCommunityInterestForm = ({
  formOptionsQuery,
  formDataQuery,
  userId,
  formDisabled,
  onSubmit,
}: UpdateCommunityInterestFormProps) => {
  const formOptions = getFragment(
    UpdateCommunityInterestFormOptions_Fragment,
    formOptionsQuery,
  );

  const formData = getFragment(
    UpdateCommunityInterestFormData_Fragment,
    formDataQuery,
  );

  const developmentProgramsForCommunity = unpackMaybes(
    formOptions?.communities?.find(
      (community) => community?.id === formData.community.id,
    )?.developmentPrograms,
  );

  const developmentProgramCount: number =
    developmentProgramsForCommunity.length;

  const formMethods = useForm<FormValues>({
    defaultValues: apiDataToFormValues(
      userId,
      formData,
      developmentProgramsForCommunity,
    ),
  });

  return (
    <>
      <FormProvider {...formMethods}>
        <form onSubmit={formMethods.handleSubmit(onSubmit)}>
          <input
            type="hidden"
            {...formMethods.register(`userId`)}
            value={userId}
          />
          <Card space="lg">
            <div className="flex flex-col gap-12">
              <FindANewCommunity
                optionsQuery={formOptions}
                formDisabled={formDisabled}
                mode="update"
              />
              {/* the training section is hidden if there are no development programs */}
              {developmentProgramCount > 0 ? (
                <>
                  <Card.Separator />
                  <TrainingAndDevelopmentOpportunities
                    optionsQuery={formOptions}
                    formDisabled={formDisabled}
                  />
                </>
              ) : null}
              <Card.Separator />
              <AdditionalInformation
                optionsQuery={formOptions}
                formDisabled={formDisabled}
              />
              <Card.Separator />
              <ReviewAndSubmit
                formDisabled={formDisabled}
                actions={<DeleteCommunityInterestAlert query={formData} />}
                optionsQuery={formOptions}
              />
            </div>
          </Card>
        </form>
      </FormProvider>
    </>
  );
};

// The shape of data needed to populate the page
export const UpdateCommunityInterestPage_Fragment = graphql(/* GraphQL */ `
  fragment UpdateCommunityInterestPage_Fragment on CommunityInterest {
    community {
      name {
        localized
      }
    }
  }
`);

// Complete query for the page
const UpdateCommunityInterest_Query = graphql(/* GraphQL */ `
  query UpdateCommunityInterest_Query($communityInterestId: UUID!) {
    me {
      employeeProfile {
        communityInterests(id: $communityInterestId) {
          ...UpdateCommunityInterestPage_Fragment
          ...UpdateCommunityInterestFormData_Fragment
          interestInDevelopmentPrograms {
            id
            developmentProgram {
              id
            }
          }
        }
      }
    }
    ...UpdateCommunityInterestFormOptions_Fragment
  }
`);

const UpdateCommunityInterest_Mutation = graphql(/* GraphQL */ `
  mutation UpdateCommunityInterest(
    $communityInterest: UpdateCommunityInterestInput!
  ) {
    updateCommunityInterest(communityInterest: $communityInterest) {
      id
    }
  }
`);

interface RouteParams extends Record<string, string> {
  communityInterestId: string;
}

export const UpdateCommunityInterestPage = () => {
  const intl = useIntl();
  const routes = useRoutes();
  const { userAuthInfo } = useAuthorization();
  const { communityInterestId } = useParams<RouteParams>();

  const navigate = useNavigate();
  if (!communityInterestId) {
    throw new NotFoundError("Missing parameter: communityInterestId");
  }
  const [{ data: queryData, fetching: queryFetching, error: queryError }] =
    useQuery({
      query: UpdateCommunityInterest_Query,
      variables: {
        communityInterestId: communityInterestId,
      },
    });
  const [{ fetching: mutationFetching }, executeUpdateMutation] = useMutation(
    UpdateCommunityInterest_Mutation,
  );

  const pageData = getFragment(
    UpdateCommunityInterestPage_Fragment,
    queryData?.me?.employeeProfile?.communityInterests?.[0],
  );

  const communityName = pageData?.community?.name?.localized ?? "";

  const formattedLongPageTitle = intl.formatMessage(messages.longPageTitle, {
    communityName: communityName,
  });
  const formattedShortPageTitle = intl.formatMessage(messages.shortPageTitle);
  const formattedPageSubtitle = intl.formatMessage(messages.pageSubtitle);

  const crumbs = useBreadcrumbs({
    crumbs: [
      {
        label: intl.formatMessage(navigationMessages.applicantDashboard),
        url: routes.applicantDashboard(),
      },

      {
        label: intl.formatMessage(messages.shortPageTitle),
        url: routes.updateCommunityInterest(communityInterestId),
      },
    ],
  });

  const submitForm: SubmitHandler<FormValues> = async (
    formValues: FormValues,
  ) => {
    const interestedDevPrograms = new Map<string, string>();
    queryData?.me?.employeeProfile?.communityInterests?.forEach(
      (communityInterest) => {
        communityInterest.interestInDevelopmentPrograms?.forEach(
          (interestedDevProgram) => {
            interestedDevPrograms.set(
              interestedDevProgram.developmentProgram.id,
              interestedDevProgram.id,
            );
          },
        );
      },
    );

    const mutationInput: UpdateCommunityInterestInput =
      formValuesToApiUpdateInput(
        communityInterestId,
        interestedDevPrograms,
        formValues,
      );
    const mutationPromise = executeUpdateMutation({
      communityInterest: mutationInput,
    }).then((response) => {
      // confirmed error
      if (response.error) {
        throw new Error(response.error.message);
      }
      // confirmed success
      if (response.data?.updateCommunityInterest?.id) {
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

  const queriedCommunityInterest =
    queryData?.me?.employeeProfile?.communityInterests?.[0];

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
        {!!queryData && !!userAuthInfo?.id && !!queriedCommunityInterest ? (
          <div className="mb-18">
            <UpdateCommunityInterestForm
              formOptionsQuery={queryData}
              formDataQuery={queriedCommunityInterest}
              userId={userAuthInfo.id}
              formDisabled={queryFetching || mutationFetching}
              onSubmit={submitForm}
            />
          </div>
        ) : (
          <ThrowNotFound />
        )}
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

export default Component;
