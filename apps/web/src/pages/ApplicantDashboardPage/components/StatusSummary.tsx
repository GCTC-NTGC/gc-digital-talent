import { Notice, NoticeProps } from "@gc-digital-talent/ui";

interface StatusSummaryProps {
  label: React.ReactNode;
  description: React.ReactNode;
  color: NoticeProps["color"];
  className: string;
}

const StatusSummary = ({
  label,
  description,
  color,
  ...rest
}: StatusSummaryProps) => {
  return (
    <Notice.Root color={color} {...rest}>
      <Notice.Content>
        <p className="mb-3 font-bold">{label}</p>
        <p>{description}</p>
      </Notice.Content>
    </Notice.Root>
  );
};

export default StatusSummary;
