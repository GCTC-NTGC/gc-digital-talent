import React from "react";
import { useIntl } from "react-intl";
import Dialog from "@common/components/Dialog";
import Button from "@common/components/Button";

export interface DialogLevelsProps {
  isOpen: boolean;
  onDismiss: () => void;
}

export interface CloseDialogButtonProps {
  close: () => void;
  children?: React.ReactNode;
}

export const CloseDialogButton: React.FC<CloseDialogButtonProps> = ({
  close,
  children,
}) => {
  return (
    <Button type="button" mode="outline" color="secondary" onClick={close}>
      {children}
    </Button>
  );
};

export const DialogLevelOne: React.FC<DialogLevelsProps> = ({
  isOpen,
  onDismiss,
}) => {
  const intl = useIntl();

  return (
    <Dialog
      title={intl.formatMessage({
        defaultMessage: "Level 1: Technicians",
        id: "aLMroa",
        description: "title for IT-01 dialog",
      })}
      color="ts-primary"
      isOpen={isOpen}
      onDismiss={onDismiss}
    >
      <p>
        {intl.formatMessage({
          defaultMessage:
            "Technicians (IT-01) provide technical support in the development, implementation, integration, and maintenance of service delivery to clients and stakeholders",
          id: "Z9Uex5",
          description: "blurb describing IT-01",
        })}
      </p>
      <p>
        {intl.formatMessage({
          defaultMessage:
            "IT Technicians are primarily found in three work streams: ",
          id: "vQzmUH",
          description: "Preceding list description",
        })}
      </p>
      <ul>
        <li>
          {intl.formatMessage({
            defaultMessage: "IT Infrastructure Operations",
            id: "QZ9FZB",
            description: "work stream example",
          })}
        </li>
        <li>
          {intl.formatMessage({
            defaultMessage: "IT Security",
            id: "nrBkon",
            description: "work stream example",
          })}
        </li>
        <li>
          {intl.formatMessage({
            defaultMessage: "IT Software Solutions",
            id: "SDDp1t",
            description: "work stream example",
          })}
        </li>
      </ul>
      <Dialog.Footer>
        <div
          data-h2-display="base(flex)"
          data-h2-justify-content="base(center)"
        >
          <CloseDialogButton close={onDismiss}>
            {intl.formatMessage({
              defaultMessage: "Close",
              id: "qSxmx0",
              description: "Close Confirmations",
            })}
          </CloseDialogButton>
        </div>
      </Dialog.Footer>
    </Dialog>
  );
};

export const DialogLevelTwo: React.FC<DialogLevelsProps> = ({
  isOpen,
  onDismiss,
}) => {
  const intl = useIntl();

  return (
    <Dialog
      title={intl.formatMessage({
        defaultMessage: "Level 2: Analysts",
        id: "MNVv3A",
        description: "title for IT-02 dialog",
      })}
      color="ts-primary"
      isOpen={isOpen}
      onDismiss={onDismiss}
    >
      <p>
        {intl.formatMessage({
          defaultMessage:
            "Analysts (IT-02) provide technical services, advice, analysis, and research in their field of expertise to support service delivery to clients and stakeholders. IT analysts are found in all work streams.",
          id: "raFdbB",
          description: "blurb describing IT-02",
        })}
      </p>
      <Dialog.Footer>
        <div
          data-h2-display="base(flex)"
          data-h2-justify-content="base(center)"
        >
          <CloseDialogButton close={onDismiss}>
            {intl.formatMessage({
              defaultMessage: "Close",
              id: "qSxmx0",
              description: "Close Confirmations",
            })}
          </CloseDialogButton>
        </div>
      </Dialog.Footer>
    </Dialog>
  );
};

export const DialogLevelThreeLead: React.FC<DialogLevelsProps> = ({
  isOpen,
  onDismiss,
}) => {
  const intl = useIntl();

  return (
    <Dialog
      title={intl.formatMessage({
        defaultMessage: "Level 3: Teams Leads",
        id: "mTlHta",
        description: "title for IT-03 lead dialog",
      })}
      color="ts-primary"
      isOpen={isOpen}
      onDismiss={onDismiss}
    >
      <p>
        {intl.formatMessage({
          defaultMessage:
            "There are two types of IT-03 employees: those following a management path, and individual contributors.",
          id: "hCgrxA",
          description: "IT-03 description precursor",
        })}
      </p>
      <p>
        {intl.formatMessage({
          defaultMessage:
            "<strong>Management Path</strong>: IT Team Leads (IT-03) are responsible for supervising work and project teams for IT services and operations in their field of expertise to support service delivery to clients and stakeholders. IT Team Leads are found in all work streams.",
          id: "+bC9lc",
          description:
            "IT-03 team lead path description, ignore things in <> tags please",
        })}
      </p>
      <Dialog.Footer>
        <div
          data-h2-display="base(flex)"
          data-h2-justify-content="base(center)"
        >
          <CloseDialogButton close={onDismiss}>
            {intl.formatMessage({
              defaultMessage: "Close",
              id: "qSxmx0",
              description: "Close Confirmations",
            })}
          </CloseDialogButton>
        </div>
      </Dialog.Footer>
    </Dialog>
  );
};

export const DialogLevelThreeAdvisor: React.FC<DialogLevelsProps> = ({
  isOpen,
  onDismiss,
}) => {
  const intl = useIntl();

  return (
    <Dialog
      title={intl.formatMessage({
        defaultMessage: "Level 3: Technical Advisors",
        id: "WE0OGe",
        description: "title for IT-03 advisor dialog",
      })}
      color="ts-primary"
      isOpen={isOpen}
      onDismiss={onDismiss}
    >
      <p>
        {intl.formatMessage({
          defaultMessage:
            "There are two types of IT-03 employees: those following a management path, and individual contributors.",
          id: "hCgrxA",
          description: "IT-03 description precursor",
        })}
      </p>
      <p>
        {intl.formatMessage({
          defaultMessage:
            "<strong>Individual Contributor</strong>: IT Technical Advisors (IT-03) provide specialized technical advice, recommendations and support on solutions and services in their field of expertise in support of service delivery to clients and stakeholders. IT Technical Advisors are found in all work streams.",
          id: "u+9mg1",
          description:
            "IT-03 advisor description, ignore things in <> tags please",
        })}
      </p>
      <Dialog.Footer>
        <div
          data-h2-display="base(flex)"
          data-h2-justify-content="base(center)"
        >
          <CloseDialogButton close={onDismiss}>
            {intl.formatMessage({
              defaultMessage: "Close",
              id: "qSxmx0",
              description: "Close Confirmations",
            })}
          </CloseDialogButton>
        </div>
      </Dialog.Footer>
    </Dialog>
  );
};

export const DialogLevelFourLead: React.FC<DialogLevelsProps> = ({
  isOpen,
  onDismiss,
}) => {
  const intl = useIntl();

  return (
    <Dialog
      title={intl.formatMessage({
        defaultMessage: "Level 4: Manager",
        id: "2KjiDn",
        description: "title for IT-04 manager dialog",
      })}
      color="ts-primary"
      isOpen={isOpen}
      onDismiss={onDismiss}
    >
      <p>
        {intl.formatMessage({
          defaultMessage:
            "There are two types of IT-04 employees: those following a management path, and individual contributors.",
          id: "87nFC8",
          description: "IT-04 description precursor",
        })}
      </p>
      <p>
        {intl.formatMessage({
          defaultMessage:
            "<strong>Management Path</strong>: IT Managers (IT-04) are responsible for managing the development and delivery of IT services and/or operations through subordinate team leaders, technical advisors, and project teams, for service delivery to clients and stakeholders. IT Managers are found in all work streams.",
          id: "m21EOJ",
          description:
            "IT-04 manager path description, ignore things in <> tags please",
        })}
      </p>
      <Dialog.Footer>
        <div
          data-h2-display="base(flex)"
          data-h2-justify-content="base(center)"
        >
          <CloseDialogButton close={onDismiss}>
            {intl.formatMessage({
              defaultMessage: "Close",
              id: "qSxmx0",
              description: "Close Confirmations",
            })}
          </CloseDialogButton>
        </div>
      </Dialog.Footer>
    </Dialog>
  );
};

export const DialogLevelFourAdvisor: React.FC<DialogLevelsProps> = ({
  isOpen,
  onDismiss,
}) => {
  const intl = useIntl();

  return (
    <Dialog
      title={intl.formatMessage({
        defaultMessage: "Level 4: Senior Advisor",
        id: "2VprXV",
        description: "title for IT-04 senior advisor dialog",
      })}
      color="ts-primary"
      isOpen={isOpen}
      onDismiss={onDismiss}
    >
      <p>
        {intl.formatMessage({
          defaultMessage:
            "There are two types of IT-04 employees: those following a management path, and individual contributors.",
          id: "87nFC8",
          description: "IT-04 description precursor",
        })}
      </p>
      <p>
        {intl.formatMessage({
          defaultMessage:
            "<strong>Individual Contributor</strong>: IT Senior Advisors (IT-04) provide expert technical advice and strategic direction in their field of expertise in the provision of solutions and services to internal or external clients, and stakeholders. IT Senior Advisors are primarily found in six work streams:",
          id: "58BEeZ",
          description:
            "IT-04 senior advisor description precursor to work stream list, ignore things in <> tags please",
        })}
      </p>
      <ul>
        <li>
          {intl.formatMessage({
            defaultMessage: "IT Infrastructure Operations",
            id: "QZ9FZB",
            description: "work stream example",
          })}
        </li>
        <li>
          {intl.formatMessage({
            defaultMessage: "IT Security",
            id: "nrBkon",
            description: "work stream example",
          })}
        </li>
        <li>
          {intl.formatMessage({
            defaultMessage: "IT Software Solutions",
            id: "SDDp1t",
            description: "work stream example",
          })}
        </li>
        <li>
          {intl.formatMessage({
            defaultMessage: "IT Database Management",
            id: "6LTC0y",
            description: "work stream example",
          })}
        </li>
        <li>
          {intl.formatMessage({
            defaultMessage: "IT Enterprise Architecture",
            id: "oOcegG",
            description: "work stream example",
          })}
        </li>
        <li>
          {intl.formatMessage({
            defaultMessage: "IT Project Portfolio Management",
            id: "tm3zLD",
            description: "work stream example",
          })}
        </li>
      </ul>
      <Dialog.Footer>
        <div
          data-h2-display="base(flex)"
          data-h2-justify-content="base(center)"
        >
          <CloseDialogButton close={onDismiss}>
            {intl.formatMessage({
              defaultMessage: "Close",
              id: "qSxmx0",
              description: "Close Confirmations",
            })}
          </CloseDialogButton>
        </div>
      </Dialog.Footer>
    </Dialog>
  );
};
