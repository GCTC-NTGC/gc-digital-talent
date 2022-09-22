// GC Digital Talent / Common workspace / Static homepage / Hero

// Vendor dependencies
import React from "react";

// Local helper dependencies

// Local assets
// @ts-ignore
import hero1Landscape from "../images/hero-1-landscape.jpg";
// @ts-ignore
import hero2Landscape from "../images/hero-2-landscape.png";
// @ts-ignore
import hero3Landscape from "../images/hero-3-landscape.png";
// @ts-ignore
import hero4Landscape from "../images/hero-4-landscape.png";
// @ts-ignore
import "./hero.css";

// Local component dependencies
import Heading from "./heading";
import CallToAction from "./call-to-action";

// Image randomizer function
const landscapeRandomizer = () => {
  const items = [
    hero1Landscape,
    hero2Landscape,
    hero3Landscape,
    hero4Landscape,
  ];
  return items[Math.floor(Math.random() * items.length)];
};

// Create the page component
const Hero: React.FunctionComponent = () => {
  // This array is just a temporary data object representing the content required by the hero calls-to-action. This data will need to be migrated to wherever makes sense, and we'll also need dynamic routes and translated strings
  const actions = [
    {
      type: "link",
      context: "job",
      content: {
        path: "/",
        title: "Find out more about how join the GC digital community.",
        label: "Looking for a job?",
      },
    },
    {
      type: "link",
      context: "hire",
      content: {
        path: "/",
        title: "Find out more about how to hire with us.",
        label: "Looking to hire?",
      },
    },
  ];
  // Return the component
  return (
    <div
      data-h2-background-color="base(black)"
      data-h2-padding-top="base(x3) p-tablet(x4) l-tablet(x6)"
      data-h2-padding-bottom="
        base(calc(50vh + 3%))
        p-tablet(calc(60vh + 3%))
        l-tablet(calc((6rem * var(--h2-line-height-copy)) + 3%))"
      className="hero-bg-image"
      style={{
        backgroundImage: `url('${landscapeRandomizer()}')`,
      }}
    >
      <div
        data-h2-position="base(relative)"
        data-h2-container="base(center, large, x1) p-tablet(center, large, x2)"
        data-h2-layer="base(1, relative)"
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
