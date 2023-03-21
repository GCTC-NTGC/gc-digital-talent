import React from "react";
import { useIntl } from "react-intl";

import { Button } from "@gc-digital-talent/ui";

import { IndigenousCommunity } from "~/api/generated";
import { IndigenousDialog } from "./dialogs";

import { IndigenousDialogProps } from "../types";

type EquityGroup = "indigenous";

interface EquityOptionProps {
  indigenousCommunities: Array<IndigenousCommunity>;
  option: EquityGroup;
  // Note: Just defining the func signature
  onSave: (indigenousCommunities: Array<IndigenousCommunity>) => void;
  title: React.ReactNode;
}

const dialogMap: Record<
  EquityGroup,
  (props: IndigenousDialogProps) => JSX.Element
> = {
  indigenous: IndigenousDialog,
};

const EquityOption = ({
  indigenousCommunities,
  option,
  onSave,
  title,
}: EquityOptionProps) => {
  const intl = useIntl();
  const Dialog = dialogMap[option];

  const removeText = intl.formatMessage(
    {
      defaultMessage: "Edit <hidden>{title}</hidden>",
      id: "s7QD5B",
      description:
        "Text label for button to edit employment equity category from profile.",
    },
    {
      title,
    },
  );

  const addText = intl.formatMessage(
    {
      defaultMessage: "Add <hidden>{title} </hidden>to profile",
      id: "/AJCvK",
      description:
        "Text label for button to add employment equity category to profile.",
    },
    {
      title,
    },
  );

  const isAdded = indigenousCommunities && indigenousCommunities.length > 0;

  return (
    <div
      data-h2-margin="base(x.25, 0, 0, 0)"
      data-h2-background="base(foreground)"
      data-h2-padding="base(x1)"
      data-h2-shadow="base(small)"
      data-h2-radius="base(0px, s, s, 0px)"
      data-h2-overflow="base(hidden)"
      {...(isAdded
        ? { "data-h2-border-left": "base(.5rem solid primary)" }
        : { "data-h2-border-left": "base(.5rem solid secondary)" })}
    >
      <div data-h2-flex-grid="base(center, x1)">
        <span data-h2-flex-item="base(fill)">{title}</span>
        <span data-h2-flex-item="base(content)">
          <Dialog indigenousCommunities={indigenousCommunities} onSave={onSave}>
            <Button
              type="button"
              mode="inline"
              color={isAdded ? "primary" : "secondary"}
              block
            >
              <span
                data-h2-display="base(flex)"
                data-h2-align-items="base(center)"
                data-h2-justify-content="base(center)"
              >
                <span>{isAdded ? removeText : addText}</span>
              </span>
            </Button>
          </Dialog>
        </span>
      </div>
    </div>
  );
};

export default EquityOption;
