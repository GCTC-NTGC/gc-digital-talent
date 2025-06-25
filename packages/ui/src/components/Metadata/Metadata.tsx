import { Fragment, ReactNode } from "react";
import { tv } from "tailwind-variants";

import Chip, { ChipProps } from "../Chip/Chip";

interface MetaDataBase {
  children: ReactNode;
  key: string;
  type: string;
}

interface MetaDataText extends MetaDataBase {
  type: "text";
}

interface MetaDataChip extends MetaDataBase {
  type: "chip";
  color?: ChipProps["color"];
}

export type MetadataItemProps = MetaDataChip | MetaDataText;

const MetadataItem = (props: MetadataItemProps) => {
  switch (props.type) {
    case "text":
      return (
        <span className="text-gray-600 dark:text-gray-100">
          {props.children}
        </span>
      );
    case "chip":
      return (
        <span>
          <Chip color={props.color} className="font-normal">
            {props.children}
          </Chip>
        </span>
      );
    default:
      return null;
  }
};

const metaWrapper = tv({
  base: "flex flex-col items-start gap-3 text-sm xs:flex-row xs:flex-wrap xs:items-center",
});

interface MetadataProps {
  metadata: MetadataItemProps[];
  className?: string;
}

const Metadata = ({ metadata, className, ...rest }: MetadataProps) => {
  return (
    <div className={metaWrapper({ class: className })} {...rest}>
      {metadata.map((data, index) => (
        <Fragment key={data.key}>
          {index > 0 && (
            <span
              aria-hidden="true"
              className="mx-3 hidden text-gray-300 xs:inline-block dark:text-gray-200"
              // eslint-disable-next-line formatjs/no-literal-string-in-jsx
            >
              &bull;
            </span>
          )}
          <MetadataItem {...data} key={data.key} />
        </Fragment>
      ))}
    </div>
  );
};

export default Metadata;
