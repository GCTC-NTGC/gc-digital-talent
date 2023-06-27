import React from "react";
import { notEmpty } from "@gc-digital-talent/helpers";
import { Pill } from "@gc-digital-talent/ui";
import { Maybe } from "@gc-digital-talent/graphql";
import { Classification } from "~/api/generated";
import uniqueId from "lodash/uniqueId";

interface TableClassificationPillsProps {
  classifications: Maybe<Maybe<Classification>[]>;
}

const TableClassificationPills = ({
  classifications,
}: TableClassificationPillsProps) => {
  const filteredClassifications = classifications
    ? classifications.filter(notEmpty)
    : [];
  const pillsArray = filteredClassifications.map((classification, index) => {
    return (
      <span
        key={uniqueId()}
        {...(index + 1 !== filteredClassifications.length && {
          "data-h2-padding-right": "base(x1)",
        })}
      >
        <Pill color="primary" mode="outline">
          {`${classification.group}-0${classification.level}`}
        </Pill>
      </span>
    );
  });
  return pillsArray.length > 0 ? (
    <div data-h2-display="base(flex)">{pillsArray}</div>
  ) : null;
};

const tableClassificationPills = (props: TableClassificationPillsProps) => (
  <TableClassificationPills {...props} />
);

export default tableClassificationPills;
