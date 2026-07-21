import { useIntl } from "react-intl";
import type { SubmitHandler } from "react-hook-form";
import { FormProvider, useForm } from "react-hook-form";
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
import type { FragmentType } from "@gc-digital-talent/graphql";
import {
  getFragment,
  graphql,
  TalentNominationEventStatus,
} from "@gc-digital-talent/graphql";
import { toast } from "@gc-digital-talent/toast";
import {
  commonMessages,
  formMessages,
  navigationMessages,
} from "@gc-digital-talent/i18n";
import { Submit } from "@gc-digital-talent/forms";
import {
  convertDateTimeToDate,
  convertDateTimeZone,
  currentDate,
  nowUTCDateTime,
} from "@gc-digital-talent/date-helpers";
import { ROLE_NAME } from "@gc-digital-talent/auth";

import Hero from "~/components/Hero";
import SEO from "~/components/SEO/SEO";
import useBreadcrumbs from "~/hooks/useBreadcrumbs";
import useRoutes from "~/hooks/useRoutes";
import useRequiredParams from "~/hooks/useRequiredParams";
import RequireAuth from "~/components/RequireAuth/RequireAuth";
import profileMessages from "~/messages/profileMessages";
import adminMessages from "~/messages/adminMessages";

import type { RouteParams } from "./TalentEvent/types";
import ActiveTalentEventForm from "./components/ActiveTalentEventForm";
import UpcomingTalentEventForm from "./components/UpcomingTalentEventForm";
import type { FormValues } from "./components/formValues";
import {
  TalentNominationEvent_Fragment,
  UpdateTalentNominationEvent_Fragment,
  UpdateTalentNominationEvent_Mutation,
} from "./components/fragments";

interface UpdateTalentEventFormProps {
  userQuery: FragmentType<typeof TalentNominationEvent_Fragment>;
  talentEventQuery: FragmentType<typeof UpdateTalentNominationEvent_Fragment>;
}

const UpdateTalentEventForm = ({
  userQuery,
  talentEventQuery,
}: UpdateTalentEventFormProps) => {
  const intl = useIntl();
  const paths = useRoutes();
  const navigate = useNavigate();
  const user = getFragment(TalentNominationEvent_Fragment, userQuery);
  const talentNominationEvent = getFragment(
    UpdateTalentNominationEvent_Fragment,
    talentEventQuery,
  );

  const methods = useForm<FormValues>({
    defaultValues: {
      name: {
        en: talentNominationEvent.name.en,
        fr: talentNominationEvent.name.fr,
      },
      description: {
        en: talentNominationEvent.description?.en,
        fr: talentNominationEvent.description?.fr,
      },
      learnMoreUrl: {
        en: talentNominationEvent.learnMoreUrl?.en,
        fr: talentNominationEvent.learnMoreUrl?.fr,
      },
      openDate: convertDateTimeToDate(
        convertDateTimeZone(
          talentNominationEvent.openDate,
          "UTC",
          "Canada/Pacific",
        ),
      ),
      closeDate: convertDateTimeToDate(
        convertDateTimeZone(
          talentNominationEvent.closeDate,
          "UTC",
          "Canada/Pacific",
        ),
      ),
      includeLeadershipCompetencies:
        talentNominationEvent.includeLeadershipCompetencies,
      community: talentNominationEvent.community.id,
      communityDevelopmentPrograms:
        talentNominationEvent.communityDevelopmentPrograms?.map((cdp) => ({
          value: cdp.id,
          description: {
            en: cdp.pivot?.descriptionForNominations?.en,
            fr: cdp.pivot?.descriptionForNominations?.fr,
          },
        })),
      customInstructions: {
        en: talentNominationEvent.customInstructions?.en,
        fr: talentNominationEvent.customInstructions?.fr,
      },
      contactEmail: talentNominationEvent.contactEmail,
    },
  });

  const [, executeMutation] = useMutation(UpdateTalentNominationEvent_Mutation);

  const handleError = () => {
    toast.error(
      intl.formatMessage({
        defaultMessage: "Error: updating talent nomination event failed",
        id: "jULOHh",
        description:
          "Message displayed to user after talent nomination event fails to get updated",
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
      id: talentNominationEvent.id,
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
        if (result.data?.updateTalentNominationEvent) {
          await navigate(
            paths.adminTalentManagementEvent(
              result.data.updateTalentNominationEvent.id,
            ),
          );
          toast.success(
            intl.formatMessage({
              defaultMessage: "Talent nomination event updated successfully!",
              id: "eJbGm2",
              description:
                "Message displayed to user after talent nomination event is updated",
            }),
          );
        } else {
          handleError();
        }
      })
      .catch(handleError);
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        {user != null && user != undefined ? (
          <UpcomingTalentEventForm query={userQuery} />
        ) : (
          <NotFound
            headingMessage={intl.formatMessage(commonMessages.notFound)}
          >
            <p>{intl.formatMessage(profileMessages.userNotFound)}</p>
          </NotFound>
        )}
        <CardSeparator />
        <div className="flex flex-col items-center gap-6 text-center xs:flex-row xs:text-left">
          <Submit text={intl.formatMessage(formMessages.saveChanges)} />
          <Link
            color="warning"
            mode="inline"
            href={paths.adminTalentManagementEvent(talentNominationEvent.id)}
          >
            {intl.formatMessage(commonMessages.cancel)}
          </Link>
        </div>
      </form>
    </FormProvider>
  );
};

const UpdateTalentNominationEvent_Query = graphql(/* GraphQL */ `
  query UpdateTalentNominationEventQuery($id: UUID!) {
    talentNominationEvent(id: $id) {
      ...UpdateTalentNominationEvent_Fragment
      name {
        localized
      }
      status {
        value
      }
    }
    me {
      ...TalentNominationEvent_Fragment
    }
  }
`);

const UpdateTalentEventPage = () => {
  const intl = useIntl();
  const paths = useRoutes();
  const { eventId } = useRequiredParams<RouteParams>("eventId");

  const [{ data, fetching, error }] = useQuery({
    query: UpdateTalentNominationEvent_Query,
    variables: { id: eventId },
  });

  const pageTitle = intl.formatMessage({
    defaultMessage: "Edit a talent nomination event",
    id: "33I+qy",
    description: "Page title for the talent nomination event edit page",
  });

  const crumbs = useBreadcrumbs({
    crumbs: [
      {
        label: intl.formatMessage(navigationMessages.talentManagementEvents),
        url: paths.adminTalentManagementEvents(),
      },
      {
        label: data?.talentNominationEvent?.name.localized,
        url: paths.adminTalentManagementEvent(eventId),
      },
      {
        label: intl.formatMessage({
          defaultMessage: "Edit<hidden> talent nomination event</hidden>",
          id: "qnLmg1",
          description:
            "Breadcrumb title for the create talent nomination event page link.",
        }),
        url: paths.updateTalentManagementEvent(eventId),
      },
    ],
  });

  return (
    <>
      <SEO title={pageTitle} />
      <Hero
        title={pageTitle}
        subtitle={intl.formatMessage(
          {
            defaultMessage: "Edit details about {name}",
            id: "5qiuq2",
            description: "Description for update talent management event",
          },
          {
            name:
              data?.talentNominationEvent?.name.localized ??
              intl.formatMessage(commonMessages.notFound),
          },
        )}
        crumbs={crumbs}
        centered
        overlap
      >
        <div className="mb-18">
          <Pending fetching={fetching} error={error}>
            {data?.talentNominationEvent && data?.me ? (
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
                {data?.talentNominationEvent.status?.value ===
                  TalentNominationEventStatus.Active ||
                data.talentNominationEvent.status?.value ===
                  TalentNominationEventStatus.Past ? (
                  <ActiveTalentEventForm
                    userQuery={data.me}
                    talentEventQuery={data.talentNominationEvent}
                  />
                ) : (
                  <UpdateTalentEventForm
                    userQuery={data.me}
                    talentEventQuery={data.talentNominationEvent}
                  />
                )}
              </Card>
            ) : (
              <NotFound
                headingMessage={intl.formatMessage(commonMessages.notFound)}
              >
                <p>
                  {intl.formatMessage(
                    {
                      defaultMessage:
                        "Talent nomination event {eventId} not found.",
                      id: "hNIQyO",
                      description:
                        "Message displayed for talent nomination event not found.",
                    },
                    { eventId },
                  )}
                </p>
              </NotFound>
            )}
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
    <UpdateTalentEventPage />
  </RequireAuth>
);

Component.displayName = "AdminUpdateTalentEventPage";

export default Component;
