import * as React from "react";
import { XCircleIcon } from "@heroicons/react/24/outline";
import { useIntl } from "react-intl";

import { styleMap, iconStyleMap, iconMap, dismissStyleMap } from "./styles";

import "./alert.css";

export type AlertType = "success" | "warning" | "info" | "error";

export interface AlertProps
  extends Omit<React.HTMLProps<HTMLDivElement>, "title"> {
  title: React.ReactNode;
  type: AlertType;
  dismissible?: boolean;
  live?: boolean;
  onDismiss?: () => void;
}

const Alert = ({
  title,
  type,
  live = true,
  dismissible = false,
  onDismiss,
  children,
  ...rest
}: AlertProps) => {
  const intl = useIntl();
  const [isOpen, setIsOpen] = React.useState(true);
  const Icon = iconMap[type];

  const close = () => {
    setIsOpen((currentIsOpen) => !currentIsOpen);
    if (onDismiss) {
      onDismiss();
    }
  };

  return isOpen ? (
    <div
      className={`Alert Alert--large Alert--${type}`}
      data-h2-display="base(flex)"
      data-h2-flex-direction="base(column) p-tablet(row)"
      data-h2-background-color="base(white)"
      data-h2-position="base(relative)"
      data-h2-radius="base(s)"
      data-h2-shadow="base(s)"
      data-h2-overflow="base(hidden)"
      data-h2-margin="base(x1, 0)"
      {...(live ? { role: "alert" } : {})}
      {...styleMap[type]}
      {...rest}
    >
      {dismissible && (
        <button
          type="button"
          data-h2-background-color="base(transparent) base:hover(black.10)"
          data-h2-outline="base(none)"
          data-h2-radius="base(9999px)"
          data-h2-position="base(absolute)"
          data-h2-display="base(flex)"
          data-h2-align-items="base(center)"
          data-h2-offset="base(x.5, x.5, auto, auto)"
          data-h2-cursor="base(pointer)"
          data-h2-padding="base(0)"
          data-h2-transition="base(all, 100ms, ease-in)"
          {...dismissStyleMap[type]}
          onClick={close}
        >
          <XCircleIcon
            data-h2-width="base(1.5rem)"
            data-h2-height="base(1.5rem)"
          />
          <span data-h2-visibility="base(invisible)">
            {intl.formatMessage({
              defaultMessage: "Close alert",
              id: "oGXgxJ",
              description: "Text for the close button on alerts",
            })}
          </span>
        </button>
      )}
      <div
        className="Alert__Icon"
        data-h2-content="base:selectors[::after]('')"
        data-h2-display="base(flex)"
        data-h2-align-items="base(center) p-tablet(flex-start)"
        data-h2-justify-content="base(center)"
        data-h2-position="base(relative)"
        data-h2-padding="base(x1)"
        {...iconStyleMap[type]}
      >
        <Icon data-h2-width="base(2rem)" />
      </div>
      <div
        style={{ flexGrow: 1 }}
        data-h2-align-self="base(center)"
        data-h2-padding="base(x2, x1, x1, x1) p-tablet(x1, x1, x1, x2)"
      >
        <p
          data-h2-font-size="base(h5, 1)"
          data-h2-font-weight="base(600)"
          data-h2-margin="base(0, 0, x.25, 0)"
        >
          {title}
        </p>
        <div data-h2-margin="base(0, 0, 0, 0)">{children}</div>
      </div>
    </div>
  ) : null;
};

export default Alert;
