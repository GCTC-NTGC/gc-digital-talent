/* eslint-disable camelcase */
import CheckCircleIcon from "@heroicons/react/20/solid/CheckCircleIcon";
import XCircleIcon from "@heroicons/react/20/solid/XCircleIcon";
import NoSymbolIcon from "@heroicons/react/20/solid/NoSymbolIcon";
import ExclamationCircleIcon from "@heroicons/react/20/solid/ExclamationCircleIcon";
import QuestionMarkCircleIcon from "@heroicons/react/20/solid/QuestionMarkCircleIcon";
import BuildingLibraryIcon from "@heroicons/react/20/solid/BuildingLibraryIcon";
import { tv, VariantProps } from "tailwind-variants";

import { assertUnreachable } from "@gc-digital-talent/helpers";

import { IconType } from "../../types";

const statusItem = tv({
  slots: {
    base: "flex items-center gap-x-1.5",
    icon: "size-4",
    label: "font-normal text-gray-600 dark:text-gray-100",
  },
  variants: {
    status: {
      selected: {
        icon: "text-success dark:text-success-300",
      },
      empty: {
        icon: "text-gray dark:text-gray-200",
      },
      declined: {
        icon: "text-gray dark:text-gray-200",
      },
      error: {
        icon: "text-error dark:text-error-300",
      },
      interested: {
        icon: "text-secondary dark:text-secondary-300",
      },
      in_program: {
        icon: "text-secondary dark:text-secondary-300",
      },
    },
  },
});

type StatusItemVariants = VariantProps<typeof statusItem>;
type RequiredStatus = Required<Pick<StatusItemVariants, "status">>;

function getIcon(status: NonNullable<StatusItemVariants["status"]>): IconType {
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

export interface AccordionMetaDataStatusItemProps extends RequiredStatus {
  label: string;
}

// based on the BoolCheckIcon component
function MetaDataStatusItem({
  label,
  status,
}: AccordionMetaDataStatusItemProps) {
  const Icon = getIcon(status);
  const { base, icon: iconStyles, label: labelStyles } = statusItem({ status });

  return (
    <div className={base()}>
      <Icon className={iconStyles()} />
      <span className={labelStyles()}>{label}</span>
    </div>
  );
}

export default MetaDataStatusItem;
