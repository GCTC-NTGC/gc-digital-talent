import React from "react";
import { useIntl } from "react-intl";
import { getLocale } from "@common/helpers/localize";
import { BasicForm, Checklist } from "@common/components/form";
import Dialog from "@common/components/Dialog";
import { SubmitHandler } from "react-hook-form";
import Button from "@common/components/Button";
import { UpdateUserAsUserInput, User } from "../../api/generated";
import ProfileFormWrapper from "../applicantProfile/ProfileFormWrapper";
import ProfileFormFooter from "../applicantProfile/ProfileFormFooter";
import applicantProfileRoutes from "../../applicantProfileRoutes";

export interface DialogLevelsProps {
  isOpen: boolean;
  onDismiss: () => void;
}

export const DialogLevelOne: React.FC<DialogLevelsProps> = ({
  isOpen,
  onDismiss,
}) => {
  const intl = useIntl();

  const closeButton = (
    <Button type="button" mode="outline" color="secondary" onClick={onDismiss}>
      {intl.formatMessage({
        defaultMessage: "Cancel",
        description: "Cancel confirmation",
      })}
    </Button>
  );

  return (
    <Dialog
      title={intl.formatMessage({
        defaultMessage: "One",
        description: "One",
      })}
      isOpen={isOpen}
      onDismiss={onDismiss}
      footer={
        <div
          data-h2-display="b(flex)"
          data-h2-justify-content="b(space-between)"
        >
          {closeButton}
        </div>
      }
    >
      One
    </Dialog>
  );
};

export const DialogLevelTwo: React.FC<DialogLevelsProps> = ({
  isOpen,
  onDismiss,
}) => {
  const intl = useIntl();

  const closeButton = (
    <Button type="button" mode="outline" color="secondary" onClick={onDismiss}>
      {intl.formatMessage({
        defaultMessage: "Cancel",
        description: "Cancel confirmation",
      })}
    </Button>
  );

  return (
    <Dialog
      title={intl.formatMessage({
        defaultMessage: "Two",
        description: "Two",
      })}
      isOpen={isOpen}
      onDismiss={onDismiss}
      footer={
        <div
          data-h2-display="b(flex)"
          data-h2-justify-content="b(space-between)"
        >
          {closeButton}
        </div>
      }
    >
      Two
    </Dialog>
  );
};
export const DialogLevelThree: React.FC<DialogLevelsProps> = ({
  isOpen,
  onDismiss,
}) => {
  const intl = useIntl();

  const closeButton = (
    <Button type="button" mode="outline" color="secondary" onClick={onDismiss}>
      {intl.formatMessage({
        defaultMessage: "Cancel",
        description: "Cancel confirmation",
      })}
    </Button>
  );

  return (
    <Dialog
      title={intl.formatMessage({
        defaultMessage: "Three",
        description: "Three",
      })}
      isOpen={isOpen}
      onDismiss={onDismiss}
      footer={
        <div
          data-h2-display="b(flex)"
          data-h2-justify-content="b(space-between)"
        >
          {closeButton}
        </div>
      }
    >
      Three
    </Dialog>
  );
};
export const DialogLevelFour: React.FC<DialogLevelsProps> = ({
  isOpen,
  onDismiss,
}) => {
  const intl = useIntl();

  const closeButton = (
    <Button type="button" mode="outline" color="secondary" onClick={onDismiss}>
      {intl.formatMessage({
        defaultMessage: "Cancel",
        description: "Cancel confirmation",
      })}
    </Button>
  );

  return (
    <Dialog
      title={intl.formatMessage({
        defaultMessage: "Four",
        description: "Four",
      })}
      isOpen={isOpen}
      onDismiss={onDismiss}
      footer={
        <div
          data-h2-display="b(flex)"
          data-h2-justify-content="b(space-between)"
        >
          {closeButton}
        </div>
      }
    >
      Four
    </Dialog>
  );
};
