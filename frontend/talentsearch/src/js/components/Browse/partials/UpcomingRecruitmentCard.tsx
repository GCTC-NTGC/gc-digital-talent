// Vendor dependencies
import React from "react";

// Local assets
import { Link } from "@common/components";

// Create the page component
const UpcomingRecruitmentCard = () => {
  return (
    <div
      data-h2-background-color="base(white) base:dark(black.light)"
      data-h2-shadow="base(large)"
      data-h2-padding="base(x1) p-tablet(x2)"
      data-h2-radius="base(rounded)"
    >
      <div
        data-h2-display="p-tablet(flex)"
        data-h2-gap="base(x3)"
        data-h2-align-items="base(center)"
      >
        <div>
          <p data-h2-margin="base(0, 0, x1, 0)">
            <strong data-h2-font-weight="base(700)">
              {/* Needs translated string */}
              More opportunities are coming soon!
            </strong>
          </p>
          <p>
            {/* Needs translated string */}
            We’re posting new opportunities all the time. By starting your
            profile now, you’ll be able to submit applications lightning fast
            when the time comes.
          </p>
        </div>
        <div data-h2-margin="base(x1, 0, 0, 0) p-tablet(0)">
          <Link
            color="blue"
            mode="outline"
            type="button"
            weight="bold"
            // Needs a proper route
            href="#ADD-A-PATH"
            style={{ whiteSpace: "nowrap" }}
            // Needs a translated string
            title="Register for an account and complete a profile to make your next application easy."
          >
            {/* Needs a translated string */}
            Create a profile
          </Link>
        </div>
      </div>
    </div>
  );
};

// Export the component
export default UpcomingRecruitmentCard;
