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
      <Notice.Title>{label}</Notice.Title>
      <Notice.Content>
        <p>{description}</p>
      </Notice.Content>
    </Notice.Root>
  );
};

export default StatusSummary;
