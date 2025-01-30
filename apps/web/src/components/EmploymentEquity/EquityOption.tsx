import { useIntl } from "react-intl";
import PlusCircleIcon from "@heroicons/react/24/solid/PlusCircleIcon";
import { ReactNode, JSX } from "react";

import { Button } from "@gc-digital-talent/ui";

import {
  DisabilityDialog,
  VisibleMinorityDialog,
  WomanDialog,
} from "./dialogs";
import { EquityDialogProps } from "./types";

type EquityGroup = "woman" | "minority" | "disability";

interface EquityOptionProps {
  disabled?: boolean;
  isAdded: boolean;
  option: EquityGroup;
  // Note: Just defining the func signature
  onSave: (value: boolean) => Promise<void>;
  title: ReactNode;
  description?: ReactNode;
}

type EquityDialogFunc = (props: EquityDialogProps) => JSX.Element;

const dialogMap: Record<EquityGroup, EquityDialogFunc> = {
  disability: DisabilityDialog,
  minority: VisibleMinorityDialog,
  woman: WomanDialog,
};

const EquityOption = ({
  isAdded,
  option,
  onSave,
  title,
  description,
  disabled,
}: EquityOptionProps) => {
  const intl = useIntl();
  const Dialog = dialogMap[option];

  const removeText = intl.formatMessage(
    {
      defaultMessage: "Edit this information<hidden> for {title}</hidden>",
      id: "+fIw4g",
      description:
        "Text label for button to edit employment equity category in profile.",
    },
    {
      title,
    },
  );

  const addText = intl.formatMessage(
    {
      defaultMessage: "Add <hidden>{title} </hidden>to my profile",
      id: "Re8emH",
      description:
        "Text label for button to add employment equity category to profile.",
    },
    {
      title,
    },
  );

  return (
    <div
      data-h2-background="base(foreground)"
      data-h2-color="base(black)"
      data-h2-padding="base(x1)"
      data-h2-radius="base(rounded)"
      data-h2-shadow="base(m)"
    >
      <p data-h2-font-weight="base(700)" data-h2-padding-bottom="base(x1)">
        {title}
      </p>
      {description && <p data-h2-padding-bottom="base(x1)">{description}</p>}
      <Dialog isAdded={isAdded} onSave={onSave} disabled={disabled}>
        <Button type="button" mode="inline" color="secondary">
          {isAdded ? (
            removeText
          ) : (
            <>
              <PlusCircleIcon
                data-h2-width="base(x1)"
                data-h2-display="base(inline-block)"
                data-h2-vertical-align="base(bottom)"
                data-h2-margin="base(0, x.25, 0, 0) p-tablet(0, x0.5, 0, 0)"
              />
              {addText}
            </>
          )}
        </Button>
      </Dialog>
    </div>
  );
};

export default EquityOption;
