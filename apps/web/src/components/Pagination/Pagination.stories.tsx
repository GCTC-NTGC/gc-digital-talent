import { action } from "@storybook/addon-actions";
import { Meta, StoryFn } from "@storybook/react";
import React from "react";

import { fakeSkills } from "@gc-digital-talent/fake-data";
import { Skill } from "@gc-digital-talent/graphql";

import Pagination from "./Pagination";
import type { PaginationProps } from "./Pagination";

import { usePaginationVars } from ".";

export default {
  component: Pagination,
  title: "Components/Pagination",
  args: {
    ariaLabel: "Pagination table",
    handlePageChange: action("Change page"),
    handlePageSize: action("Change page size"),
    color: "black",
    mode: "outline",
  },
} as Meta;

const TemplatePagination: StoryFn<PaginationProps> = (args) => {
  return <Pagination {...args} />;
};

const Default = TemplatePagination.bind({});
export const NoDots = TemplatePagination.bind({});
export const RightDots = TemplatePagination.bind({});
export const LeftDots = TemplatePagination.bind({});
export const BothDots = TemplatePagination.bind({});

Default.args = {
  totalCount: 100,
  totalPages: 10,
  siblings: 1,
  currentPage: 1,
  pageSize: 10,
  color: "black",
  activeColor: "primary",
};

NoDots.args = {
  ...Default.args,
  totalPages: 5,
  totalCount: 50,
};

RightDots.args = {
  ...Default.args,
};

LeftDots.args = {
  ...Default.args,
  currentPage: 9,
};

BothDots.args = {
  ...Default.args,
  currentPage: 5,
};

const TemplatePaginationWithData: StoryFn<PaginationProps> = () => {
  const skills = fakeSkills(50);
  const pageSize = 5;
  const pagination = usePaginationVars<Skill>(pageSize, skills);
  const { currentPage, currentTableData, setCurrentPage, setPageSize } =
    pagination;
  return (
    <div>
      {currentTableData.map((skill) => (
        <p key={skill.key}>{skill.name.en}</p>
      ))}
      <Pagination
        ariaLabel="Pagination table"
        color="black"
        activeColor="primary"
        onPageSizeChange={setPageSize}
        currentPage={currentPage}
        pageSize={pageSize}
        siblings={1}
        totalCount={skills.length}
        totalPages={10}
        onCurrentPageChange={(page) => setCurrentPage(page)}
      />
    </div>
  );
};

export const WithData = TemplatePaginationWithData.bind({});
