import { useNavigate } from "react-router";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useIntl } from "react-intl";
import IdentificationIcon from "@heroicons/react/24/outline/IdentificationIcon";
import { useMutation, useQuery } from "urql";

import { toast } from "@gc-digital-talent/toast";
import { Submit } from "@gc-digital-talent/forms";
import {
  commonMessages,
  formMessages,
  getLocalizedName,
} from "@gc-digital-talent/i18n";
import {
  Heading,
  Link,
  CardSeparator,
  Card,
  NotFound,
  Pending,
} from "@gc-digital-talent/ui";
import {
  FragmentType,
  Scalars,
  UpdateTrainingOpportunityInput,
  getFragment,
  graphql,
} from "@gc-digital-talent/graphql";
import { ROLE_NAME } from "@gc-digital-talent/auth";

import SEO from "~/components/SEO/SEO";
import useRoutes from "~/hooks/useRoutes";
import useRequiredParams from "~/hooks/useRequiredParams";
import useBreadcrumbs from "~/hooks/useBreadcrumbs";
import RequireAuth from "~/components/RequireAuth/RequireAuth";
import pageTitles from "~/messages/pageTitles";
import Hero from "~/components/Hero";

import {
  FormValues,
  TrainingOpportunityForm_Fragment,
  convertApiFragmentToFormValues,
  convertFormValuesToUpdateInput,
} from "./apiUtils";
import TrainingOpportunityForm, {
  TrainingOpportunityFormOptions_Fragment,
} from "./components/TrainingOpportunityForm";

interface UpdateTrainingOpportunityFormProps {
  trainingOpportunityQuery: FragmentType<
    typeof TrainingOpportunityForm_Fragment
  >;
  handleUpdateTrainingOpportunity: (
    input: UpdateTrainingOpportunityInput,
  ) => Promise<FragmentType<typeof TrainingOpportunityForm_Fragment>>;
  formOptionsQuery: FragmentType<
    typeof TrainingOpportunityFormOptions_Fragment
  >;
}

const UpdateTrainingOpportunityForm = ({
  trainingOpportunityQuery,
  handleUpdateTrainingOpportunity,
  formOptionsQuery,
}: UpdateTrainingOpportunityFormProps) => {
  const intl = useIntl();
  const navigate = useNavigate();
  const paths = useRoutes();
  const { trainingOpportunityId } = useRequiredParams<RouteParams>(
    "trainingOpportunityId",
  );
  const initialTrainingOpportunity = getFragment(
    TrainingOpportunityForm_Fragment,
    trainingOpportunityQuery,
  );
  const methods = useForm<FormValues>({
    defaultValues: convertApiFragmentToFormValues(initialTrainingOpportunity),
  });
  const { handleSubmit } = methods;

  const onSubmit: SubmitHandler<FormValues> = async (
    formValues: FormValues,
  ) => {
    return handleUpdateTrainingOpportunity(
      convertFormValuesToUpdateInput(trainingOpportunityId, formValues),
    )
      .then(async () => {
        await navigate(paths.trainingOpportunityView(trainingOpportunityId));
        toast.success(
          intl.formatMessage({
            defaultMessage: "Training opportunity updated successfully!",
            id: "3YO9gR",
            description:
              "Message displayed to user after training opportunity is updated successfully.",
          }),
        );
      })
      .catch(() => {
        toast.error(
          intl.formatMessage({
            defaultMessage: "Error: updating training opportunity failed",
            id: "WWrQYI",
            description:
              "Message displayed to user after training opportunity fails to get updated.",
          }),
        );
      });
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card className="mb-18">
          <Heading
            level="h2"
            color="secondary"
            icon={IdentificationIcon}
            className="mt-0 mb-9 font-normal xs:justify-start xs:text-left"
          >
            {intl.formatMessage({
              defaultMessage: "Training opportunity information",
              id: "bwoJyk",
              description:
                "Heading for the opportunity form information section",
            })}
          </Heading>
          <TrainingOpportunityForm query={formOptionsQuery} />
          <CardSeparator />
          <div className="flex flex-col items-center gap-6 xs:flex-row">
            <Submit text={intl.formatMessage(formMessages.saveChanges)} />
            <Link
              color="warning"
              mode="inline"
              href={paths.trainingOpportunityView(trainingOpportunityId)}
            >
              {intl.formatMessage(commonMessages.cancel)}
            </Link>
          </div>
        </Card>
      </form>
    </FormProvider>
  );
};

interface RouteParams extends Record<string, string> {
  trainingOpportunityId: Scalars["ID"]["output"];
}

const UpdateTrainingOpportunityPage_Query = graphql(/* GraphQL */ `
  query UpdateTrainingOpportunityPage($id: UUID!) {
    trainingOpportunity(id: $id) {
      title {
        en
        fr
      }
      ...TrainingOpportunityView
    }
    ...TrainingOpportunityFormOptions
  }
`);

const UpdateTrainingOpportunity_Mutation = graphql(/* GraphQL */ `
  mutation updateTrainingOpportunity($input: UpdateTrainingOpportunityInput!) {
    updateTrainingOpportunity(updateTrainingOpportunity: $input) {
      ...TrainingOpportunityView
    }
  }
`);

const UpdateTrainingOpportunityPage = () => {
  const intl = useIntl();
  const routes = useRoutes();
  const { trainingOpportunityId } = useRequiredParams<RouteParams>(
    "trainingOpportunityId",
  );
  const [{ data, fetching, error }] = useQuery({
    query: UpdateTrainingOpportunityPage_Query,
    variables: { id: trainingOpportunityId },
  });
  const [, executeMutation] = useMutation(UpdateTrainingOpportunity_Mutation);
  const handleUpdateTrainingOpportunity = (
    input: UpdateTrainingOpportunityInput,
  ) =>
    executeMutation({
      input,
    }).then((result) => {
      if (result.data?.updateTrainingOpportunity) {
        return result.data.updateTrainingOpportunity;
      }
      return Promise.reject(new Error(result.error?.toString()));
    });

  const trainingOpportunityName = getLocalizedName(
    data?.trainingOpportunity?.title,
    intl,
  );

  const navigationCrumbs = useBreadcrumbs({
    crumbs: [
      {
        label: intl.formatMessage(pageTitles.trainingOpportunities),
        url: routes.trainingOpportunitiesIndex(),
      },
      {
        label: trainingOpportunityName,
        url: routes.trainingOpportunityView(trainingOpportunityId),
      },
      {
        label: intl.formatMessage({
          defaultMessage: "Edit<hidden> training opportunity</hidden>",
          id: "xhdl6Q",
          description:
            "Breadcrumb title for the edit training opportunity page link.",
        }),
        url: routes.trainingOpportunityUpdate(trainingOpportunityId),
      },
    ],
  });

  const pageTitle = intl.formatMessage({
    defaultMessage: "Edit a training opportunity",
    id: "5pf2qR",
    description: "Page title for the training opportunity edit page",
  });

  return (
    <>
      <SEO title={pageTitle} />
      <Hero title={pageTitle} crumbs={navigationCrumbs} overlap centered>
        <Pending fetching={fetching} error={error}>
          {data?.trainingOpportunity ? (
            <UpdateTrainingOpportunityForm
              trainingOpportunityQuery={data.trainingOpportunity}
              handleUpdateTrainingOpportunity={handleUpdateTrainingOpportunity}
              formOptionsQuery={data}
            />
          ) : (
            <NotFound
              headingMessage={intl.formatMessage(commonMessages.notFound)}
            >
              <p>{intl.formatMessage(commonMessages.notFound)}</p>
            </NotFound>
          )}
        </Pending>
      </Hero>
    </>
  );
};

export const Component = () => (
  <RequireAuth roles={[ROLE_NAME.PlatformAdmin]}>
    <UpdateTrainingOpportunityPage />
  </RequireAuth>
);

Component.displayName = "AdminUpdateTrainingOpportunityPage";

export default Component;
