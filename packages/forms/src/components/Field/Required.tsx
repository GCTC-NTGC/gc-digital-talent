import React from "react";

export interface RequiredProps {
  required?: boolean;
}

const Required = ({ required }: RequiredProps) =>
  required ? (
    <span data-h2-color="base(error) base:dark(error.lighter)"> *</span>
  ) : null;

export default Required;
