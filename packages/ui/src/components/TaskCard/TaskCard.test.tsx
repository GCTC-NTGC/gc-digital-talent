/**
 * @jest-environment jsdom
 */

import { faker } from "@faker-js/faker/locale/en";
import UsersIcon from "@heroicons/react/24/outline/UsersIcon";

import { renderWithProviders, axeTest } from "@gc-digital-talent/jest-helpers";

import TaskCard from "./TaskCard";
import Link from "../Link";
import Well from "../Well";

function renderComponent() {
  return renderWithProviders(
    <TaskCard
      headingColor="primary"
      icon={UsersIcon}
      title="Your active applications"
      link={<Link href="#">Browse new jobs</Link>}
    >
      <div data-h2-padding="base(x1)">
        <Well>{faker.lorem.paragraph()}</Well>
      </div>
    </TaskCard>,
  );
}

describe("TaskCard", () => {
  it("should not have accessibility errors", async () => {
    const { container } = renderComponent();
    await axeTest(container);
  });
});
