// Vendor dependencies
import React from "react";

// Local helper dependencies

// Local component dependencies
import Heading from "./heading";
import Button from "./button";

// Define the interface
export interface OpportunityBlockProps {
  content: {
    color: string;
    title: string;
    summary: string;
    link: {
      path: string;
      title: string;
      label: string;
    };
  };
}

// Create the page component
const OpportunityBlock: React.FC<OpportunityBlockProps> = ({
  content,
}): React.ReactElement => {
  let blockColor = {};
  if (content.color === "yellow") {
    blockColor = {
      "data-h2-border": "base(left, x.25, solid, tm-yellow)",
    };
  } else if (content.color === "red") {
    blockColor = {
      "data-h2-border": "base(left, x.25, solid, tm-red)",
    };
  } else if (content.color === "blue") {
    blockColor = {
      "data-h2-border": "base(left, x.25, solid, tm-blue)",
    };
  } else if (content.color === "black") {
    blockColor = {
      "data-h2-border": "base(left, x.25, solid, black)",
    };
  }
  return (
    <div
      {...blockColor}
      data-h2-display="base(flex)"
      data-h2-flex-direction="base(column)"
      data-h2-padding="base(0, 0, 0, x1)"
    >
      <Heading type="h3" size="h6" label={content.title} id="" />
      <p data-h2-flex-grow="base(1)" data-h2-margin="base(x1, 0)">
        {content.summary}
      </p>
      <div>
        <Button type="link" color={content.color} content={content.link} />
      </div>
    </div>
  );
};

// Export the component
export default OpportunityBlock;
