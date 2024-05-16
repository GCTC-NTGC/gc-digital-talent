import BarsArrowUpIcon from "@heroicons/react/24/solid/BarsArrowUpIcon";
import BarsArrowDownIcon from "@heroicons/react/24/solid/BarsArrowDownIcon";

interface SortIconProps {
  isSortedDesc?: boolean;
  size?: string | number;
}

const SortIcon = ({ isSortedDesc, size = "0.75rem" }: SortIconProps) => {
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
