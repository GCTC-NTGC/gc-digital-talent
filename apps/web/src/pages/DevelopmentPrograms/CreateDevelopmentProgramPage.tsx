import { useNavigate } from "react-router";
import type { SubmitHandler } from "react-hook-form";
import { FormProvider, useForm } from "react-hook-form";
import { useIntl } from "react-intl";
import { useMutation } from "urql";
import IdentificationIcon from "@heroicons/react/24/outline/IdentificationIcon";

import { toast } from "@gc-digital-talent/toast";
import { Submit } from "@gc-digital-talent/forms";
import type {
  CreateDevelopmentProgramInput,
  LocalizedStringInput,
} from "@gc-digital-talent/graphql";
import { graphql } from "@gc-digital-talent/graphql";
import { ROLE_NAME } from "@gc-digital-talent/auth";
import { Heading, Link, CardSeparator, Card } from "@gc-digital-talent/ui";

import SEO from "~/components/SEO/SEO";
import useRoutes from "~/hooks/useRoutes";
import useBreadcrumbs from "~/hooks/useBreadcrumbs";
import RequireAuth from "~/components/RequireAuth/RequireAuth";
import pageTitles from "~/messages/pageTitles";
import Hero from "~/components/Hero";

import FormFields from "./FormFields";

interface FormValues {
  name?: LocalizedStringInput;
  descriptionForProfile?: LocalizedStringInput;
  informationUrl?: LocalizedStringInput;
  abbreviation?: LocalizedStringInput;
}

export function formValuesToCreateInput({
  name,
  descriptionForProfile,
  informationUrl,
  abbreviation,
}: FormValues): CreateDevelopmentProgramInput {
  return {
    name,
    descriptionForProfile,
    informationUrl,
    abbreviation,
  };
}

interface CreateDevelopmentProgramProps {
  handleCreateDevelopmentProgram: (
    data: CreateDevelopmentProgramInput,
  ) => Promise<string>;
}

export const CreateDevelopmentProgramForm = ({
  handleCreateDevelopmentProgram,
}: CreateDevelopmentProgramProps) => {
  const intl = useIntl();
  const navigate = useNavigate();
  const paths = useRoutes();
  const methods = useForm<FormValues>();
  const { handleSubmit } = methods;

  const onSubmit: SubmitHandler<FormValues> = async (values: FormValues) => {
    return handleCreateDevelopmentProgram(formValuesToCreateInput(values))
      .then(async (id) => {
        await navigate(paths.developmentProgramView(id));
        toast.success(
          intl.formatMessage({
            defaultMessage: "Development program created successfully.",
            id: "OtZDuZ",
            description:
              "Message displayed to user after development program is created successfully.",
          }),
        );
      })
      .catch(() => {
        toast.error(
          intl.formatMessage({
            defaultMessage: "Error: creating development program failed",
            id: "kX3dVQ",
            description:
              "Message displayed to user after development program fails to get created.",
          }),
        );
      });
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <Heading
            level="h2"
            color="secondary"
            icon={IdentificationIcon}
            center
            className="mt-0 mb-9 font-normal xs:justify-start xs:text-left"
          >
            {intl.formatMessage({
              defaultMessage: "Development program information",
              id: "AxLO/M",
              description:
                "Heading for the 'create a development program' form",
            })}
          </Heading>
          <FormFields />
          <CardSeparator />
          <div className="flex flex-col items-center gap-6 xs:flex-row">
            <Submit
              text={intl.formatMessage({
                defaultMessage: "Create development program",
                id: "bmLEAN",
                description: "Button label to create a development program",
              })}
            />
            <Link
              color="warning"
              mode="inline"
              href={paths.developmentProgramTable()}
            >
              {intl.formatMessage({
                defaultMessage: "Cancel and go back to development programs",
                id: "aaPfXH",
                description:
                  "Button label to return to the development programs table",
              })}
            </Link>
          </div>
        </Card>
      </form>
    </FormProvider>
  );
};

const CreateDevelopmentProgram_Mutation = graphql(/* GraphQL */ `
  mutation CreateDevelopmentProgram(
    $developmentProgram: CreateDevelopmentProgramInput!
  ) {
    createDevelopmentProgram(developmentProgram: $developmentProgram) {
      id
      name {
        en
        fr
      }
      descriptionForProfile {
        en
        fr
      }
      informationUrl {
        en
        fr
      }
      abbreviation {
        en
        fr
      }
    }
  }
`);

const CreateDevelopmentProgramPage = () => {
  const intl = useIntl();
  const routes = useRoutes();
  const [, executeMutation] = useMutation(CreateDevelopmentProgram_Mutation);
  const handleCreateDevelopmentProgram = (
    data: CreateDevelopmentProgramInput,
  ) =>
    executeMutation({ developmentProgram: data }).then((result) => {
      if (result.data?.createDevelopmentProgram?.id) {
        return result.data.createDevelopmentProgram.id;
      }
      return Promise.reject(new Error(result.error?.toString()));
    });

  const navigationCrumbs = useBreadcrumbs({
    crumbs: [
      {
        label: intl.formatMessage(pageTitles.developmentPrograms),
        url: routes.developmentProgramTable(),
      },
      {
        label: intl.formatMessage({
          defaultMessage: "Create<hidden> development program</hidden>",
          id: "HVrV+A",
          description:
            "Breadcrumb title for the create development program page link.",
        }),
        url: routes.developmentProgramCreate(),
      },
    ],
  });

  const pageTitle = intl.formatMessage({
    defaultMessage: "Create a development program",
    id: "T3qkMJ",
    description: "Page title for the development program creation page",
  });

  return (
    <>
      <SEO title={pageTitle} />
      <Hero title={pageTitle} crumbs={navigationCrumbs} overlap centered>
        <div className="mb-18">
          <CreateDevelopmentProgramForm
            handleCreateDevelopmentProgram={handleCreateDevelopmentProgram}
          />
        </div>
      </Hero>
    </>
  );
};

export const Component = () => (
  <RequireAuth roles={[ROLE_NAME.PlatformAdmin]}>
    <CreateDevelopmentProgramPage />
  </RequireAuth>
);

Component.displayName = "AdminCreateDevelopmentProgramPage";

export default Component;
