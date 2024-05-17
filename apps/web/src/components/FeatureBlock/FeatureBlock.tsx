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
      className="flex flex-col overflow-hidden rounded shadow-lg"
      data-h2-background-color="base(foreground)"
    >
      <div
        data-h2-color="base:all(white)"
        data-h2-background-color="base:all(black.darker)"
        className="p-6"
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
        className="h-60 bg-cover lg:h-80"
        style={{
          backgroundImage: `url('${content.img.path}')`,
          backgroundPosition: content.img.position || "center",
        }}
      />
      <div className="flex-grow p-6">{content.summary}</div>
      <div className="p-6 pt-0">
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
