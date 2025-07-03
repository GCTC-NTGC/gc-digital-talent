import { useIntl } from "react-intl";

import SEO from "~/components/SEO/SEO";

import type { HeroProps } from "./components/Hero";
import Hero from "./components/Hero";
import Opportunities from "./components/Opportunities";
import Profile from "./components/Profile";
import Featured from "./components/Featured";
import About from "./components/About";

export const Component = ({ defaultImage }: HeroProps) => {
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

Component.displayName = "HomePage";

export default Component;
