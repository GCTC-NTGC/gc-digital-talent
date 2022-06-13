import React from "react";
import { useIntl } from "react-intl";

import type { Applicant } from "../../../api/generated";

interface AdminAboutSectionProps {
  applicant: Pick<Applicant, "firstName" | "lastName">;
}

const AdminAboutSection: React.FC<AdminAboutSectionProps> = ({
  applicant: { firstName, lastName },
}) => {
  const intl = useIntl();

  return (
    <div data-h2-flex-item="b(1of1) s(3of4)">
      <div
        data-h2-background-color="b(light.dt-gray)"
        data-h2-padding="b(x1)"
        data-h2-radius="b(s)"
      >
        {!!firstName && !!lastName && (
          <p>
            {intl.formatMessage({
              defaultMessage: "Name:",
              description: "Name label and colon",
            })}{" "}
            <span data-h2-font-weight="b(700)">
              {firstName} {lastName}
            </span>
          </p>
        )}
      </div>
    </div>
  );
};

export default AdminAboutSection;
