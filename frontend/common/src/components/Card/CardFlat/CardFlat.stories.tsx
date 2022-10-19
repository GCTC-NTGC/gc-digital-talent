import React from "react";
import { Story, Meta } from "@storybook/react";
import CardFlat from "./CardFlat";

export default {
  component: CardFlat,
  title: "Components/Card Flat",
} as Meta;

const Spacer: React.FC = ({ children }) => (
  <div
    data-h2-display="base(flex)"
    data-h2-flex-direction="base(column)"
    data-h2-align-items="base(center)"
    style={{ padding: "1rem" }}
  >
    {children}
  </div>
);

const Template: Story = () => (
  <div
    data-h2-display="base(flex)"
    data-h2-justify-content="base(space-around)"
    style={{ margin: "-1rem" }}
  >
    <Spacer>
      <CardFlat title="Yellow" color="yellow">
        <p>Etiam auctor bibendum lectus, ornare dapibus est placerat vitae.</p>
      </CardFlat>
    </Spacer>
    <Spacer>
      <CardFlat title="Red" color="red">
        <p>Etiam auctor bibendum lectus, ornare dapibus est placerat vitae.</p>
      </CardFlat>
    </Spacer>
    <Spacer>
      <CardFlat title="Blue" color="blue">
        <p>Etiam auctor bibendum lectus, ornare dapibus est placerat vitae.</p>
      </CardFlat>
    </Spacer>
    <Spacer>
      <CardFlat title="Black" color="black">
        <p>Etiam auctor bibendum lectus, ornare dapibus est placerat vitae.</p>
      </CardFlat>
    </Spacer>
    <Spacer>
      <CardFlat
        title="Purple"
        color="purple"
        link={{ href: "#", label: "With link" }}
      >
        <p>Etiam auctor bibendum lectus, ornare dapibus est placerat vitae.</p>
      </CardFlat>
    </Spacer>
  </div>
);

export const CardFlatStory = Template.bind({});
