import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useIntl } from "react-intl";
import { useMutation } from "urql";

import { Dialog, Button } from "@gc-digital-talent/ui";
import { RadioGroup } from "@gc-digital-talent/forms";
import { toast } from "@gc-digital-talent/toast";
import { commonMessages } from "@gc-digital-talent/i18n";
import { FragmentType, getFragment, graphql } from "@gc-digital-talent/graphql";

import { poolTitle } from "~/utils/poolUtils";

interface FormValues {
  isSuspended: "true" | "false"; // Note: RadioGroup only accepts strings
}

const RecruitmentAvailabilityChangeSuspendedAt_Mutation = graphql(
  /* GraphQL */ `
    mutation Name($id: ID!, $isSuspended: Boolean!) {
      changeApplicationSuspendedAt(id: $id, isSuspended: $isSuspended) {
        id
        suspendedAt
      }
    }
  `,
);

const RecruitmentAvailabilityDialog_Fragment = graphql(/* GraphQL */ `
  fragment RecruitmentAvailabilityDialog on PoolCandidate {
    id
    suspendedAt
    pool {
      id
      workStream {
        id
        name {
          en
          fr
        }
      }
      publishingGroup {
        value
        label {
          en
          fr
        }
      }
      name {
        en
        fr
      }
      classification {
        id
        group
        level
      }
    }
  }
`);

interface RecruitmentAvailabilityDialogProps {
  candidateQuery: FragmentType<typeof RecruitmentAvailabilityDialog_Fragment>;
}

const RecruitmentAvailabilityDialog = ({
  candidateQuery,
}: RecruitmentAvailabilityDialogProps) => {
  const intl = useIntl();
  const candidate = getFragment(
    RecruitmentAvailabilityDialog_Fragment,
    candidateQuery,
  );
  const [, executeMutation] = useMutation(
    RecruitmentAvailabilityChangeSuspendedAt_Mutation,
  );
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const isSuspended = !!candidate.suspendedAt;
  const title = poolTitle(intl, {
    workStream: candidate.pool.workStream,
    name: candidate.pool.name,
    publishingGroup: candidate.pool.publishingGroup,
    classification: candidate.pool.classification,
  });

  const methods = useForm<FormValues>({
    defaultValues: { isSuspended: isSuspended ? "true" : "false" },
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
          if (values.isSuspended === "true") {
            toast.success(
              intl.formatMessage({
                defaultMessage:
                  "You have been removed from the search results.",
                id: "PoFTwr",
                description:
                  "Alert displayed to the user when application card dialog submits successfully.",
              }),
            );
          } else {
            toast.success(
              intl.formatMessage({
                defaultMessage:
                  "You have been added back into the search results.",
                id: "lB/SWR",
                description:
                  "Alert displayed to the user when they updated something to appear in search results again.",
              }),
            );
          }
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
        <Button
          mode="inline"
          color="black"
          fontSize="caption"
          aria-label={intl.formatMessage(
            {
              defaultMessage: "Change your availability for {title}.",
              id: "K8PP2Y",
              description:
                "Button text to open form to change availability in a specific recruitment",
            },
            {
              title: title.label,
            },
          )}
        >
          {intl.formatMessage({
            defaultMessage: "Change your availability",
            id: "33wMLU",
            description:
              "Button text to open form to change availability in a generic recruitment",
          })}
        </Button>
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Header>
          {intl.formatMessage({
            defaultMessage:
              "Change your availability in this recruitment process",
            id: "OF7SCg",
            description:
              "Header text for dialog to change availability in a recruitment",
          })}
        </Dialog.Header>
        <Dialog.Body>
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(updateSuspendedAtStatus)}>
              <p data-h2-margin-bottom="base(x1)">
                {intl.formatMessage(
                  {
                    defaultMessage:
                      "As a successful member of the <strong>{title}</strong> recruitment process, you may be contacted about relevant opportunities.",
                    id: "mHTt67",
                    description:
                      "Text describing what it means to be available in a recruitment",
                  },
                  {
                    title: title.html,
                  },
                )}
              </p>
              <p data-h2-margin-bottom="base(x1)">
                {intl.formatMessage({
                  defaultMessage:
                    "If you've recently taken a job or simply no longer want to be considered for opportunities, you can disable your availability in this recruitment process. <strong>This will <emphasize>not</emphasize> remove you from the process</strong> itself and you can always re-enable your availability if you change your mind.",
                  id: "rR252Q",
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
                    value: "false",
                  },
                  {
                    label: intl.formatMessage({
                      defaultMessage:
                        "I am <strong>unavailable</strong> and do not want to be contacted about opportunities from this recruitment process.",
                      id: "1mYPEx",
                      description:
                        "Radio button label for not available for opportunities option",
                    }),
                    value: "true",
                  },
                ]}
              />
              <Dialog.Footer>
                <Button type="submit" disabled={isSubmitting} color="secondary">
                  {intl.formatMessage({
                    defaultMessage: "Save availability",
                    id: "nDm9dX",
                    description:
                      "Button text to save availability in a recruitment",
                  })}
                </Button>
                <Dialog.Close>
                  <Button mode="inline" color="warning">
                    {intl.formatMessage(commonMessages.cancel)}
                  </Button>
                </Dialog.Close>
              </Dialog.Footer>
            </form>
          </FormProvider>
        </Dialog.Body>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default RecruitmentAvailabilityDialog;
