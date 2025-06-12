import { Fragment, ReactNode } from "react";

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
      return <span className="text-gray">{props.children}</span>;
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

const Metadata = ({ metadata, ...rest }: { metadata: MetadataItemProps[] }) => {
  return (
    <div
      className="flex flex-col items-start gap-3 text-sm xs:flex-row xs:flex-wrap xs:items-center"
      {...rest}
    >
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
