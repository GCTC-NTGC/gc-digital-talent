import { useNavigate } from "react-router-dom";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useIntl } from "react-intl";
import pick from "lodash/pick";
import { useMutation, useQuery } from "urql";
import IdentificationIcon from "@heroicons/react/24/outline/IdentificationIcon";

import { toast } from "@gc-digital-talent/toast";
import { Input, Submit } from "@gc-digital-talent/forms";
import {
  errorMessages,
  commonMessages,
  formMessages,
} from "@gc-digital-talent/i18n";
import {
  NotFound,
  Heading,
  Link,
  CardSeparator,
  CardBasic,
} from "@gc-digital-talent/ui";
import {
  FragmentType,
  Scalars,
  UpdateDepartmentInput,
  graphql,
} from "@gc-digital-talent/graphql";
import { ROLE_NAME } from "@gc-digital-talent/auth";

import SEO from "~/components/SEO/SEO";
import useRoutes from "~/hooks/useRoutes";
import useRequiredParams from "~/hooks/useRequiredParams";
import adminMessages from "~/messages/adminMessages";
import useBreadcrumbs from "~/hooks/useBreadcrumbs";
import RequireAuth from "~/components/RequireAuth/RequireAuth";
import pageTitles from "~/messages/pageTitles";
import Hero from "~/components/Hero";

export const DepartmentForm_Fragment = graphql(/* GraphQL */ `
  fragment DepartmentForm on Department {
    id
    departmentNumber
    name {
      en
      fr
    }
  }
`);

type FormValues = UpdateDepartmentInput;

interface UpdateTrainingEventFormProps {
  // query: FragmentType<typeof DepartmentForm_Fragment>;
  handleUpdateTrainingEvent: (
    id: string,
    data: FormValues,
  ) => Promise<FragmentType<typeof DepartmentForm_Fragment>>;
}

export const UpdateTrainingEventForm = ({
  // query,
  handleUpdateTrainingEvent,
}: UpdateTrainingEventFormProps) => {
  const intl = useIntl();
  const navigate = useNavigate();
  const paths = useRoutes();
  const { trainingEventId } = useRequiredParams<RouteParams>("trainingEventId");
  // const initialDepartment = getFragment(DepartmentForm_Fragment, query);
  const methods = useForm<FormValues>({
    // defaultValues: {
    //   departmentNumber: initialDepartment.departmentNumber,
    //   name: initialDepartment.name,
    // },
  });
  const { handleSubmit } = methods;

  const onSubmit: SubmitHandler<FormValues> = async (data: FormValues) => {
    return handleUpdateTrainingEvent(trainingEventId, {
      departmentNumber: Number(data.departmentNumber),
      name: data.name,
    })
      .then(() => {
        navigate(paths.departmentView(trainingEventId));
        toast.success(
          intl.formatMessage({
            defaultMessage: "Department updated successfully!",
            id: "GTR9Pt",
            description:
              "Message displayed to user after department is updated successfully.",
          }),
        );
      })
      .catch(() => {
        toast.error(
          intl.formatMessage({
            defaultMessage: "Error: updating department failed",
            id: "nXRLAX",
            description:
              "Message displayed to user after department fails to get updated.",
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
            <Submit text={intl.formatMessage(formMessages.saveChanges)} />
            <Link
              color="warning"
              mode="inline"
              href={paths.departmentView(trainingEventId)}
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

// const Department_Query = graphql(/* GraphQL */ `
//   query Department($id: UUID!) {
//     department(id: $id) {
//       name {
//         en
//         fr
//       }
//       ...DepartmentForm
//     }
//   }
// `);

// const UpdateDepartment_Mutation = graphql(/* GraphQL */ `
//   mutation UpdateDepartment($id: ID!, $department: UpdateDepartmentInput!) {
//     updateDepartment(id: $id, department: $department) {
//       ...DepartmentForm
//     }
//   }
// `);

const UpdateTrainingEventPage = () => {
  const intl = useIntl();
  const routes = useRoutes();
  const { trainingEventId } = useRequiredParams<RouteParams>("trainingEventId");
  // const [{ data: departmentData, fetching, error }] = useQuery({
  //   query: Department_Query,
  //   variables: { id: trainingEventId },
  // });
  // const [, executeMutation] = useMutation(UpdateDepartment_Mutation);
  const handleUpdateTrainingEvent = (id: string, data: UpdateDepartmentInput) =>
    Promise.reject(new Error("TODO"));
  // executeMutation({
  //   id,
  //   department: pick(data, [
  //     "departmentName",
  //     "name.en",
  //     "name.fr",
  //     "departmentNumber",
  //   ]),
  // }).then((result) => {
  //   if (result.data?.updateDepartment) {
  //     return result.data?.updateDepartment;
  //   }
  //   return Promise.reject(new Error(result.error?.toString()));
  // });

  const trainingEventName = "TODO";
  // const trainingEventName = getLocalizedName(
  //   departmentData?.department?.name,
  //   intl,
  // );

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
          {/* <Pending fetching={fetching} error={error}> */}
          {/* {departmentData?.department ? ( */}
          <UpdateTrainingEventForm
            // query={departmentData.department}
            handleUpdateTrainingEvent={handleUpdateTrainingEvent}
          />
          {/* ) : (
            <NotFound
              headingMessage={intl.formatMessage(commonMessages.notFound)}
            >
              <p>
                {intl.formatMessage(
                  {
                    defaultMessage: "Department {departmentId} not found.",
                    id: "8Otaw9",
                    description: "Message displayed for department not found.",
                  },
                  { departmentId: trainingEventId },
                )}
              </p>
            </NotFound>
          )} */}
          {/* </Pending> */}
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
