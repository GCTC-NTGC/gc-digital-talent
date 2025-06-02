import { ReactNode } from "react";

import { TalentNominationStep } from "@gc-digital-talent/graphql";
import { Heading, Link } from "@gc-digital-talent/ui";

import useRequiredParams from "~/hooks/useRequiredParams";
import useRoutes from "~/hooks/useRoutes";

import { RouteParams } from "../../types";

interface ReviewHeadingProps {
  children: ReactNode;
  link: {
    to: TalentNominationStep;
    name: ReactNode;
  };
}

const ReviewHeading = ({ children, link }: ReviewHeadingProps) => {
  const { id } = useRequiredParams<RouteParams>("id");
  const paths = useRoutes();

  return (
    <div
      data-h2-display="base(flex)"
      data-h2-flex-direction="base(column) p-tablet(row)"
      data-h2-align-items="base(center)"
      data-h2-gap="base(x1)"
      data-h2-margin-bottom="base(x1)"
      data-h2-justify-content="base(space-between)"
    >
      <Heading level="h3" size="h4" data-h2-margin="base(0)">
        {children}
      </Heading>
      <Link
        href={`${paths.talentNomination(id)}?step=${link.to}`}
        mode="inline"
        color="primary"
      >
        {link.name}
      </Link>
    </div>
  );
};

export default ReviewHeading;
