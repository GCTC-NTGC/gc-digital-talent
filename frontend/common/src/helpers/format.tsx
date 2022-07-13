import React from "react";

/**
 * Wraps text in strong tags.
 * @param text text to wrap.
 */
export const strong = (text: string): React.ReactNode => (
  <strong>{text}</strong>
);

/**
 * Wraps text in span to make invisible to sighted users
 * @param text text to wrap.
 */
export const hidden = (text: string): React.ReactNode => (
  <span data-h2-visibility="base(invisible)">{text}</span>
);
