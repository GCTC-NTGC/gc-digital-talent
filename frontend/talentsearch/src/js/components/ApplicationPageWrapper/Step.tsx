import React from "react";
import Link from "@common/components/Link";

export interface StepProps {
  path: string;
  label: string;
  disabled?: boolean;
}

const Step = ({ path, label, disabled }: StepProps) => (
  <Link
    href={path}
    mode="solid"
    type="button"
    color="primary"
    disabled={disabled}
  >
    {label}
  </Link>
);

export default Step;
