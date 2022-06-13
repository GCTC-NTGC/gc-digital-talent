import React from "react";
import { useIntl } from "react-intl";
import { MinusIcon, PlusIcon } from "@heroicons/react/outline";

import { Button } from "@common/components";

const hiddenText = (...chunks: string[]) => (
  <span data-h2-visibility="b(invisible)">{chunks}</span>
);

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
      description:
        "Text label for button to remove employment equity category from profile.",
    },
    {
      title,
      hidden: hiddenText,
    },
  );

  const addText = intl.formatMessage(
    {
      defaultMessage: "Add <hidden>{title} </hidden>to profile",
      description:
        "Text label for button to add employment equity category to profile.",
    },
    {
      title,
      hidden: hiddenText,
    },
  );

  const iconSize = "1rem";
  const Icon = isAdded ? MinusIcon : PlusIcon;

  return (
    <div
      data-h2-margin="b(x.125, 0, 0, 0)"
      data-h2-padding="b(x.5)"
      data-h2-shadow="b(m)"
      data-h2-radius="b(0px, s, s, 0px)"
      data-h2-overflow="b(hidden, all)"
      data-h2-display="b(flex)"
      data-h2-align-items="b(center)"
      data-h2-justify-content="b(space-between)"
      {...(isAdded
        ? { "data-h2-border": "b(left, .5rem, solid, dark.dt-primary)" }
        : { "data-h2-border": "b(left, .5rem, solid, dt-primary)" })}
    >
      <span>{title}</span>
      <span style={{ flexShrink: 0 }}>
        <Button
          onClick={onOpen}
          type="button"
          mode="outline"
          color={isAdded ? "secondary" : "primary"}
        >
          <span data-h2-display="b(flex)" data-h2-align-items="b(center)">
            <Icon
              style={{ height: iconSize, width: iconSize }}
              data-h2-margin="b(0, x.125, 0, 0)"
            />
            <span>{isAdded ? removeText : addText}</span>
          </span>
        </Button>
      </span>
    </div>
  );
};

export default EquityOption;
