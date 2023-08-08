import React from "react";
import PlusCircleIcon from "@heroicons/react/24/solid/PlusCircleIcon";

import { Link } from "@gc-digital-talent/ui";

interface ControlsProps {
  children: React.ReactNode;
  addLink?: {
    label: React.ReactNode;
    href: string;
  };
}

const Controls = ({ children, addLink }: ControlsProps) => (
  <div
    data-h2-display="base(flex)"
    data-h2-flex-direction="base(column) l-tablet(row)"
    data-h2-gap="base(x.25 0) l-tablet(0 x.25)"
    data-h2-margin-bottom="base(x.25)"
  >
    <div
      data-h2-display="base(flex)"
      data-h2-flex-direction="base(column) l-tablet(row)"
      data-h2-gap="base(x.25 0) l-tablet(0 x.25)"
    >
      {children}
    </div>
    {addLink && (
      <div>
        <Link icon={PlusCircleIcon} color="secondary" href={addLink.href}>
          {addLink.label}
        </Link>
      </div>
    )}
  </div>
);

export default Controls;
