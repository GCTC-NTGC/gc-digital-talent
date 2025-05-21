import { ReactNode } from "react";

import Chip, { ChipVariants } from "../Chip/Chip";

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
  color?: ChipVariants["color"];
}

export type MetadataItemProps = MetaDataChip | MetaDataText;

const MetadataItem = (props: MetadataItemProps) => {
  switch (props.type) {
    case "text":
      return <span data-h2-color="base(black.light)">{props.children}</span>;
    case "chip":
      return (
        <span>
          <Chip color={props.color} data-h2-font-weight="base(400)">
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
      data-h2-display="base(flex)"
      data-h2-flex-direction="base(column) p-tablet(row)"
      data-h2-flex-wrap="base(nowrap) p-tablet(wrap)"
      data-h2-align-items="base(flex-start) p-tablet(center)"
      data-h2-gap="base(x.5 0)"
      data-h2-content='p-tablet:children[:not(:last-child)::after]("•")'
      data-h2-color="p-tablet:children[::after](black.lighter)"
      data-h2-margin="p-tablet:children[:not(:last-child)::after](0 x.5)"
      data-h2-font-size="base(caption)"
      {...rest}
    >
      {metadata.map((data) => (
        <MetadataItem {...data} key={data.key} />
      ))}
    </div>
  );
};

export default Metadata;
