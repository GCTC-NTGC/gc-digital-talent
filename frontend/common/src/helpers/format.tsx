import React from "react";

/**
 * Wraps text in strong tags.
 * @param text text to wrap.
 */
// eslint-disable-next-line import/prefer-default-export
export const strong = (text: string): React.ReactNode => (
  <strong>{text}</strong>
);
