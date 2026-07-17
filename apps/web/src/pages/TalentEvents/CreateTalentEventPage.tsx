import { useIntl } from "react-intl";
import { FormProvider, useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import { useMutation, useQuery } from "urql";
import { useNavigate } from "react-router";
import QueueListIcon from "@heroicons/react/24/outline/QueueListIcon";

import {
  Card,
  CardSeparator,
  Heading,
  Link,
  NotFound,
  Pending,
} from "@gc-digital-talent/ui";
import { graphql } from "@gc-digital-talent/graphql";
import { toast } from "@gc-digital-talent/toast";
import { commonMessages, navigationMessages } from "@gc-digital-talent/i18n";
import { Submit } from "@gc-digital-talent/forms";
import {
  convertDateTimeZone,
  currentDate,
  nowUTCDateTime,
} from "@gc-digital-talent/date-helpers";
import { ROLE_NAME } from "@gc-digital-talent/auth";

import Hero from "~/components/Hero";
import SEO from "~/components/SEO/SEO";
import useBreadcrumbs from "~/hooks/useBreadcrumbs";
import useRoutes from "~/hooks/useRoutes";
import RequireAuth from "~/components/RequireAuth/RequireAuth";
import profileMessages from "~/messages/profileMessages";
import adminMessages from "~/messages/adminMessages";

import UpcomingTalentEventForm from "./components/UpcomingTalentEventForm";
import type { FormValues } from "./components/formValues";

const CreateTalentNominationEvent_Query = graphql(/* GraphQL */ `
  query CreateTalentNominationEventQuery {
    me {
      ...TalentNominationEvent_Fragment
    }
  }
`);

const CreateTalentNominationEvent_Mutation = graphql(/* GraphQL */ `
  mutation CreateTalentNominationEventMutation(
    $talentNominationEvent: CreateTalentNominationEventInput!
  ) {
    createTalentNominationEvent(talentNominationEvent: $talentNominationEvent) {
      id
    }
  }
`);

const CreateTalentEventPage = () => {
  const intl = useIntl();
  const paths = useRoutes();
  const navigate = useNavigate();
  const methods = useForm<FormValues>({ defaultValues: {} });
  const { handleSubmit } = methods;

  const [{ data, fetching, error }] = useQuery({
    query: CreateTalentNominationEvent_Query,
  });
  const [, executeMutation] = useMutation(CreateTalentNominationEvent_Mutation);

  const handleError = () => {
    toast.error(
      intl.formatMessage({
        defaultMessage: "Error: creating talent management event failed",
        id: "iHkByN",
        description:
          "Message displayed to user after talent nomination event fails to get created",
      }),
    );
  };

  const onSubmit: SubmitHandler<FormValues> = async (
    formValues: FormValues,
  ) => {
    const inputOpenDate = formValues.openDate;
    const nowDate = currentDate();

    let overrideOpenDate = "";

    // if to open today go with the immediate datetime, otherwise opens just after midnight Pacific day of
    if (inputOpenDate === nowDate) {
      overrideOpenDate = nowUTCDateTime();
    } else {
      overrideOpenDate = convertDateTimeZone(
        `${formValues.openDate} 00:00:01`,
        "Canada/Pacific",
        "UTC",
      );
    }

    if (!formValues.contactEmail) {
      throw new Error("contact email is mandatory"); // form enforces this - just to make TS happy
    }

    return executeMutation({
      talentNominationEvent: {
        ...formValues,
        openDate: overrideOpenDate,
        closeDate: convertDateTimeZone(
          `${formValues.closeDate} 23:59:59`,
          "Canada/Pacific",
          "UTC",
        ),
        community: { connect: formValues.community },
        communityDevelopmentPrograms: {
          sync: [
            ...formValues.communityDevelopmentPrograms.map((d) => ({
              id: d.value,
              descriptionForNominations: d.description,
            })),
          ],
        },
        contactEmail: formValues.contactEmail,
      },
    })
      .then(async (result) => {
        if (result.data?.createTalentNominationEvent) {
          await navigate(
            paths.adminTalentManagementEvent(
              result.data.createTalentNominationEvent.id,
            ),
          );
          toast.success(
            intl.formatMessage({
              defaultMessage: "Talent management event created successfully!",
              id: "JUjH/B",
              description:
                "Message displayed to user after talent management event is created",
            }),
          );
        } else {
          handleError();
        }
      })
      .catch(handleError);
  };

  const pageTitle = intl.formatMessage({
    defaultMessage: "Create a talent management event",
    id: "BrtEPe",
    description: "Page title for the talent nomination event create page",
  });

  const crumbs = useBreadcrumbs({
    crumbs: [
      {
        label: intl.formatMessage(navigationMessages.talentManagementEvents),
        url: paths.adminTalentManagementEvents(),
      },
      {
        label: intl.formatMessage({
          defaultMessage: "Create<hidden> talent management event</hidden>",
          id: "h14qwQ",
          description:
            "Breadcrumb title for the create talent management event page link.",
        }),
        url: paths.createTalentManagementEvent(),
      },
    ],
  });

  return (
    <>
      <SEO title={pageTitle} />
      <Hero
        title={pageTitle}
        subtitle={intl.formatMessage({
          defaultMessage:
            "Create and publish a talent management event to collect nominations for advancement, lateral movement or development opportunities",
          id: "3ZPZqo",
          description: "Subtitle for create talent management event page",
        })}
        crumbs={crumbs}
        centered
        overlap
      >
        <div className="mb-18">
          <Pending fetching={fetching} error={error}>
            <Card>
              <Heading
                level="h2"
                color="primary"
                icon={QueueListIcon}
                center
                className="mt-0 mb-6 font-normal xs:justify-start xs:text-left"
              >
                {intl.formatMessage(adminMessages.eventDetails)}
              </Heading>
              <p className="mb-6">
                {intl.formatMessage({
                  defaultMessage:
                    "Talent management events allow the community to open a nomination period where employees can be nominated for advancement, lateral movement or development opportunities. This form allows you to customize the event’s details, including when the nomination period is, what type of nominations will be accepted, and whether the event is targeted at specific classifications.",
                  id: "fTm+ln",
                  description: "Description for talent management event form",
                })}
              </p>
              <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onSubmit)}>
                  {data?.me ? (
                    <UpcomingTalentEventForm query={data?.me} />
                  ) : (
                    <NotFound
                      headingMessage={intl.formatMessage(
                        commonMessages.notFound,
                      )}
                    >
                      <p>{intl.formatMessage(profileMessages.userNotFound)}</p>
                    </NotFound>
                  )}
                  <CardSeparator />
                  <div className="flex flex-col items-center gap-6 text-center xs:flex-row xs:text-left">
                    <Submit
                      text={intl.formatMessage({
                        defaultMessage: "Create talent nomination event",
                        id: "Ju0qLf",
                        description:
                          "Button text to create talent nomination event",
                      })}
                    />
                    <Link
                      color="warning"
                      mode="inline"
                      href={paths.adminTalentManagementEvents()}
                    >
                      {intl.formatMessage({
                        defaultMessage:
                          "Cancel and go back to talent nomination events",
                        id: "U8Qnok",
                        description:
                          "Link text to return to talent nomination events",
                      })}
                    </Link>
                  </div>
                </form>
              </FormProvider>
            </Card>
          </Pending>
        </div>
      </Hero>
    </>
  );
};

export const Component = () => (
  <RequireAuth
    roles={[ROLE_NAME.CommunityAdmin, ROLE_NAME.CommunityTalentCoordinator]}
  >
    <CreateTalentEventPage />
  </RequireAuth>
);

Component.displayName = "AdminCreateTalentEventPage";

export default Component;
