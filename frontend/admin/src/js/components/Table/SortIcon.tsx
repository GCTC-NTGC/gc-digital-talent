import React from "react";
import { BarsArrowUpIcon, BarsArrowDownIcon } from "@heroicons/react/24/solid";

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
    <BarsArrowDownIcon style={iconStyles} />
  ) : (
    <BarsArrowUpIcon style={iconStyles} />
  );
};

export default SortIcon;
