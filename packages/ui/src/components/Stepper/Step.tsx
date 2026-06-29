import { useIntl } from "react-intl";
import type { ReactNode } from "react";
import CheckIcon from "@heroicons/react/20/solid/CheckIcon";
import XMarkIcon from "@heroicons/react/20/solid/XMarkIcon";

import type { StepVariants } from "./utils";
import { messageMap, step } from "./utils";
import Link from "../Link";
import type { IconType } from "../../types";

interface StepLinkProps {
  children: ReactNode;
  href: string;
  state: StepVariants["state"];
  preventDisable?: boolean;
  className?: string;
}

const StepLink = ({
  children,
  href,
  state,
  preventDisable,
  ...rest
}: StepLinkProps) => {
  // Return a disabled Link
  if (state === "disabled" && !preventDisable) {
    return (
      // NOTE: This is a custom disabled link component
      // eslint-disable-next-line react/forbid-elements
      <a role="link" aria-disabled="true" {...rest}>
        {children}
      </a>
    );
  }

  return (
    <Link
      aria-current={state?.includes("active") ? "step" : undefined}
      href={href}
      mode="text"
      noUnderline
      {...rest}
    >
      {children}
    </Link>
  );
};

type StepState = NonNullable<StepVariants["state"]>;

interface StepProps
  extends
    Omit<StepLinkProps, "children" | "state">,
    Required<Pick<StepVariants, "state">> {
  last?: boolean;
  label: ReactNode;
}

const ICON_MAP: Record<StepState, IconType | null> = {
  completed: CheckIcon,
  error: XMarkIcon,

  // No icon states
  active: null,
  disabled: null,
  "active-error": null,
  default: null,
};

const Step = ({
  label,
  href,
  preventDisable,
  last = false,
  state,
}: StepProps) => {
  const intl = useIntl();
  const Icon = ICON_MAP[state];
  const message = messageMap.get(state);
  const { link, icon, tail, text } = step({ state });
  const ariaLabel = message ? intl.formatMessage(message, { label }) : label;

  return (
    <li className="relative">
      <StepLink
        href={href}
        state={state}
        preventDisable={preventDisable}
        className={link()}
        aria-label={ariaLabel}
      >
        <span className="absolute -top-0.5 left-0 h-full w-9">
          {!last && <div className={tail()} />}

          <span className={icon()}>
            {Icon && (
              <Icon className="absolute top-1/2 left-1/2 size-4 -translate-1/2 transform text-white dark:text-gray-700" />
            )}
            {state?.includes("active") && (
              <span className="absolute top-1/2 left-1/2 size-5 -translate-1/2 transform rounded-full border-3 border-white dark:border-gray-700" />
            )}
          </span>
        </span>
        <span className={text()}>{label}</span>
      </StepLink>
    </li>
  );
};

export default Step;
