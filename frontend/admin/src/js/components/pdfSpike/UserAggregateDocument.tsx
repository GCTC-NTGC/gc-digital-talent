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
    <div ref={ref}>
      <div className="print-container">
        {initialData.users.map((user) => (
          <React.Fragment key={user?.id}>
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
            <div className="page-break" />
          </React.Fragment>
        ))}
      </div>
    </div>
  </div>
));

export default UserAggregateDocument;
