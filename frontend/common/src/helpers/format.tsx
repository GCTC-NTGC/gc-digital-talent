import React from "react";

/**
 * Wraps text in strong tags.
 * @param text text to wrap.
 */
export const strong = (text: React.ReactNode): React.ReactNode => (
  <strong>{text}</strong>
);

/**
 * Wraps text in span to make invisible to sighted users
 * @param text text to wrap.
 */
export const hidden = (text: React.ReactNode): React.ReactNode => (
  <span data-h2-visibility="b(invisible)">{text}</span>
);
