import { useState } from "react";
import { useIntl } from "react-intl";
import { useMutation } from "urql";
import { FormProvider, useForm } from "react-hook-form";

import { strToFormDate } from "@gc-digital-talent/date-helpers";
import type { FragmentType } from "@gc-digital-talent/graphql";
import {
  getFragment,
  graphql,
  CommunityReferralStatus,
} from "@gc-digital-talent/graphql";
import {
  commonMessages,
  errorMessages,
  formMessages,
  uiMessages,
} from "@gc-digital-talent/i18n";
import { toast } from "@gc-digital-talent/toast";
import { Button, Dialog, Link } from "@gc-digital-talent/ui";
import {
  DateInput,
  RadioGroup,
  Select,
  TextArea,
} from "@gc-digital-talent/forms";

import useRoutes from "~/hooks/useRoutes";
import { getFullNameLabel } from "~/utils/nameUtils";
import poolCandidateMessages from "~/messages/poolCandidateMessages";

import { messages } from "../../messages";

const CommunityReferralStatusDialog_Fragment = graphql(/* GraphQL */ `
  fragment CommunityReferralStatusDialog on CommunityInterest {
    id
    user {
      id
      firstName
      lastName
    }
    referralStatus {
      status {
        value
        label {
          localized
        }
      }
      followUpDate
      classification {
        id
        displayName
      }
      notes
    }
  }
`);

const UpdateCommunityInterestReferralStatus_Mutation = graphql(/* GraphQL */ `
  mutation UpdateCommunityInterestReferralStatus(
    $communityInterestReferral: UpdateCommunityInterestReferralStatusInput!
  ) {
    updateCommunityInterestReferralStatus(
      communityInterestReferral: $communityInterestReferral
    ) {
      id
      ...CommunityReferralStatusDialog
    }
  }
`);

interface FormValues {
  status?: CommunityReferralStatus;
  classification?: string;
  followUpDate?: string | null;
  notes?: string;
}

interface CommunityReferralStatusDialogProps {
  query: FragmentType<typeof CommunityReferralStatusDialog_Fragment>;
  classifications: { id: string; displayName?: string | null }[];
}

const CommunityReferralStatusDialog = ({
  query,
  classifications,
}: CommunityReferralStatusDialogProps) => {
  const intl = useIntl();
  const paths = useRoutes();
  const [isOpen, setOpen] = useState(false);
  const [{ fetching }, executeMutation] = useMutation(
    UpdateCommunityInterestReferralStatus_Mutation,
  );
  const communityInterest = getFragment(
    CommunityReferralStatusDialog_Fragment,
    query,
  );
  const { user, referralStatus } = communityInterest;
  const userName = getFullNameLabel(user.firstName, user.lastName, intl);

  const methods = useForm<FormValues>({
    defaultValues: {
      status: referralStatus.status.value,
      classification: referralStatus.classification?.id,
      followUpDate: referralStatus.followUpDate
        ? strToFormDate(referralStatus.followUpDate)
        : null,
      notes: referralStatus.notes ?? "",
    },
  });
  const { watch, reset } = methods;
  const status = watch("status");

  const handleOpenChange = (open: boolean) => {
    setOpen(open);
    if (!open) {
      reset();
    }
  };

  const handleSubmit = async (values: FormValues) => {
    if (!values.status || fetching) return;

    const isAvailable =
      values.status === CommunityReferralStatus.AvailableForReferral;

    await executeMutation({
      communityInterestReferral: {
        id: communityInterest.id,
        status: values.status,
        followUpDate:
          values.status === CommunityReferralStatus.NotReferred
            ? null
            : (values.followUpDate ?? null),
        // NOTE: we do want to treat an empty string as unset
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
        notes: values.notes || null,
        classification: isAvailable
          ? { connect: values.classification }
          : undefined,
      },
    })
      .then((res) => {
        if (res.error || !res.data?.updateCommunityInterestReferralStatus?.id) {
          throw new Error();
        }

        toast.success(
          intl.formatMessage({
            defaultMessage: "Community referral status updated successfully",
            id: "hhCkpd",
            description:
              "Success message displayed when a community interest's referral status is updated",
          }),
        );
        handleOpenChange(false);
      })
      .catch(() => {
        toast.error(
          intl.formatMessage({
            defaultMessage: "Error: Failed to update community referral status",
            id: "7JwBrE",
            description:
              "Error message displayed when a community interest's referral status fails to update",
          }),
        );
      });
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={handleOpenChange}>
      <Dialog.Trigger>
        <Button mode="inline">{userName}</Button>
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Header
          subtitle={intl.formatMessage({
            defaultMessage:
              "Manage this employee's visibility in requests submitted to this community",
            id: "u2EsqC",
            description: "Subtitle for the community referral status dialog",
          })}
        >
          {intl.formatMessage({
            defaultMessage: "Change community referral status",
            id: "9qVtmg",
            description: "Title for the community referral status dialog",
          })}
        </Dialog.Header>
        <Dialog.Body>
          <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(handleSubmit)}>
              <div className="flex flex-col gap-6">
                <RadioGroup
                  idPrefix="communityReferralStatus"
                  name="status"
                  legend={intl.formatMessage(messages.communityReferralStatus)}
                  rules={{
                    required: intl.formatMessage(errorMessages.required),
                  }}
                  context={
                    status === CommunityReferralStatus.New
                      ? intl.formatMessage({
                          defaultMessage: "Please select a status to continue.",
                          id: "Z1JAqo",
                          description:
                            "Notice shown when a community interest's referral status has not yet been reviewed",
                        })
                      : undefined
                  }
                  items={[
                    {
                      value: CommunityReferralStatus.Pending,
                      label: intl.formatMessage({
                        defaultMessage: "Pending",
                        id: "SYs9hG",
                        description: "Community referral status: pending",
                      }),
                      contentBelow: intl.formatMessage({
                        defaultMessage:
                          "Employee's information is currently under review",
                        id: "vLwOT+",
                        description:
                          "Description of the pending community referral status",
                      }),
                    },
                    {
                      value: CommunityReferralStatus.AvailableForReferral,
                      label: intl.formatMessage(
                        poolCandidateMessages.availableForReferral,
                      ),
                      contentBelow: intl.formatMessage({
                        defaultMessage:
                          "Employee will appear on matching talent requests",
                        id: "h8K/RQ",
                        description:
                          "Description of the available for referral community referral status",
                      }),
                    },
                    {
                      value: CommunityReferralStatus.NotReferred,
                      label: intl.formatMessage(commonMessages.notReferred),
                      contentBelow: intl.formatMessage({
                        defaultMessage:
                          "Employee won't appear on any talent requests",
                        id: "jES7+O",
                        description:
                          "Description of the not referred community referral status",
                      }),
                    },
                  ]}
                />
                {status === CommunityReferralStatus.AvailableForReferral && (
                  <Select
                    id="classification"
                    name="classification"
                    label={intl.formatMessage({
                      defaultMessage: "Community classification",
                      id: "3rkuAy",
                      description:
                        "Label for the community classification select",
                    })}
                    nullSelection={intl.formatMessage(
                      uiMessages.nullSelectionOption,
                    )}
                    rules={{
                      required: intl.formatMessage(errorMessages.required),
                    }}
                    options={classifications.map((classification) => ({
                      value: classification.id,
                      label: classification.displayName ?? classification.id,
                    }))}
                  />
                )}
                {status !== CommunityReferralStatus.NotReferred &&
                  status !== CommunityReferralStatus.New && (
                    <div className="flex flex-col gap-3">
                      <p>
                        {status === CommunityReferralStatus.Pending
                          ? intl.formatMessage({
                              defaultMessage:
                                "Add a follow-up date to review this employee's membership to this community.",
                              id: "bIA6Ty",
                              description:
                                "Context for the follow-up date field when the community referral status is pending",
                            })
                          : intl.formatMessage({
                              defaultMessage:
                                "Add a follow-up date to review this employee's information.",
                              id: "TB/Yuy",
                              description:
                                "Context for the follow-up date field when the community referral status is available for referral",
                            })}
                      </p>
                      <DateInput
                        id="followUpDate"
                        name="followUpDate"
                        legend={intl.formatMessage(commonMessages.followUpDate)}
                        rules={{
                          required: intl.formatMessage(errorMessages.required),
                        }}
                      />
                    </div>
                  )}
                {status !== CommunityReferralStatus.New && (
                  <TextArea
                    id="notes"
                    name="notes"
                    label={intl.formatMessage({
                      defaultMessage: "Additional notes",
                      id: "3dRAA0",
                      description:
                        "Label for the community referral status additional notes field",
                    })}
                    rules={{
                      required:
                        status === CommunityReferralStatus.NotReferred
                          ? intl.formatMessage(errorMessages.required)
                          : undefined,
                    }}
                  />
                )}
              </div>
              <Dialog.Footer>
                <Button type="submit">
                  {intl.formatMessage(formMessages.saveChanges)}
                </Button>
                <Dialog.Close>
                  <Button type="button" color="warning" mode="inline">
                    {intl.formatMessage(commonMessages.cancel)}
                  </Button>
                </Dialog.Close>
                <Link
                  href={paths.userEmployeeProfile(user.id)}
                  mode="inline"
                  newTab
                >
                  {intl.formatMessage(commonMessages.viewProfile)}
                </Link>
              </Dialog.Footer>
            </form>
          </FormProvider>
        </Dialog.Body>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default CommunityReferralStatusDialog;
