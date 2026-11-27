import type { ReactNode } from "react";

import {
  Card,
  Heading,
  type HeadingProps,
  type IconType,
} from "@gc-digital-talent/ui";

const Separator = () => <Card.Separator className="my-6" />;

interface TalentRequestSectionCardProps {
  title: ReactNode;
  subtitle?: ReactNode;
  color?: HeadingProps["color"];
  icon?: IconType;
  children: ReactNode;
}

const TalentRequestSectionCard = ({
  title,
  subtitle,
  color,
  icon,
  children,
}: TalentRequestSectionCardProps) => {
  return (
    <Card>
      <Heading color={color} icon={icon} className="mt-0">
        {title}
      </Heading>
      {subtitle && <p>{subtitle}</p>}
      <Separator />
      {children}
    </Card>
  );
};

TalentRequestSectionCard.Separator = Separator;

export default TalentRequestSectionCard;
