import { defineMessage, useIntl } from "react-intl";
import type { SubmitHandler } from "react-hook-form";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import { useMutation, useQuery } from "urql";
import { useNavigate } from "react-router";
import { useEffect } from "react";
import QueueListIcon from "@heroicons/react/24/outline/QueueListIcon";

import {
  Card,
  CardSeparator,
  Heading,
  Link,
  NotFound,
  Notice,
  Pending,
} from "@gc-digital-talent/ui";
import type {
  Community,
  CommunityDevelopmentProgram,
  FragmentType,
  Scalars,
} from "@gc-digital-talent/graphql";
import {
  getFragment,
  graphql,
  TalentNominationEventStatus,
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
import processMessages from "~/messages/processMessages";
import DevelopmentProgramCard from "~/components/DevelopmentProgramCard/DevelopmentProgramCard";

import type { RouteParams } from "./TalentEvent/types";
import { isCommunity } from "./TalentEvent/util";
import DevelopmentProgramDialog from "./components/DevelopmentProgramDialog";
import ActiveTalentEventForm from "./components/ActiveTalentEventForm";
import RemoveDevelopmentProgramDialog from "./components/RemoveDevelopmentProgramDialog";

const openDate = defineMessage({
  defaultMessage: "Open date",
  id: "Qxxop2",
  description: "Label for open date",
});

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
    communityDevelopmentPrograms {
      id
      developmentProgram {
        id
        name {
          localized
        }
        descriptionForProfile {
          localized
        }
      }
      pivot {
        descriptionForNominations {
          en
          fr
        }
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
  communityDevelopmentPrograms: {
    value: string;
    description: {
      en: string | null;
      fr: string | null;
    };
  }[];
}

interface UpdateTalentEventFormProps {
  query: FragmentType<typeof UpdateTalentNominationEvent_Fragment>;
  communities: Community[];
}

const UpdateTalentEventForm = ({
  query,
  communities,
}: UpdateTalentEventFormProps) => {
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
      communityDevelopmentPrograms:
        talentNominationEvent.communityDevelopmentPrograms?.map((cdp) => ({
          value: cdp.id,
          description: {
            en: cdp.pivot?.descriptionForNominations?.en,
            fr: cdp.pivot?.descriptionForNominations?.fr,
          },
        })),
    },
  });

  const { fields, append, update, remove } = useFieldArray<FormValues>({
    name: "communityDevelopmentPrograms",
    control: methods.control,
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
        communityDevelopmentPrograms: {
          sync: [
            ...formValues.communityDevelopmentPrograms.map((d) => ({
              id: d.value,
              descriptionForNominations: d.description,
            })),
          ],
        },
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
      (acc: CommunityDevelopmentProgram[], curr: Community) => [
        ...acc,
        ...(curr.communityDevelopmentPrograms ?? []),
      ],
      [],
    )
    .map((cdp) => ({
      label: cdp.developmentProgram.name.localized,
      value: cdp.id,
      description: cdp.developmentProgram.descriptionForProfile.localized,
    }));

  const { isDirty: communityIsDirty } = methods.getFieldState(
    "community",
    methods.formState,
  );

  useEffect(() => {
    if (watchCommunity && communityIsDirty) {
      methods.resetField("communityDevelopmentPrograms", {
        keepDirty: false,
        defaultValue: [],
      });
    }
  }, [watchCommunity]);

  const notFound = intl.formatMessage(commonMessages.notFound);

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <div className="grid gap-6 xs:grid-cols-2">
          <div className="xs:col-span-2">
            <Select
              id="community"
              name="community"
              label={intl.formatMessage({
                defaultMessage: "Functional community",
                id: "FILFak",
                description: "Label for the select community input",
              })}
              nullSelection={intl.formatMessage(uiMessages.nullSelectionOption)}
              options={communityOptions}
              rules={{
                required: intl.formatMessage(errorMessages.required),
              }}
            />
          </div>
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
              defaultMessage: "Link to external information",
              id: "PWqfaJ",
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
              defaultMessage: "Link to external information",
              id: "PWqfaJ",
              description:
                "Label displayed on the talent nomination event more info link field",
            })}
            appendLanguageToLabel={"fr"}
            type="url"
          />
        </div>
        <CardSeparator />
        <div className="grid gap-6 xs:grid-cols-2">
          <div className="xs:col-span-2">
            <Heading level="h3" size="h6" className="mt-0 mb-3">
              {intl.formatMessage({
                defaultMessage: "Nomination settings",
                id: "eWP5gJ",
                description:
                  "Title for subsection of create talent management form",
              })}
            </Heading>
            <p>
              {intl.formatMessage({
                defaultMessage:
                  "These options allow you to specify classification restrictions, the type of nominations that are accepted, and the period of time the event will be accepting nomination submissions.",
                id: "Qds8Yz",
                description:
                  "Description for subsection create talent management event",
              })}
            </p>
          </div>
          <div className="xs:col-span-2">
            <Checkbox
              id="includeLeadershipCompetencies"
              boundingBox
              boundingBoxLabel={intl.formatMessage({
                defaultMessage: "Leadership competency requirement",
                id: "eBH+tH",
                description:
                  "Bounding box label for the include leadership competencies",
              })}
              label={intl.formatMessage({
                defaultMessage:
                  "The nomination must include the nominee's top 3 leadership competencies",
                id: "4rkX89",
                description: "Label for the include leadership competencies",
              })}
              name="includeLeadershipCompetencies"
            />
          </div>
          <DateInput
            id="openDate"
            name="openDate"
            legend={intl.formatMessage(openDate)}
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
            legend={intl.formatMessage(processMessages.closingDate)}
            rules={{
              min: {
                value: watchOpenDate ? String(watchOpenDate) : "",
                message: intl.formatMessage(errorMessages.minDateSelfLabel, {
                  labelSelf: intl.formatMessage(processMessages.closingDate),
                  labelAssociated: intl.formatMessage(openDate),
                }),
              },
            }}
          />
        </div>
        {watchCommunity && (
          <>
            <CardSeparator />
            <div className="grid gap-6">
              <div>
                <Heading level="h3" size="h6" className="mt-0 mb-3">
                  {intl.formatMessage({
                    defaultMessage: "Development opportunities",
                    id: "p+JlKG",
                    description:
                      "Title for subsection of create talent management form",
                  })}
                </Heading>
                <p>
                  {intl.formatMessage({
                    defaultMessage:
                      "Specify which professionalization options nominators can choose from when nominating an employee for development opportunities. You can also optionally provide extra context for nominators to better understand their choices if need be,. If you can’t find the program or certificate you need, contact your community administrator and work with them to add the options you need.",
                    id: "atLy8S",
                    description:
                      "Description for subsection create talent management event",
                  })}
                </p>
              </div>

              <DevelopmentProgramDialog
                developmentProgramOptions={developmentProgramOptions}
                onSubmit={(values) => append(values)}
              />

              <>
                {fields.length === 0 ? (
                  <Notice.Root>
                    <Notice.Content className="text-center">
                      {intl.formatMessage({
                        defaultMessage:
                          "Please add at least one development opportunity for nominators to select from.",
                        id: "6akdUp",
                        description:
                          "Notice message to add at least one development opportunity",
                      })}
                    </Notice.Content>
                  </Notice.Root>
                ) : (
                  <div className="rounded-md border border-gray-200">
                    <DevelopmentProgramCard.Root>
                      {fields.map((field, index) => {
                        const developmentProgram =
                          developmentProgramOptions.find(
                            ({ value }) => value === field.value,
                          );

                        return (
                          <DevelopmentProgramCard.Item
                            key={field.id}
                            title={developmentProgram?.label ?? notFound}
                            description={
                              developmentProgram?.description ?? notFound
                            }
                            iconLabel={intl.formatMessage(
                              {
                                defaultMessage:
                                  "More actions for development opportunity {title}",
                                id: "L8zYRQ",
                                description:
                                  "Aria label for the menu trigger for development program actions",
                              },
                              {
                                title:
                                  developmentProgram?.label ??
                                  intl.formatMessage(commonMessages.notFound),
                              },
                            )}
                            edit={
                              <DevelopmentProgramDialog
                                developmentProgramOptions={
                                  developmentProgramOptions
                                }
                                defaultValues={{
                                  value: field.value,
                                  description: field.description,
                                }}
                                onSubmit={(values) => update(index, values)}
                                edit
                              />
                            }
                            remove={
                              <RemoveDevelopmentProgramDialog
                                title={developmentProgram?.label}
                                onRemove={() => remove(index)}
                              />
                            }
                          />
                        );
                      })}
                    </DevelopmentProgramCard.Root>
                  </div>
                )}
              </>
            </div>
          </>
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
              communityDevelopmentPrograms {
                id
                developmentProgram {
                  id
                  name {
                    localized
                  }
                  descriptionForProfile {
                    localized
                  }
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
        label: intl.formatMessage(adminMessages.talentManagementEvents),
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
      <Hero
        title={pageTitle}
        subtitle={intl.formatMessage(
          {
            defaultMessage: "Edit details about {name}",
            id: "5qiuq2",
            description: "Description for update talent management event",
          },
          { name: data?.talentNominationEvent?.name.localized },
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
                  {intl.formatMessage({
                    defaultMessage: "Event details",
                    id: "PnHH9A",
                    description: "Subheading for nomination event details",
                  })}
                </Heading>
                <p className="mb-6">
                  {intl.formatMessage({
                    defaultMessage:
                      "Talent management events allow the community to open a nomination period where employees can be nominated for advancement, lateral movement or development opportunities. This form allows you to customize the event’s details, including when the nomination period is, what type of nominations will be accepted, and whether the event is targeted at specific classifications.",
                    id: "1gAJVq",
                    description:
                      "Subtitle for update talent management event page",
                  })}
                </p>
                {data?.talentNominationEvent.status?.value ===
                TalentNominationEventStatus.Active ? (
                  <ActiveTalentEventForm
                    query={data.talentNominationEvent}
                    communities={communities}
                  />
                ) : (
                  <UpdateTalentEventForm
                    query={data.talentNominationEvent}
                    communities={communities}
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
