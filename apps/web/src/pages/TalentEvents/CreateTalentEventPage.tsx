import { defineMessage, useIntl } from "react-intl";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import { useMutation, useQuery } from "urql";
import { useNavigate } from "react-router";
import { useEffect } from "react";
import QueueListIcon from "@heroicons/react/24/outline/QueueListIcon";

import {
  Card,
  CardSeparator,
  Heading,
  Link,
  Notice,
  Pending,
} from "@gc-digital-talent/ui";
import type {
  Community,
  CommunityDevelopmentProgram,
} from "@gc-digital-talent/graphql";
import { graphql } from "@gc-digital-talent/graphql";
import { toast } from "@gc-digital-talent/toast";
import {
  commonMessages,
  errorMessages,
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
import RequireAuth from "~/components/RequireAuth/RequireAuth";
import processMessages from "~/messages/processMessages";
import DevelopmentProgramCard from "~/components/DevelopmentProgramCard/DevelopmentProgramCard";

import { isCommunity } from "./TalentEvent/util";
import DevelopmentProgramDialog from "./components/DevelopmentProgramDialog";
import RemoveDevelopmentProgramDialog from "./components/RemoveDevelopmentProgramDialog";

const openDate = defineMessage({
  defaultMessage: "Open date",
  id: "Qxxop2",
  description: "Label for open date",
});

const CreateTalentNominationEvent_Query = graphql(/* GraphQL */ `
  query CreateTalentNominationEventQuery {
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

const CreateTalentNominationEvent_Mutation = graphql(/* GraphQL */ `
  mutation CreateTalentNominationEventMutation(
    $talentNominationEvent: CreateTalentNominationEventInput!
  ) {
    createTalentNominationEvent(talentNominationEvent: $talentNominationEvent) {
      id
    }
  }
`);

export interface FormValues {
  name: {
    en: string;
    fr: string;
  };
  description: {
    en: string;
    fr: string;
  };
  openDate: string;
  closeDate: string;
  learnMoreUrl: {
    en: string;
    fr: string;
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

const CreateTalentEventPage = () => {
  const intl = useIntl();
  const paths = useRoutes();
  const navigate = useNavigate();
  const methods = useForm<FormValues>({ defaultValues: {} });
  const { watch, handleSubmit, getFieldState, resetField, formState, control } =
    methods;

  const { fields, append, update, remove } = useFieldArray<FormValues>({
    name: "communityDevelopmentPrograms",
    control,
  });

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
    return executeMutation({
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
        label: intl.formatMessage(adminMessages.talentManagementEvents),
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

  const watchOpenDate = watch("openDate");
  const watchCommunity = watch("community");

  const roles = unpackMaybes(data?.me?.authInfo?.roleAssignments);
  const communities = unpackMaybes(roles.map((r) => r.teamable)).filter((c) =>
    isCommunity(c),
  );
  const communityOptions = communities.map((community) => ({
    label:
      community.name?.localized ??
      intl.formatMessage(commonMessages.notAvailable),
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

  const { isDirty: communityIsDirty } = getFieldState("community", formState);

  useEffect(() => {
    if (watchCommunity && communityIsDirty) {
      resetField("communityDevelopmentPrograms", {
        keepDirty: false,
        defaultValue: [],
      });
    }
  }, [watchCommunity]);

  const notFound = intl.formatMessage(commonMessages.notFound);

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
                {intl.formatMessage({
                  defaultMessage: "Event details",
                  id: "+2dR9i",
                  description:
                    "Subtitle for create talent management event page",
                })}
              </Heading>
              <p className="mb-6">
                {intl.formatMessage({
                  defaultMessage:
                    "Talent management events allow the community to open a nomination period where employees can be nominated for advancement, lateral movement or development opportunities. This form allows you to customize the event’s details, including when the nomination period is, what type of nominations will be accepted, and whether the event is targeted at specific classifications.",
                  id: "J/Ou2j",
                  description: "Description for create talent management event",
                })}
              </p>
              <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onSubmit)}>
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
                        nullSelection={intl.formatMessage(
                          uiMessages.nullSelectionOption,
                        )}
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
                      <Heading level="h3" size="h6" className="mt-0">
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
                          description:
                            "Label for the include leadership competencies",
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
                          message: intl.formatMessage(
                            errorMessages.minDateSelfLabel,
                            {
                              labelSelf: intl.formatMessage(
                                processMessages.closingDate,
                              ),
                              labelAssociated: intl.formatMessage(openDate),
                            },
                          ),
                        },
                      }}
                    />
                  </div>
                  {watchCommunity && (
                    <>
                      <CardSeparator />
                      <div className="grid gap-6">
                        <div>
                          <Heading level="h3" size="h6" className="mt-0">
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
                            <Notice.Root className="text-center">
                              <Notice.Content>
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
                                      title={
                                        developmentProgram?.label ?? notFound
                                      }
                                      description={
                                        developmentProgram?.description ??
                                        notFound
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
                                            intl.formatMessage(
                                              commonMessages.notFound,
                                            ),
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
                                          onSubmit={(values) =>
                                            update(index, values)
                                          }
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
