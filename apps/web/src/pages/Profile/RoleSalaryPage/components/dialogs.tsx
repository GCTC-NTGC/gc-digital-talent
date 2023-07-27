import React from "react";
import { useIntl } from "react-intl";

import { Dialog, Button } from "@gc-digital-talent/ui";

import { wrapAbbr } from "~/utils/nameUtils";

interface DialogLevelsProps {
  children: React.ReactNode;
}

const CloseDialogButton = React.forwardRef<
  React.ElementRef<typeof Button>,
  React.ComponentPropsWithoutRef<typeof Button>
>((props, forwardedRef) => (
  <Button ref={forwardedRef} {...props} type="button" color="secondary" />
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
        <Dialog.Header>
          {intl.formatMessage({
            defaultMessage: "Level 1: Technicians",
            id: "aLMroa",
            description: "title for IT-01 dialog",
          })}
        </Dialog.Header>
        <Dialog.Body>
          <p>
            {intl.formatMessage(
              {
                defaultMessage:
                  "Technicians (<abbreviation>IT-01</abbreviation>) provide technical support in the development, implementation, integration, and maintenance of service delivery to clients and stakeholders",
                id: "j3OROA",
                description: "blurb describing IT-01",
              },
              {
                abbreviation: (text: React.ReactNode) => wrapAbbr(text, intl),
              },
            )}
          </p>
          <p>
            {intl.formatMessage(
              {
                defaultMessage:
                  "<abbreviation>IT</abbreviation> Technicians are primarily found in three work streams: ",
                id: "69euaM",
                description: "Preceding list description",
              },
              {
                abbreviation: (text: React.ReactNode) => wrapAbbr(text, intl),
              },
            )}
          </p>
          <ul>
            <li>
              {intl.formatMessage(
                {
                  defaultMessage:
                    "<abbreviation>IT</abbreviation> Infrastructure Operations",
                  id: "028BJx",
                  description: "work stream example",
                },
                {
                  abbreviation: (text: React.ReactNode) => wrapAbbr(text, intl),
                },
              )}
            </li>
            <li>
              {intl.formatMessage(
                {
                  defaultMessage: "<abbreviation>IT</abbreviation> Security",
                  id: "3gDiDK",
                  description: "work stream example",
                },
                {
                  abbreviation: (text: React.ReactNode) => wrapAbbr(text, intl),
                },
              )}
            </li>
            <li>
              {intl.formatMessage(
                {
                  defaultMessage:
                    "<abbreviation>IT</abbreviation> Software Solutions",
                  id: "ObVJ7H",
                  description: "work stream example",
                },
                {
                  abbreviation: (text: React.ReactNode) => wrapAbbr(text, intl),
                },
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
        </Dialog.Body>
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
        <Dialog.Header>
          {intl.formatMessage({
            defaultMessage: "Level 2: Analysts",
            id: "MNVv3A",
            description: "title for IT-02 dialog",
          })}
        </Dialog.Header>
        <Dialog.Body>
          <p>
            {intl.formatMessage(
              {
                defaultMessage:
                  "Analysts (<abbreviation>IT-02</abbreviation>) provide technical services, advice, analysis, and research in their field of expertise to support service delivery to clients and stakeholders. <abbreviation>IT</abbreviation> analysts are found in all work streams.",
                id: "/SLyVF",
                description: "blurb describing IT-02",
              },
              {
                abbreviation: (text: React.ReactNode) => wrapAbbr(text, intl),
              },
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
        </Dialog.Body>
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
        <Dialog.Header>
          {intl.formatMessage({
            defaultMessage: "Level 3: Teams Leads",
            id: "mTlHta",
            description: "title for IT-03 lead dialog",
          })}
        </Dialog.Header>
        <Dialog.Body>
          <p>
            {intl.formatMessage(
              {
                defaultMessage:
                  "There are two types of <abbreviation>IT-03</abbreviation> employees: those following a management path, and individual contributors.",
                id: "7wcfnG",
                description: "IT-03 description precursor",
              },
              {
                abbreviation: (text: React.ReactNode) => wrapAbbr(text, intl),
              },
            )}
          </p>
          <p>
            {intl.formatMessage(
              {
                defaultMessage:
                  "<strong>Management Path</strong>: <abbreviation>IT</abbreviation> Team Leads (<abbreviation>IT-03</abbreviation>) are responsible for supervising work and project teams for <abbreviation>IT</abbreviation> services and operations in their field of expertise to support service delivery to clients and stakeholders. <abbreviation>IT</abbreviation> Team Leads are found in all work streams.",
                id: "t+WUYM",
                description: "IT-03 team lead path description",
              },
              {
                abbreviation: (text: React.ReactNode) => wrapAbbr(text, intl),
              },
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
        </Dialog.Body>
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
        <Dialog.Header>
          {intl.formatMessage({
            defaultMessage: "Level 3: Technical Advisors",
            id: "WE0OGe",
            description: "title for IT-03 advisor dialog",
          })}
        </Dialog.Header>
        <Dialog.Body>
          <p>
            {intl.formatMessage(
              {
                defaultMessage:
                  "There are two types of <abbreviation>IT-03</abbreviation> employees: those following a management path, and individual contributors.",
                id: "7wcfnG",
                description: "IT-03 description precursor",
              },
              {
                abbreviation: (text: React.ReactNode) => wrapAbbr(text, intl),
              },
            )}
          </p>
          <p>
            {intl.formatMessage(
              {
                defaultMessage:
                  "<strong>Individual Contributor</strong>: <abbreviation>IT</abbreviation> Technical Advisors (<abbreviation>IT-03</abbreviation>) provide specialized technical advice, recommendations and support on solutions and services in their field of expertise in support of service delivery to clients and stakeholders. <abbreviation>IT</abbreviation> Technical Advisors are found in all work streams.",
                id: "7xDPj5",
                description: "IT-03 advisor description",
              },
              {
                abbreviation: (text: React.ReactNode) => wrapAbbr(text, intl),
              },
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
        </Dialog.Body>
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
        <Dialog.Header>
          {intl.formatMessage({
            defaultMessage: "Level 4: Manager",
            id: "2KjiDn",
            description: "title for IT-04 manager dialog",
          })}
        </Dialog.Header>
        <Dialog.Body>
          <p>
            {intl.formatMessage(
              {
                defaultMessage:
                  "There are two types of <abbreviation>IT-04</abbreviation> employees: those following a management path, and individual contributors.",
                id: "2aBKgf",
                description: "IT-04 description precursor",
              },
              {
                abbreviation: (text: React.ReactNode) => wrapAbbr(text, intl),
              },
            )}
          </p>
          <p>
            {intl.formatMessage(
              {
                defaultMessage:
                  "<strong>Management Path</strong>: <abbreviation>IT</abbreviation> Managers (<abbreviation>IT-04</abbreviation>) are responsible for managing the development and delivery of <abbreviation>IT</abbreviation> services and/or operations through subordinate team leaders, technical advisors, and project teams, for service delivery to clients and stakeholders. <abbreviation>IT</abbreviation> Managers are found in all work streams.",
                id: "YVuyjO",
                description: "IT-04 manager path description",
              },
              {
                abbreviation: (text: React.ReactNode) => wrapAbbr(text, intl),
              },
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
        </Dialog.Body>
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
        <Dialog.Header>
          {intl.formatMessage({
            defaultMessage: "Level 4: Senior Advisor",
            id: "2VprXV",
            description: "title for IT-04 senior advisor dialog",
          })}
        </Dialog.Header>
        <Dialog.Body>
          <p>
            {intl.formatMessage(
              {
                defaultMessage:
                  "There are two types of <abbreviation>IT-04</abbreviation> employees: those following a management path, and individual contributors.",
                id: "2aBKgf",
                description: "IT-04 description precursor",
              },
              {
                abbreviation: (text: React.ReactNode) => wrapAbbr(text, intl),
              },
            )}
          </p>
          <p>
            {intl.formatMessage(
              {
                defaultMessage:
                  "<strong>Individual Contributor</strong>: <abbreviation>IT</abbreviation> Senior Advisors (<abbreviation>IT-04</abbreviation>) provide expert technical advice and strategic direction in their field of expertise in the provision of solutions and services to internal or external clients, and stakeholders. <abbreviation>IT</abbreviation> Senior Advisors are primarily found in six work streams:",
                id: "SPECr8",
                description:
                  "IT-04 senior advisor description precursor to work stream list",
              },
              {
                abbreviation: (text: React.ReactNode) => wrapAbbr(text, intl),
              },
            )}
          </p>
          <ul>
            <li>
              {intl.formatMessage(
                {
                  defaultMessage:
                    "<abbreviation>IT</abbreviation> Infrastructure Operations",
                  id: "028BJx",
                  description: "work stream example",
                },
                {
                  abbreviation: (text: React.ReactNode) => wrapAbbr(text, intl),
                },
              )}
            </li>
            <li>
              {intl.formatMessage(
                {
                  defaultMessage: "<abbreviation>IT</abbreviation> Security",
                  id: "3gDiDK",
                  description: "work stream example",
                },
                {
                  abbreviation: (text: React.ReactNode) => wrapAbbr(text, intl),
                },
              )}
            </li>
            <li>
              {intl.formatMessage(
                {
                  defaultMessage:
                    "<abbreviation>IT</abbreviation> Software Solutions",
                  id: "ObVJ7H",
                  description: "work stream example",
                },
                {
                  abbreviation: (text: React.ReactNode) => wrapAbbr(text, intl),
                },
              )}
            </li>
            <li>
              {intl.formatMessage(
                {
                  defaultMessage:
                    "<abbreviation>IT</abbreviation> Database Management",
                  id: "y+HB+k",
                  description: "work stream example",
                },
                {
                  abbreviation: (text: React.ReactNode) => wrapAbbr(text, intl),
                },
              )}
            </li>
            <li>
              {intl.formatMessage(
                {
                  defaultMessage:
                    "<abbreviation>IT</abbreviation> Enterprise Architecture",
                  id: "6kSk+R",
                  description: "work stream example",
                },
                {
                  abbreviation: (text: React.ReactNode) => wrapAbbr(text, intl),
                },
              )}
            </li>
            <li>
              {intl.formatMessage(
                {
                  defaultMessage:
                    "<abbreviation>IT</abbreviation> Project Portfolio Management",
                  id: "WgGDug",
                  description: "work stream example",
                },
                {
                  abbreviation: (text: React.ReactNode) => wrapAbbr(text, intl),
                },
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
        </Dialog.Body>
      </Dialog.Content>
    </Dialog.Root>
  );
};
