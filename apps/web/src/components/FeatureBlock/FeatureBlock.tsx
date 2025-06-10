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
    <div className="flex flex-col overflow-hidden rounded-md bg-white shadow-lg dark:bg-gray-600">
      <div className="flex min-h-auto w-full flex-col justify-center bg-black p-6 text-white">
        <Heading level="h3" size="h6" className="my-0 mb-1.5">
          {content.title}
        </Heading>
      </div>
      <div>
        <img
          src={content.img.path}
          alt={content.title}
          className="block h-auto w-full object-cover object-center"
        />
      </div>
      <div className="grow p-6">{content.summary}</div>
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
