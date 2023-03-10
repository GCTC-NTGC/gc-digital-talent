import React from "react";
import { useIntl } from "react-intl";
import { Link } from "react-router-dom";

import { StepState, IconType } from "./types";
import { linkStyleMap, getIconFromState, messageMap } from "./utils";

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
export interface StepProps extends StepLinkProps {
  icon: IconType;
  last?: boolean;
}

const Step = ({
  children,
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
        data-h2-align-items="base(flex-start)"
        data-h2-display="base(flex)"
        data-h2-gap="base(0, x.25)"
        data-h2-justify-content="base(flex-start)"
        data-h2-outline="base(none)"
        data-h2-position="base(relative)"
      >
        {message && (
          <span data-h2-visually-hidden="base(hidden)">
            {intl.formatMessage(message)}
          </span>
        )}
        {Icon && (
          <span
            className="Step__Icon Step__Flair"
            data-h2-align-items="base(center)"
            data-h2-display="base(flex)"
            data-h2-flex-shrink="base(0)"
            data-h2-justify-content="base(center)"
            data-h2-height="base(x1.25)"
            data-h2-width="base(x1.25)"
            data-h2-position="base(relative)"
            data-h2-radius="base(circle)"
          >
            <Icon data-h2-height="base(x.5)" data-h2-width="base(x.5)" />
          </span>
        )}
        {!last && (
          <span
            className="Step__Tail Step__Flair"
            data-h2-align-self="base(stretch)"
            data-h2-display="base(block)"
            data-h2-height="base(100%)"
            data-h2-left="base(x.5)"
            data-h2-position="base(absolute)"
            data-h2-top="base(x1.25)"
            data-h2-transform="base(translateX(50%))"
            data-h2-width="base(x.15)"
          />
        )}
        <span
          className="Step__Text"
          data-h2-flex-item="base(content)"
          data-h2-margin="base(x.1, 0, 0, 0)"
        >
          {children}
        </span>
      </StepLink>
    </li>
  );
};

export default Step;
