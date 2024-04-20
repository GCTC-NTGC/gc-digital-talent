import React from "react";

import { IconType } from "@gc-digital-talent/ui";

interface IconLabelProps {
  label: React.ReactNode;
  icon: IconType;
  children?: React.ReactNode;
}

const IconLabel = ({ label, icon, children }: IconLabelProps) => {
  const Icon = icon;

  return (
    <p className="grid grid-cols-[1.75rem_1fr] gap-x-1.5">
      <span className="inline-block h-6 w-6 align-middle">
        <Icon />
      </span>
      <span>
        <span className="mr-1 inline-block font-bold">{label}</span>
        {children && <span>{children}</span>}
      </span>
    </p>
  );
};

export default IconLabel;
