import React from "react";
import { useIntl } from "react-intl";
import { XIcon } from "@heroicons/react/outline";

import Overlay from "./Overlay";
import Content from "./Content";

import "@reach/dialog/styles.css";
import "./dialog.css";

export type Color = "ts-primary" | "ia-primary" | "ia-secondary";

export interface DialogProps {
  isOpen: boolean;
  color?: Color;
  onDismiss: (e: React.MouseEvent | React.KeyboardEvent) => void;
  title: string;
  subtitle?: string;
  confirmation?: boolean;
  footer?: React.ReactNode;
  centered?: boolean;
}

export const colorMap: Record<Color, Record<string, string>> = {
  "ts-primary": {
    "data-h2-background-color": "base(dt-linear)",
    "data-h2-color": "base(dt-white)",
  },
  "ia-primary": {
    "data-h2-background-color": "base(ia-linear-secondary)",
    "data-h2-color": "base(ia-white)",
  },
  "ia-secondary": {
    "data-h2-background-color": "base(ia-linear-primary)",
    "data-h2-color": "base(ia-white)",
  },
};

const Dialog: React.FC<DialogProps> = ({
  title,
  subtitle,
  onDismiss,
  isOpen,
  color = "ia-primary",
  confirmation = false,
  centered = false,
  footer,
  children,
}) => {
  const intl = useIntl();
  return (
    <Overlay
      isOpen={isOpen}
      onDismiss={onDismiss}
      data-h2-font-family="base(sans)"
    >
      <Content
        aria-labelledby="dialog-title"
        className={centered ? `dialog--centered` : undefined}
      >
        <div
          className={`dialog__header ${
            confirmation ? `dialog__header--confirmation` : null
          }`}
          data-h2-radius="base(s, s, none, none)"
          data-h2-padding="base(x1)"
          data-h2-position="base(relative)"
          {...(!confirmation
            ? { ...colorMap[color] }
            : {
                "data-h2-background-color": "base(dt-white)",
              })}
        >
          <button
            type="button"
            onClick={onDismiss}
            className="dialog-close"
            data-h2-padding="base(x.5)"
            data-h2-position="base(absolute)"
            data-h2-offset="base(x.5, x.5, auto, auto)"
            {...(confirmation
              ? {
                  "data-h2-color": "base(dt-black)",
                }
              : {
                  "data-h2-color": "base(dt-white)",
                })}
          >
            <span data-h2-visibility="base(invisible)">
              {intl.formatMessage({
                defaultMessage: "Close dialog",
                description: "Text for the button to close a modal dialog.",
              })}
            </span>
            <XIcon className="dialog-close__icon" />
          </button>
          <div
            className="dialog__title dialog__title--standard"
            data-h2-position="base(relative)"
          >
            <h1
              id="dialog-title"
              data-h2-font-weight="base(700)"
              data-h2-font-size="base(h3, 1.3)"
              data-h2-margin="base(0)"
            >
              {title}
            </h1>
            {subtitle && (
              <p
                data-h2-margin="base(x.25, 0, 0, 0)"
                {...(confirmation
                  ? {
                      "data-h2-color": "base(dt-primary)",
                    }
                  : null)}
              >
                {subtitle}
              </p>
            )}
          </div>
        </div>
        <div className="dialog__content">{children}</div>
        {footer ? (
          <div
            className="dialog__footer"
            data-h2-margin="base(x1, 0, 0, 0)"
            data-h2-padding="base(x1, 0, 0, 0)"
            data-h2-border="base(top, 1px, solid, dark.dt-gray)"
          >
            {footer}
          </div>
        ) : null}
      </Content>
    </Overlay>
  );
};

export default Dialog;
