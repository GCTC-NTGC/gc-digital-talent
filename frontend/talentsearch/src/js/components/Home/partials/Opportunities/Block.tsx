import React from "react";

import Heading from "@common/components/Heading";
import { Link } from "@common/components";
import { colorMap, type HomeButtonColor } from "./styles";

// Define the interface
export interface OpportunityBlockProps {
  content: {
    color: HomeButtonColor;
    title: string;
    summary: string;
    link: {
      path: string;
      label: string;
    };
  };
}

// Create the page component
const OpportunityBlock = ({ content }: OpportunityBlockProps) => (
  <div
    {...colorMap[content.color]}
    data-h2-display="base(flex)"
    data-h2-flex-direction="base(column)"
    data-h2-padding="base(0, 0, 0, x1)"
  >
    <Heading
      level="h3"
      data-h2-font-size="base(h6)"
      data-h2-margin="base(0, 0, x0.25, 0)"
    >
      {content.title}
    </Heading>
    <p data-h2-flex-grow="base(1)" data-h2-margin="base(x1, 0)">
      {content.summary}
    </p>
    <div>
      <Link
        color={content.color}
        mode="solid"
        type="button"
        href={content.link.path}
      >
        {content.link.label}
      </Link>
    </div>
  </div>
);

// Export the component
export default OpportunityBlock;
