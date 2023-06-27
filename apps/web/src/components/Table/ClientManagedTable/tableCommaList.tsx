import React from "react";

interface TableCommaListProps {
  list: string[];
}

const TableCommaList = ({ list }: TableCommaListProps) => {
  return list.length > 0 ? (
    <p>
      {list.map((item, index) => {
        if (index + 1 === list.length) return item;

        return `${item}, `;
      })}
    </p>
  ) : null;
};

const tableCommaList = (props: TableCommaListProps) => (
  <TableCommaList {...props} />
);

export default tableCommaList;
