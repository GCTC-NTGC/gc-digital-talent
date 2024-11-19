import { useIntl } from "react-intl";
import { useNavigate } from "react-router-dom";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import IdentificationIcon from "@heroicons/react/24/outline/IdentificationIcon";

import { ROLE_NAME } from "@gc-digital-talent/auth";
import { CreateDepartmentInput, Scalars } from "@gc-digital-talent/graphql";
import { toast } from "@gc-digital-talent/toast";
import {
  CardBasic,
  CardSectioned,
  CardSeparator,
  Heading,
  Link,
} from "@gc-digital-talent/ui";
import { Input, Submit } from "@gc-digital-talent/forms";
import { errorMessages } from "@gc-digital-talent/i18n";

import Hero from "~/components/Hero";
import RequireAuth from "~/components/RequireAuth/RequireAuth";
import SEO from "~/components/SEO/SEO";
import useRoutes from "~/hooks/useRoutes";
import pageTitles from "~/messages/pageTitles";
import useBreadcrumbs from "~/hooks/useBreadcrumbs";
import adminMessages from "~/messages/adminMessages";

type FormValues = CreateDepartmentInput;

interface CreateTrainingEventFormProps {
  handleTrainingEvent: (data: FormValues) => Promise<Scalars["UUID"]["output"]>;
}

const CreateTrainingEventForm = ({
  handleTrainingEvent,
}: CreateTrainingEventFormProps) => {
  const intl = useIntl();
  const navigate = useNavigate();
  const paths = useRoutes();
  const methods = useForm<FormValues>();
  const { handleSubmit } = methods;

  const onSubmit: SubmitHandler<FormValues> = async (data: FormValues) => {
    return handleTrainingEvent({
      departmentNumber: Number(data.departmentNumber),
      name: data.name,
    })
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
                id: "2rnlFj",
                description: "Heading for the 'create an event' form",
              })}
            </Heading>
          </div>
          <div
            data-h2-display="base(grid)"
            data-h2-grid-template-columns="p-tablet(repeat(2, 1fr))"
            data-h2-gap="base(x1)"
          >
            <Input
              id="name_en"
              name="name.en"
              label={intl.formatMessage(adminMessages.nameEn)}
              type="text"
              rules={{
                required: intl.formatMessage(errorMessages.required),
              }}
            />
            <Input
              id="name_fr"
              name="name.fr"
              label={intl.formatMessage(adminMessages.nameFr)}
              type="text"
              rules={{
                required: intl.formatMessage(errorMessages.required),
              }}
            />
            <div data-h2-grid-column="p-tablet(span 2)">
              <Input
                id="departmentNumber"
                name="departmentNumber"
                label={intl.formatMessage({
                  defaultMessage: "Department number",
                  id: "66kU6k",
                  description: "Label for department number",
                })}
                type="number"
                rules={{
                  required: intl.formatMessage(errorMessages.required),
                }}
                min="0"
              />
            </div>
          </div>
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
                id: "vRmMjQ",
                description: "Button label to create a new event",
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

const CreateTrainingEventPage = () => {
  const intl = useIntl();
  const routes = useRoutes();
  // const [, executeMutation] = useMutation(CreateDepartment_Mutation);
  const handleCreateDepartment = (data: CreateDepartmentInput) =>
    Promise.reject(new Error("TODO"));
  // executeMutation({ department: data }).then((result) => {
  //   if (result.data?.createDepartment?.id) {
  //     return result.data.createDepartment.id;
  //   }
  // return Promise.reject(new Error(result.error?.toString()));
  // });

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
          <CreateTrainingEventForm
            handleCreateDepartment={handleCreateDepartment}
          />
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
