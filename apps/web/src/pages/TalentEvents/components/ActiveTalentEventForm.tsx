import { useIntl } from "react-intl";
import type { SubmitHandler } from "react-hook-form";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import { useMutation } from "urql";
import { useNavigate } from "react-router";
import { useState } from "react";

import { CardSeparator, Heading, Link, Notice } from "@gc-digital-talent/ui";
import type { FragmentType } from "@gc-digital-talent/graphql";
import { getFragment } from "@gc-digital-talent/graphql";
import { toast } from "@gc-digital-talent/toast";
import {
  commonMessages,
  errorMessages,
  formMessages,
  getLocale,
} from "@gc-digital-talent/i18n";
import {
  DateInput,
  htmlToRichTextJSON,
  Input,
  RichTextRenderer,
  Submit,
  TextArea,
} from "@gc-digital-talent/forms";
import {
  convertDateTimeToDate,
  convertDateTimeZone,
  DATE_FORMAT_LOCALIZED,
  formatDate,
  parseDateTimeUtc,
  strToFormDate,
} from "@gc-digital-talent/date-helpers";
import { unpackMaybes } from "@gc-digital-talent/helpers";
import { ROLE_NAME } from "@gc-digital-talent/auth";

import useRoutes from "~/hooks/useRoutes";
import processMessages from "~/messages/processMessages";
import FieldDisplay from "~/components/FieldDisplay/FieldDisplay";
import BoolCheckIcon from "~/components/BoolCheckIcon/BoolCheckIcon";
import DevelopmentProgramCard from "~/components/DevelopmentProgramCard/DevelopmentProgramCard";
import adminMessages from "~/messages/adminMessages";

import {
  TalentNominationEvent_Fragment,
  UpdateTalentNominationEvent_Fragment,
  UpdateTalentNominationEvent_Mutation,
} from "./fragments";
import type { FormValues } from "./formValues";
import { isCommunity } from "../TalentEvent/util";
import AddDialog from "./AddDialog";
import EditDialog from "./EditDialog";
import RemoveDialog from "./RemoveDialog";

interface ActiveTalentEventFormProps {
  userQuery: FragmentType<typeof TalentNominationEvent_Fragment>;
  talentEventQuery: FragmentType<typeof UpdateTalentNominationEvent_Fragment>;
}

const ActiveTalentEventForm = ({
  userQuery,
  talentEventQuery,
}: ActiveTalentEventFormProps) => {
  const intl = useIntl();
  const locale = getLocale(intl);
  const paths = useRoutes();
  const navigate = useNavigate();
  const user = getFragment(TalentNominationEvent_Fragment, userQuery);
  const talentNominationEvent = getFragment(
    UpdateTalentNominationEvent_Fragment,
    talentEventQuery,
  );

  const {
    community,
    name,
    includeLeadershipCompetencies,
    openDate,
    description,
    learnMoreUrl,
    closeDate,
    communityDevelopmentPrograms,
    contactEmail,
    customInstructions,
  } = talentNominationEvent;
  const notFound = intl.formatMessage(commonMessages.notFound);
  const notProvided = intl.formatMessage(commonMessages.notProvided);

  const methods = useForm<FormValues>({
    defaultValues: {
      description: {
        en: description?.en,
        fr: description?.fr,
      },
      learnMoreUrl: {
        en: learnMoreUrl?.en,
        fr: learnMoreUrl?.fr,
      },
      closeDate: convertDateTimeToDate(
        convertDateTimeZone(closeDate, "UTC", "Canada/Pacific"),
      ),
      communityDevelopmentPrograms: communityDevelopmentPrograms?.map(
        (cdp) => ({
          value: cdp.id,
          description: {
            en: cdp.pivot?.descriptionForNominations?.en,
            fr: cdp.pivot?.descriptionForNominations?.fr,
          },
        }),
      ),
      contactEmail: contactEmail,
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
        description: formValues.description,
        learnMoreUrl: formValues.learnMoreUrl,
        closeDate: convertDateTimeZone(
          `${formValues.closeDate} 23:59:59`,
          "Canada/Pacific",
          "UTC",
        ),
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

  const roles = unpackMaybes(user?.authInfo?.roleAssignments).filter(
    (ra) =>
      ra.role?.name === ROLE_NAME.CommunityAdmin ||
      ra.role?.name === ROLE_NAME.CommunityTalentCoordinator,
  );
  const communities = unpackMaybes(roles.map((r) => r.teamable)).filter((c) =>
    isCommunity(c),
  );

  const [watchDevelopmentProgramOptions] = methods.watch([
    "communityDevelopmentPrograms",
  ]);
  const ids = watchDevelopmentProgramOptions
    ? new Set(watchDevelopmentProgramOptions.map((dp) => dp.value))
    : new Set();

  const developmentProgramOptions = unpackMaybes(
    communities
      .filter((c) => c.id === community.id)
      .flatMap((c) => c.communityDevelopmentPrograms),
  ).map((cdp) => ({
    label: cdp.developmentProgram.name.localized,
    value: cdp.id,
    description: cdp.developmentProgram.descriptionForProfile.localized,
  }));

  const filteredDevelopmentProgramOptions = developmentProgramOptions.filter(
    (cdp) => !ids.has(cdp.value),
  );

  let minDate = new Date();
  if (closeDate) {
    minDate = new Date(closeDate);
    minDate.setDate(minDate.getDate() - 1);
  }

  const fixedDevelopmentPrograms = communityDevelopmentPrograms?.map(
    (cdp) => cdp.id,
  );

  const [editOpen, setEditOpen] = useState<string | null>(null);
  const [removeOpen, setRemoveOpen] = useState<string | null>(null);

  return (
    <>
      <Notice.Root color="warning" className="mb-6">
        <Notice.Title>
          {intl.formatMessage({
            defaultMessage: "Only some details can be edited",
            id: "mOmhrH",
            description: "Title for warning notice in active talent event form",
          })}
        </Notice.Title>
        <Notice.Content>
          <p>
            {intl.formatMessage({
              defaultMessage:
                "Once a talent event is published and has begun accepting nominations, only specific parts of the events can be changed. This is to ensure fairness and clarity for nominators and their nominees.",
              id: "jQiIbl",
              description:
                "Description for warning notice in active talent event form",
            })}
          </p>
        </Notice.Content>
      </Notice.Root>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 gap-6 xs:grid-cols-2">
            <div className="col-span-2">
              <FieldDisplay
                label={intl.formatMessage({
                  defaultMessage: "Functional community",
                  id: "FILFak",
                  description: "Label for the select community input",
                })}
              >
                {community.name?.localized ?? notFound}
              </FieldDisplay>
            </div>
            <FieldDisplay
              label={intl.formatMessage(commonMessages.name)}
              appendLanguageToLabel={"en"}
            >
              {name.en ?? notFound}
            </FieldDisplay>
            <FieldDisplay
              label={intl.formatMessage(commonMessages.name)}
              appendLanguageToLabel={"fr"}
            >
              {name.fr ?? notFound}
            </FieldDisplay>
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
            <div className="xs:col-span-2">
              <Input
                id="contactEmail"
                name="contactEmail"
                label={intl.formatMessage({
                  defaultMessage: "Event contact email",
                  id: "ezbo2U",
                  description:
                    "Label displayed on the talent nomination event contact email field",
                })}
                type="email"
                rules={{
                  required: intl.formatMessage(errorMessages.required),
                }}
              />
            </div>
          </div>
          <CardSeparator />
          <div className="grid grid-cols-1 gap-6 xs:grid-cols-2">
            <div className="col-span-2">
              <Heading level="h3" size="h6">
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
            <FieldDisplay
              label={intl.formatMessage({
                defaultMessage: "Nomination opening date",
                id: "JhEMHT",
                description:
                  "Label for nomination event date to start accepting nominations",
              })}
            >
              {openDate
                ? formatDate({
                    date: parseDateTimeUtc(openDate),
                    formatString: DATE_FORMAT_LOCALIZED,
                    intl,
                    timeZone: "Canada/Pacific",
                  })
                : intl.formatMessage(commonMessages.notProvided)}
            </FieldDisplay>

            <div className="col-span-2">
              <Notice.Root color="warning" className="mb-6">
                <Notice.Content>
                  <p>
                    {intl.formatMessage({
                      defaultMessage:
                        "Please note that the nomination closing date can only be extended.",
                      id: "eE/J+Q",
                      description:
                        "Description for warning notice in active talent event form",
                    })}
                  </p>
                </Notice.Content>
              </Notice.Root>
              <DateInput
                id="closeDate"
                name="closeDate"
                legend={intl.formatMessage(processMessages.closingDate)}
                rules={{
                  min: {
                    value: strToFormDate(minDate.toISOString()),
                    message: intl.formatMessage(errorMessages.futureDate),
                  },
                  required: intl.formatMessage(errorMessages.required),
                }}
              />
            </div>
            <div className="col-span-2">
              <FieldDisplay
                label={intl.formatMessage({
                  defaultMessage: "Leadership competency requirement",
                  id: "eBH+tH",
                  description:
                    "Bounding box label for the include leadership competencies",
                })}
              >
                <BoolCheckIcon value={includeLeadershipCompetencies}>
                  {intl.formatMessage({
                    defaultMessage:
                      "The nomination must include the nominee's top 3 leadership competencies",
                    id: "4rkX89",
                    description:
                      "Label for the include leadership competencies",
                  })}
                </BoolCheckIcon>
              </FieldDisplay>
            </div>
            <FieldDisplay
              label={intl.formatMessage({
                defaultMessage: "Customized instruction text",
                id: "f1Kpkp",
                description: "label for nomination event instructions",
              })}
              appendLanguageToLabel="en"
            >
              {customInstructions?.en ? (
                <RichTextRenderer
                  node={htmlToRichTextJSON(customInstructions.en)}
                />
              ) : (
                notProvided
              )}
            </FieldDisplay>
            <FieldDisplay
              label={intl.formatMessage({
                defaultMessage: "Customized instruction text",
                id: "f1Kpkp",
                description: "label for nomination event instructions",
              })}
              appendLanguageToLabel="fr"
            >
              {customInstructions?.fr ? (
                <RichTextRenderer
                  node={htmlToRichTextJSON(customInstructions.fr)}
                />
              ) : (
                notProvided
              )}
            </FieldDisplay>
          </div>
          {community !== null && (
            <>
              <CardSeparator />
              <div className="grid gap-6">
                <div>
                  <Heading level="h3" size="h6" className="mt-0">
                    {intl.formatMessage(adminMessages.developmentOpportunities)}
                  </Heading>
                  <p>
                    {intl.formatMessage({
                      defaultMessage:
                        "Specify which professionalization options nominators can choose from when nominating an employee for development opportunities. You can also optionally provide extra context for nominators to better understand their choices. If you can't find the program or certificate you need, contact your community administrator and work with them to add the options you need.",
                      id: "cm1uO9",
                      description:
                        "Description for subsection in talent management event form",
                    })}
                  </p>
                </div>
                <Notice.Root color="warning">
                  <Notice.Content>
                    <p>
                      {intl.formatMessage({
                        defaultMessage:
                          "Please note development opportunities can be added and edited but not removed.",
                        id: "hAb5VZ",
                        description:
                          "Description for warning notice in active talent event form",
                      })}
                    </p>
                  </Notice.Content>
                </Notice.Root>

                <AddDialog
                  developmentProgramOptions={filteredDevelopmentProgramOptions}
                  onSubmit={(values) => append(values)}
                />

                <div>
                  {fields.length === 0 ? (
                    <Notice.Root>
                      <Notice.Content>
                        {intl.formatMessage({
                          defaultMessage:
                            "Please add at least one development opportunity for nominators to select from.",
                          id: "bShedV",
                          description:
                            "Message to add at least one development opportunity",
                        })}
                      </Notice.Content>
                    </Notice.Root>
                  ) : (
                    <div className="overflow-hidden rounded-md border border-gray-200 dark:border-gray-700">
                      <DevelopmentProgramCard.Root>
                        {fields.map((field, index) => {
                          const developmentProgram =
                            developmentProgramOptions.find(
                              ({ value }) => value === field.value,
                            );

                          return (
                            <DevelopmentProgramCard.Item
                              id={field.id}
                              key={field.id}
                              title={developmentProgram?.label ?? notFound}
                              description={
                                <>
                                  <span className="mb-3 block">
                                    {developmentProgram?.description ??
                                      notFound}
                                  </span>
                                  {field.description && (
                                    <span>{field.description[locale]}</span>
                                  )}
                                </>
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
                                <EditDialog
                                  communityDevelopmentProgramId={field.id}
                                  developmentProgramOptions={
                                    developmentProgramOptions
                                  }
                                  defaultValues={{
                                    value: field.value,
                                    description: field.description,
                                  }}
                                  onSubmit={(values) => update(index, values)}
                                  active
                                  open={editOpen === field.id}
                                  setOpen={setEditOpen}
                                />
                              }
                              remove={
                                !fixedDevelopmentPrograms?.includes(
                                  field.value,
                                ) ? (
                                  <RemoveDialog
                                    communityDevelopmentProgramId={field.id}
                                    title={developmentProgram?.label}
                                    onRemove={() => remove(index)}
                                    open={removeOpen === field.id}
                                    setOpen={setRemoveOpen}
                                  />
                                ) : null
                              }
                              setEditOpen={setEditOpen}
                              setRemoveOpen={setRemoveOpen}
                            />
                          );
                        })}
                      </DevelopmentProgramCard.Root>
                    </div>
                  )}
                </div>
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
    </>
  );
};

export default ActiveTalentEventForm;
