import React from "react";

import { Heading, Link } from "@gc-digital-talent/ui";

// Define the interface
export interface FeatureBlockProps {
  content: {
    title: string;
    summary: React.ReactNode;
    img: {
      path: string;
      position?: string;
    };
    link: {
      external?: boolean;
      path: string;
      label: string;
    };
  };
}

// Create the page component
const FeatureBlock = ({ content }: FeatureBlockProps) => {
  const LinkEl = content.link.external ? "a" : Link;
  const linkStyles = {
    "data-h2-background-color": "base:focus-visible(focus)",
    "data-h2-outline": "base(none)",
    "data-h2-color": "base:hover(secondary.darker) base:focus-visible(black)",
  };

  return (
    <div
      data-h2-display="base(flex)"
      data-h2-flex-direction="base(column)"
      data-h2-background-color="base(white) base:dark(black.lighter)"
      data-h2-radius="base(rounded)"
      data-h2-overflow="base(hidden)"
      data-h2-shadow="base(large)"
    >
      <div
        data-h2-color="base(white)"
        data-h2-background-color="base(black.darker)"
        data-h2-padding="base(x1)"
      >
        <Heading
          level="h3"
          size="h2"
          data-h2-font-size="base(h6)"
          data-h2-margin="base(0, 0, x0.25, 0)"
        >
          {content.title}
        </Heading>
      </div>
      <div
        data-h2-height="base(x10) desktop(x12)"
        style={{
          backgroundImage: `url('${content.img.path}')`,
          backgroundPosition: content.img.position || "center",
          backgroundSize: "cover",
        }}
      />
      <p data-h2-flex-grow="base(1)" data-h2-padding="base(x1)">
        {content.summary}
      </p>
      <div data-h2-padding="base(0, x1, x1, x1)">
        <LinkEl href={content.link.path} {...linkStyles}>
          {content.link.label}
        </LinkEl>
      </div>
    </div>
  );
};

// Export the component
export default FeatureBlock;
