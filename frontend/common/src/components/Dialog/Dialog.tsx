import React from "react";
import { XIcon } from "@heroicons/react/outline";

import Overlay from "./Overlay";
import Content from "./Content";

import "@reach/dialog/styles.css";
import "./dialog.css";

export type Color = "primary" | "secondary" | "tertiary";

interface DialogProps {
  isOpen: boolean;
  color?: Color;
  onDismiss: (e: React.MouseEvent | React.KeyboardEvent) => void;
  title: string;
  subtitle?: string;
  confirmation?: boolean;
  footer?: React.ReactNode;
}

export const colorMap: Record<Color, Record<string, string>> = {
  primary: {
    "data-h2-bg-color": "b(linear-70[lightpurple][lightnavy])",
    "data-h2-font-color": "b(white)",
  },
  secondary: {
    "data-h2-bg-color": "b(linear-90[ia-lightpurple][ia-darkpurple])",
    "data-h2-font-color": "b(white)",
  },
  tertiary: {
    "data-h2-bg-color": "b(linear-90[ia-pink][ia-darkpink])",
    "data-h2-font-color": "b(white)",
  },
};

const Dialog: React.FC<DialogProps> = ({
  title,
  subtitle,
  onDismiss,
  isOpen,
  color = "primary",
  confirmation = false,
  footer,
  children,
}) => {
  return (
    <Overlay isOpen={isOpen} onDismiss={onDismiss}>
      <Content aria-labelledby="dialog-title">
        <div
          className={`dialog__header ${
            confirmation ? `dialog__header--confirmation` : null
          }`}
          data-h2-radius="b(s, s, none, none)"
          data-h2-padding="b(all, m)"
          data-h2-position="b(relative)"
          {...(!confirmation
            ? { ...colorMap[color] }
            : {
                "data-h2-bg-color": "b(white)",
              })}
        >
          <button
            type="button"
            onClick={onDismiss}
            className="dialog-close"
            data-h2-padding="b(all, xs)"
            data-h2-position="b(absolute)"
            data-h2-location="b(top-right, s)"
            {...(confirmation
              ? {
                  "data-h2-font-color": "b(black)",
                }
              : {
                  "data-h2-font-color": "b(white)",
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
              data-h2-font-size="b(h3)"
              data-h2-margin="b(all, none)"
            >
              {title}
            </h1>
            {subtitle && (
              <p
                data-h2-margin="b(top, xs) b(bottom, none)"
                {...(confirmation
                  ? {
                      "data-h2-font-color": "b(lightpurple)",
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
            data-h2-margin="b(top, m)"
            data-h2-padding="b(top, m)"
            data-h2-border="b(darkgray, top, solid, s)"
          >
            {footer}
          </div>
        ) : null}
      </Content>
    </Overlay>
  );
};

export default Dialog;
