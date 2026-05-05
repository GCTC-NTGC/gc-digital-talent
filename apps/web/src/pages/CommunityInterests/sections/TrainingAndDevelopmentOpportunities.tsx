import { useState } from "react";
import { useIntl } from "react-intl";
import RectangleGroupIcon from "@heroicons/react/24/outline/RectangleGroupIcon";
import type { SubmitHandler } from "react-hook-form";
import { FormProvider, useForm, useFormContext } from "react-hook-form";

import {
  Chip,
  Chips,
  Dialog,
  Heading,
  Button,
  Link,
} from "@gc-digital-talent/ui";
import { commonMessages, errorMessages } from "@gc-digital-talent/i18n";
import type { FragmentType } from "@gc-digital-talent/graphql";
import {
  DevelopmentProgramParticipationStatus,
  getFragment,
  graphql,
} from "@gc-digital-talent/graphql";
import { sortAlphaBy, unpackMaybes } from "@gc-digital-talent/helpers";
import { RadioGroup, Select } from "@gc-digital-talent/forms";

import { getClassificationName } from "~/utils/poolUtils";
import { getDateRange } from "~/utils/dateUtils";
import useRoutes from "~/hooks/useRoutes";
import DevelopmentProgramCard from "~/components/DevelopmentProgramCard/DevelopmentProgramCard";
import experienceMessages from "~/messages/experienceMessages";

import type { FormValues } from "../form";

const TrainingAndDevelopmentOpportunitiesOptions_Fragment = graphql(
  /* GraphQL */ `
    fragment TrainingAndDevelopmentOpportunitiesOptions_Fragment on Query {
      communities {
        id
        associatedDevelopmentPrograms {
          id
          name {
            localized
          }
          descriptionForProfile {
            localized
          }
          eligibleClassifications {
            id
            group
            level
          }
        }
      }
    }
  `,
);

export const DevelopmentProgramUserTrainingAndDevelopmentOpportunities_Fragment =
  graphql(/* GraphQL */ `
    fragment DevelopmentProgramUserRecordsTrainingAndDevelopmentOpportunitiesFragment on DevelopmentProgramUser {
      id
      developmentProgram {
        id
      }
      educationExperience {
        id
      }
      participationStatus
    }
  `);

export interface SubformValues {
  interestInDevelopmentPrograms:
    | {
        developmentProgramId: string | null;
        participationStatus: DevelopmentProgramParticipationStatus | null;
        educationExperienceId: string | null;
      }[]
    | null;
}

interface TrainingAndDevelopmentOpportunitiesProps {
  selectedCommunityId: string;
  optionsQuery: FragmentType<
    typeof TrainingAndDevelopmentOpportunitiesOptions_Fragment
  >;
  formDisabled: boolean;
  developmentProgramUserRecordsQuery: FragmentType<
    typeof DevelopmentProgramUserTrainingAndDevelopmentOpportunities_Fragment
  >[];
  educationExperiences: {
    id: string;
    institution?: string | null;
    areaOfStudy?: string | null;
    startDate?: string | null;
    endDate?: string | null;
    type?: { label?: { localized?: string | null } | null } | null;
    skills?: { id: string }[] | null;
  }[];
}

interface DialogFormValues {
  experienceId: string;
}

const TrainingAndDevelopmentOpportunities = ({
  selectedCommunityId,
  optionsQuery,
  formDisabled,
  developmentProgramUserRecordsQuery,
  educationExperiences,
}: TrainingAndDevelopmentOpportunitiesProps) => {
  const intl = useIntl();
  const paths = useRoutes();

  const [dialogOpenForIndex, setDialogOpenForIndex] = useState<number | null>(
    null,
  );
  const dialogFormMethods = useForm<DialogFormValues>();

  const optionsData = getFragment(
    TrainingAndDevelopmentOpportunitiesOptions_Fragment,
    optionsQuery,
  );

  const developmentProgramUserRecords = getFragment(
    DevelopmentProgramUserTrainingAndDevelopmentOpportunities_Fragment,
    developmentProgramUserRecordsQuery,
  );
  const developmentProgramUserRecordsUnpacked = unpackMaybes(
    developmentProgramUserRecords,
  );
  const arrayOfDefaultValues: {
    developmentProgramId: string;
    participationStatus?:
      | DevelopmentProgramParticipationStatus
      | null
      | undefined;
  }[] = developmentProgramUserRecordsUnpacked.map((record) => {
    return {
      developmentProgramId: record.developmentProgram.id,
      participationStatus: record.participationStatus,
    };
  });

  const { watch, register, setValue } = useFormContext<FormValues>();
  const [selectedInterestInDevelopmentPrograms] = watch([
    "interestInDevelopmentPrograms",
  ]);

  const developmentPrograms =
    optionsData.communities.find(
      (community) => community?.id === selectedCommunityId,
    )?.associatedDevelopmentPrograms ?? [];

  // sort programs
  developmentPrograms.sort(
    sortAlphaBy((developmentProgram) => developmentProgram.name?.localized),
  );

  developmentPrograms.forEach((developmentProgram) => {
    if (developmentProgram.eligibleClassifications) {
      developmentProgram.eligibleClassifications.sort((a, b) =>
        getClassificationName(a, intl).localeCompare(
          getClassificationName(b, intl),
        ),
      );
    }
  });

  const openLinkDialog = (index: number) => {
    const currentId =
      selectedInterestInDevelopmentPrograms?.[index]?.educationExperienceId ??
      "";
    dialogFormMethods.reset({ experienceId: currentId });
    setDialogOpenForIndex(index);
  };

  const handleLinkExperience: SubmitHandler<DialogFormValues> = (
    dialogValues,
  ) => {
    if (dialogOpenForIndex !== null) {
      setValue(
        `interestInDevelopmentPrograms.${dialogOpenForIndex}.educationExperienceId`,
        dialogValues.experienceId,
      );
    }
    setDialogOpenForIndex(null);
  };

  const handleRemoveExperience = (index: number) => {
    setValue(
      `interestInDevelopmentPrograms.${index}.educationExperienceId`,
      null,
    );
  };

  const getLinkedExperience = (experienceId: string | null | undefined) => {
    if (!experienceId) return null;
    return educationExperiences.find((e) => e.id === experienceId) ?? null;
  };

  const subtitle = intl.formatMessage({
    defaultMessage:
      "Link an education or certificate experience to a professionalization",
    id: "mjhQ02",
    description:
      "Subtitle for the provincial program license dialog in the training and development opportunities section",
  });

  const getSelectLabel = (exp: {
    institution?: string | null;
    areaOfStudy?: string | null;
  }) =>
    [exp.institution, exp.areaOfStudy].filter(Boolean).join(" – ") ||
    intl.formatMessage(commonMessages.notProvided);

  return (
    <div className="flex flex-col gap-7.5">
      {/* heading and description */}
      <div className="flex flex-col gap-6">
        <Heading
          level="h2"
          icon={RectangleGroupIcon}
          color="secondary"
          className="mt-0 font-normal"
        >
          {intl.formatMessage({
            defaultMessage: "Training and development opportunities",
            id: "I5K1zI",
            description:
              "Heading for the 'Training and development opportunities' section",
          })}
        </Heading>
        <p>
          {intl.formatMessage({
            defaultMessage:
              "Most functional communities offer various programs for learning and development. These programs might have specific eligibility requirements based on your experience, classification, or other qualifications. Expressing interest in these opportunities isn't an application, but it allows HR and recruitment staff to verify your interest in case you've been nominated for a training or development opportunity.",
            id: "2HNbTn",
            description:
              "Description of the 'Training and development opportunities' section",
          })}
        </p>
      </div>
      {/* list of programs */}
      <div className="flex flex-col gap-9">
        {developmentPrograms.map((developmentProgram, index) => (
          <div key={developmentProgram.id} className="flex flex-col gap-6">
            {/* titles */}
            <div>
              <Heading level="h3" size="h6" className="m-0 font-bold">
                {developmentProgram.name?.localized ??
                  intl.formatMessage(commonMessages.notProvided)}
              </Heading>
              <p>
                {developmentProgram.descriptionForProfile?.localized ??
                  intl.formatMessage(commonMessages.notProvided)}
              </p>
            </div>
            {/* classification list */}
            {developmentProgram?.eligibleClassifications?.length ? (
              <div className="flex gap-1.5">
                <span>
                  {intl.formatMessage({
                    defaultMessage: "Available to",
                    id: "nCqQlv",
                    description: "Title for the classification list",
                  })}
                  {intl.formatMessage(commonMessages.dividingColon)}
                </span>
                <Chips>
                  {unpackMaybes(
                    developmentProgram?.eligibleClassifications,
                  ).map((classification) => (
                    <Chip key={classification.id} color="secondary">
                      {getClassificationName(classification, intl)}
                    </Chip>
                  ))}
                </Chips>
              </div>
            ) : null}

            <input
              type="hidden"
              {...register(
                `interestInDevelopmentPrograms.${index}.developmentProgramId`,
              )}
              value={developmentProgram.id}
            />
            <input
              type="hidden"
              {...register(
                `interestInDevelopmentPrograms.${index}.educationExperienceId`,
              )}
            />
            <RadioGroup
              idPrefix={`interestInDevelopmentPrograms.${index}.participationStatus`}
              name={`interestInDevelopmentPrograms.${index}.participationStatus`}
              legend={intl.formatMessage(
                {
                  defaultMessage:
                    "Program participation<hidden> for {name}</hidden>",
                  id: "c667HQ",
                  description:
                    "Legend for the radio group of program participation",
                },
                {
                  name:
                    developmentProgram.name?.localized ??
                    intl.formatMessage(commonMessages.notProvided),
                },
              )}
              items={[
                {
                  value: DevelopmentProgramParticipationStatus.NotInterested,
                  label: intl.formatMessage({
                    defaultMessage: "I’m not interested right now.",
                    id: "gg0yRf",
                    description:
                      "Option for the 'not interested' choice of program participation",
                  }),
                },
                {
                  value: DevelopmentProgramParticipationStatus.Interested,
                  label: intl.formatMessage({
                    defaultMessage:
                      "I’m interested in participating in this program.",
                    id: "r6WWEn",
                    description:
                      "Option for the 'interested' choice of program participation",
                  }),
                },
                {
                  value: DevelopmentProgramParticipationStatus.Completed,
                  label: intl.formatMessage({
                    defaultMessage: "I’ve successfully completed this program.",
                    id: "tGTM5i",
                    description:
                      "Option for the 'completed' choice of program participation",
                  }),
                },
                {
                  value: DevelopmentProgramParticipationStatus.Enrolled,
                  label: intl.formatMessage({
                    defaultMessage: "I’m currently enrolled in this program.",
                    id: "oYEBcP",
                    description:
                      "Option for the 'enrolled' choice of program participation",
                  }),
                },
              ]}
              disabled={formDisabled}
              defaultSelected={
                arrayOfDefaultValues.find(
                  (array) =>
                    array.developmentProgramId === developmentProgram.id,
                )?.participationStatus ?? undefined
              }
            />
            {selectedInterestInDevelopmentPrograms?.[index]
              ?.participationStatus ===
            DevelopmentProgramParticipationStatus.Completed ? (
              <>
                {(() => {
                  const linkedExp = getLinkedExperience(
                    selectedInterestInDevelopmentPrograms[index]
                      ?.educationExperienceId,
                  );
                  return linkedExp ? (
                    <DevelopmentProgramCard.Root>
                      <DevelopmentProgramCard.Item
                        title={
                          linkedExp.areaOfStudy ??
                          linkedExp.institution ??
                          intl.formatMessage(commonMessages.notProvided)
                        }
                        titleHref={`${paths.careerTimeline()}#experience-${linkedExp.id}`}
                        institution={linkedExp.institution ?? undefined}
                        description=""
                        dateRange={
                          getDateRange({
                            startDate: linkedExp.startDate,
                            endDate: linkedExp.endDate,
                            intl,
                          }) || undefined
                        }
                        skillCount={linkedExp.skills?.length}
                        experienceType={
                          linkedExp.type?.label?.localized ??
                          intl.formatMessage(experienceMessages.education)
                        }
                        iconLabel={intl.formatMessage({
                          defaultMessage: "Edit linked education experience",
                          id: "zHKvoY",
                          description:
                            "Accessibility label for the edit/remove dropdown on a linked education experience",
                        })}
                        edit={
                          <button
                            type="button"
                            onClick={() => openLinkDialog(index)}
                          >
                            {intl.formatMessage({
                              defaultMessage: "Swap experience",
                              id: "NaFYXo",
                              description:
                                "Button to swap the linked education experience for a development program",
                            })}
                          </button>
                        }
                        remove={
                          <button
                            type="button"
                            onClick={() => handleRemoveExperience(index)}
                          >
                            {intl.formatMessage({
                              defaultMessage: "Remove experience",
                              id: "Cxy9bi",
                              description:
                                "Button to remove the linked education experience from a development program",
                            })}
                          </button>
                        }
                      />
                    </DevelopmentProgramCard.Root>
                  ) : (
                    <div className="flex gap-3">
                      <Button
                        type="button"
                        onClick={() => openLinkDialog(index)}
                      >
                        {intl.formatMessage({
                          defaultMessage: "Link existing experience",
                          id: "g6QXmz",
                          description:
                            "Button to open the dialog to link an education experience to a development program",
                        })}
                      </Button>
                      <Link
                        href={paths.createExperience()}
                        newTab
                        mode="inline"
                        color="secondary"
                      >
                        {intl.formatMessage(
                          experienceMessages.addNewExperience,
                        )}
                      </Link>
                    </div>
                  );
                })()}
              </>
            ) : null}
          </div>
        ))}
      </div>
      <Dialog.Root
        open={dialogOpenForIndex !== null}
        onOpenChange={(open) => {
          if (!open) setDialogOpenForIndex(null);
        }}
      >
        <Dialog.Content>
          <Dialog.Header subtitle={subtitle}>
            {intl.formatMessage({
              defaultMessage: "Provincial Program License",
              id: "WWh3KI",
              description:
                "Dialog header for linking a provincial program license to a development program",
            })}
          </Dialog.Header>
          <Dialog.Body>
            <div className="flex flex-col gap-4">
            <p>
              {intl.formatMessage({
                defaultMessage:
                  'By selecting the professionalization from your education and certificate experience, you can help recruiters and hiring managers quickly understand your standing. If you haven\'t added this professionalization to your career experience yet, you can do so using the " Add new experience " button.',
                id: "jaGVck",
                description:
                  "Body text in the provincial program license dialog explaining how to link an education experience",
              })}
            </p>
            {dialogOpenForIndex !== null &&
              developmentPrograms[dialogOpenForIndex]?.descriptionForProfile
                ?.localized && (
                <p className="rounded-[10px] border border-gray-700 bg-gray-100/20 p-4 text-sm dark:border-gray-100">
                  {
                    developmentPrograms[dialogOpenForIndex].descriptionForProfile
                      ?.localized
                  }
                </p>
              )}
            <FormProvider {...dialogFormMethods}>
              <form
                onSubmit={(e) => {
                  e.stopPropagation();
                  return dialogFormMethods.handleSubmit(handleLinkExperience)(
                    e,
                  );
                }}
              >
                {educationExperiences.length > 0 ? (
                  <Select
                    id="experienceId"
                    name="experienceId"
                    label={intl.formatMessage({
                      defaultMessage:
                        "Select education or certificate experience",
                      id: "PbUHEk",
                      description:
                        "Label for the education experience dropdown in the link experience dialog",
                    })}
                    nullSelection={intl.formatMessage({
                      defaultMessage: "Select an option",
                      id: "c+HfTe",
                      description:
                        "Placeholder option for the education experience select",
                    })}
                    rules={{
                      required: intl.formatMessage(errorMessages.required),
                    }}
                    options={educationExperiences.map((exp) => ({
                      value: exp.id,
                      label: getSelectLabel(exp),
                    }))}
                  />
                ) : (
                  <p>
                    {intl.formatMessage({
                      defaultMessage:
                        "You don't have any education experiences yet.",
                      id: "/0vaTK",
                      description:
                        "Message shown when there are no education experiences to link to a development program",
                    })}
                  </p>
                )}
                <Dialog.Footer>
                  {educationExperiences.length > 0 && (
                    <Button type="submit" color="primary">
                      {intl.formatMessage({
                        defaultMessage: "Link experience",
                        id: "jgysHD",
                        description:
                          "Button to confirm linking the selected education experience to a development program",
                      })}
                    </Button>
                  )}
                  <Dialog.Close>
                    <Button mode="inline" color="warning">
                      {intl.formatMessage(commonMessages.cancel)}
                    </Button>
                  </Dialog.Close>
                </Dialog.Footer>
              </form>
            </FormProvider>
            </div>
          </Dialog.Body>
        </Dialog.Content>
      </Dialog.Root>
    </div>
  );
};

export default TrainingAndDevelopmentOpportunities;
