import { Well, WellProps } from "@gc-digital-talent/ui";

interface StatusSummaryProps {
  label: React.ReactNode;
  description: React.ReactNode;
  color: WellProps["color"];
  className: string;
}

const StatusSummary = ({
  label,
  description,
  color,
  ...rest
}: StatusSummaryProps) => {
  return (
    <Well color={color} {...rest}>
      <p className="mb-3 font-bold">{label}</p>
      <p>{description}</p>
    </Well>
  );
};

export default StatusSummary;
