import { useIntl } from "react-intl";
import { useNavigate } from "react-router";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import IdentificationIcon from "@heroicons/react/24/outline/IdentificationIcon";
import { useMutation, useQuery } from "urql";

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
import permissionConstants from "~/constants/permissionConstants";

import { convertFormValuesToCreateInput, FormValues } from "./apiUtils";
import TrainingOpportunityForm, {
  TrainingOpportunityFormOptions_Fragment,
} from "./components/TrainingOpportunityForm";

interface CreateTrainingOpportunityFormProps {
  handleCreateTrainingOpportunity: (
    input: CreateTrainingOpportunityInput,
  ) => Promise<Scalars["UUID"]["output"]>;
  formOptionsQuery: FragmentType<
    typeof TrainingOpportunityFormOptions_Fragment
  >;
}

const CreateTrainingOpportunityForm = ({
  handleCreateTrainingOpportunity,
  formOptionsQuery,
}: CreateTrainingOpportunityFormProps) => {
  const intl = useIntl();
  const navigate = useNavigate();
  const paths = useRoutes();
  const methods = useForm<FormValues>();
  const { handleSubmit } = methods;

  const onSubmit: SubmitHandler<FormValues> = async (
    formValues: FormValues,
  ) => {
    return handleCreateTrainingOpportunity(
      convertFormValuesToCreateInput(formValues),
    )
      .then(async (id) => {
        await navigate(paths.trainingOpportunityView(id));
        toast.success(
          intl.formatMessage({
            defaultMessage: "Training opportunity created successfully!",
            id: "XKpHTN",
            description:
              "Message displayed to user after a training opportunity is created successfully.",
          }),
        );
      })
      .catch(() => {
        toast.error(
          intl.formatMessage({
            defaultMessage: "Error: creating training opportunity failed",
            id: "Hc3RTQ",
            description:
              "Message displayed to user after a training opportunity fails to get created.",
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
                defaultMessage: "Training opportunity information",
                id: "bwoJyk",
                description:
                  "Heading for the opportunity form information section",
              })}
            </Heading>
          </div>
          <TrainingOpportunityForm query={formOptionsQuery} />
          <CardSeparator />
          <div
            data-h2-display="base(flex)"
            data-h2-flex-direction="base(column) p-tablet(row)"
            data-h2-gap="base(x1)"
            data-h2-align-items="base(center)"
          >
            <Submit
              text={intl.formatMessage({
                defaultMessage: "Create training opportunity",
                id: "TFAsYS",
                description:
                  "Button label to submit the create an opportunity form",
              })}
            />
            <Link
              color="warning"
              mode="inline"
              href={paths.trainingOpportunitiesIndex()}
            >
              {intl.formatMessage({
                defaultMessage: "Cancel and go back to training opportunities",
                id: "OU/MkT",
                description:
                  "Button label to return to the opportunities table",
              })}
            </Link>
          </div>
        </CardBasic>
      </form>
    </FormProvider>
  );
};

const CreateTrainingOpportunityPage_Query = graphql(/* GraphQL */ `
  query CreateTrainingOpportunityPage {
    ...TrainingOpportunityFormOptions
  }
`);

const CreateTrainingOpportunity_Mutation = graphql(/* GraphQL */ `
  mutation createTrainingOpportunity($input: CreateTrainingOpportunityInput!) {
    createTrainingOpportunity(createTrainingOpportunity: $input) {
      id
    }
  }
`);

const CreateTrainingOpportunityPage = () => {
  const intl = useIntl();
  const routes = useRoutes();
  const [{ data, fetching, error }] = useQuery({
    query: CreateTrainingOpportunityPage_Query,
  });
  const [, executeMutation] = useMutation(CreateTrainingOpportunity_Mutation);
  const handleCreateTrainingOpportunity = (
    input: CreateTrainingOpportunityInput,
  ) =>
    executeMutation({ input }).then((result) => {
      if (result.data?.createTrainingOpportunity?.id) {
        return result.data.createTrainingOpportunity.id;
      }
      return Promise.reject(new Error(result.error?.toString()));
    });

  const navigationCrumbs = useBreadcrumbs({
    crumbs: [
      {
        label: intl.formatMessage(pageTitles.trainingOpportunities),
        url: routes.departmentTable(),
      },
      {
        label: intl.formatMessage({
          defaultMessage: "Create<hidden> a training opportunity</hidden>",
          id: "YEYD5j",
          description:
            "Breadcrumb title for the create training opportunity page link.",
        }),
        url: routes.trainingOpportunityCreate(),
      },
    ],
  });

  const pageTitle = intl.formatMessage({
    defaultMessage: "Create a training opportunity",
    id: "rTBi+P",
    description:
      "Page title for the training opportunity creation page (infinitive in French)",
  });

  return (
    <>
      <SEO title={pageTitle} />
      <Hero title={pageTitle} crumbs={navigationCrumbs} overlap centered>
        <div data-h2-margin-bottom="base(x3)">
          <Pending fetching={fetching} error={error}>
            {data ? (
              <CreateTrainingOpportunityForm
                formOptionsQuery={data}
                handleCreateTrainingOpportunity={
                  handleCreateTrainingOpportunity
                }
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
  <RequireAuth roles={permissionConstants.managePlatformData}>
    <CreateTrainingOpportunityPage />
  </RequireAuth>
);

Component.displayName = "AdminCreateTrainingOpportunityPage";

export default CreateTrainingOpportunityPage;
