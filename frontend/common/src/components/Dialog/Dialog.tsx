import React from "react";
import { XIcon } from "@heroicons/react/outline";

import Overlay from "./Overlay";
import Content from "./Content";

import type { DialogProps } from "./types";

import "@reach/dialog/styles.css";
import "./dialog.css";

const Dialog: React.FC<DialogProps> = ({
  title,
  subtitle,
  onDismiss,
  isOpen,
  children,
}) => (
  <Overlay isOpen={isOpen} onDismiss={onDismiss}>
    <Content aria-labelledby="dialog-title">
      <div
        data-h2-radius="b(s, s, none, none)"
        data-h2-padding="b(all, m)"
        data-h2-bg-color="b(linear-70[lightpurple][lightnavy])"
        data-h2-font-color="b(white)"
        data-h2-position="b(relative)"
      >
        <button
          type="button"
          onClick={onDismiss}
          className="dialog-close"
          data-h2-padding="b(all, xs)"
          data-h2-position="b(absolute)"
          data-h2-location="b(top-right, s)"
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
            <p data-h2-margin="b(top, xs) b(bottom, none)">{subtitle}</p>
          )}
        </div>
      </div>
      <div
        data-h2-bg-color="b(white)"
        data-h2-padding="b(all, m)"
        data-h2-radius="b(none, none, s, s)"
      >
        {children}
      </div>
    </Content>
  </Overlay>
);

export default Dialog;
