// Vendor dependencies
import React from "react";

// Local helper dependencies

// Local component dependencies
import Heading from "./heading";
import OpportunityBlock from "./opportunity-block";

// Create the page component
const About: React.FunctionComponent = () => {
  const opportunities = [
    {
      color: "black",
      title: "Office of the Chief Information Officer",
      summary:
        "GC Digital Talent is only one of the many initiatives being led by the Office of the Chief Information Officer of Canada (OCIO). Learn more about OCIO’s role in the Government of Canada. Check out the GC Digital Ambition to see where OCIO is heading in the future.",
      link: {
        path: "https://google.com",
        title: "View current opportunities in IT.",
        label: "Learn more",
      },
    },
    {
      color: "black",
      title: "Digital Community Management Office",
      summary:
        "Behind the GC Digital Talent platform is a whole team of people designing, developing, screening applicants, talent managing employees, placing executives, and helping managers find the talent they need to deliver services to Canadians. ",
      link: {
        path: "https://google.com",
        title: "View current opportunities in IT.",
        label: "Learn more",
      },
    },
    {
      color: "black",
      title: "From Concept to Code",
      summary:
        "Curious about how the GC Digital Talent platform was developed? Want to learn more about the ideas, designs, and philosophy going on behind the scenes? Check out the path from Talent Cloud’s experimental pilot to today’s full-scale platform.",
      link: {
        path: "https://google.com",
        title: "View current opportunities in IT.",
        label: "Learn more",
      },
    },
  ];
  const sectionIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="2"
      stroke="currentColor"
      className="w-6 h-6"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z"
      />
    </svg>
  );
  return (
    <div
      data-h2-background-color="base(tm-linear-footer)"
      data-h2-layer="base(1, relative)"
      data-h2-margin="base(-3%, 0, 0, 0)"
    >
      <div
        data-h2-position="base(relative)"
        data-h2-padding="base(calc((3rem * var(--h2-line-height-copy)) + 3%), 0, x3, 0) p-tablet(calc((4rem * var(--h2-line-height-copy)) + 3%), 0, x4, 0) l-tablet(calc((6rem * var(--h2-line-height-copy)) + 3%), 0, x6, 0)"
      >
        <div data-h2-container="base(center, large, x1) p-tablet(center, large, x2)">
          <div data-h2-color="base(black)">
            <Heading
              type="h2"
              size="h2"
              label="Learn more"
              id=""
              icon={sectionIcon}
              color="black"
            />
            <div
              data-h2-display="base(grid)"
              data-h2-grid-template-columns="base(1fr) p-tablet(1fr 1fr) l-tablet(1fr 1fr 1fr)"
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
    </div>
  );
};

// Export the component
export default About;
