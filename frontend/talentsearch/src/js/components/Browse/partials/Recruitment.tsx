// Vendor dependencies
import React from "react";
import { RocketLaunchIcon } from "@heroicons/react/24/outline";

// Local assets
import Heading from "@common/components/Heading";
import { imageUrl } from "@common/helpers/router";
import RecruitmentCard from "./RecruitmentCard";
import UpcomingRecruitmentCard from "./UpcomingRecruitmentCard";
import TALENTSEARCH_APP_DIR from "../../../talentSearchConstants";

const FlourishTopLight = imageUrl(TALENTSEARCH_APP_DIR, "browse_top_light.png");
const FlourishBottomLight = imageUrl(
  TALENTSEARCH_APP_DIR,
  "browse_bottom_light.png",
);
const FlourishTopDark = imageUrl(TALENTSEARCH_APP_DIR, "browse_top_dark.png");
const FlourishBottomDark = imageUrl(
  TALENTSEARCH_APP_DIR,
  "browse_bottom_dark.png",
);

// Example recruitments
// Needs real data
const recruitments = [
  {
    classification: "IT-01",
    title: "Application developer",
    description:
      "IT-01 application developers might find jobs where they do things like optimize Government websites, build new tools for public servants, or digitize services.",
    salary: {
      min: "$71,000",
      max: "$82,000",
    },
    skills: ["React", "CSS", "Responsive design"],
    closing: "January 1st, 2023",
  },
  {
    classification: "IT-03",
    title: "Cybersecurity advisor",
    description:
      "IT-03 cyber security advisors might find jobs where they do things like provide advice on upcoming security policy or audit existing infrastructure for security risks.",
    salary: {
      min: "$89,000",
      max: "$101,000",
    },
    skills: ["Risk assessment", "Emergency planning", "Cybersecurity"],
    closing: "March 3rd, 2023",
  },
];

// Create the page component
const Recruitment = () => {
  return (
    <div
      data-h2-background-color="base(black.03) base:dark(black.9)"
      data-h2-border="base(bottom, 1px, solid, black.50)"
      data-h2-position="base(relative)"
    >
      <img
        // Alt text? Pretty sure these can be ignored by SRs as they serve no informational purpose
        alt=""
        src={FlourishTopLight}
        data-h2-display="base(block) base:dark(none)"
        data-h2-position="base(absolute)"
        data-h2-offset="base(0, 0, auto, auto)"
        data-h2-width="base(25vw)"
      />
      <img
        // Alt text? Pretty sure these can be ignored by SRs as they serve no informational purpose
        alt=""
        src={FlourishBottomLight}
        data-h2-display="base(block) base:dark(none)"
        data-h2-position="base(absolute)"
        data-h2-offset="base(auto, auto, 0, 0)"
        data-h2-width="base(25vw)"
      />
      <img
        // Alt text? Pretty sure these can be ignored by SRs as they serve no informational purpose
        alt=""
        src={FlourishTopDark}
        data-h2-display="base(none) base:dark(block)"
        data-h2-position="base(absolute)"
        data-h2-offset="base(0, 0, auto, auto)"
        data-h2-width="base(25vw)"
      />
      <img
        // Alt text? Pretty sure these can be ignored by SRs as they serve no informational purpose
        alt=""
        src={FlourishBottomDark}
        data-h2-display="base(none) base:dark(block)"
        data-h2-position="base(absolute)"
        data-h2-offset="base(auto, auto, 0, 0)"
        data-h2-width="base(25vw)"
      />
      <div
        data-h2-position="base(relative)"
        data-h2-container="base(center, large, x1) p-tablet(center, large, x2)"
      >
        <div data-h2-padding="base(x3, 0) p-tablet(x4, 0) l-tablet(x6, 0)">
          {/* Requires an ID and a translated text string */}
          <Heading
            level="h2"
            Icon={RocketLaunchIcon}
            color="blue"
            data-h2-margin="base(0, 0, x0.5, 0)"
          >
            {/* Needs translated string */}
            Active talent recruitment processes
          </Heading>
          <p data-h2-margin="base(x1, 0)">
            <strong data-h2-font-weight="base(700)">
              {/* Needs translated string */}
              This platform allows you to apply to recruitment processes that
              makes it easy for hiring managers to find you.
            </strong>
          </p>
          <p>
            {/* Needs translated string */}
            Your application to a process will be reviewed by our team and if
            it’s a match, you will be invited to an assessment. Once accepted,
            managers will be able to contact you about job opportunities based
            on your skills.
          </p>
          <div data-h2-padding="base(x2, 0, 0, 0) p-tablet(x3, 0, 0, 0)">
            {recruitments.map((card) => (
              // Needs proper key
              <RecruitmentCard key="" data={card} />
            ))}
            <UpcomingRecruitmentCard />
          </div>
        </div>
      </div>
    </div>
  );
};

// Export the component
export default Recruitment;
