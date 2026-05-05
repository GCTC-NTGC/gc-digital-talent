import CheckCircleIcon from "@heroicons/react/20/solid/CheckCircleIcon";
import XCircleIcon from "@heroicons/react/20/solid/XCircleIcon";
import NoSymbolIcon from "@heroicons/react/20/solid/NoSymbolIcon";
import ExclamationCircleIcon from "@heroicons/react/20/solid/ExclamationCircleIcon";
import QuestionMarkCircleIcon from "@heroicons/react/20/solid/QuestionMarkCircleIcon";
import BuildingLibraryIcon from "@heroicons/react/20/solid/BuildingLibraryIcon";
import type { VariantProps } from "tailwind-variants";
import { tv } from "tailwind-variants";

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
      // eslint-disable-next-line camelcase
      in_program: {
        icon: "text-secondary dark:text-secondary-300",
      },
    },
  },
});

type StatusItemVariants = VariantProps<typeof statusItem>;
type RequiredStatus = Required<Pick<StatusItemVariants, "status">>;

interface IconProps {
  className: string;
  status: RequiredStatus["status"];
}

const Icon = ({ status, ...rest }: IconProps) => {
  if (status === "selected") {
    return <CheckCircleIcon {...rest} />;
  }
  if (status === "empty") {
    return <XCircleIcon {...rest} />;
  }
  if (status === "declined") {
    return <NoSymbolIcon {...rest} />;
  }
  if (status === "error") {
    return <ExclamationCircleIcon {...rest} />;
  }
  if (status === "interested") {
    return <QuestionMarkCircleIcon {...rest} />;
  }
  if (status === "in_program") {
    return <BuildingLibraryIcon {...rest} />;
  }

  return null;
};

export interface MetaDataStatusItemProps extends RequiredStatus {
  label: string;
}

// based on the BoolCheckIcon component
function MetaDataStatusItem({ label, status }: MetaDataStatusItemProps) {
  const { base, icon: iconStyles, label: labelStyles } = statusItem({ status });

  return (
    <div className={base()}>
      <Icon className={iconStyles()} status={status} />
      <span className={labelStyles()}>{label}</span>
    </div>
  );
}

export default MetaDataStatusItem;
