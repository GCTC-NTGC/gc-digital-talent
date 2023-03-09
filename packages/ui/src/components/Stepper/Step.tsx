import React from "react";
import { useIntl } from "react-intl";
import { Link } from "react-router-dom";

import { StepState, IconType } from "./types";
import {
  iconColorMap,
  linkStyleMap,
  getIconFromState,
  messageMap,
} from "./utils";

export interface StepProps {
  children: React.ReactNode;
  href: string;
  icon: IconType;
  last?: boolean;
  state: StepState;
}

const Step = ({ children, href, icon, last = false, state }: StepProps) => {
  const intl = useIntl();
  const Icon = getIconFromState(state, icon);
  const iconStyles = iconColorMap.get(state);
  const linkStyles = linkStyleMap.get(state);
  const message = messageMap.get(state);

  return (
    <li>
      <Link
        aria-current={state === "active" ? "step" : undefined}
        to={href}
        {...(state === "disabled"
          ? {
              role: "link",
              "aria-disabled": "true",
            }
          : {})}
        {...(linkStyles || {})}
      >
        <span
          data-h2-align-items="base(center)"
          data-h2-flex-grid="base(center, x.4, 0)"
          data-h2-justify-content="base(center)"
          data-h2-position="base(relative)"
        >
          {message && (
            <span data-h2-visually-hidden="base(hidden)">
              {intl.formatMessage(message)}
            </span>
          )}
          {Icon && (
            <span
              data-h2-align-items="base(center)"
              data-h2-display="base(flex)"
              data-h2-flex-item="base(content)"
              data-h2-justify-content="base(center)"
              data-h2-height="base(x1.25)"
              data-h2-width="base(x1.25)"
              data-h2-position="base(relative)"
              data-h2-radius="base(circle)"
              {...(iconStyles || {})}
            >
              <Icon data-h2-height="base(x.5)" data-h2-width="base(x.5)" />
              {!last && (
                <span
                  data-h2-display="base(block)"
                  data-h2-position="base(absolute)"
                  data-h2-top="base(100%)"
                  data-h2-left="base(50%)"
                  data-h2-transform="base(translateX(-50%))"
                  data-h2-height="base(x.75)"
                  data-h2-width="base(x.15)"
                  {...(iconStyles || {})}
                />
              )}
            </span>
          )}
          <span data-h2-flex-item="base(content)">{children}</span>
        </span>
      </Link>
    </li>
  );
};

export default Step;
