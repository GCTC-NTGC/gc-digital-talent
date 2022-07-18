import { ComponentMeta, ComponentStory } from "@storybook/react";
import { SearchIcon } from "@heroicons/react/solid";
import Select, { components, ContainerProps } from "react-select";
import type { GroupBase } from "react-select";
import { InputGroup } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.css";
import React from "react";

type HeroIcon = (props: React.ComponentProps<"svg">) => JSX.Element;

// See: https://github.com/JedWatson/react-select/issues/4804#issuecomment-927223471
declare module "react-select/dist/declarations/src/Select" {
  export interface Props<
    Option,
    IsMulti extends boolean,
    Group extends GroupBase<Option>,
  > {
    icon?: HeroIcon;
  }
}

const CustomContainer = ({ children, ...props }: ContainerProps) => {
  const {
    selectProps: { icon: Icon },
  } = props;
  return (
    <components.SelectContainer {...props}>
      {Icon ? (
        <InputGroup>
          <span className="input-group-text">
            <Icon style={{ width: "1rem" }} />
          </span>
          {children}
        </InputGroup>
      ) : (
        { children }
      )}
    </components.SelectContainer>
  );
};

interface CustomSelectProps {
  icon: HeroIcon;
}
const CustomSelect = ({ icon }: CustomSelectProps) => {
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
        SelectContainer: CustomContainer,
      }}
      styles={customStyles}
    />
  );
};

export default {
  component: CustomSelect,
  title: "InputGroup",
} as ComponentMeta<typeof CustomSelect>;

const Template: ComponentStory<typeof CustomSelect> = (args) => {
  return <CustomSelect {...args} />;
};

export const Default = Template.bind({});
export const WithIcon = Template.bind({});
WithIcon.args = {
  icon: SearchIcon,
};
