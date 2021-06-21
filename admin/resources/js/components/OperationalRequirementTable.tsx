import React, { useMemo } from "react";
import { Column } from "react-table";
import { GetOperationalRequirementsQuery } from "../api/generated";
import { notEmpty } from "../helpers/util";
import Table from "./Table";

const OperationalRequirementTable: React.FC<GetOperationalRequirementsQuery> =
  ({ operationalRequirements }) => {
    const columns: Array<Column> = useMemo(
      () => [
        {
          Header: "ID",
          accessor: "id",
        },
        {
          Header: "Key",
          accessor: "key",
        },
        {
          Header: "Name",
          accessor: "name.en",
        },
        {
          Header: "Description",
          accessor: "description.en",
        },
      ],
      [],
    );

    const memoizedData = useMemo(
      () => operationalRequirements.filter(notEmpty),
      [operationalRequirements],
    );

    return (
      <>
        <Table data={memoizedData} columns={columns} />
      </>
    );
  };

export default OperationalRequirementTable;
