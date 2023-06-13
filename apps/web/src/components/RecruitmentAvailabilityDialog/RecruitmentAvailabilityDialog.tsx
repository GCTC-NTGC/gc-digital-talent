import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useIntl } from "react-intl";

import { Dialog, Button } from "@gc-digital-talent/ui";
import { RadioGroup } from "@gc-digital-talent/forms";
import { toast } from "@gc-digital-talent/toast";

import {
  PoolCandidate,
  useChangeApplicationSuspendedAtMutation,
} from "~/api/generated";
import { fullPoolTitle } from "~/utils/poolUtils";

interface RecruitmentAvailabilityDialogProps {
  candidate: PoolCandidate;
}

type FormValues = {
  isSuspended: "true" | "false"; // Note: RadioGroup only accepts strings
};

const RecruitmentAvailabilityDialog = ({
  candidate,
}: RecruitmentAvailabilityDialogProps) => {
  const intl = useIntl();
  const [, executeMutation] = useChangeApplicationSuspendedAtMutation();
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const isSuspended = !!candidate.suspendedAt;
  const title = fullPoolTitle(intl, candidate.pool);

  const methods = useForm<FormValues>({
    defaultValues: { isSuspended: isSuspended ? "false" : "true" },
  });
  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const updateSuspendedAtStatus = async (values: FormValues) => {
    await executeMutation({
      id: candidate.id,
      isSuspended: values.isSuspended === "true",
    })
      .then((res) => {
        if (!res.error) {
          setIsOpen(false);
          toast.success(
            intl.formatMessage({
              defaultMessage: "You have been removed from the search results.",
              id: "PoFTwr",
              description:
                "Alert displayed to the user when application card dialog submits successfully.",
            }),
          );
        }
      })
      .catch(() => {
        toast.error(
          intl.formatMessage({
            defaultMessage: "Error: failed removing you from search results.",
            id: "7tdU/G",
            description:
              "Alert displayed to the user when application card dialog fails.",
          }),
        );
      });
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger>
        <Button mode="inline" color="black">
          {intl.formatMessage({
            defaultMessage: "Change your availability",
            id: "YW6HNZ",
            description:
              "Button text to open form to change availability in a recruitment",
          })}
        </Button>
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Header>
          {intl.formatMessage(
            {
              defaultMessage: "Change your availability in {title}",
              id: "87rS5g",
              description:
                "Header text for dialog to change availability in a recruitment",
            },
            {
              title: title.html,
            },
          )}
        </Dialog.Header>
        <Dialog.Body>
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(updateSuspendedAtStatus)}>
              <p data-h2-margin-bottom="base(x1)">
                {intl.formatMessage({
                  defaultMessage:
                    "As a successful member of the <strong>{title}</strong> recruitment process, you may be contacted about relevant opportunities.",
                  id: "mHTt67",
                  description:
                    "Text describing what it means to be available in a recruitment",
                })}
              </p>
              <p data-h2-margin-bottom="base(x1)">
                {intl.formatMessage({
                  defaultMessage:
                    "If you've recently taken a job or simply no longer want to be considered for opportunities, you can disable your availability in this recruitment process. <strong>This will <emphasize>not</emphasize> remove you from the recruitment</strong> itself and you can always re-enable your availability if you change your mind.",
                  id: "3AwFyW",
                  description:
                    "Text describing what it means to disable your availability and that you can reverse the decision",
                })}
              </p>
              <RadioGroup
                legend={intl.formatMessage({
                  defaultMessage: "Your availability",
                  id: "jaMIil",
                  description:
                    "Label for available for opportunities radio group",
                })}
                idPrefix="availability"
                id="isSuspended"
                name="isSuspended"
                items={[
                  {
                    label: intl.formatMessage({
                      defaultMessage:
                        "I am <strong>available</strong> for hire and want to be contacted about opportunities from this recruitment process.",
                      id: "cAOf3a",
                      description:
                        "Radio button label for available for opportunities option",
                    }),
                    value: "true",
                  },
                  {
                    label: intl.formatMessage({
                      defaultMessage:
                        "I am <strong>unavailable</strong> and do not want to be contacted about opportunities from this recruitment process.",
                      id: "1mYPEx",
                      description:
                        "Radio button label for not available for opportunities option",
                    }),
                    value: "false",
                  },
                ]}
              />
              <Dialog.Footer>
                <Dialog.Close>
                  <Button mode="inline" color="secondary">
                    {intl.formatMessage({
                      defaultMessage: "Cancel",
                      id: "yFIC7K",
                      description: "Label for close availability dialog.",
                    })}
                  </Button>
                </Dialog.Close>
                <Button type="submit" disabled={isSubmitting}>
                  {intl.formatMessage({
                    defaultMessage: "Save availability",
                    id: "nDm9dX",
                    description:
                      "Button text to save availability in a recruitment",
                  })}
                </Button>
              </Dialog.Footer>
            </form>
          </FormProvider>
        </Dialog.Body>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default RecruitmentAvailabilityDialog;
