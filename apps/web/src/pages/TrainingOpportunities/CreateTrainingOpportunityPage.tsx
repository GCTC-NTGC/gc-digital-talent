import { useIntl } from "react-intl";
import { useNavigate } from "react-router-dom";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import IdentificationIcon from "@heroicons/react/24/outline/IdentificationIcon";
import { useMutation, useQuery } from "urql";

import { ROLE_NAME } from "@gc-digital-talent/auth";
import {
  CreateTrainingOpportunityInput,
  FragmentType,
  graphql,
  Scalars,
} from "@gc-digital-talent/graphql";
import { toast } from "@gc-digital-talent/toast";
import {
  CardBasic,
  CardSeparator,
  Heading,
  Link,
  NotFound,
  Pending,
} from "@gc-digital-talent/ui";
import { Submit } from "@gc-digital-talent/forms";
import { commonMessages } from "@gc-digital-talent/i18n";

import Hero from "~/components/Hero";
import RequireAuth from "~/components/RequireAuth/RequireAuth";
import SEO from "~/components/SEO/SEO";
import useRoutes from "~/hooks/useRoutes";
import pageTitles from "~/messages/pageTitles";
import useBreadcrumbs from "~/hooks/useBreadcrumbs";

import { convertFormValuesToCreateInput, FormValues } from "./apiUtils";
import TrainingEventForm, {
  TrainingEventFormOptions_Fragment,
} from "./components/TrainingOpportunityForm";

interface CreateTrainingEventFormProps {
  handleCreateTrainingEvent: (
    input: CreateTrainingOpportunityInput,
  ) => Promise<Scalars["UUID"]["output"]>;
  formOptionsQuery: FragmentType<typeof TrainingEventFormOptions_Fragment>;
}

const CreateTrainingEventForm = ({
  handleCreateTrainingEvent,
  formOptionsQuery,
}: CreateTrainingEventFormProps) => {
  const intl = useIntl();
  const navigate = useNavigate();
  const paths = useRoutes();
  const methods = useForm<FormValues>();
  const { handleSubmit } = methods;

  const onSubmit: SubmitHandler<FormValues> = async (
    formValues: FormValues,
  ) => {
    return handleCreateTrainingEvent(convertFormValuesToCreateInput(formValues))
      .then((id) => {
        navigate(paths.trainingEventView(id));
        toast.success(
          intl.formatMessage({
            defaultMessage: "Training event created successfully!",
            id: "g2DtHI",
            description:
              "Message displayed to user after a training event is created successfully.",
          }),
        );
      })
      .catch(() => {
        toast.error(
          intl.formatMessage({
            defaultMessage: "Error: creating training event failed",
            id: "K2cRGq",
            description:
              "Message displayed to user after a training event fails to get created.",
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
            <Submit
              text={intl.formatMessage({
                defaultMessage: "Create event",
                id: "+21CEK",
                description:
                  "Button label to submit the create a new event form",
              })}
            />
            <Link
              color="warning"
              mode="inline"
              href={paths.trainingEventsIndex()}
            >
              {intl.formatMessage({
                defaultMessage: "Cancel and go back to events",
                id: "qTJFY0",
                description: "Button label to return to the events table",
              })}
            </Link>
          </div>
        </CardBasic>
      </form>
    </FormProvider>
  );
};

const CreateTrainingEventPage_Query = graphql(/* GraphQL */ `
  query CreateTrainingEventPage {
    ...TrainingEventFormOptions
  }
`);

const CreateTrainingOpportunity_Mutation = graphql(/* GraphQL */ `
  mutation createTrainingOpportunity($input: CreateTrainingOpportunityInput!) {
    createTrainingOpportunity(createTrainingOpportunity: $input) {
      id
    }
  }
`);

const CreateTrainingEventPage = () => {
  const intl = useIntl();
  const routes = useRoutes();
  const [{ data, fetching, error }] = useQuery({
    query: CreateTrainingEventPage_Query,
  });
  const [, executeMutation] = useMutation(CreateTrainingOpportunity_Mutation);
  const handleCreateTrainingEvent = (input: CreateTrainingOpportunityInput) =>
    executeMutation({ input }).then((result) => {
      if (result.data?.createTrainingOpportunity?.id) {
        return result.data.createTrainingOpportunity.id;
      }
      return Promise.reject(new Error(result.error?.toString()));
    });

  const navigationCrumbs = useBreadcrumbs({
    crumbs: [
      {
        label: intl.formatMessage(pageTitles.trainingEvents),
        url: routes.departmentTable(),
      },
      {
        label: intl.formatMessage({
          defaultMessage: "Create<hidden> an event</hidden>",
          id: "R6j8QR",
          description:
            "Breadcrumb title for the create training event page link.",
        }),
        url: routes.trainingEventCreate(),
      },
    ],
  });

  const pageTitle = intl.formatMessage({
    defaultMessage: "Create an event",
    id: "y6UFyA",
    description: "Page title for the training event creation page",
  });

  return (
    <>
      <SEO title={pageTitle} />
      <Hero title={pageTitle} crumbs={navigationCrumbs} overlap centered>
        <div data-h2-margin-bottom="base(x3)">
          <Pending fetching={fetching} error={error}>
            {data ? (
              <CreateTrainingEventForm
                formOptionsQuery={data}
                handleCreateTrainingEvent={handleCreateTrainingEvent}
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
    <CreateTrainingEventPage />
  </RequireAuth>
);

Component.displayName = "AdminCreateTrainingEventPage";

export default CreateTrainingEventPage;
