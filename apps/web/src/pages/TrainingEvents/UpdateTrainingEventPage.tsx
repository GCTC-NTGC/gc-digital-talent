import { useNavigate } from "react-router-dom";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useIntl } from "react-intl";
import IdentificationIcon from "@heroicons/react/24/outline/IdentificationIcon";
import { useMutation, useQuery } from "urql";

import { toast } from "@gc-digital-talent/toast";
import {
  DATE_SEGMENT,
  DateInput,
  Input,
  localizedEnumToOptions,
  RichTextInput,
  Select,
  Submit,
} from "@gc-digital-talent/forms";
import {
  errorMessages,
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
  CourseFormat,
  CourseLanguage,
  FragmentType,
  LocalizedEnumString,
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

import formLabels from "./formLabels";
import {
  FormValues,
  TrainingEventForm_Fragment,
  convertApiFragmentToFormValues,
} from "./apiUtils";

function convertFormValuesToApiInput(
  id: string,
  formValues: FormValues,
): UpdateTrainingOpportunityInput {
  return {
    id: id,
    title: {
      en: formValues.titleEn,
      fr: formValues.titleFr,
    },
    courseLanguage: formValues.courseLanguage as CourseLanguage,
    courseFormat: formValues.courseFormat as CourseFormat,
    registrationDeadline: formValues.registrationDeadline,
    trainingStart: formValues.trainingStart,
    trainingEnd: formValues.trainingEnd,
    description: {
      en: formValues.descriptionEn,
      fr: formValues.descriptionFr,
    },
    applicationUrl: {
      en: formValues.applicationUrlEn,
      fr: formValues.applicationUrlFr,
    },
  };
}

interface UpdateTrainingEventFormProps {
  query: FragmentType<typeof TrainingEventForm_Fragment>;
  handleUpdateTrainingEvent: (
    input: UpdateTrainingOpportunityInput,
  ) => Promise<FragmentType<typeof TrainingEventForm_Fragment>>;
  courseLanguages: LocalizedEnumString[];
  courseFormats: LocalizedEnumString[];
}

export const UpdateTrainingEventForm = ({
  query,
  handleUpdateTrainingEvent,
  courseLanguages,
  courseFormats,
}: UpdateTrainingEventFormProps) => {
  const intl = useIntl();
  const navigate = useNavigate();
  const paths = useRoutes();
  const { trainingEventId } = useRequiredParams<RouteParams>("trainingEventId");
  const initialTrainingOpportunity = getFragment(
    TrainingEventForm_Fragment,
    query,
  );
  const methods = useForm<FormValues>({
    defaultValues: convertApiFragmentToFormValues(initialTrainingOpportunity),
  });
  const { handleSubmit } = methods;

  const onSubmit: SubmitHandler<FormValues> = async (
    formValues: FormValues,
  ) => {
    return handleUpdateTrainingEvent(
      convertFormValuesToApiInput(trainingEventId, formValues),
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
          <div
            data-h2-display="base(grid)"
            data-h2-grid-template-columns="p-tablet(repeat(2, 1fr))"
            data-h2-gap="base(x1)"
          >
            <Input
              id="titleEn"
              name="titleEn"
              label={intl.formatMessage(formLabels.titleEn)}
              type="text"
              rules={{
                required: intl.formatMessage(errorMessages.required),
              }}
            />
            <Input
              id="titleFr"
              name="titleFr"
              label={intl.formatMessage(formLabels.titleFr)}
              type="text"
              rules={{
                required: intl.formatMessage(errorMessages.required),
              }}
            />
            <Select
              id="courseLanguage"
              name="courseLanguage"
              label={intl.formatMessage(formLabels.courseLanguage)}
              nullSelection={intl.formatMessage({
                defaultMessage: "Select a language",
                id: "uup5F2",
                description:
                  "Placeholder displayed on the user form preferred communication language field.",
              })}
              rules={{
                required: intl.formatMessage(errorMessages.required),
              }}
              options={localizedEnumToOptions(courseLanguages, intl)}
            />
            <Select
              id="courseFormat"
              name="courseFormat"
              label={intl.formatMessage(formLabels.format)}
              nullSelection={intl.formatMessage({
                defaultMessage: "Select a format",
                id: "m3c4o8",
                description:
                  "Placeholder displayed on the select input for a format",
              })}
              rules={{
                required: intl.formatMessage(errorMessages.required),
              }}
              options={localizedEnumToOptions(courseFormats, intl)}
            />
            <DateInput
              id="registrationDeadline"
              legend={intl.formatMessage(formLabels.registrationDeadline)}
              name="registrationDeadline"
              show={[DATE_SEGMENT.Day, DATE_SEGMENT.Month, DATE_SEGMENT.Year]}
              rules={{
                required: intl.formatMessage(errorMessages.required),
              }}
            />
            <div data-h2-display="base(none) p-tablet(inherit)">
              {/* intentionally left blank */}
            </div>
            <DateInput
              id="trainingStart"
              legend={intl.formatMessage(formLabels.trainingStartDate)}
              name="trainingStart"
              show={[DATE_SEGMENT.Day, DATE_SEGMENT.Month, DATE_SEGMENT.Year]}
              rules={{
                required: intl.formatMessage(errorMessages.required),
              }}
            />
            <DateInput
              id="trainingEnd"
              legend={intl.formatMessage(formLabels.trainingEndDate)}
              name="trainingEnd"
              show={[DATE_SEGMENT.Day, DATE_SEGMENT.Month, DATE_SEGMENT.Year]}
            />
            <RichTextInput
              id="descriptionEn"
              label={intl.formatMessage(formLabels.descriptionEn)}
              name="descriptionEn"
              rules={{
                required: intl.formatMessage(errorMessages.required),
              }}
            />
            <RichTextInput
              id="descriptionFr"
              label={intl.formatMessage(formLabels.descriptionFr)}
              name="descriptionFr"
              rules={{
                required: intl.formatMessage(errorMessages.required),
              }}
            />
            <Input
              id="applicationUrlEn"
              name="applicationUrlEn"
              label={intl.formatMessage(formLabels.applicationUrlEn)}
              type="text"
              rules={{
                required: intl.formatMessage(errorMessages.required),
              }}
            />
            <Input
              id="applicationUrlFr"
              name="applicationUrlFr"
              label={intl.formatMessage(formLabels.applicationUrlFr)}
              type="text"
              rules={{
                required: intl.formatMessage(errorMessages.required),
              }}
            />
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
    courseLanguages: localizedEnumStrings(enumName: "CourseLanguage") {
      value
      label {
        en
        fr
      }
    }
    courseFormats: localizedEnumStrings(enumName: "CourseFormat") {
      value
      label {
        en
        fr
      }
    }
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
            {data?.trainingOpportunity &&
            data?.courseLanguages &&
            data?.courseFormats ? (
              <UpdateTrainingEventForm
                query={data.trainingOpportunity}
                handleUpdateTrainingEvent={handleUpdateTrainingEvent}
                courseLanguages={data.courseLanguages}
                courseFormats={data.courseFormats}
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
