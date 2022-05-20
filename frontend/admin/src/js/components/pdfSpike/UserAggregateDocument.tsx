import React from "react";
import { GetDataUserAggregateDocumentQuery } from "../../api/generated";

export interface UserAggregateDocumentProps {
  initialData: GetDataUserAggregateDocumentQuery;
}

export const UserAggregateDocument = React.forwardRef<
  HTMLDivElement,
  UserAggregateDocumentProps
>(({ initialData }, ref) => (
  <div style={{ display: "none" }}>
    <style type="text/css" media="print">
      {`
        @page
        {
          size: letter portrait;
          margin: 1in;
        }
        @media print {
          html, body {
            height: initial !important;
            overflow: initial !important;
            -webkit-print-color-adjust: exact;
          }
          div.user-region {
            margin-bottom: 2rem;
            display: block;
            page-break-after: auto;
            page-break-inside: avoid;
            -webkit-region-break-inside: avoid;
          }
        }
      `}
    </style>
    <div ref={ref} className="print-container">
      {initialData.users.map((user) => (
        <div key={user?.id} className="user-region">
          <strong>{`${user?.firstName} ${user?.lastName}`}</strong>
          <p>Skills</p>
          {user?.experiences ? (
            <ul>
              {user.experiences.map((experience) => (
                <li key={experience?.id}>{experience?.id}</li>
              ))}
            </ul>
          ) : (
            <p>(no experiences)</p>
          )}
        </div>
      ))}
    </div>
  </div>
));

export default UserAggregateDocument;
