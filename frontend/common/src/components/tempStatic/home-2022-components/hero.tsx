// Vendor dependencies
import React from "react";

// Local helper dependencies

// Local assets
import hero1Landscape from "../images/hero-1-landscape.png";
import hero1Portrait from "../images/hero-1-portrait.png";

// Local component dependencies
import Heading from "./heading";
import CallToAction from "./call-to-action";

// Create the page component
const Hero: React.FunctionComponent = () => {
  const actions = [
    {
      type: "link",
      context: "job",
      content: {
        path: "",
        title: "",
        label: "Looking for a job?",
      },
    },
    {
      type: "link",
      context: "hire",
      content: {
        path: "",
        title: "",
        label: "Looking to hire?",
      },
    },
  ];
  return (
    <div
      data-h2-padding="base(x3, 0, calc((3rem * var(--h2-line-height-copy)) + 3%), 0) p-tablet(x4, 0, calc((4rem * var(--h2-line-height-copy)) + 3%), 0) l-tablet(x6, 0, calc((6rem * var(--h2-line-height-copy)) + 3%), 0)"
      data-h2-layer="base(1, relative)"
      style={{
        transformOrigin: "100%",
        backgroundImage: `url('${hero1Landscape}')`,
        backgroundPosition: "center",
        backgroundSize: "cover",
      }}
    >
      <div
        data-h2-position="base(relative)"
        data-h2-container="base(center, large, x1) p-tablet(center, large, x2)"
      >
        <div
          data-h2-color="base(white)"
          data-h2-text-align="base(center) p-tablet(left)"
        >
          <Heading type="h1" size="h1" label="GC Digital Talent" id="" />
          <p
            data-h2-font-size="base(h6, 1.4)"
            data-h2-font-weight="base(300)"
            data-h2-margin="base(x1, 0, x2, 0)"
            data-h2-max-width="p-tablet(50%)"
          >
            Whether you’re thinking about joining government or already an
            employee, hoping to hire or considering an executive role, this is
            the place to come to be part of the GC digital community.
          </p>
        </div>
        <div
          data-h2-display="base(flex)"
          data-h2-gap="base(x1)"
          data-h2-justify-content="base(center) p-tablet(flex-start)"
          data-h2-flex-wrap="base(wrap) p-tablet(initial)"
        >
          {actions.map((item) => (
            <CallToAction
              key=""
              type={item.type}
              context={item.context}
              content={item.content}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

// Export the component
export default Hero;
