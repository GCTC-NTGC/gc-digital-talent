// Vendor dependencies
import React from "react";

// Local assets
import Block from "../../Home/partials/Opportunities/Block";

// Needs translated data
const info = [
  {
    title: "Browse IT opportunities for the Indigenous community",
    summary:
      "Designed by, with, and for the Indigenous community, the program recruits First Nations, Inuit, and Métis applicants who have a passion for IT, for entry level employment, learning and development opportunities.",
    link: {
      url: "#ADD-A-PATH",
      title: "Learn more about Indigenous IT apprenticeship opportunities.",
      label: "Indigenous apprenticeship",
    },
  },
  {
    title: "Hire talent for your team",
    summary:
      "Let our team save you time and energy by matching your needs to pre-qualified IT professionals with the right skills for the job. All the talent in our pools has been qualified through a competitive process, so you can jump straight to the interview and decide if they are a good fit for your team.",
    link: {
      url: "#ADD-A-PATH",
      title: "Discover talent with the skills you need.",
      label: "Visit the talent search page",
    },
  },
];

// Create the page component
const OtherOpportunities = () => {
  return (
    <div
      data-h2-background-color="base:dark(black.light)"
      data-h2-padding="base(x3, 0) p-tablet(x4, 0) l-tablet(x6, 0)"
    >
      <div
        data-h2-position="base(relative)"
        data-h2-container="base(center, large, x1) p-tablet(center, large, x2)"
      >
        <div
          data-h2-display="base(grid)"
          data-h2-grid-template-columns="base(1fr) p-tablet(repeat(2, minmax(0, 1fr)))"
          data-h2-gap="base(x2) p-tablet(x3)"
        >
          {info.map((item) => (
            <Block
              // Needs proper key
              key=""
              content={{
                color: "purple",
                title: item.title,
                summary: item.summary,
                link: {
                  path: item.link.url,
                  mode: "outline",
                  label: item.link.label,
                },
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

// Export the component
export default OtherOpportunities;
