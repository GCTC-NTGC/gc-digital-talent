import React from "react";
import { useIntl } from "react-intl";
import { MinusIcon, PlusIcon } from "@heroicons/react/24/outline";

import { Button } from "@common/components";

interface EquityOptionProps {
  isAdded: boolean;
  title: string;
  onOpen: () => void;
}

const EquityOption: React.FC<EquityOptionProps> = ({
  isAdded,
  onOpen,
  title,
}) => {
  const intl = useIntl();

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
        ? { "data-h2-border": "base(left, .5rem, solid, dark.dt-primary)" }
        : { "data-h2-border": "base(left, .5rem, solid, dt-primary)" })}
    >
      <span>{title}</span>
      <span style={{ flexShrink: 0 }}>
        <Button
          onClick={onOpen}
          type="button"
          mode="outline"
          color={isAdded ? "secondary" : "primary"}
        >
          <span data-h2-display="base(flex)" data-h2-align-items="base(center)">
            <Icon
              style={{ height: iconSize, width: iconSize }}
              data-h2-margin="base(0, x.125, 0, 0)"
            />
            <span>{isAdded ? removeText : addText}</span>
          </span>
        </Button>
      </span>
    </div>
  );
};

export default EquityOption;
