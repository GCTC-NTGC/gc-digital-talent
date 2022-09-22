// Vendor dependencies
import React from "react";

// Local helper dependencies

// Local assets
// @ts-ignore
import hero1Landscape from "../images/Profile hero.png";
// @ts-ignore
import "./profile.css";

// Local component dependencies
import CallToAction from "./call-to-action";

// Create the page component
const Profile: React.FunctionComponent = () => {
  const actions = [
    {
      type: "link",
      context: "profile",
      content: {
        path: "",
        title: "",
        label: "Create a profile",
      },
    },
  ];
  return (
    <div
      data-h2-background-color="base(white) base:dark(black.light)"
      data-h2-layer="base(2, relative)"
    >
      <div
        data-h2-height="base(100%)"
        data-h2-width="base(100%)"
        data-h2-background-color="base(black)"
        data-h2-position="base(absolute)"
        data-h2-transform="base(skewY(-3deg))"
        data-h2-overflow="base(hidden)"
      >
        <div
          data-h2-position="base(absolute)"
          data-h2-transform="base(skewY(3deg))"
          data-h2-height="base(100%)"
          data-h2-width="base(100%)"
          className="profile-bg-image"
          style={{
            backgroundImage: `url('${hero1Landscape}')`,
          }}
        />
        <div
          data-h2-background-color="base(tm-linear-divider)"
          data-h2-offset="base(0, 0, auto, 0)"
          data-h2-display="base(block)"
          data-h2-height="base(x1)"
          data-h2-position="base(absolute)"
        />
        <div
          data-h2-background-color="base(tm-linear-divider)"
          data-h2-offset="base(auto, 0, 0, 0)"
          data-h2-display="base(block)"
          data-h2-height="base(x1)"
          data-h2-position="base(absolute)"
        />
      </div>
      <div
        data-h2-position="base(relative)"
        data-h2-container="base(center, large, x1) p-tablet(center, large, x2)"
      >
        <div data-h2-padding="base(x4, 0, 50vh, 0) p-tablet(x5, 0, 60vh, 0) l-tablet(x7, 0, x6, 0)">
          <p
            data-h2-font-size="base(h6, 1.4)"
            data-h2-font-weight="base(300)"
            data-h2-color="base(white)"
            data-h2-margin="base(0, 0, x2, 0)"
            data-h2-max-width="p-tablet(50%)"
            data-h2-text-align="base(center) p-tablet(left)"
          >
            Your profile is at the heart of the platform. Tell your story, show
            how you developed your skills, and use your profile to apply for
            jobs. Whether you’re hunting for a job now or just thinking about
            the future, your profile is your path to getting found by hiring
            managers.
          </p>
          <div
            data-h2-display="base(flex)"
            data-h2-gap="base(x1)"
            data-h2-justify-content="base(center) p-tablet(flex-start)"
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
    </div>
  );
};

// Export the component
export default Profile;
