import React from "react";
import { SortAscendingIcon, SortDescendingIcon } from "@heroicons/react/solid";

interface SortIconProps {
  isSortedDesc?: boolean;
  size?: string | number;
}

const SortIcon: React.FC<SortIconProps> = ({
  isSortedDesc,
  size = "0.75rem",
}) => {
  const iconStyles = {
    width: size,
    height: size,
    marginLeft: "0.5rem",
    flexShrink: 0,
  };
  return isSortedDesc ? (
    <SortDescendingIcon style={iconStyles} />
  ) : (
    <SortAscendingIcon style={iconStyles} />
  );
};

export default SortIcon;
