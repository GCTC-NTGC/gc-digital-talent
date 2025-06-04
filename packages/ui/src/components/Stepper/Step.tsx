import { useIntl } from "react-intl";
import { ReactNode } from "react";

import { getIconFromState, messageMap, StepVariants, step } from "./utils";
import Link from "../Link";

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

interface StepProps
  extends Omit<StepLinkProps, "children" | "state">,
    Required<Pick<StepVariants, "state">> {
  last?: boolean;
  label: ReactNode;
}

const Step = ({
  label,
  href,
  preventDisable,
  last = false,
  state,
}: StepProps) => {
  const intl = useIntl();
  const Icon = getIconFromState(state);
  const message = messageMap.get(state);
  const { link, icon, tail, text } = step({ state });

  return (
    <li className="relative">
      <StepLink
        href={href}
        state={state}
        preventDisable={preventDisable}
        className={link()}
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
        <span className={text()}>
          {message ? intl.formatMessage(message, { label }) : label}
        </span>
      </StepLink>
    </li>
  );
};

export default Step;
