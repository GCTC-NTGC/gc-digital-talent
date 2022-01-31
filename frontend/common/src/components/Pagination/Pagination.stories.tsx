import { action } from "@storybook/addon-actions";
import { Meta, Story } from "@storybook/react";
import React from "react";
import { usePaginationVars } from ".";
import { Skill } from "../../api/generated";
import { fakeSkills } from "../../fakeData";
import Pagination, { PaginationProps } from "./Pagination";

export default {
  component: Pagination,
  title: "Components/Pagination",
  args: {
    handlePageChange: action("Change page"),
  },
} as Meta;

const TemplatePagination: Story<PaginationProps> = (args) => {
  return <Pagination {...args} />;
};

export const NoDots = TemplatePagination.bind({});
export const RightDots = TemplatePagination.bind({});
export const LeftDots = TemplatePagination.bind({});
export const BothDots = TemplatePagination.bind({});

NoDots.args = {
  totalCount: 50,
  siblingCount: 1,
  currentPage: 1,
  pageSize: 10,
};

RightDots.args = {
  totalCount: 100,
  siblingCount: 1,
  currentPage: 1,
  pageSize: 10,
};

LeftDots.args = {
  totalCount: 100,
  siblingCount: 1,
  currentPage: 9,
  pageSize: 10,
};

BothDots.args = {
  totalCount: 100,
  siblingCount: 1,
  currentPage: 5,
  pageSize: 10,
};

const TemplatePaginationWithData: Story<PaginationProps> = () => {
  const skills = fakeSkills(50);
  const pageSize = 10;
  const pagination = usePaginationVars<Skill>(1, pageSize, skills);
  const { currentPage, currentTableData, setCurrentPage } = pagination;
  return (
    <div>
      {currentTableData.map(skill => (<p>{skill.name.en}</p>))}
      <Pagination
        currentPage={currentPage}
        pageSize={pageSize}
        siblingCount={1}
        totalCount={skills.length}
        handlePageChange={(page) => setCurrentPage(page)}
      />
    </div>
  )
};

export const WithData = TemplatePaginationWithData.bind({});
