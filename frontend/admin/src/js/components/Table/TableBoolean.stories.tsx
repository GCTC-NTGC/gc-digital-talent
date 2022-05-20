import React from "react";
import { Story, Meta } from "@storybook/react";
import TableBoolean from "./TableBoolean";
import type { TableBooleanProps } from "./TableBoolean";

export default {
  component: TableBoolean,
  title: "Components/Table Boolean",
} as Meta;

const TemplateTableBoolean: Story<TableBooleanProps> = ({ checked }) => {
  return <TableBoolean checked={checked} />;
};

export const TableBooleanTrue = TemplateTableBoolean.bind({});

TableBooleanTrue.args = {
  checked: true,
};

export const TableBooleanFalse = TemplateTableBoolean.bind({});

TableBooleanFalse.args = {
  checked: false,
};
