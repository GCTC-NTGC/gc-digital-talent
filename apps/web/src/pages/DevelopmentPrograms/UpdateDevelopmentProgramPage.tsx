import { useNavigate } from "react-router";
import type { SubmitHandler } from "react-hook-form";
import { FormProvider, useForm } from "react-hook-form";
import { useIntl } from "react-intl";
import { useMutation, useQuery } from "urql";
import IdentificationIcon from "@heroicons/react/24/outline/IdentificationIcon";

import { toast } from "@gc-digital-talent/toast";
import { Submit } from "@gc-digital-talent/forms";
import { commonMessages, formMessages } from "@gc-digital-talent/i18n";
import {
  Pending,
  NotFound,
  Heading,
  Link,
  CardSeparator,
  Card,
} from "@gc-digital-talent/ui";
import type {
  FragmentType,
  LocalizedStringInput,
  UpdateDevelopmentProgramInput,
} from "@gc-digital-talent/graphql";
import { getFragment, graphql } from "@gc-digital-talent/graphql";
import { ROLE_NAME } from "@gc-digital-talent/auth";

import useRoutes from "~/hooks/useRoutes";
import useRequiredParams from "~/hooks/useRequiredParams";
import RequireAuth from "~/components/RequireAuth/RequireAuth";

import FormFields from "./FormFields";

interface FormValues {
  name: LocalizedStringInput;
  descriptionForProfile: LocalizedStringInput;
  informationUrl?: LocalizedStringInput | null;
  abbreviation?: LocalizedStringInput | null;
}

export function formValuesToUpdateInput({
  name,
  descriptionForProfile,
  informationUrl,
  abbreviation,
}: FormValues): UpdateDevelopmentProgramInput {
  return {
    name: {
      en: name?.en,
      fr: name?.fr,
    },
    descriptionForProfile: {
      en: descriptionForProfile?.en,
      fr: descriptionForProfile?.fr,
    },
    informationUrl: {
      en: informationUrl?.en,
      fr: informationUrl?.fr,
    },
    abbreviation: {
      en: abbreviation?.en,
      fr: abbreviation?.fr,
    },
  };
}

export const DevelopmentProgramForm_Fragment = graphql(/* GraphQL */ `
  fragment DevelopmentProgramForm on DevelopmentProgram {
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
`);

interface UpdateDevelopmentProgramProps {
  query: FragmentType<typeof DevelopmentProgramForm_Fragment>;
  handleUpdateDevelopmentProgram: (
    id: string,
    data: UpdateDevelopmentProgramInput,
  ) => Promise<FragmentType<typeof DevelopmentProgramForm_Fragment>>;
}

export const UpdateDevelopmentProgramForm = ({
  query,
  handleUpdateDevelopmentProgram,
}: UpdateDevelopmentProgramProps) => {
  const intl = useIntl();
  const navigate = useNavigate();
  const paths = useRoutes();
  const developmentProgram = getFragment(
    DevelopmentProgramForm_Fragment,
    query,
  );
  const methods = useForm<FormValues>({
    defaultValues: {
      name: developmentProgram.name,
      descriptionForProfile: developmentProgram.descriptionForProfile,
      informationUrl: developmentProgram.informationUrl,
      abbreviation: developmentProgram.abbreviation,
    },
  });
  const { handleSubmit } = methods;

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    return handleUpdateDevelopmentProgram(
      developmentProgram.id,
      formValuesToUpdateInput(data),
    )
      .then(async () => {
        await navigate(paths.developmentProgramView(developmentProgram.id));
        toast.success(
          intl.formatMessage({
            defaultMessage: "Development program updated successfully.",
            id: "PfsAGV",
            description:
              "Message displayed to user after development program is updated successfully.",
          }),
        );
      })
      .catch(() => {
        toast.error(
          intl.formatMessage({
            defaultMessage: "Error: updating development program failed",
            id: "gsscSp",
            description:
              "Message displayed to user after development program fails to get updated.",
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
              id: "vAkaZH",
              description: "Heading for the 'create a developmentProgram' form",
            })}
          </Heading>
          <FormFields />
          <CardSeparator />
          <div className="flex flex-col items-center gap-6 xs:flex-row">
            <Submit text={intl.formatMessage(formMessages.saveChanges)} />
            <Link
              color="warning"
              mode="inline"
              href={paths.developmentProgramView(developmentProgram.id)}
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
  developmentProgramId: string;
}

const DevelopmentProgramQuery = graphql(/* GraphQL */ `
  query DevelopmentProgram($id: UUID!) {
    developmentProgram(id: $id) {
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
      ...DevelopmentProgramForm
    }
  }
`);

const UpdateDevelopmentProgramMutation = graphql(/* GraphQL */ `
  mutation UpdateDevelopmentProgram(
    $id: ID!
    $developmentProgram: UpdateDevelopmentProgramInput!
  ) {
    updateDevelopmentProgram(id: $id, developmentProgram: $developmentProgram) {
      ...DevelopmentProgramForm
    }
  }
`);

const UpdateDevelopmentProgramPage = () => {
  const intl = useIntl();
  const { developmentProgramId } = useRequiredParams<RouteParams>(
    "developmentProgramId",
  );
  const [{ data, fetching, error }] = useQuery({
    query: DevelopmentProgramQuery,
    variables: { id: developmentProgramId },
  });
  const [, executeMutation] = useMutation(UpdateDevelopmentProgramMutation);
  const handleUpdateDevelopmentProgram = (
    id: string,
    developmentProgram: UpdateDevelopmentProgramInput,
  ) =>
    executeMutation({
      id,
      developmentProgram,
    }).then((result) => {
      if (result.data?.updateDevelopmentProgram) {
        return result.data?.updateDevelopmentProgram;
      }
      return Promise.reject(new Error(result.error?.toString()));
    });

  return (
    <>
      <Pending fetching={fetching} error={error}>
        {data?.developmentProgram ? (
          <UpdateDevelopmentProgramForm
            query={data.developmentProgram}
            handleUpdateDevelopmentProgram={handleUpdateDevelopmentProgram}
          />
        ) : (
          <NotFound
            headingMessage={intl.formatMessage(commonMessages.notFound)}
          >
            <p>
              {intl.formatMessage(
                {
                  defaultMessage:
                    "Development program {developmentProgramId} not found.",
                  id: "gmymLN",
                  description:
                    "Message displayed for development program not found.",
                },
                { developmentProgramId },
              )}
            </p>
          </NotFound>
        )}
      </Pending>
    </>
  );
};

export const Component = () => (
  <RequireAuth roles={[ROLE_NAME.PlatformAdmin]}>
    <UpdateDevelopmentProgramPage />
  </RequireAuth>
);

Component.displayName = "AdminUpdateDevelopmentProgramPage";

export default Component;
