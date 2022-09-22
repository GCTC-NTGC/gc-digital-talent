// Vendor dependencies
import React from "react";

// Local helper dependencies

// Local assets
// @ts-ignore
import lightModeGraphic from "../images/Desktop_Graphics_light_1.png";
// @ts-ignore
import darkModeGraphic from "../images/Desktop_Graphics_dark_1.png";

// Local component dependencies
import Heading from "./heading";
import OpportunityBlock from "./opportunity-block";

const SectionIcon: React.FC<React.HTMLAttributes<HTMLOrSVGElement>> = (
  props,
) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth="2"
    stroke="currentColor"
    className="w-6 h-6"
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15.75 15.75l-2.489-2.489m0 0a3.375 3.375 0 10-4.773-4.773 3.375 3.375 0 004.774 4.774zM21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);
// Create the page component
const Opportunities: React.FunctionComponent = () => {
  // This array is just a temporary data object representing the content required by the opportunity entries. This data will need to be migrated to wherever makes sense, and we'll also need dynamic routes and translated strings
  const opportunities = [
    {
      color: "yellow",
      title: "Jobs in digital government",
      summary:
        "Check out the latest GC opportunities in digital and tech, from entry level to management. Find a team, make a difference, and be inspired.",
      link: {
        path: "https://google.com",
        title: "View current opportunities in IT.",
        label: "Browse IT jobs",
      },
    },
    {
      color: "blue",
      title: "Indigenous Apprenticeship Program",
      summary:
        "Designed by the Indigenous community for the Indigenous community, this program recruits entry-level applicants for learning and development IT opportunities across government.",
      link: {
        path: "https://google.com",
        title: "View current opportunities in IT.",
        label: "Apply now",
      },
    },
    {
      color: "red",
      title: "Executives in digital government",
      summary:
        "From entry-level executives to CIO opportunities across the GC, this is the place to come if you’re ready to take on a digital leadership role making a difference for Canadians.",
      link: {
        path: "https://google.com",
        title: "View current opportunities in IT.",
        label: "Browse exec jobs",
      },
    },
  ];
  return (
    <div data-h2-margin="base(-3%, 0, 0, 0)" data-h2-layer="base(2, relative)">
      <div
        data-h2-height="base(100%)"
        data-h2-width="base(100%)"
        data-h2-background-color="base(white) base:dark(black.light)"
        data-h2-position="base(absolute)"
        data-h2-transform="base(skewY(-3deg))"
        data-h2-overflow="base(hidden)"
      >
        <img
          data-h2-display="base(block) base:dark(none)"
          data-h2-position="base(absolute)"
          data-h2-offset="base(0, 0, auto, auto)"
          data-h2-transform="base(translate(32%, -52%) skew(3deg)) l-tablet(translate(0, 0) skew(3deg))"
          data-h2-height="base(auto) l-tablet(40%)"
          data-h2-width="base(250%) l-tablet(auto)"
          data-h2-max-width="base(initial)"
          src={lightModeGraphic}
          alt="A fun graphic!" // Requires a proper alt tag and a translated string
        />
        <img
          data-h2-display="base(none) base:dark(block)"
          data-h2-position="base(absolute)"
          data-h2-offset="base(0, 0, auto, auto)"
          data-h2-transform="base(translate(32%, -52%) skew(3deg)) l-tablet(translate(0, 0) skew(3deg))"
          data-h2-height="base(auto) l-tablet(40%)"
          data-h2-width="base(250%) l-tablet(auto)"
          data-h2-max-width="base(initial)"
          src={darkModeGraphic}
          alt="A fun graphic!" // Requires a proper alt tag and a translated string
        />
        <div
          data-h2-background-color="base(tm-linear-divider)"
          data-h2-offset="base(0, 0, auto, 0)"
          data-h2-display="base(block)"
          data-h2-height="base(x1)"
          data-h2-position="base(absolute)"
        />
      </div>
      <div
        data-h2-position="base(relative)"
        data-h2-container="base(center, large, x1) p-tablet(center, large, x2)"
      >
        <div data-h2-padding="base(x3, 0) p-tablet(x5, 0, x4, 0) l-tablet(x7, 0, x6, 0)">
          {/* Requires an ID and a translated text string */}
          <Heading
            type="h2"
            size="h2"
            label="Ongoing recruitment"
            id=""
            Icon={SectionIcon}
            color="yellow"
          />
          <div
            data-h2-display="base(grid)"
            data-h2-grid-template-columns="base(1fr) p-tablet(repeat(2, minmax(0, 1fr))) l-tablet(repeat(3, minmax(0, 1fr)))"
            data-h2-gap="base(x2) p-tablet(x3)"
            data-h2-padding="base(x2, 0, 0, 0) p-tablet(x3, 0, 0, 0)"
          >
            {opportunities.map((item) => (
              <OpportunityBlock key="" content={item} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Export the component
export default Opportunities;
