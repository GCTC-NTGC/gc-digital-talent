import { ReactNode, useState } from "react";
import { useIntl } from "react-intl";
import { useFormContext } from "react-hook-form";

import { Community } from "@gc-digital-talent/graphql";
import { commonMessages } from "@gc-digital-talent/i18n";
import { Button, Dialog, Well } from "@gc-digital-talent/ui";
import { CheckboxOption, Checklist, Select } from "@gc-digital-talent/forms";
import { unpackMaybes } from "@gc-digital-talent/helpers";

import pageTitles from "~/messages/pageTitles";

interface ExperienceWorkStreamsDialogProps {
  communities: Community[];
  trigger: ReactNode;
  defaultOpen?: boolean;
}

const ExperienceWorkStreamsDialog = ({
  communities,
  trigger,
  defaultOpen = false,
}: ExperienceWorkStreamsDialogProps) => {
  const intl = useIntl();
  const [isOpen, setOpen] = useState<boolean>(defaultOpen);

  const { watch } = useFormContext<{ community: string }>();
  const communityValue = watch("community");

  const workStreamItemsOfCommunity = communities
    ?.find((item) => communityValue === item.id)
    ?.workStreams?.map<CheckboxOption>(({ id, name }) => ({
      value: id,
      label: name?.localized,
    }));
  return (
    <Dialog.Root open={isOpen} onOpenChange={setOpen}>
      <Dialog.Trigger>{trigger}</Dialog.Trigger>
      <Dialog.Content hasSubtitle>
        <Dialog.Header>
          {intl.formatMessage({
            defaultMessage: "Select the work streams for this experience",
            id: "njfu1M",
            description: "Subtitle for work streams for an experience dialog",
          })}
        </Dialog.Header>
        <Dialog.Body>
          <p data-h2-margin-bottom="base(x1)">
            {intl.formatMessage({
              defaultMessage:
                "The first step in identifying work streams is selecting one of our partner functional communities. If you can't find a relevant community, you can skip this step until a more relevant community joins the platform.",
              id: "uEzDbH",
              description:
                "Description for work streams for an experience dialog",
            })}
          </p>
          <div
            data-h2-display="base(flex)"
            data-h2-flex-direction="base(column)"
            data-h2-gap="base(x1 0)"
          >
            {communities && (
              <Select
                id="community"
                name="community"
                enableNull
                label={intl.formatMessage({
                  defaultMessage: "Functional communities",
                  id: "QuVtMh",
                  description: "Label for functional communities field",
                })}
                nullSelection={intl.formatMessage(
                  commonMessages.selectACommunity,
                )}
                options={communities
                  ?.filter((item) => unpackMaybes(item?.workStreams).length > 0)
                  .map(({ id, name }) => ({
                    value: id,
                    label: name?.localized,
                  }))}
              />
            )}
            {!communityValue ? (
              <Well data-h2-text-align="base(center)">
                <p>
                  {intl.formatMessage({
                    defaultMessage:
                      "Select a functional community to continue.",
                    id: "yKpbHC",
                    description: "Message when no community selected",
                  })}
                </p>
              </Well>
            ) : (
              <>
                <p>
                  {intl.formatMessage({
                    defaultMessage:
                      "Select 1 or more work streams that you feel match the work done during this experience.",
                    id: "L8iV5q",
                    description: "Instructions for selecting work streams",
                  })}
                </p>
                {workStreamItemsOfCommunity && (
                  <Checklist
                    idPrefix="workStreams"
                    name="workStreams"
                    legend={intl.formatMessage(pageTitles.workStreams)}
                    items={workStreamItemsOfCommunity}
                  />
                )}
              </>
            )}
          </div>
          <Dialog.Footer>
            <Button mode="solid" color="secondary">
              {intl.formatMessage({
                defaultMessage: "Save work streams",
                id: "JUC/JA",
                description: "Link text to save work streams for an experience",
              })}
            </Button>
            <Dialog.Close>
              <Button mode="inline" color="quaternary">
                {intl.formatMessage(commonMessages.cancel)}
              </Button>
            </Dialog.Close>
          </Dialog.Footer>
        </Dialog.Body>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default ExperienceWorkStreamsDialog;
