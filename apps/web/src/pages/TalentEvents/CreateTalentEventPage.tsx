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
  Pending,
} from "@gc-digital-talent/ui";
import {
  Community,
  DevelopmentProgram,
  graphql,
} from "@gc-digital-talent/graphql";
import { toast } from "@gc-digital-talent/toast";
import {
  commonMessages,
  errorMessages,
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
  DATE_FORMAT_STRING,
  DATETIME_FORMAT_STRING,
  formatDate,
  parseDateTimeUtc,
} from "@gc-digital-talent/date-helpers";
import { unpackMaybes } from "@gc-digital-talent/helpers";
import { ROLE_NAME } from "@gc-digital-talent/auth";

import Hero from "~/components/Hero";
import SEO from "~/components/SEO/SEO";
import useBreadcrumbs from "~/hooks/useBreadcrumbs";
import useRoutes from "~/hooks/useRoutes";
import adminMessages from "~/messages/adminMessages";
import RequireAuth from "~/components/RequireAuth/RequireAuth";

const CreateTalentNominationEvent_Query = graphql(/* GraphQL */ `
  query CreateTalentNominationEventQuery {
    communities {
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

interface FormValues {
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
  developmentPrograms: string[] | undefined;
}

const CreateTalentEventPage = () => {
  const intl = useIntl();
  const paths = useRoutes();
  const navigate = useNavigate();
  const methods = useForm<FormValues>({ defaultValues: {} });

  const [{ data, fetching, error }] = useQuery({
    query: CreateTalentNominationEvent_Query,
  });
  const [, executeMutation] = useMutation(CreateTalentNominationEvent_Mutation);

  const handleError = () => {
    toast.error(
      intl.formatMessage({
        defaultMessage: "Error: creating talent nomination event failed",
        id: "QP4oEE",
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
        openDate: formatDate({
          date: parseDateTimeUtc(formValues.openDate),
          formatString: DATETIME_FORMAT_STRING,
          intl,
        }),
        closeDate: formatDate({
          date: parseDateTimeUtc(formValues.closeDate),
          formatString: DATETIME_FORMAT_STRING,
          intl,
        }),
        community: { connect: formValues.community },
        developmentPrograms: { sync: formValues.developmentPrograms },
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
              defaultMessage: "Talent nomination event created successfully!",
              id: "UVTjIw",
              description:
                "Message displayed to user after talent nomination event is created",
            }),
          );
        } else {
          handleError();
        }
      })
      .catch(handleError);
  };

  const pageTitle = intl.formatMessage({
    defaultMessage: "Create a talent nomination event",
    id: "W/UJ9H",
    description: "Page title for the talent nomination event create page",
  });

  const crumbs = useBreadcrumbs({
    crumbs: [
      {
        label: intl.formatMessage(adminMessages.talentEvent),
        url: paths.adminTalentManagementEvents(),
      },
      {
        label: intl.formatMessage({
          defaultMessage: "Create<hidden> talent nomination event</hidden>",
          id: "uREOIt",
          description:
            "Breadcrumb title for the create talent nomination event page link.",
        }),
        url: paths.createTalentManagementEvent(),
      },
    ],
  });

  const communities = unpackMaybes(data?.communities);
  const watchOpenDate = methods.watch("openDate");
  const communityOptions = communities.map((community) => ({
    label: community.name?.localized,
    value: community.id,
  }));
  const watchCommunity = methods.watch("community");
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

  useEffect(() => {
    if (!watchCommunity) {
      methods.resetField("developmentPrograms");
    }
  }, [watchCommunity]);

  return (
    <>
      <SEO title={pageTitle} />
      <Hero title={pageTitle} crumbs={crumbs} centered overlap>
        <div className="mb-18">
          <Pending fetching={fetching} error={error}>
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
                  id: "lNE6pk",
                  description: "Subtitle for create talent event page",
                })}
              </Heading>
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
                        validate: (value: string) =>
                          new Date(value) > new Date(watchOpenDate),
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
                          description:
                            "Label for the include leadership competencies",
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
                        nullSelection={intl.formatMessage(
                          uiMessages.nullSelectionOption,
                        )}
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
                            required: intl.formatMessage(
                              errorMessages.required,
                            ),
                          }}
                        />
                      </div>
                    )}
                  </div>
                  <CardSeparator />
                  <div className="flex flex-col items-center gap-6 text-center xs:flex-row xs:text-left">
                    <Submit
                      text={intl.formatMessage({
                        defaultMessage: "Create skill family",
                        id: "qkuRs8",
                        description: "Button text to create a skill family",
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
