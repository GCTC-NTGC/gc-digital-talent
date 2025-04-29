import { ReactNode, useState } from "react";
import { useIntl } from "react-intl";

import { FragmentType, getFragment, graphql } from "@gc-digital-talent/graphql";
import { commonMessages } from "@gc-digital-talent/i18n";
import { Button, Dialog } from "@gc-digital-talent/ui";

import CareerObjective from "./CareerObjective";

export const CareerObjectiveDialog_Fragment = graphql(/* GraphQL */ `
  fragment CareerObjectiveDialog on User {
    firstName
    employeeProfile {
      ...CareerObjectiveInfo
    }
  }
`);

interface CareerObjectiveDialogProps {
  careerObjectiveDialogQuery: FragmentType<
    typeof CareerObjectiveDialog_Fragment
  >;
  trigger?: ReactNode;
  defaultOpen?: boolean;
}

const CareerObjectiveDialog = ({
  careerObjectiveDialogQuery,
  trigger,
  defaultOpen = false,
}: CareerObjectiveDialogProps) => {
  const intl = useIntl();
  const [isOpen, setOpen] = useState<boolean>(defaultOpen);
  const careerObjective = getFragment(
    CareerObjectiveDialog_Fragment,
    careerObjectiveDialogQuery,
  );

  const title = intl.formatMessage(
    {
      defaultMessage: "{firstName}'s career objective",
      id: "kXd/03",
      description: "Title for career objective dialog",
    },
    {
      firstName:
        careerObjective.firstName ??
        intl.formatMessage(commonMessages.notFound),
    },
  );

  return (
    <Dialog.Root open={isOpen} onOpenChange={setOpen}>
      <Dialog.Trigger>{trigger || <Button>{title}</Button>}</Dialog.Trigger>
      <Dialog.Content hasSubtitle>
        <Dialog.Header
          subtitle={intl.formatMessage({
            defaultMessage:
              "Learn more about the role this nominee is working toward as their main career objective.",
            id: "1LkIfy",
            description: "Subtitle for dialog viewing career objective info",
          })}
        >
          {title}
        </Dialog.Header>
        <Dialog.Body>
          {/* TODO: Add well with null message if fragment is undefined? */}
          {careerObjective.employeeProfile && (
            <CareerObjective
              careerObjectiveQuery={careerObjective.employeeProfile}
            />
          )}
          <Dialog.Footer>
            <Dialog.Close>
              <Button mode="inline" color="quaternary">
                {intl.formatMessage(commonMessages.close)}
              </Button>
            </Dialog.Close>
          </Dialog.Footer>
        </Dialog.Body>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default CareerObjectiveDialog;
