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

function bold(msg: string) {
  return <span data-h2-font-weight="b(700)">{msg}</span>;
}

export const DialogLevelOne: React.FC<DialogLevelsProps> = ({
  isOpen,
  onDismiss,
}) => {
  const intl = useIntl();

  return (
    <Dialog
      title={intl.formatMessage({
        defaultMessage: "Level 1: Technicians",
        description: "title for IT-01 dialog",
      })}
      isOpen={isOpen}
      onDismiss={onDismiss}
      footer={
        <div data-h2-display="b(flex)" data-h2-justify-content="b(center)">
          <CloseDialogButton close={onDismiss}>
            {intl.formatMessage({
              defaultMessage: "Close",
              description: "Close Confirmations",
            })}
          </CloseDialogButton>
        </div>
      }
    >
      <p>
        {intl.formatMessage({
          defaultMessage:
            "Technicians (IT-01) provide technical support in the development, implementation, integration, and maintenance of service delivery to clients and stakeholders",
          description: "blurb describing IT-01",
        })}
      </p>
      <p>
        {intl.formatMessage({
          defaultMessage:
            "IT Technicians are primarily found in three work streams: ",
          description: "Preceding list description",
        })}
      </p>
      <ul>
        <li>
          {intl.formatMessage({
            defaultMessage: "IT Infrastructure Operations",
            description: "work stream example",
          })}
        </li>
        <li>
          {intl.formatMessage({
            defaultMessage: "IT Security",
            description: "work stream example",
          })}
        </li>
        <li>
          {intl.formatMessage({
            defaultMessage: "IT Software Solutions",
            description: "work stream example",
          })}
        </li>
      </ul>
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
        description: "title for IT-02 dialog",
      })}
      isOpen={isOpen}
      onDismiss={onDismiss}
      footer={
        <div data-h2-display="b(flex)" data-h2-justify-content="b(center)">
          <CloseDialogButton close={onDismiss}>
            {intl.formatMessage({
              defaultMessage: "Close",
              description: "Close Confirmations",
            })}
          </CloseDialogButton>
        </div>
      }
    >
      <p>
        {intl.formatMessage({
          defaultMessage:
            "Analysts (IT-02) provide technical services, advice, analysis, and research in their field of expertise to support service delivery to clients and stakeholders. IT analysts are found in all work streams.",
          description: "blurb describing IT-02",
        })}
      </p>
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
        description: "title for IT-03 lead dialog",
      })}
      isOpen={isOpen}
      onDismiss={onDismiss}
      footer={
        <div data-h2-display="b(flex)" data-h2-justify-content="b(center)">
          <CloseDialogButton close={onDismiss}>
            {intl.formatMessage({
              defaultMessage: "Close",
              description: "Close Confirmations",
            })}
          </CloseDialogButton>
        </div>
      }
    >
      <p>
        {intl.formatMessage({
          defaultMessage:
            "There are two types of IT-03 employees: those following a management path, and individual contributors.",
          description: "IT-03 description precursor",
        })}
      </p>
      <p>
        {intl.formatMessage(
          {
            defaultMessage:
              "<bold>Management Path</bold>: IT Team Leads (IT-03) are responsible for supervising work and project teams for IT services and operations in their field of expertise to support service delivery to clients and stakeholders. IT Team Leads are found in all work streams.",
            description: "IT-03 team lead path description",
          },
          { bold },
        )}
      </p>
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
        description: "title for IT-03 advisor dialog",
      })}
      isOpen={isOpen}
      onDismiss={onDismiss}
      footer={
        <div data-h2-display="b(flex)" data-h2-justify-content="b(center)">
          <CloseDialogButton close={onDismiss}>
            {intl.formatMessage({
              defaultMessage: "Close",
              description: "Close Confirmations",
            })}
          </CloseDialogButton>
        </div>
      }
    >
      <p>
        {intl.formatMessage({
          defaultMessage:
            "There are two types of IT-03 employees: those following a management path, and individual contributors.",
          description: "IT-03 description precursor",
        })}
      </p>
      <p>
        {intl.formatMessage(
          {
            defaultMessage:
              "<bold>Individual Contributor</bold>: IT Technical Advisors (IT-03) provide specialized technical advice, recommendations and support on solutions and services in their field of expertise in support of service delivery to clients and stakeholders. IT Technical Advisors are found in all work streams.",
            description: "IT-03 advisor description",
          },
          { bold },
        )}
      </p>
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
        description: "title for IT-04 manager dialog",
      })}
      isOpen={isOpen}
      onDismiss={onDismiss}
      footer={
        <div data-h2-display="b(flex)" data-h2-justify-content="b(center)">
          <CloseDialogButton close={onDismiss}>
            {intl.formatMessage({
              defaultMessage: "Close",
              description: "Close Confirmations",
            })}
          </CloseDialogButton>
        </div>
      }
    >
      <p>
        {intl.formatMessage({
          defaultMessage:
            "There are two types of IT-04 employees: those following a management path, and individual contributors.",
          description: "IT-04 description precursor",
        })}
      </p>
      <p>
        {intl.formatMessage(
          {
            defaultMessage:
              "<bold>Management Path</bold>: IT Managers (IT-04) are responsible for managing the development and delivery of IT services and/or operations through subordinate team leaders, technical advisors, and project teams, for service delivery to clients and stakeholders. IT Managers are found in all work streams.",
            description: "IT-04 manager path description",
          },
          { bold },
        )}
      </p>
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
        description: "title for IT-04 senior advisor dialog",
      })}
      isOpen={isOpen}
      onDismiss={onDismiss}
      footer={
        <div data-h2-display="b(flex)" data-h2-justify-content="b(center)">
          <CloseDialogButton close={onDismiss}>
            {intl.formatMessage({
              defaultMessage: "Close",
              description: "Close Confirmations",
            })}
          </CloseDialogButton>
        </div>
      }
    >
      <p>
        {intl.formatMessage({
          defaultMessage:
            "There are two types of IT-04 employees: those following a management path, and individual contributors.",
          description: "IT-04 description precursor",
        })}
      </p>
      <p>
        {intl.formatMessage(
          {
            defaultMessage:
              "<bold>Individual Contributor</bold>: IT Senior Advisors (IT-03) provide expert technical advice and strategic direction in their field of expertise in the provision of solutions and services to internal or external clients, and stakeholders. IT Senior Advisors are primarily found in six work streams:",
            description:
              "IT-04 senior advisor description precursor to work stream list",
          },
          { bold },
        )}
      </p>
      <ul>
        <li>
          {intl.formatMessage({
            defaultMessage: "IT Infrastructure Operations",
            description: "work stream example",
          })}
        </li>
        <li>
          {intl.formatMessage({
            defaultMessage: "IT Security",
            description: "work stream example",
          })}
        </li>
        <li>
          {intl.formatMessage({
            defaultMessage: "IT Software Solutions",
            description: "work stream example",
          })}
        </li>
        <li>
          {intl.formatMessage({
            defaultMessage: "IT Database Management",
            description: "work stream example",
          })}
        </li>
        <li>
          {intl.formatMessage({
            defaultMessage: "IT Enterprise Architecture",
            description: "work stream example",
          })}
        </li>
        <li>
          {intl.formatMessage({
            defaultMessage: "IT Project Portfolio Management",
            description: "work stream example",
          })}
        </li>
      </ul>
    </Dialog>
  );
};
