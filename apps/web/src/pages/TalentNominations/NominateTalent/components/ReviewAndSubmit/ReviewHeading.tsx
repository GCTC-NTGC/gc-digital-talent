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
    <div className="mb-6 flex flex-col items-center justify-between gap-6 xs:flex-row">
      <Heading level="h3" size="h4" className="mt-0">
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
