import React, { useMemo } from "react";
import { CheckIcon, XIcon } from "@heroicons/react/solid";
import {
  GetPoolCandidatesQuery,
  useGetPoolCandidatesQuery,
} from "../../api/generated";
import { notEmpty } from "../../helpers/util";
import { FromArray } from "../../types/utilityTypes";
import Table, { ColumnsOf } from "../Table";

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
        accessor: (d) => {
          const { isWoman } = d;
          return isWoman ? (
            <CheckIcon style={{ width: "1rem" }} />
          ) : (
            <XIcon style={{ width: "1rem" }} />
          );
        },
        id: "woman",
      },
      {
        Header: "Disability",
        accessor: (d) => {
          const { hasDisability } = d;
          return hasDisability ? (
            <CheckIcon style={{ width: "1rem" }} />
          ) : (
            <XIcon style={{ width: "1rem" }} />
          );
        },
        id: "disability",
      },
      {
        Header: "Indigenous",
        accessor: (d) => {
          const { isIndigenous } = d;
          return isIndigenous ? (
            <CheckIcon style={{ width: "1rem" }} />
          ) : (
            <XIcon style={{ width: "1rem" }} />
          );
        },
        id: "indigenous",
      },
      {
        Header: "Visible Minority",
        accessor: (d) => {
          const { isVisibleMinority } = d;
          return isVisibleMinority ? (
            <CheckIcon style={{ width: "1rem" }} />
          ) : (
            <XIcon style={{ width: "1rem" }} />
          );
        },
        id: "visibleMinority",
      },
      {
        Header: "Diploma",
        accessor: (d) => {
          const { hasDiploma } = d;
          return hasDiploma ? (
            <CheckIcon style={{ width: "1rem" }} />
          ) : (
            <XIcon style={{ width: "1rem" }} />
          );
        },
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
