import { useNavigate } from "react-router-dom";
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
  CardBasic,
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
  TrainingEventForm_Fragment,
  convertApiFragmentToFormValues,
  convertFormValuesToUpdateInput,
} from "./apiUtils";
import TrainingEventForm, {
  TrainingEventFormOptions_Fragment,
} from "./components/TrainingOpportunityForm";

interface UpdateTrainingEventFormProps {
  trainingOpportunityQuery: FragmentType<typeof TrainingEventForm_Fragment>;
  handleUpdateTrainingEvent: (
    input: UpdateTrainingOpportunityInput,
  ) => Promise<FragmentType<typeof TrainingEventForm_Fragment>>;
  formOptionsQuery: FragmentType<typeof TrainingEventFormOptions_Fragment>;
}

const UpdateTrainingEventForm = ({
  trainingOpportunityQuery,
  handleUpdateTrainingEvent,
  formOptionsQuery,
}: UpdateTrainingEventFormProps) => {
  const intl = useIntl();
  const navigate = useNavigate();
  const paths = useRoutes();
  const { trainingEventId } = useRequiredParams<RouteParams>("trainingEventId");
  const initialTrainingOpportunity = getFragment(
    TrainingEventForm_Fragment,
    trainingOpportunityQuery,
  );
  const methods = useForm<FormValues>({
    defaultValues: convertApiFragmentToFormValues(initialTrainingOpportunity),
  });
  const { handleSubmit } = methods;

  const onSubmit: SubmitHandler<FormValues> = async (
    formValues: FormValues,
  ) => {
    return handleUpdateTrainingEvent(
      convertFormValuesToUpdateInput(trainingEventId, formValues),
    )
      .then(() => {
        navigate(paths.trainingEventView(trainingEventId));
        toast.success(
          intl.formatMessage({
            defaultMessage: "Training event updated successfully!",
            id: "Yv8V51",
            description:
              "Message displayed to user after training event is updated successfully.",
          }),
        );
      })
      .catch(() => {
        toast.error(
          intl.formatMessage({
            defaultMessage: "Error: updating training event failed",
            id: "OnZE7b",
            description:
              "Message displayed to user after training event fails to get updated.",
          }),
        );
      });
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardBasic>
          <div
            data-h2-display="base(flex)"
            data-h2-justify-content="base(center) p-tablet(flex-start)"
          >
            <Heading
              level="h2"
              color="primary"
              Icon={IdentificationIcon}
              data-h2-margin="base(0, 0, x1.5, 0)"
              data-h2-font-weight="base(400)"
            >
              {intl.formatMessage({
                defaultMessage: "Event information",
                id: "8ZTHFe",
                description: "Heading for the event form information section",
              })}
            </Heading>
          </div>
          <TrainingEventForm query={formOptionsQuery} />
          <CardSeparator />
          <div
            data-h2-display="base(flex)"
            data-h2-flex-direction="base(column) p-tablet(row)"
            data-h2-gap="base(x1)"
            data-h2-align-items="base(center)"
          >
            <Submit text={intl.formatMessage(formMessages.saveChanges)} />
            <Link
              color="warning"
              mode="inline"
              href={paths.trainingEventView(trainingEventId)}
            >
              {intl.formatMessage(commonMessages.cancel)}
            </Link>
          </div>
        </CardBasic>
      </form>
    </FormProvider>
  );
};

interface RouteParams extends Record<string, string> {
  trainingEventId: Scalars["ID"]["output"];
}

const UpdateTrainingEventPage_Query = graphql(/* GraphQL */ `
  query UpdateTrainingEventPage($id: UUID!) {
    trainingOpportunity(id: $id) {
      title {
        en
        fr
      }
      ...TrainingEventView
    }
    ...TrainingEventFormOptions
  }
`);

const UpdateTrainingOpportunity_Mutation = graphql(/* GraphQL */ `
  mutation updateTrainingOpportunity($input: UpdateTrainingOpportunityInput!) {
    updateTrainingOpportunity(updateTrainingOpportunity: $input) {
      ...TrainingEventView
    }
  }
`);

const UpdateTrainingEventPage = () => {
  const intl = useIntl();
  const routes = useRoutes();
  const { trainingEventId } = useRequiredParams<RouteParams>("trainingEventId");
  const [{ data, fetching, error }] = useQuery({
    query: UpdateTrainingEventPage_Query,
    variables: { id: trainingEventId },
  });
  const [, executeMutation] = useMutation(UpdateTrainingOpportunity_Mutation);
  const handleUpdateTrainingEvent = (input: UpdateTrainingOpportunityInput) =>
    executeMutation({
      input,
    }).then((result) => {
      if (result.data?.updateTrainingOpportunity) {
        return result.data.updateTrainingOpportunity;
      }
      return Promise.reject(new Error(result.error?.toString()));
    });

  const trainingEventName = getLocalizedName(
    data?.trainingOpportunity?.title,
    intl,
  );

  const navigationCrumbs = useBreadcrumbs({
    crumbs: [
      {
        label: intl.formatMessage(pageTitles.trainingEvents),
        url: routes.trainingEventsIndex(),
      },
      {
        label: trainingEventName,
        url: routes.trainingEventView(trainingEventId),
      },
      {
        label: intl.formatMessage({
          defaultMessage: "Edit<hidden> event</hidden>",
          id: "NNWkJH",
          description:
            "Breadcrumb title for the edit training event page link.",
        }),
        url: routes.trainingEventUpdate(trainingEventId),
      },
    ],
  });

  const pageTitle = intl.formatMessage({
    defaultMessage: "Edit an event",
    id: "bUat3o",
    description: "Page title for the training event edit page",
  });

  return (
    <>
      <SEO title={pageTitle} />
      <Hero title={pageTitle} crumbs={navigationCrumbs} overlap centered>
        <div data-h2-margin-bottom="base(x3)">
          <Pending fetching={fetching} error={error}>
            {data?.trainingOpportunity ? (
              <UpdateTrainingEventForm
                trainingOpportunityQuery={data.trainingOpportunity}
                handleUpdateTrainingEvent={handleUpdateTrainingEvent}
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
        </div>
      </Hero>
    </>
  );
};

export const Component = () => (
  <RequireAuth roles={[ROLE_NAME.PlatformAdmin]}>
    <UpdateTrainingEventPage />
  </RequireAuth>
);

Component.displayName = "AdminUpdateTrainingEventPage";

export default UpdateTrainingEventPage;
