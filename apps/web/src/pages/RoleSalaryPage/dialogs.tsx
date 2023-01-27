import React from "react";
import { useIntl } from "react-intl";
import Dialog from "@common/components/Dialog";
import Button from "@common/components/Button";
import { getITAbbrHtml } from "~/../../../frontend/common/src/helpers/nameUtils";

export interface DialogLevelsProps {
  children: React.ReactNode;
}

export interface CloseDialogButtonProps {
  close: () => void;
  children?: React.ReactNode;
}

export const CloseDialogButton = React.forwardRef<
  React.ElementRef<typeof Button>,
  React.ComponentPropsWithoutRef<typeof Button>
>((props, forwardedRef) => (
  <Button
    ref={forwardedRef}
    {...props}
    type="button"
    mode="outline"
    color="secondary"
  />
));

const ModalButton = React.forwardRef<
  React.ElementRef<typeof Button>,
  React.ComponentPropsWithoutRef<typeof Button>
>(({ children, ...rest }, forwardedRef) => (
  <Button
    ref={forwardedRef}
    {...rest}
    color="black"
    mode="inline"
    data-h2-padding="base(0)"
    data-h2-font-size="base(caption)"
  >
    <span data-h2-text-decoration="base(underline)">{children}</span>
  </Button>
));

export const DialogLevelOne = ({ children }: DialogLevelsProps) => {
  const intl = useIntl();

  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <ModalButton>{children}</ModalButton>
      </Dialog.Trigger>

      <Dialog.Content>
        <Dialog.Header color="ts-primary">
          {intl.formatMessage({
            defaultMessage: "Level 1: Technicians",
            id: "aLMroa",
            description: "title for IT-01 dialog",
          })}
        </Dialog.Header>
        <p>
          {intl.formatMessage(
            {
              defaultMessage:
                "Technicians ({ITAbbr}) provide technical support in the development, implementation, integration, and maintenance of service delivery to clients and stakeholders",
              id: "D39mvO",
              description: "blurb describing IT-01",
            },
            { ITAbbr: getITAbbrHtml(intl, 1) },
          )}
        </p>
        <p>
          {intl.formatMessage(
            {
              defaultMessage:
                "{ITAbbr} Technicians are primarily found in three work streams: ",
              id: "2IQ8Y3",
              description: "Preceding list description",
            },
            { ITAbbr: getITAbbrHtml(intl) },
          )}
        </p>
        <ul>
          <li>
            {intl.formatMessage(
              {
                defaultMessage: "{ITAbbr} Infrastructure Operations",
                id: "ymbZa1",
                description: "work stream example",
              },
              { ITAbbr: getITAbbrHtml(intl) },
            )}
          </li>
          <li>
            {intl.formatMessage(
              {
                defaultMessage: "{ITAbbr} Security",
                id: "j5YawQ",
                description: "work stream example",
              },
              { ITAbbr: getITAbbrHtml(intl) },
            )}
          </li>
          <li>
            {intl.formatMessage(
              {
                defaultMessage: "{ITAbbr} Software Solutions",
                id: "4oQRHt",
                description: "work stream example",
              },
              { ITAbbr: getITAbbrHtml(intl) },
            )}
          </li>
        </ul>
        <Dialog.Footer>
          <Dialog.Close>
            <CloseDialogButton>
              {intl.formatMessage({
                defaultMessage: "Close",
                id: "qSxmx0",
                description: "Close Confirmations",
              })}
            </CloseDialogButton>
          </Dialog.Close>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export const DialogLevelTwo = ({ children }: DialogLevelsProps) => {
  const intl = useIntl();

  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <ModalButton>{children}</ModalButton>
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Header color="ts-primary">
          {intl.formatMessage({
            defaultMessage: "Level 2: Analysts",
            id: "MNVv3A",
            description: "title for IT-02 dialog",
          })}
        </Dialog.Header>
        <p>
          {intl.formatMessage(
            {
              defaultMessage:
                "Analysts ({IT2Abbr}) provide technical services, advice, analysis, and research in their field of expertise to support service delivery to clients and stakeholders. {ITAbbr} analysts are found in all work streams.",
              id: "7nQiL5",
              description: "blurb describing IT-02",
            },
            { ITAbbr: getITAbbrHtml(intl), IT2Abbr: getITAbbrHtml(intl, 2) },
          )}
        </p>
        <Dialog.Footer>
          <Dialog.Close>
            <CloseDialogButton>
              {intl.formatMessage({
                defaultMessage: "Close",
                id: "qSxmx0",
                description: "Close Confirmations",
              })}
            </CloseDialogButton>
          </Dialog.Close>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export const DialogLevelThreeLead = ({ children }: DialogLevelsProps) => {
  const intl = useIntl();

  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <ModalButton>{children}</ModalButton>
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Header color="ts-primary">
          {intl.formatMessage({
            defaultMessage: "Level 3: Teams Leads",
            id: "mTlHta",
            description: "title for IT-03 lead dialog",
          })}
        </Dialog.Header>
        <p>
          {intl.formatMessage(
            {
              defaultMessage:
                "There are two types of {ITAbbr} employees: those following a management path, and individual contributors.",
              id: "NGoXse",
              description: "IT-03 description precursor",
            },
            { ITAbbr: getITAbbrHtml(intl, 3) },
          )}
        </p>
        <p>
          {intl.formatMessage(
            {
              defaultMessage:
                "<strong>Management Path</strong>: {ITAbbr} Team Leads ({IT3Abbr}) are responsible for supervising work and project teams for {ITAbbr} services and operations in their field of expertise to support service delivery to clients and stakeholders. {ITAbbr} Team Leads are found in all work streams.",
              id: "/qXjCD",
              description:
                "IT-03 team lead path description, ignore things in <> tags please",
            },
            { ITAbbr: getITAbbrHtml(intl), IT3Abbr: getITAbbrHtml(intl, 3) },
          )}
        </p>
        <Dialog.Footer>
          <Dialog.Close>
            <CloseDialogButton>
              {intl.formatMessage({
                defaultMessage: "Close",
                id: "qSxmx0",
                description: "Close Confirmations",
              })}
            </CloseDialogButton>
          </Dialog.Close>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export const DialogLevelThreeAdvisor = ({ children }: DialogLevelsProps) => {
  const intl = useIntl();

  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <ModalButton>{children}</ModalButton>
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Header color="ts-primary">
          {intl.formatMessage({
            defaultMessage: "Level 3: Technical Advisors",
            id: "WE0OGe",
            description: "title for IT-03 advisor dialog",
          })}
        </Dialog.Header>
        <p>
          {intl.formatMessage(
            {
              defaultMessage:
                "There are two types of {ITAbbr} employees: those following a management path, and individual contributors.",
              id: "NGoXse",
              description: "IT-03 description precursor",
            },
            { ITAbbr: getITAbbrHtml(intl, 3) },
          )}
        </p>
        <p>
          {intl.formatMessage(
            {
              defaultMessage:
                "<strong>Individual Contributor</strong>: {ITAbbr} Technical Advisors ({IT3Abbr}) provide specialized technical advice, recommendations and support on solutions and services in their field of expertise in support of service delivery to clients and stakeholders. {ITAbbr} Technical Advisors are found in all work streams.",
              id: "/HbrEK",
              description:
                "IT-03 advisor description, ignore things in <> tags please",
            },
            { ITAbbr: getITAbbrHtml(intl), IT3Abbr: getITAbbrHtml(intl, 3) },
          )}
        </p>
        <Dialog.Footer>
          <Dialog.Close>
            <CloseDialogButton>
              {intl.formatMessage({
                defaultMessage: "Close",
                id: "qSxmx0",
                description: "Close Confirmations",
              })}
            </CloseDialogButton>
          </Dialog.Close>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export const DialogLevelFourLead = ({ children }: DialogLevelsProps) => {
  const intl = useIntl();

  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <ModalButton>{children}</ModalButton>
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Header color="ts-primary">
          {intl.formatMessage({
            defaultMessage: "Level 4: Manager",
            id: "2KjiDn",
            description: "title for IT-04 manager dialog",
          })}
        </Dialog.Header>
        <p>
          {intl.formatMessage(
            {
              defaultMessage:
                "There are two types of {ITAbbr} employees: those following a management path, and individual contributors.",
              id: "rifhMf",
              description: "IT-04 description precursor",
            },
            { ITAbbr: getITAbbrHtml(intl, 4) },
          )}
        </p>
        <p>
          {intl.formatMessage(
            {
              defaultMessage:
                "<strong>Management Path</strong>: {ITAbbr} Managers ({IT4Abbr}) are responsible for managing the development and delivery of {ITAbbr} services and/or operations through subordinate team leaders, technical advisors, and project teams, for service delivery to clients and stakeholders. {ITAbbr} Managers are found in all work streams.",
              id: "MpRdnW",
              description:
                "IT-04 manager path description, ignore things in <> tags please",
            },
            { ITAbbr: getITAbbrHtml(intl), IT4Abbr: getITAbbrHtml(intl, 4) },
          )}
        </p>
        <Dialog.Footer>
          <Dialog.Close>
            <CloseDialogButton>
              {intl.formatMessage({
                defaultMessage: "Close",
                id: "qSxmx0",
                description: "Close Confirmations",
              })}
            </CloseDialogButton>
          </Dialog.Close>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export const DialogLevelFourAdvisor = ({ children }: DialogLevelsProps) => {
  const intl = useIntl();

  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <ModalButton>{children}</ModalButton>
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Header color="ts-primary">
          {intl.formatMessage({
            defaultMessage: "Level 4: Senior Advisor",
            id: "2VprXV",
            description: "title for IT-04 senior advisor dialog",
          })}
        </Dialog.Header>
        <p>
          {intl.formatMessage(
            {
              defaultMessage:
                "There are two types of {IT4Abbr} employees: those following a management path, and individual contributors.",
              id: "QpR/L2",
              description: "IT-04 description precursor",
            },
            { IT4Abbr: getITAbbrHtml(intl, 4) },
          )}
        </p>
        <p>
          {intl.formatMessage(
            {
              defaultMessage:
                "<strong>Individual Contributor</strong>: {ITAbbr} Senior Advisors ({IT4Abbr}) provide expert technical advice and strategic direction in their field of expertise in the provision of solutions and services to internal or external clients, and stakeholders. {ITAbbr} Senior Advisors are primarily found in six work streams:",
              id: "DqByKJ",
              description:
                "IT-04 senior advisor description precursor to work stream list, ignore things in <> tags please",
            },
            { ITAbbr: getITAbbrHtml(intl), IT4Abbr: getITAbbrHtml(intl, 4) },
          )}
        </p>
        <ul>
          <li>
            {intl.formatMessage(
              {
                defaultMessage: "{ITAbbr} Infrastructure Operations",
                id: "ymbZa1",
                description: "work stream example",
              },
              { ITAbbr: getITAbbrHtml(intl) },
            )}
          </li>
          <li>
            {intl.formatMessage(
              {
                defaultMessage: "{ITAbbr} Security",
                id: "j5YawQ",
                description: "work stream example",
              },
              { ITAbbr: getITAbbrHtml(intl) },
            )}
          </li>
          <li>
            {intl.formatMessage(
              {
                defaultMessage: "{ITAbbr} Software Solutions",
                id: "4oQRHt",
                description: "work stream example",
              },
              { ITAbbr: getITAbbrHtml(intl) },
            )}
          </li>
          <li>
            {intl.formatMessage(
              {
                defaultMessage: "{ITAbbr} Database Management",
                id: "gBDg6Z",
                description: "work stream example",
              },
              { ITAbbr: getITAbbrHtml(intl) },
            )}
          </li>
          <li>
            {intl.formatMessage(
              {
                defaultMessage: "{ITAbbr} Enterprise Architecture",
                id: "MJ0fpu",
                description: "work stream example",
              },
              { ITAbbr: getITAbbrHtml(intl) },
            )}
          </li>
          <li>
            {intl.formatMessage(
              {
                defaultMessage: "{ITAbbr} Project Portfolio Management",
                id: "JQxq9G",
                description: "work stream example",
              },
              { ITAbbr: getITAbbrHtml(intl) },
            )}
          </li>
        </ul>
        <Dialog.Footer>
          <Dialog.Close>
            <CloseDialogButton>
              {intl.formatMessage({
                defaultMessage: "Close",
                id: "qSxmx0",
                description: "Close Confirmations",
              })}
            </CloseDialogButton>
          </Dialog.Close>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Root>
  );
};
