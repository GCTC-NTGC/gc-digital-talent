import React, { useMemo } from "react";
import {
  GetPoolCandidatesQuery,
  useGetPoolCandidatesQuery,
} from "../api/generated";
import { notEmpty } from "../helpers/util";
import { FromArray } from "../types/utilityTypes";
import Table, { ColumnsOf } from "./Table";

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
        accessor: (d) => (d.isWoman ? "Y" : "N"),
        id: "woman",
      },
      {
        Header: "Disability",
        accessor: (d) => (d.hasDisability ? "Y" : "N"),
        id: "disability",
      },
      {
        Header: "Indigenous",
        accessor: (d) => (d.isIndigenous ? "Y" : "N"),
        id: "indigenous",
      },
      {
        Header: "Visible Minority",
        accessor: (d) => (d.isVisibleMinority ? "Y" : "N"),
        id: "visibleMinority",
      },
      {
        Header: "Diploma",
        accessor: (d) => (d.hasDiploma ? "Y" : "N"),
        id: "diploma",
      },
      {
        Header: "Language",
        accessor: "languageAbility",
      },
      {
        Header: "Name",
        accessor: "firstLast",
      },
      {
        Header: "Email",
        accessor: "email",
      },
      {
        Header: "Phone",
        accessor: "telephone",
      },
      {
        Header: "Preferred Lang",
        accessor: "preferredLang",
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
