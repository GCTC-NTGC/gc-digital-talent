import React from "react";

import PageHeader from "./partials/PageHeader";
import Breadcrumbs from "./partials/Breadcrumbs";
import Recruitment from "./partials/Recruitment";
import OtherOpportunities from "./partials/OtherOpportunities";
import Flourish from "./partials/Flourish";

const HomePage = () => (
  <div data-h2-color="base(black) base:dark(white)">
    <PageHeader />
    <Breadcrumbs />
    <Recruitment />
    <OtherOpportunities />
    <Flourish />
  </div>
);

export default HomePage;
