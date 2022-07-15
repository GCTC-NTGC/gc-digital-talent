import { ComponentMeta, ComponentStory } from "@storybook/react";
import { SearchIcon } from "@heroicons/react/solid";
import Select, { components, ControlProps } from "react-select";
import type { GroupBase } from "react-select";
import { InputGroup } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.css";
import React from "react";

type HeroIcon = (props: React.ComponentProps<"svg">) => JSX.Element;

declare module "react-select/dist/declarations/src/Select" {
  export interface Props<
    Option,
    IsMulti extends boolean,
    Group extends GroupBase<Option>,
  > {
    icon: HeroIcon;
  }
}

const CustomControl = ({ selectProps, ...props }: ControlProps) => {
  const { icon: Icon } = selectProps;
  return (
    <InputGroup>
      <span className="input-group-text">
        <Icon style={{ width: "1rem" }} />
      </span>
      <components.Control {...props} {...{ selectProps }} />
    </InputGroup>
  );
};

interface ComponentProps {
  icon: HeroIcon;
}
const Component = ({ icon }: ComponentProps) => {
  const customStyles = {
    control: (provided: any) => ({
      ...provided,
      flex: "1 1 auto",
    }),
  };

  return (
    <Select
      options={["foo", "bar", "baz"].map((val) => ({ label: val, value: val }))}
      icon={icon}
      components={{
        Control: CustomControl,
      }}
      styles={customStyles}
    />
  );
};

export default {
  component: Component,
  title: "InputGroup",
} as ComponentMeta<typeof Component>;

const Template: ComponentStory<typeof Component> = (args) => {
  return <Component {...args} />;
};

export const Default = Template.bind({});
Default.args = {
  icon: SearchIcon,
};
