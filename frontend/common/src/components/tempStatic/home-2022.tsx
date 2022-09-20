// Vendor dependencies
import React from "react";

// Local helper dependencies

// Local component dependencies
import GocBanner from "./home-2022-components/goc-banner";
import Navigation from "./home-2022-components/navigation";
import Hero from "./home-2022-components/hero";
import Opportunities from "./home-2022-components/opportunities";
import Profile from "./home-2022-components/profile";
import Featured from "./home-2022-components/featured";
import About from "./home-2022-components/about";
import Footer from "./home-2022-components/footer";

// Create the page component
const Home: React.FunctionComponent = () => {
  return (
    <div data-h2-color="base(black) base:dark(white)">
      <GocBanner />
      <Navigation />
      <Hero />
      <Opportunities />
      <Profile />
      <Featured />
      <About />
      <Footer />
    </div>
  );
};

// Export the component
export default Home;
