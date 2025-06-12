import { HTMLAttributes, ReactElement, ReactNode } from "react";

import Heading from "~/components/IAPHeading/Heading";

interface CardProps {
  title: string;
  Icon?: (props: HTMLAttributes<HTMLOrSVGElement>) => ReactElement;
  children?: ReactNode;
}

const Card = ({ title, Icon, children }: CardProps) => (
  <div className="text-center">
    {Icon && <Icon className="inline-block w-24" aria-hidden="true" />}
    <Heading level="h4" size="h3" color="white" className="my-6">
      {title}
    </Heading>
    <div className="text-white">{children}</div>
  </div>
);

export default Card;
