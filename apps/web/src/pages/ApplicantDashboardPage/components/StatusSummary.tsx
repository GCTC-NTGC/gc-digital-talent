import { Well, WellProps } from "@gc-digital-talent/ui";

interface StatusSummaryProps {
  label: React.ReactNode;
  description: React.ReactNode;
  color: WellProps["color"];
}

const StatusSummary = ({
  label,
  description,
  color,
  ...rest
}: StatusSummaryProps) => {
  return (
    <Well color={color} {...rest}>
      <p data-h2-font-weight="base(bold)" data-h2-margin-bottom="base(x.5)">
        {label}
      </p>
      <p>{description}</p>
    </Well>
  );
};

export default StatusSummary;
