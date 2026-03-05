import { useIntl } from "react-intl";
import { useMutation, useQuery } from "urql";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

import {
  FragmentType,
  getFragment,
  graphql,
  ReferralPauseLength,
  Scalars,
} from "@gc-digital-talent/graphql";
import { toast } from "@gc-digital-talent/toast";
import { Button, Dialog, Pending } from "@gc-digital-talent/ui";
import { strToFormDate } from "@gc-digital-talent/date-helpers";
import {
  Checkbox,
  DateInput,
  Select,
  TextArea,
} from "@gc-digital-talent/forms";
import {
  errorMessages,
  sortLocalizedEnumOptions,
  ENUM_SORT_ORDER,
  narrowEnumType,
  commonMessages,
  Locales,
  getLocale,
} from "@gc-digital-talent/i18n";
import { unpackMaybes } from "@gc-digital-talent/helpers";

import { FRENCH_WORDS_PER_ENGLISH_WORD } from "~/constants/talentSearchConstants";

import Footer from "./Footer";

const ApplicationReferralPauseOptions_Query = graphql(/** GraphQL */ `
  query ApplicationReferralPauseOptions {
    referralPauseLengths: localizedEnumOptions(
      enumName: "ReferralPauseLength"
    ) {
      ... on LocalizedReferralPauseLength {
        value
        label {
          localized
        }
      }
    }
  }
`);

const ApplicationPauseReferralDialog_Fragment = graphql(/** GraphQL */ `
  fragment ApplicationPauseReferralDialog on PoolCandidate {
    id
    expiryDate
  }
`);

const ApplicationPauseReferralDialog_Mutation = graphql(/** GraphQL */ `
  mutation pauseCandidateReferral(
    $id: UUID!
    $referralPauseLength: ReferralPauseLength
    $referralUnpauseAt: Date
    $referralPauseReason: String
  ) {
    pauseCandidateReferral(
      id: $id
      referralPauseLength: $referralPauseLength
      referralUnpauseAt: $referralUnpauseAt
      referralPauseReason: $referralPauseReason
    ) {
      id
      referralPauseAt
      referralUnpauseAt
      referralPauseReason
    }
  }
`);

const TEXT_AREA_ROWS = 3;
const TEXT_AREA_MAX_WORDS_EN = 200;

interface FormValues {
  referralPauseStatus: boolean;
  referralPauseLength?: ReferralPauseLength;
  referralUnpauseAt?: Scalars["Date"]["input"];
  referralPauseReason?: string;
}

interface ApplicationPauseReferralDialogProps {
  query: FragmentType<typeof ApplicationPauseReferralDialog_Fragment>;
}

const ApplicationPauseReferralDialog = ({
  query,
}: ApplicationPauseReferralDialogProps) => {
  const intl = useIntl();
  const locale = getLocale(intl);
  const [isOpen, setOpen] = useState<boolean>(false);

  const [{ data: options, fetching, error }] = useQuery({
    query: ApplicationReferralPauseOptions_Query,
  });
  const application = getFragment(
    ApplicationPauseReferralDialog_Fragment,
    query,
  );
  const [, executePauseCandidateReferral] = useMutation(
    ApplicationPauseReferralDialog_Mutation,
  );

  const methods = useForm<FormValues>({
    defaultValues: {
      referralPauseStatus: false,
      referralUnpauseAt: undefined,
    },
  });

  const { watch, handleSubmit: submit, resetField } = methods;
  const pauseStatus = watch("referralPauseStatus");
  const pauseLength = watch("referralPauseLength");

  const handleError = () => {
    toast.error(
      intl.formatMessage({
        defaultMessage: "Failed to update referral pause status",
        id: "xa2D5p",
        description: "Error message for updating referral pause status",
      }),
    );
  };

  const handleSubmit = async (values: FormValues) => {
    await executePauseCandidateReferral({
      id: application.id,
      referralPauseLength: values.referralPauseLength,
      referralUnpauseAt: "",
      referralPauseReason: values.referralPauseReason,
    })
      .then((res) => {
        if (!res.data || res.error) {
          handleError();
          return;
        }

        toast.success(
          intl.formatMessage({
            defaultMessage: "Referral pause status updated successfully",
            id: "LzHJtH",
            description: "Success message for updating referral status",
          }),
        );

        setOpen(false);
      })
      .catch(handleError);
  };

  const notAvailable = intl.formatMessage(commonMessages.notAvailable);

  const referralPauseLengthOptions = sortLocalizedEnumOptions(
    ENUM_SORT_ORDER.REFERRAL_PAUSE_LENGTH,
    narrowEnumType(
      unpackMaybes(options?.referralPauseLengths),
      "ReferralPauseLength",
    ),
  ).map((referralPauseLength) => ({
    value: referralPauseLength.value,
    label: referralPauseLength.label.localized ?? notAvailable,
  }));

  /**
   * Reset all fields when employmentCategory field is changed
   */
  useEffect(() => {
    const resetDirtyField = (name: keyof FormValues) => {
      resetField(name, { keepDirty: false, defaultValue: undefined });
    };

    if (!pauseStatus) {
      resetDirtyField("referralPauseLength");
      resetDirtyField("referralPauseReason");
      resetDirtyField("referralUnpauseAt");
    }

    if (pauseLength !== ReferralPauseLength.Other) {
      resetDirtyField("referralUnpauseAt");
    }
  }, [pauseStatus, pauseLength]);

  const wordCountLimits: Record<Locales, number> = {
    en: TEXT_AREA_MAX_WORDS_EN,
    fr: Math.round(TEXT_AREA_MAX_WORDS_EN * FRENCH_WORDS_PER_ENGLISH_WORD),
  } as const;

  return (
    <Dialog.Root open={isOpen} onOpenChange={setOpen}>
      <Dialog.Trigger>
        <Button mode="text" color="success" className="text-left">
          {intl.formatMessage({
            defaultMessage: "Actively being referred",
            id: "mAtGlT",
            description: "Dialog trigger for pause referral status dialog",
          })}
        </Button>
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Header
          subtitle={intl.formatMessage({
            defaultMessage:
              "Manage when this candidate appears on talent requests.",
            id: "uUOZbw",
            description: "Subtitle for the pause candidate's referral status",
          })}
        >
          {intl.formatMessage({
            defaultMessage: "Pause candidate's referral status",
            id: "n/Y1Ex",
            description:
              "Title for the pause candidate's referral status dialog",
          })}
        </Dialog.Header>
        <Dialog.Body>
          <Pending fetching={fetching} error={error} inline>
            <p className="mb-6">
              {intl.formatMessage({
                defaultMessage:
                  "If you would like to temporarily prevent this candidate from appearing on talent requests, you use the following option.",
                id: "VuXPU8",
                description:
                  "Blurb for the pause candidate's referral status dialog",
              })}
            </p>
            <FormProvider {...methods}>
              <form onSubmit={submit(handleSubmit)}>
                <div className="flex flex-col gap-6">
                  <Checkbox
                    id="referralPauseStatus"
                    name="referralPauseStatus"
                    boundingBox
                    boundingBoxLabel={intl.formatMessage({
                      defaultMessage: "Paused referral status",
                      id: "F/zEUH",
                      description:
                        "Bounding box label for pause referral status checkbox input",
                    })}
                    label={intl.formatMessage({
                      defaultMessage: "Pause candidate referral",
                      id: "Q/Fbat",
                      description:
                        "Label for pause referral status checkbox input",
                    })}
                    rules={{
                      required: intl.formatMessage(errorMessages.required),
                    }}
                  />
                  {pauseStatus && (
                    <>
                      <Select
                        id="referralPauseLength"
                        name="referralPauseLength"
                        options={referralPauseLengthOptions}
                        label={intl.formatMessage({
                          defaultMessage: "Pause length",
                          id: "eUjL9C",
                          description:
                            "Label for pause referral status select input",
                        })}
                        nullSelection={intl.formatMessage({
                          defaultMessage: "Select a pause length",
                          id: "hGBUc+",
                          description:
                            "Null selection for pause referral select input",
                        })}
                        rules={{
                          required: intl.formatMessage(errorMessages.required),
                        }}
                        doNotSort
                      />
                      {pauseLength === ReferralPauseLength.Other && (
                        <DateInput
                          id="referralUnpauseAt"
                          name="referralUnpauseAt"
                          rules={{
                            required: intl.formatMessage(
                              errorMessages.required,
                            ),
                            min: {
                              value: strToFormDate(new Date().toISOString()),
                              message: intl.formatMessage(
                                errorMessages.mustNotBePastExpiryDate,
                              ),
                            },
                            max: {
                              value: strToFormDate(
                                application.expiryDate ?? "",
                              ),
                              message: intl.formatMessage(
                                {
                                  defaultMessage:
                                    "Pause end date cannot be after this candidate’s pool expiry date ({date}).",
                                  id: "rJQmvz",
                                  description:
                                    "Error message for pause referral status end date input",
                                },
                                {
                                  date: strToFormDate(
                                    application.expiryDate ?? notAvailable,
                                  ),
                                },
                              ),
                            },
                          }}
                          legend={intl.formatMessage({
                            defaultMessage: "Pause referral end date",
                            id: "u3ardU",
                            description:
                              "Label for pause referral status end date input",
                          })}
                        />
                      )}
                      <TextArea
                        id="referralPauseReason"
                        name="referralPauseReason"
                        rows={TEXT_AREA_ROWS}
                        wordLimit={wordCountLimits[locale]}
                        label={intl.formatMessage({
                          defaultMessage: "Pause reason",
                          id: "Yo8gFh",
                          description:
                            "Label for pause referral status dialog reason input",
                        })}
                        rules={{
                          required: intl.formatMessage(errorMessages.required),
                        }}
                      />
                    </>
                  )}
                </div>
                <Footer />
              </form>
            </FormProvider>
          </Pending>
        </Dialog.Body>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default ApplicationPauseReferralDialog;
