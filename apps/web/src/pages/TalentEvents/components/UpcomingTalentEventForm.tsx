import { defineMessage, useIntl } from "react-intl";
import { useFieldArray, useFormContext } from "react-hook-form";
import { useEffect, useId, useRef, useState } from "react";

import { CardSeparator, Heading, Notice } from "@gc-digital-talent/ui";
import { getFragment, type FragmentType } from "@gc-digital-talent/graphql";
import {
  commonMessages,
  errorMessages,
  getLocale,
  uiMessages,
  type Locales,
} from "@gc-digital-talent/i18n";
import {
  Checkbox,
  DateInput,
  Input,
  RichTextInput,
  Select,
  TextArea,
} from "@gc-digital-talent/forms";
import { unpackMaybes } from "@gc-digital-talent/helpers";
import { ROLE_NAME } from "@gc-digital-talent/auth";

import processMessages from "~/messages/processMessages";
import DevelopmentProgramCard from "~/components/DevelopmentProgramCard/DevelopmentProgramCard";
import adminMessages from "~/messages/adminMessages";
import { FRENCH_WORDS_PER_ENGLISH_WORD } from "~/constants/talentSearchConstants";

import { isCommunity } from "../TalentEvent/util";
import type { FormValues } from "./formValues";
import { TalentNominationEvent_Fragment } from "./fragments";
import AddDialog from "./AddDialog";
import EditDialog from "./EditDialog";
import RemoveDialog from "./RemoveDialog";

const atLeastOne = defineMessage({
  defaultMessage:
    "Please add at least one development opportunity for nominators to select from.",
  id: "bShedV",
  description: "Message to add at least one development opportunity",
});

const TEXT_AREA_MAX_WORDS_EN = 75;

interface UpcomingTalentEventFormProps {
  query?: FragmentType<typeof TalentNominationEvent_Fragment>;
}

const UpcomingTalentEventForm = ({ query }: UpcomingTalentEventFormProps) => {
  const intl = useIntl();
  const locale = getLocale(intl);
  const user = getFragment(TalentNominationEvent_Fragment, query);
  const methods = useFormContext<FormValues>();
  const { watch, control, getFieldState } = methods;

  const { fields, append, update, remove, replace } = useFieldArray<FormValues>(
    {
      name: "communityDevelopmentPrograms",
      control,
      rules: {
        required: intl.formatMessage(errorMessages.required),
        validate: (value) => value.length > 0 || intl.formatMessage(atLeastOne),
      },
    },
  );

  const [watchOpenDate, watchCommunity, watchDevelopmentProgramOptions] = watch(
    ["openDate", "community", "communityDevelopmentPrograms"],
  );

  const roles = unpackMaybes(user?.authInfo?.roleAssignments).filter(
    (ra) =>
      ra.role?.name === ROLE_NAME.CommunityAdmin ||
      ra.role?.name === ROLE_NAME.CommunityTalentCoordinator,
  );
  const communities = unpackMaybes(roles.map((r) => r.teamable))
    .filter((c) => isCommunity(c))
    .filter(
      (item, index, self) => index === self.findIndex((c) => c.id === item.id),
    );

  const communityOptions = communities.map((community) => ({
    label:
      community.name?.localized ??
      intl.formatMessage(commonMessages.notAvailable),
    value: community.id,
  }));

  const ids = watchDevelopmentProgramOptions
    ? new Set(watchDevelopmentProgramOptions.map((dp) => dp.value))
    : new Set();
  const developmentProgramOptions = unpackMaybes(
    communities
      .filter((community) => community.id === watchCommunity)
      .flatMap((community) => community.communityDevelopmentPrograms),
  ).map((cdp) => ({
    label: cdp.developmentProgram.name.localized,
    value: cdp.id,
    description: cdp.developmentProgram.descriptionForProfile.localized,
  }));

  const filteredDevelopmentProgramOptions = developmentProgramOptions.filter(
    (cdp) => !ids.has(cdp.value),
  );

  const previousValue = useRef(watchCommunity);

  useEffect(() => {
    if (previousValue.current !== watchCommunity) {
      replace([]);
    }

    previousValue.current = watchCommunity;
  }, [replace, watchCommunity]);

  const notFound = intl.formatMessage(commonMessages.notFound);

  const { invalid: invalidDevelopmentPrograms } = getFieldState(
    "communityDevelopmentPrograms",
  );

  const [editOpen, setEditOpen] = useState<string | null>(null);
  const [removeOpen, setRemoveOpen] = useState<string | null>(null);

  const wordCountLimits: Record<Locales, number> = {
    en: TEXT_AREA_MAX_WORDS_EN,
    fr: Math.round(TEXT_AREA_MAX_WORDS_EN * FRENCH_WORDS_PER_ENGLISH_WORD),
  } as const;

  const instructionsDescriptionId = useId();

  return (
    <>
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
        <DateInput
          id="openDate"
          name="openDate"
          legend={intl.formatMessage({
            defaultMessage: "Nomination start date",
            id: "aXY8in",
            description: "start date of a nomination event",
          })}
          rules={{
            required: intl.formatMessage(errorMessages.required),
          }}
        />
        <DateInput
          id="closeDate"
          name="closeDate"
          legend={intl.formatMessage({
            defaultMessage: "Nomination close date",
            id: "bnjpsH",
            description: "end date of a nomination event",
          })}
          rules={{
            min: {
              value: watchOpenDate ? String(watchOpenDate) : "",
              message: intl.formatMessage(errorMessages.minDateSelfLabel, {
                labelSelf: intl.formatMessage(processMessages.closingDate),
                labelAssociated: intl.formatMessage(adminMessages.openingDate),
              }),
            },
            required: intl.formatMessage(errorMessages.required),
          }}
        />
        <div className="xs:col-span-2">
          <Checkbox
            id="includeNineBox"
            boundingBox
            boundingBoxLabel={intl.formatMessage({
              defaultMessage: "Leadership performance questions",
              id: "bCqtne",
              description:
                "Bounding box label for the include leadership performance",
            })}
            label={intl.formatMessage({
              defaultMessage:
                "The nomination must include the nominee’s performance and leadership potential",
              id: "x7c8ZO",
              description: "Label for the include leadership performance",
            })}
            name="includeNineBox"
          />
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
        <div className="xs:col-span-2" id={instructionsDescriptionId}>
          {intl.formatMessage({
            defaultMessage:
              "The nomination form offers basic instructions at the beginning of each nomination to help guide the nominator through the process. You use the following optional field to include extra context that might be unique to your event.",
            id: "5jkq2u",
            description: "description for custom event instructions",
          })}
        </div>
        <RichTextInput
          id={"customInstructions.en"}
          name={"customInstructions.en"}
          wordLimit={wordCountLimits.en}
          label={intl.formatMessage({
            defaultMessage: "Customized instruction text",
            id: "f1Kpkp",
            description: "label for nomination event instructions",
          })}
          appendLanguageToLabel={"en"}
          rules={{ required: intl.formatMessage(errorMessages.required) }}
          aria-describedby={instructionsDescriptionId}
        />
        <RichTextInput
          id={"customInstructions.fr"}
          name={"customInstructions.fr"}
          wordLimit={wordCountLimits.fr}
          label={intl.formatMessage({
            defaultMessage: "Customized instruction text",
            id: "f1Kpkp",
            description: "label for nomination event instructions",
          })}
          appendLanguageToLabel={"fr"}
          rules={{ required: intl.formatMessage(errorMessages.required) }}
          aria-describedby={instructionsDescriptionId}
        />
      </div>
      {watchCommunity && (
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

            <AddDialog
              developmentProgramOptions={filteredDevelopmentProgramOptions}
              onSubmit={(values) => append(values)}
            />

            <>
              {fields.length === 0 ? (
                <Notice.Root
                  color={invalidDevelopmentPrograms ? "error" : "gray"}
                  className="text-center"
                >
                  <Notice.Content>
                    {intl.formatMessage(atLeastOne)}
                  </Notice.Content>
                </Notice.Root>
              ) : (
                <div className="overflow-hidden rounded-md border border-gray-200 dark:border-gray-700">
                  <DevelopmentProgramCard.Root>
                    {fields.map((field, index) => {
                      const developmentProgram = developmentProgramOptions.find(
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
                                {developmentProgram?.description ?? notFound}
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
                              key={field.id}
                              communityDevelopmentProgramId={field.id}
                              developmentProgramOptions={
                                developmentProgramOptions
                              }
                              defaultValues={{
                                value: field.value,
                                description: field.description,
                              }}
                              onSubmit={(values) => update(index, values)}
                              open={editOpen === field.id}
                              setOpen={setEditOpen}
                            />
                          }
                          remove={
                            <RemoveDialog
                              communityDevelopmentProgramId={field.id}
                              title={developmentProgram?.label}
                              onRemove={() => remove(index)}
                              open={removeOpen === field.id}
                              setOpen={setRemoveOpen}
                            />
                          }
                          setEditOpen={setEditOpen}
                          setRemoveOpen={setRemoveOpen}
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
    </>
  );
};

export default UpcomingTalentEventForm;
