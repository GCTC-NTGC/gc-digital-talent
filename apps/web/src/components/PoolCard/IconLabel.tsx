import { ReactNode } from "react";

import { IconType } from "@gc-digital-talent/ui";

interface IconLabelProps {
  label: ReactNode;
  icon: IconType;
  children?: ReactNode;
}

const IconLabel = ({ label, icon, children }: IconLabelProps) => {
  const Icon = icon;

  return (
    <p className="grid grid-cols-[calc(var(--spacing)*6)_1fr] gap-x-1.5">
      <span className="inline-block size-6 align-middle">
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
