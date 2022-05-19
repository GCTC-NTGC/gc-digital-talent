import { Button } from "@common/components";
import React, { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { useGetDataUserAggregateDocumentQuery } from "../../api/generated";
import UserAggregateDocument from "./UserAggregateDocument";

const UserAggregateDocumentPage: React.FunctionComponent = () => {
  const [result] = useGetDataUserAggregateDocumentQuery();
  const { data, fetching, error } = result;

  const pageStyle = `
  @page {
    size: letter portrait;
  }

  @media all {
    .page-break {
      display: none;
    }
  }

  @media print {
    .page-break {
      margin-top: 1rem;
      display: block;
      page-break-after: always;
    }
  }
`;

  const componentRef = useRef(null);
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    pageStyle,
    documentTitle: "User Aggregate",
  });

  if (fetching) {
    return <p>Loading</p>;
  }

  if (error || !data) {
    return <p>Error</p>;
  }

  return (
    <div>
      <Button color="primary" mode="solid" onClick={handlePrint}>
        Print this out!
      </Button>
      <UserAggregateDocument initialData={data} ref={componentRef} />
    </div>
  );
};

export default UserAggregateDocumentPage;
