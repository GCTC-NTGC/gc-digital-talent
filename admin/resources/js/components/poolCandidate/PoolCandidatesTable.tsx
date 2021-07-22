import React, { useMemo } from "react";
import {
  GetPoolCandidatesQuery,
  useGetPoolCandidatesQuery,
} from "../../api/generated";
import { notEmpty } from "../../helpers/util";
import { FromArray } from "../../types/utilityTypes";
import Table, { ColumnsOf } from "../Table";
import TableBoolean from "../TableBoolean";

type Data = NonNullable<FromArray<GetPoolCandidatesQuery["poolCandidates"]>>;

const PoolCandidatesTable: React.FC<GetPoolCandidatesQuery> = ({
  poolCandidates,
}) => {
  const columns = useMemo<ColumnsOf<Data>>(
    () => [
      {
        Header: "ID",
        accessor: "cmoIdentifier",
      },
      {
        Header: "Pool",
        id: "pool",
        accessor: (d) => d.pool?.name?.en,
      },
      {
        Header: "User",
        id: "user",
        accessor: (d) => d.user?.email,
      },
      {
        Header: "Expiry",
        accessor: "expiryDate",
      },
      {
        Header: "Woman",
        accessor: ({ isWoman }) => <TableBoolean checked={isWoman} />,
        id: "woman",
      },
      {
        Header: "Disability",
        accessor: ({ hasDisability }) => (
          <TableBoolean checked={hasDisability} />
        ),
        id: "disability",
      },
      {
        Header: "Indigenous",
        accessor: ({ isIndigenous }) => <TableBoolean checked={isIndigenous} />,
        id: "indigenous",
      },
      {
        Header: "Visible Minority",
        accessor: ({ isVisibleMinority }) => (
          <TableBoolean checked={isVisibleMinority} />
        ),
        id: "visibleMinority",
      },
      {
        Header: "Diploma",
        accessor: ({ hasDiploma }) => <TableBoolean checked={hasDiploma} />,
        id: "diploma",
      },
      {
        Header: "Language",
        accessor: "languageAbility",
      },
    ],
    [],
  );

  const memoizedData = useMemo(
    () => poolCandidates.filter(notEmpty),
    [poolCandidates],
  );

  return (
    <>
      <Table data={memoizedData} columns={columns} />
    </>
  );
};

export default PoolCandidatesTable;

export const PoolCandidatesTableApi: React.FunctionComponent = () => {
  const [result] = useGetPoolCandidatesQuery();
  const { data, fetching, error } = result;

  if (fetching) return <p>Loading...</p>;
  if (error) return <p>Oh no... {error.message}</p>;

  return <PoolCandidatesTable poolCandidates={data?.poolCandidates ?? []} />;
};
