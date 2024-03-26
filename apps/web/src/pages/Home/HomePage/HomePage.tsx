import React from "react";
import { useIntl } from "react-intl";

import SEO from "~/components/SEO/SEO";

import { About, Featured, Hero, Opportunities, Profile } from "./components";
import type { HeroProps } from "./components/Hero/Hero";

const HomePage = ({ defaultImage }: HeroProps) => {
  const intl = useIntl();

  return (
    <>
      <SEO
        title={intl.formatMessage({
          defaultMessage: "Welcome",
          id: "4I6WIU",
          description: "Title for the homepage",
        })}
        description={intl.formatMessage({
          defaultMessage:
            "Whether you're thinking about joining government or already an employee, hoping to hire or considering a new role, this is the place to come to be part of the GC digital community.",
          id: "tJnBx1",
          description: "SEO description of the application on the homepage",
        })}
      />
      <Hero defaultImage={defaultImage} />
      <Opportunities />
      <Profile />
      <Featured />
      <About />
    </>
  );
};

export default HomePage;
