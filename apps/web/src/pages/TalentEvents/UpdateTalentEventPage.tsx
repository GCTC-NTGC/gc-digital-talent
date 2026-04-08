import { useIntl } from "react-intl";
import IdentificationIcon from "@heroicons/react/24/outline/IdentificationIcon";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useMutation, useQuery } from "urql";
import { useNavigate } from "react-router";
import { useEffect } from "react";

import {
  Card,
  CardSeparator,
  Heading,
  Link,
  NotFound,
  Pending,
} from "@gc-digital-talent/ui";
import {
  Community,
  DevelopmentProgram,
  FragmentType,
  getFragment,
  graphql,
  Scalars,
} from "@gc-digital-talent/graphql";
import { toast } from "@gc-digital-talent/toast";
import {
  commonMessages,
  errorMessages,
  formMessages,
  uiMessages,
} from "@gc-digital-talent/i18n";
import {
  Checkbox,
  Checklist,
  DateInput,
  Input,
  Select,
  Submit,
  TextArea,
} from "@gc-digital-talent/forms";
import {
  convertDateTimeToDate,
  convertDateTimeZone,
  DATE_FORMAT_STRING,
  formatDate,
} from "@gc-digital-talent/date-helpers";
import { unpackMaybes } from "@gc-digital-talent/helpers";
import { ROLE_NAME } from "@gc-digital-talent/auth";

import Hero from "~/components/Hero";
import SEO from "~/components/SEO/SEO";
import useBreadcrumbs from "~/hooks/useBreadcrumbs";
import useRoutes from "~/hooks/useRoutes";
import adminMessages from "~/messages/adminMessages";
import useRequiredParams from "~/hooks/useRequiredParams";
import RequireAuth from "~/components/RequireAuth/RequireAuth";

import { RouteParams } from "./TalentEvent/types";
import { isCommunity } from "./TalentEvent/util";

const UpdateTalentNominationEvent_Fragment = graphql(/* GraphQL */ `
  fragment UpdateTalentNominationEvent_Fragment on TalentNominationEvent {
    id
    name {
      en
      fr
      localized
    }
    description {
      en
      fr
    }
    openDate
    closeDate
    learnMoreUrl {
      en
      fr
    }
    includeLeadershipCompetencies
    community {
      id
      key
      name {
        localized
      }
    }
    developmentPrograms {
      id
      name {
        localized
      }
    }
  }
`);

const UpdateTalentNominationEvent_Mutation = graphql(/* GraphQL */ `
  mutation UpdateTalentNominationEventMutation(
    $id: UUID!
    $talentNominationEvent: UpdateTalentNominationEventInput!
  ) {
    updateTalentNominationEvent(
      id: $id
      talentNominationEvent: $talentNominationEvent
    ) {
      id
    }
  }
`);

interface FormValues {
  name: {
    en: string | null;
    fr: string | null;
  };
  description: {
    en: string | null;
    fr: string | null;
  };
  openDate: Scalars["Date"]["input"];
  closeDate: Scalars["Date"]["input"];
  learnMoreUrl: {
    en: string | null;
    fr: string | null;
  };
  includeLeadershipCompetencies: boolean;
  community: string;
  developmentPrograms: string[] | undefined;
}

const UpdateTalentEventForm = ({
  query,
  communities,
}: {
  query: FragmentType<typeof UpdateTalentNominationEvent_Fragment>;
  communities: Community[];
}) => {
  const intl = useIntl();
  const paths = useRoutes();
  const navigate = useNavigate();
  const talentNominationEvent = getFragment(
    UpdateTalentNominationEvent_Fragment,
    query,
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
      developmentPrograms: talentNominationEvent.developmentPrograms?.map(
        (dp) => dp.id,
      ),
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
    return executeMutation({
      id: talentNominationEvent.id,
      talentNominationEvent: {
        ...formValues,
        openDate: convertDateTimeZone(
          `${formValues.openDate} 23:59:59`,
          "Canada/Pacific",
          "UTC",
        ),
        closeDate: convertDateTimeZone(
          `${formValues.closeDate} 23:59:59`,
          "Canada/Pacific",
          "UTC",
        ),
        community: { connect: formValues.community },
        developmentPrograms: { sync: formValues.developmentPrograms },
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

  const watchOpenDate = methods.watch("openDate");
  const watchCommunity = methods.watch("community");

  const communityOptions = communities.map((community) => ({
    label: community.name?.localized,
    value: community.id,
  }));
  const developmentProgramOptions = communities
    .filter((community) => community.id === watchCommunity)
    .reduce(
      (acc: DevelopmentProgram[], curr: Community) => [
        ...acc,
        ...(curr.developmentPrograms ?? []),
      ],
      [],
    )
    .map((developmentProgram) => ({
      label: developmentProgram.name?.localized,
      value: developmentProgram.id,
    }));

  const { isDirty: communityIsDirty } = methods.getFieldState(
    "community",
    methods.formState,
  );

  useEffect(() => {
    if (watchCommunity && communityIsDirty) {
      methods.resetField("developmentPrograms", {
        keepDirty: false,
        defaultValue: [],
      });
    }
  }, [watchCommunity]);

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 gap-6 xs:grid-cols-2">
          <Input
            id="name_en"
            name="name.en"
            autoComplete="off"
            label={intl.formatMessage(commonMessages.name)}
            appendLanguageToLabel={"en"}
            type="text"
            rules={{
              required: intl.formatMessage(errorMessages.required),
            }}
          />
          <Input
            id="name_fr"
            name="name.fr"
            autoComplete="off"
            label={intl.formatMessage(commonMessages.name)}
            appendLanguageToLabel={"fr"}
            type="text"
            rules={{
              required: intl.formatMessage(errorMessages.required),
            }}
          />
          <TextArea
            id="description_en"
            name="description.en"
            label={intl.formatMessage(commonMessages.description)}
            appendLanguageToLabel={"en"}
            rules={{
              required: intl.formatMessage(errorMessages.required),
            }}
          />
          <TextArea
            id="description_fr"
            name="description.fr"
            label={intl.formatMessage(commonMessages.description)}
            appendLanguageToLabel={"fr"}
            rules={{
              required: intl.formatMessage(errorMessages.required),
            }}
          />
          <Input
            id="learnMoreUrl_en"
            name="learnMoreUrl.en"
            label={intl.formatMessage({
              defaultMessage: "More information link",
              id: "HHa3+K",
              description:
                "Label displayed on the talent nomination event more info link field",
            })}
            appendLanguageToLabel={"en"}
            type="url"
          />
          <Input
            id="learnMoreUrl_fr"
            name="learnMoreUrl.fr"
            label={intl.formatMessage({
              defaultMessage: "More information link",
              id: "HHa3+K",
              description:
                "Label displayed on the talent nomination event more info link field",
            })}
            appendLanguageToLabel={"fr"}
            type="url"
          />
          <DateInput
            id="openDate"
            name="openDate"
            legend={intl.formatMessage({
              defaultMessage: "Open date",
              id: "Qxxop2",
              description: "Label for open date",
            })}
            rules={{
              min: {
                value: formatDate({
                  date: new Date(),
                  formatString: DATE_FORMAT_STRING,
                  intl,
                }),
                message: intl.formatMessage({
                  defaultMessage: "Opening date must be after today.",
                  id: "9pivu5",
                  description: "Error message for closing date",
                }),
              },
              required: intl.formatMessage(errorMessages.required),
            }}
          />
          <DateInput
            id="closeDate"
            name="closeDate"
            legend={intl.formatMessage({
              defaultMessage: "Closing date",
              id: "h0LeQH",
              description: "Label for open date",
            })}
            rules={{
              validate: (closeDate) => closeDate > watchOpenDate,
              required: intl.formatMessage(errorMessages.required),
            }}
          />
          <div className="col-span-2">
            <Checkbox
              id="includeLeadershipCompetencies"
              boundingBox
              boundingBoxLabel={intl.formatMessage({
                defaultMessage: "Leadership competencies",
                id: "dOH084",
                description:
                  "Bounding box label for the include leadership competencies",
              })}
              label={intl.formatMessage({
                defaultMessage:
                  "Leadership competencies are required to be nominated for this event",
                id: "A3m7l/",
                description: "Label for the include leadership competencies",
              })}
              name="includeLeadershipCompetencies"
            />
          </div>
          <div className="col-span-2">
            <Select
              id="community"
              name="community"
              label={intl.formatMessage({
                defaultMessage: "Communities",
                id: "5/8d3J",
                description: "Label for the select community input",
              })}
              nullSelection={intl.formatMessage(uiMessages.nullSelectionOption)}
              options={communityOptions}
              rules={{
                required: intl.formatMessage(errorMessages.required),
              }}
            />
          </div>

          {watchCommunity && (
            <div className="col-span-2">
              <Checklist
                idPrefix="developmentPrograms"
                name="developmentPrograms"
                legend={intl.formatMessage({
                  defaultMessage: "Relevant development programs",
                  id: "awwnr3",
                  description:
                    "Label for the input for selecting development programs for a talent nomination event",
                })}
                items={developmentProgramOptions}
                rules={{
                  required: intl.formatMessage(errorMessages.required),
                }}
              />
            </div>
          )}
        </div>
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
    }
    me {
      authInfo {
        roleAssignments {
          teamable {
            ... on Community {
              __typename
              id
              key
              name {
                localized
              }
              developmentPrograms {
                id
                name {
                  localized
                }
              }
            }
          }
        }
      }
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
    id: "Ifq2iQ",
    description: "Page title for the talent nomination event create page",
  });

  const crumbs = useBreadcrumbs({
    crumbs: [
      {
        label: intl.formatMessage(adminMessages.talentEvent),
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

  const roles = unpackMaybes(data?.me?.authInfo?.roleAssignments);
  const communities = unpackMaybes(roles.map((r) => r.teamable)).filter((c) =>
    isCommunity(c),
  );

  return (
    <>
      <SEO title={pageTitle} />
      <Hero title={pageTitle} crumbs={crumbs} centered overlap>
        <div className="mb-18">
          <Pending fetching={fetching} error={error}>
            {data?.talentNominationEvent && data?.me ? (
              <Card>
                <Heading
                  level="h2"
                  color="secondary"
                  icon={IdentificationIcon}
                  center
                  className="mt-0 mb-9 font-normal xs:justify-start xs:text-left"
                >
                  {intl.formatMessage({
                    defaultMessage: "Talent event information",
                    id: "RhWnEX",
                    description: "Subtitle for update talent event page",
                  })}
                </Heading>
                <UpdateTalentEventForm
                  query={data.talentNominationEvent}
                  communities={communities}
                />
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
