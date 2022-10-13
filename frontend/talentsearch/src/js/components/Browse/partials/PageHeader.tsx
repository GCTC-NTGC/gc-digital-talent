// This will be a common component for all pages

// Vendor dependencies
import React from "react";

// Local assets
import Heading from "@common/components/Heading";
import { imageUrl } from "@common/helpers/router";
import TALENTSEARCH_APP_DIR from "../../../talentSearchConstants";

import "./PageHeader.css";

const PageHeaderImage = imageUrl(TALENTSEARCH_APP_DIR, "browse_header.png");

// Create the page component
const PageHeader = () => {
  return (
    <div
      data-h2-background-color="base(black)"
      data-h2-padding="base(x3, 0, 50vh, 0) p-tablet(x4, 0, 60vh, 0) l-tablet(x4, 0)"
      className="header-bg-image"
      style={{
        backgroundImage: `url('${PageHeaderImage}')`,
      }}
    >
      <div
        data-h2-position="base(relative)"
        data-h2-container="base(center, large, x1) p-tablet(center, large, x2)"
        data-h2-layer="base(1, relative)"
      >
        <div
          data-h2-color="base(white)"
          data-h2-text-align="base(center) l-tablet(left)"
        >
          <Heading level="h1" data-h2-margin="base(0, 0, x0.5, 0)">
            Browse IT jobs
          </Heading>
          <p
            data-h2-font-size="base(h6, 1.4)"
            data-h2-font-weight="base(300)"
            data-h2-margin="base(x1, 0, 0, 0)"
            data-h2-max-width="l-tablet(50%)"
          >
            {/* Needs translated string */}
            Find and apply to digital talent opportunities in the Government of
            Canada.
          </p>
        </div>
      </div>
    </div>
  );
};

// Export the component
export default PageHeader;
