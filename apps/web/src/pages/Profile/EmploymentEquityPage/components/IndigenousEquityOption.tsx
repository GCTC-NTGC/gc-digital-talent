import React from "react";
import { useIntl } from "react-intl";
import { PlusIcon } from "@heroicons/react/24/outline";

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

const dialogMap: Record<EquityGroup, React.FC<IndigenousDialogProps>> = {
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

  const iconSize = "1rem";

  return (
    <div
      data-h2-margin="base(x.125, 0, 0, 0)"
      data-h2-padding="base(x.5)"
      data-h2-shadow="base(m)"
      data-h2-radius="base(0px, s, s, 0px)"
      data-h2-overflow="base(hidden)"
      data-h2-display="base(flex)"
      data-h2-align-items="base(center)"
      data-h2-justify-content="base(space-between)"
      {...(isAdded
        ? { "data-h2-border-left": "base(.5rem solid dt-primary.dark)" }
        : { "data-h2-border-left": "base(.5rem solid dt-primary)" })}
    >
      <span>{title}</span>
      <span style={{ flexShrink: 0 }}>
        <Dialog indigenousCommunities={indigenousCommunities} onSave={onSave}>
          <Button
            type="button"
            mode="outline"
            color={isAdded ? "secondary" : "primary"}
          >
            <span
              data-h2-display="base(flex)"
              data-h2-align-items="base(center)"
            >
              {!isAdded && (
                <PlusIcon
                  style={{ height: iconSize, width: iconSize }}
                  data-h2-margin="base(0, x.125, 0, 0)"
                />
              )}
              <span>{isAdded ? removeText : addText}</span>
            </span>
          </Button>
        </Dialog>
      </span>
    </div>
  );
};

export default EquityOption;
