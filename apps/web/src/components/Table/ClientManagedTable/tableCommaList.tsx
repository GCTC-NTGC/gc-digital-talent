import React from "react";

interface TableCommaListProps {
  list: string[];
}

const TableCommaList = ({ list }: TableCommaListProps) => {
  return list.length > 0 ? <p>{list.join(", ")}</p> : null;
};

const tableCommaList = (props: TableCommaListProps) => (
  <TableCommaList {...props} />
);

export default tableCommaList;
