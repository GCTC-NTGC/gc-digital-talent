import React from "react";
import { useIntl } from "react-intl";
import { Link } from "react-router-dom";

import { StepState } from "./types";
import { linkStyleMap, getIconFromState, messageMap } from "./utils";
import { IconType } from "../../types";

interface StepLinkProps {
  children: React.ReactNode;
  href: string;
  state: StepState;
  preventDisable?: boolean;
}

const StepLink = ({
  children,
  href,
  state,
  preventDisable,
  ...rest
}: StepLinkProps) => {
  const linkStyles = linkStyleMap.get(state);

  // Return a disabled Link
  if (state === "disabled" && !preventDisable) {
    return (
      <a role="link" aria-disabled="true" {...(linkStyles || {})} {...rest}>
        {children}
      </a>
    );
  }

  return (
    <Link
      aria-current={state === "active" ? "step" : undefined}
      to={href}
      {...(linkStyles || {})}
      {...rest}
    >
      {children}
    </Link>
  );
};
export interface StepProps extends Omit<StepLinkProps, "children"> {
  icon: IconType;
  last?: boolean;
  label: React.ReactNode;
}

const Step = ({
  label,
  href,
  icon,
  preventDisable,
  last = false,
  state,
}: StepProps) => {
  const intl = useIntl();
  const Icon = getIconFromState(state, icon);
  const message = messageMap.get(state);

  return (
    <li>
      <StepLink
        href={href}
        state={state}
        preventDisable={preventDisable}
        data-h2-display="base(block)"
        data-h2-width="base(100%)"
        data-h2-padding-left="base(x1.5)"
        data-h2-position="base(relative)"
        data-h2-outline="base(none)"
      >
        <span
          data-h2-position="base(absolute)"
          data-h2-location="base(0, auto, auto, 0)"
          data-h2-width="base(x1.5)"
          data-h2-height="base(100%)"
        >
          {!last && (
            <div
              className="Step__Tail Step__Flair"
              data-h2-position="base(absolute)"
              data-h2-location="base(-x.1, auto, auto, 50%)"
              data-h2-transform="base(translate(-50%, 0))"
              data-h2-height="base(calc(100% + x.85))"
              data-h2-width="base(x.15)"
            />
          )}

          {Icon && (
            <span
              className="Step__Icon Step__Flair"
              data-h2-position="base(absolute)"
              data-h2-location="base(-x.1, auto, auto, 50%)"
              data-h2-transform="base(translate(-50%, 0))"
              data-h2-background="base(primary.light)"
              data-h2-radius="base(circle)"
              data-h2-height="base(x1.25)"
              data-h2-width="base(x1.25)"
            >
              <Icon
                data-h2-position="base(absolute)"
                data-h2-location="base(50%, auto, auto, 50%)"
                data-h2-transform="base(translate(-50%, -50%))"
                data-h2-height="base(x.65)"
                data-h2-width="base(x.65)"
              />
            </span>
          )}
        </span>
        <span
          className="Step__Text"
          data-h2-display="base(inline-block)"
          data-h2-margin-left="base(x.5)"
        >
          {message ? intl.formatMessage(message, { label }) : label}
        </span>
      </StepLink>
    </li>
  );
};

export default Step;
