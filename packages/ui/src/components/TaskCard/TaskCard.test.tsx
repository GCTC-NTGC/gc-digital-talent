/**
 * @jest-environment jsdom
 */

import { faker } from "@faker-js/faker/locale/en";
import UsersIcon from "@heroicons/react/24/outline/UsersIcon";

import { renderWithProviders, axeTest } from "@gc-digital-talent/jest-helpers";

import TaskCard from "./TaskCard";
import Well from "../Well/Well";

function renderComponent() {
  return renderWithProviders(
    <TaskCard.Root
      headingColor="primary"
      icon={UsersIcon}
      title="Your active applications"
      link={{
        label: "Browse new jobs",
        href: "#",
      }}
    >
      <TaskCard.Item>
        <Well>{faker.lorem.paragraph()}</Well>
      </TaskCard.Item>
    </TaskCard.Root>,
  );
}

describe("TaskCard", () => {
  it("should not have accessibility errors", async () => {
    const { container } = renderComponent();
    await axeTest(container);
  });
});
