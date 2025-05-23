import { ReactNode } from "react";

import { Heading, Link } from "@gc-digital-talent/ui";

interface FeatureBlockProps {
  content: {
    title: string;
    summary: ReactNode;
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

const FeatureBlock = ({ content }: FeatureBlockProps) => {
  return (
    <div
      data-h2-display="base(flex)"
      data-h2-flex-direction="base(column)"
      data-h2-background-color="base(foreground)"
      data-h2-radius="base(rounded)"
      data-h2-overflow="base(hidden)"
      data-h2-shadow="base(large)"
    >
      <div
        data-h2-color="base:all(white)"
        data-h2-background-color="base:all(black.darker)"
        data-h2-padding="base(x1)"
        data-h2-display="base(flex)"
        data-h2-flex-direction="base(column)"
        data-h2-justify-content="base(center)"
        data-h2-min-height="base(auto)"
        data-h2-width="base(100%)"
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
      <div>
        <img
          src={content.img.path}
          alt={content.title}
          data-h2-display="base(block)"
          data-h2-max-width="base(100%)"
          data-h2-height="base(auto)"
          data-h2-object-fit="base(cover)"
          data-h2-object-position="base(center center)"
        />
      </div>
      <div data-h2-flex-grow="base(1)" data-h2-padding="base(x1)">
        {content.summary}
      </div>
      <div data-h2-padding="base(0, x1, x1, x1)">
        <Link
          color="black"
          mode="inline"
          href={content.link.path}
          external={content.link.external}
        >
          {content.link.label}
        </Link>
      </div>
    </div>
  );
};

export default FeatureBlock;
