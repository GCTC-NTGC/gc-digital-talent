import { useState } from "react";
import { useIntl } from "react-intl";
import { useMutation } from "urql";
import { FormProvider, useForm } from "react-hook-form";

import {
  DATE_FORMAT_LOCALIZED,
  formatDate,
  parseDateTimeUtc,
  strToFormDate,
} from "@gc-digital-talent/date-helpers";
import {
  getFragment,
  graphql,
  type FragmentType,
} from "@gc-digital-talent/graphql";
import {
  commonMessages,
  errorMessages,
  formMessages,
} from "@gc-digital-talent/i18n";
import { toast } from "@gc-digital-talent/toast";
import { Button, Chip, Dialog } from "@gc-digital-talent/ui";
import { DateInput } from "@gc-digital-talent/forms";

import FieldDisplay from "~/components/FieldDisplay/FieldDisplay";
import { useStableDate } from "~/hooks/useStableDate";
import talentRequestMessages from "~/messages/talentRequestMessages";
import { followUpDateOverdueInfo } from "~/utils/searchRequestUtils";

const UpdateTalentRequestFollowUpDate_Mutation = graphql(/* GraphQL */ `
  mutation UpdatePoolCandidateSearchRequestFollowUpDate(
    $id: ID!
    $input: UpdatePoolCandidateSearchRequestInput!
  ) {
    updatePoolCandidateSearchRequest(
      id: $id
      poolCandidateSearchRequest: $input
    ) {
      id
      followUpDate
    }
  }
`);

const TalentRequestFollowUpDate_Fragment = graphql(/** GraphQL */ `
  fragment PoolCandidateSearchRequestFollowUpDate on PoolCandidateSearchRequest {
    id
    followUpDate
  }
`);

interface FormValues {
  followUpDate?: string | null;
}

interface TalentRequestFollowUpDateProps {
  query: FragmentType<typeof TalentRequestFollowUpDate_Fragment>;
}

const TalentRequestFollowUpDate = ({
  query,
}: TalentRequestFollowUpDateProps) => {
  const intl = useIntl();
  const now = useStableDate();
  const [isOpen, setOpen] = useState(false);
  const [, executeMutation] = useMutation(
    UpdateTalentRequestFollowUpDate_Mutation,
  );
  const talentRequest = getFragment(TalentRequestFollowUpDate_Fragment, query);
  const followUpDate = talentRequest?.followUpDate
    ? parseDateTimeUtc(talentRequest.followUpDate)
    : null;
  const { isOverdue, daysOverdue } = followUpDateOverdueInfo(followUpDate, now);
  const label = intl.formatMessage(talentRequestMessages.followUpDate);

  const methods = useForm<FormValues>({
    defaultValues: {
      followUpDate: talentRequest.followUpDate
        ? strToFormDate(talentRequest.followUpDate)
        : null,
    },
  });

  const handleSubmit = async (values: FormValues) => {
    const newDate = values.followUpDate ?? null;

    await executeMutation({
      id: talentRequest.id,
      input: { followUpDate: newDate },
    })
      .then((res) => {
        if (res.error || !res.data?.updatePoolCandidateSearchRequest?.id) {
          throw new Error();
        }

        toast.success(
          intl.formatMessage({
            defaultMessage: "Request follow-up date updated.",
            id: "27Z2k7",
            description:
              "Success message displayed when a talent requests follow-up date was updated",
          }),
        );

        methods.resetField("followUpDate", {
          defaultValue: newDate,
        });

        setOpen(false);
      })
      .catch(() => {
        toast.error(
          intl.formatMessage({
            defaultMessage: "Error: Failed to update follow-up date",
            id: "EQfFa1",
            description:
              "Error message displayed when a talent requests follow-up date failed to update",
          }),
        );
      });
  };

  return (
    <FieldDisplay label={label} className="mb-3">
      <span className="flex gap-2">
        <Dialog.Root open={isOpen} onOpenChange={setOpen}>
          <Dialog.Trigger>
            <Button mode="inline" color={isOverdue ? "error" : "primary"}>
              {followUpDate
                ? formatDate({
                    date: followUpDate,
                    formatString: DATE_FORMAT_LOCALIZED,
                    intl,
                  })
                : intl.formatMessage(commonMessages.notProvided)}
            </Button>
          </Dialog.Trigger>
          <Dialog.Content>
            <Dialog.Header>{label}</Dialog.Header>
            <Dialog.Body>
              <FormProvider {...methods}>
                <form onSubmit={methods.handleSubmit(handleSubmit)}>
                  <DateInput
                    id="followUpDate"
                    name="followUpDate"
                    legend={label}
                    round="floor"
                    rules={{
                      required: intl.formatMessage(errorMessages.required),
                    }}
                  />
                  <Dialog.Footer>
                    <Button type="submit">
                      {intl.formatMessage(formMessages.saveChanges)}
                    </Button>
                    <Dialog.Close>
                      <Button type="button" color="warning" mode="inline">
                        {intl.formatMessage(commonMessages.cancel)}
                      </Button>
                    </Dialog.Close>
                  </Dialog.Footer>
                </form>
              </FormProvider>
            </Dialog.Body>
          </Dialog.Content>
        </Dialog.Root>
        {isOverdue && (
          <Chip color="error">
            {intl.formatMessage(commonMessages.overdueDate, { daysOverdue })}
          </Chip>
        )}
      </span>
    </FieldDisplay>
  );
};

export default TalentRequestFollowUpDate;
