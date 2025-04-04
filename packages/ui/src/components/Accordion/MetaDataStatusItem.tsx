import CheckCircleIcon from "@heroicons/react/20/solid/CheckCircleIcon";
import XCircleIcon from "@heroicons/react/20/solid/XCircleIcon";
import NoSymbolIcon from "@heroicons/react/20/solid/NoSymbolIcon";
import ExclamationCircleIcon from "@heroicons/react/20/solid/ExclamationCircleIcon";
import QuestionMarkCircleIcon from "@heroicons/react/20/solid/QuestionMarkCircleIcon";
import BuildingLibraryIcon from "@heroicons/react/20/solid/BuildingLibraryIcon";

import { assertUnreachable } from "@gc-digital-talent/helpers";

import { HydrogenAttributes, IconType } from "../../types";

type Status =
  | "selected"
  | "empty"
  | "declined"
  | "error"
  | "interested"
  | "in_program";

export interface AccordionMetaDataStatusItemProps {
  label: string;
  status: Status;
}

function getIcon(status: Status): IconType {
  if (status === "selected") {
    return CheckCircleIcon;
  }
  if (status === "empty") {
    return XCircleIcon;
  }
  if (status === "declined") {
    return NoSymbolIcon;
  }
  if (status === "error") {
    return ExclamationCircleIcon;
  }
  if (status === "interested") {
    return QuestionMarkCircleIcon;
  }
  if (status === "in_program") {
    return BuildingLibraryIcon;
  }
  return assertUnreachable(status);
}

function getColorStyles(status: Status): HydrogenAttributes {
  if (status === "selected") {
    return {
      "data-h2-color": "base(success) base:dark(success.lighter)",
    };
  }
  if (status === "empty") {
    return {
      "data-h2-color": "base(black.lighter) base:dark(black.darker-50)",
    };
  }
  if (status === "declined") {
    return {
      "data-h2-color": "base(black.lighter) base:dark(black.darker-50)",
    };
  }
  if (status === "error") {
    return {
      "data-h2-color": "base(error) base:dark(error.lighter)",
    };
  }
  if (status === "interested") {
    return {
      "data-h2-color": "base(primary) base:dark(primary.lighter)",
    };
  }
  if (status === "in_program") {
    return {
      "data-h2-color": "base(primary) base:dark(primary.lighter)",
    };
  }
  return assertUnreachable(status);
}

// based on the BoolCheckIcon component
function MetaDataStatusItem({
  label,
  status,
}: AccordionMetaDataStatusItemProps) {
  const Icon = getIcon(status);
  const colorStyles = getColorStyles(status);

  return (
    <div
      data-h2-display="base(flex)"
      data-h2-align-items="base(center)"
      data-h2-gap="base(x.25)"
    >
      <Icon
        data-h2-width="base(x.75)"
        data-h2-height="base(x.75)"
        {...colorStyles}
      />
      <span data-h2-color="base(black.light)" data-h2-font-weight="base(400)">
        {label}
      </span>
    </div>
  );
}

export default MetaDataStatusItem;
