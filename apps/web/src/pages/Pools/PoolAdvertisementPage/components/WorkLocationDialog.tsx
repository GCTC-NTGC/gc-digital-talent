import React from "react";
import { useIntl } from "react-intl";
import InformationCircleIcon from "@heroicons/react/24/solid/InformationCircleIcon";

import { Button, Dialog } from "@gc-digital-talent/ui";
import { commonMessages } from "@gc-digital-talent/i18n";

type WorkLocationDialogProps = {
  workLocation: string;
};

const WorkLocationDialog = ({
  workLocation,
}: WorkLocationDialogProps): JSX.Element => {
  const intl = useIntl();

  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <Button
          mode="icon_only"
          color="secondary"
          icon={InformationCircleIcon}
          aria-label={intl.formatMessage({
            defaultMessage: "Learn about work locations and terminology.",
            id: "xvULuR",
            description:
              "Info button label for pool application work location details.",
          })}
        />
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Header
          subtitle={intl.formatMessage({
            defaultMessage:
              "Learn more about how work locations are described in the context of recruitment opportunities.",
            id: "5FXFyB",
            description: "Subtitle for the pool work location dialog",
          })}
        >
          {intl.formatMessage({
            defaultMessage: "Work location and terminology",
            id: "kbMB6R",
            description: "Heading for the pool work location dialog",
          })}
        </Dialog.Header>
        <Dialog.Body>
          <div
            data-h2-display="base(flex)"
            data-h2-gap="base(x.5)"
            data-h2-flex-direction="base(column)"
            data-h2-align-items="base(flex-start)"
          >
            <p>
              {intl.formatMessage({
                defaultMessage:
                  "As a reminder, this opportunity requires the following",
                id: "kkZZfT",
                description:
                  "First paragraph for the pool work location dialog",
              }) + intl.formatMessage(commonMessages.dividingColon)}
              <div
                data-h2-font-weight="base(700)"
                data-h2-margin="base(x.5 0 0 x.75)"
              >
                {workLocation}
              </div>
            </p>
            <p>
              {intl.formatMessage({
                defaultMessage:
                  "Recruitment opportunities on this platform have a variety of possible work location requirements. A single job advertisement often encompasses a wide breadth of available jobs, so you’ll often see combinations of location requirements provided. In theses cases, specific location information will be provided to you as job opportunities become available.",
                id: "2SqgvZ",
                description:
                  "Paragraph describing how work locations are used on pool advertisements",
              })}
            </p>
            <p>
              {intl.formatMessage({
                defaultMessage:
                  "The definitions for each location possibility are outlined here",
                id: "rlWajt",
                description:
                  "Lead-in text to definitions of different work location terminology",
              })}
            </p>
            <ul>
              <li>
                {intl.formatMessage({
                  defaultMessage:
                    "<strong>Remote positions</strong offer the ability to work 100% from a location of your choice (e.g. home office) within Canada.",
                  id: "sYU7rM",
                  description: "Definition for 'remote positions'",
                })}
              </li>
              <li>
                {intl.formatMessage({
                  defaultMessage:
                    "<strong>Hybrid positions</strong> require in-office presence for 1 or more days per week, with the remainder allowing you to work from the location of your choice.",
                  id: "QKGmDP",
                  description: "Definition for 'hybrid positions'",
                })}
              </li>
              <li>
                {intl.formatMessage({
                  defaultMessage:
                    "<strong>On-site positions</strong> require full-time in-office work with no option to work remotely.",
                  id: "hCJfYi",
                  description: "Definition for 'on-site positions'",
                })}
              </li>
            </ul>
          </div>
          <Dialog.Footer>
            <Dialog.Close>
              <Button color="secondary">
                {intl.formatMessage({
                  defaultMessage: "Close",
                  id: "4p0QdF",
                  description: "Button text used to close an open modal",
                })}
              </Button>
            </Dialog.Close>
          </Dialog.Footer>
        </Dialog.Body>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default WorkLocationDialog;
