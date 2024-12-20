import { WellColor, Well } from "@gc-digital-talent/ui";

interface StatusSummaryProps {
  status: string;
  description: string;
  color: WellColor;
}

const StatusSummary = ({
  status,
  description,
  color,
  ...rest
}: StatusSummaryProps) => {
  return (
    <Well color={color} {...rest}>
      <p data-h2-font-weight="base(bold)" data-h2-padding-bottom="base(x.5)">
        {status}
      </p>
      <p>{description}</p>
    </Well>
  );
};

export default StatusSummary;
