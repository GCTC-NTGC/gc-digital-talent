import React from "react";
import { useIntl } from "react-intl";
import { MinusIcon, PlusIcon } from "@heroicons/react/24/outline";

import { Button } from "@common/components";

import {
  DisabilityDialog,
  IndigenousDialog,
  VisibleMinorityDialog,
  WomanDialog,
} from "./dialogs";

import { EquityDialogProps } from "./types";

type EquityGroup = "woman" | "indigenous" | "minority" | "disability";

interface EquityOptionProps {
  isAdded: boolean;
  option: EquityGroup;
  onSave: (value: boolean) => void;
  title: React.ReactNode;
}

const dialogMap: Record<EquityGroup, React.FC<EquityDialogProps>> = {
  disability: DisabilityDialog,
  indigenous: IndigenousDialog,
  minority: VisibleMinorityDialog,
  woman: WomanDialog,
};

const EquityOption = ({
  isAdded,
  option,
  onSave,
  title,
}: EquityOptionProps) => {
  const intl = useIntl();
  const Dialog = dialogMap[option];

  const removeText = intl.formatMessage(
    {
      defaultMessage: "Remove <hidden>{title} </hidden>from profile",
      id: "OQ+K+X",
      description:
        "Text label for button to remove employment equity category from profile.",
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

  const iconSize = "1rem";
  const Icon = isAdded ? MinusIcon : PlusIcon;

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
        <Dialog isAdded={isAdded} onSave={onSave}>
          <Button
            type="button"
            mode="outline"
            color={isAdded ? "secondary" : "primary"}
          >
            <span
              data-h2-display="base(flex)"
              data-h2-align-items="base(center)"
            >
              <Icon
                style={{ height: iconSize, width: iconSize }}
                data-h2-margin="base(0, x.125, 0, 0)"
              />
              <span>{isAdded ? removeText : addText}</span>
            </span>
          </Button>
        </Dialog>
      </span>
    </div>
  );
};

export default EquityOption;
