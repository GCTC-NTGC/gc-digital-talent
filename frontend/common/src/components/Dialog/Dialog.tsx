import React from "react";
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
    "data-h2-background-color": "b(dt-linear)",
    "data-h2-color": "b(dt-white)",
  },
  "ia-primary": {
    "data-h2-background-color": "b(ia-linear-secondary)",
    "data-h2-color": "b(ia-white)",
  },
  "ia-secondary": {
    "data-h2-background-color": "b(ia-linear-primary)",
    "data-h2-color": "b(ia-white)",
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
  return (
    <Overlay
      isOpen={isOpen}
      onDismiss={onDismiss}
      data-h2-font-family="b(sans)"
    >
      <Content
        aria-labelledby="dialog-title"
        className={centered ? `dialog--centered` : undefined}
      >
        <div
          className={`dialog__header ${
            confirmation ? `dialog__header--confirmation` : null
          }`}
          data-h2-radius="b(s, s, none, none)"
          data-h2-padding="b(x1)"
          data-h2-position="b(relative)"
          {...(!confirmation
            ? { ...colorMap[color] }
            : {
                "data-h2-background-color": "b(dt-white)",
              })}
        >
          <button
            type="button"
            onClick={onDismiss}
            className="dialog-close"
            data-h2-padding="b(x.5)"
            data-h2-position="b(absolute)"
            data-h2-offset="b(x.5, x.5, auto, auto)"
            {...(confirmation
              ? {
                  "data-h2-color": "b(dt-black)",
                }
              : {
                  "data-h2-color": "b(dt-white)",
                })}
          >
            <span data-h2-visibility="b(invisible)">Close dialog</span>
            <XIcon className="dialog-close__icon" />
          </button>
          <div
            className="dialog__title dialog__title--standard"
            data-h2-position="b(relative)"
          >
            <h1
              id="dialog-title"
              data-h2-font-weight="b(700)"
              data-h2-font-size="b(h3, 1.3)"
              data-h2-margin="b(0)"
            >
              {title}
            </h1>
            {subtitle && (
              <p
                data-h2-margin="b(x.25, 0, 0, 0)"
                {...(confirmation
                  ? {
                      "data-h2-color": "b(dt-primary)",
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
            data-h2-margin="b(x1, 0, 0, 0)"
            data-h2-padding="b(x1, 0, 0, 0)"
            data-h2-border="b(top, 1px, solid, dark.dt-gray)"
          >
            {footer}
          </div>
        ) : null}
      </Content>
    </Overlay>
  );
};

export default Dialog;
