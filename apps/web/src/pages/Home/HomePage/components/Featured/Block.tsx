import React from "react";

import { Heading } from "@gc-digital-talent/ui";

// Define the interface
export interface FeatureBlockProps {
  content: {
    title: string;
    summary: React.ReactNode;
    img: {
      path: string;
    };
    link: {
      path: string;
      label: string;
    };
  };
}

// Create the page component
const FeatureBlock = ({ content }: FeatureBlockProps) => {
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
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
      />
      <p data-h2-flex-grow="base(1)" data-h2-padding="base(x1)">
        {content.summary}
      </p>
      <div data-h2-padding="base(0, x1, x1, x1)">
        <a
          href={content.link.path}
          data-h2-background-color="base:focus-visible(focus)"
          data-h2-outline="base(none)"
          data-h2-color="base:hover(tm-blue.dark) base:focus-visible(black)"
        >
          {content.link.label}
        </a>
      </div>
    </div>
  );
};

// Export the component
export default FeatureBlock;
