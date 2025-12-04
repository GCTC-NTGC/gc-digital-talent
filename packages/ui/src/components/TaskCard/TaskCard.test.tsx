import { faker } from "@faker-js/faker/locale/en";
import UsersIcon from "@heroicons/react/24/outline/UsersIcon";

import {
  renderWithProviders,
  expectNoAccessibilityErrors,
} from "@gc-digital-talent/vitest-helpers";

import TaskCard from "./TaskCard";
import Notice from "../Notice/Notice";

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
        <Notice.Root>
          <Notice.Content>{faker.lorem.paragraph()}</Notice.Content>
        </Notice.Root>
      </TaskCard.Item>
    </TaskCard.Root>,
  );
}

describe("TaskCard", () => {
  it("should not have accessibility errors", async () => {
    const { container } = renderComponent();
    await expectNoAccessibilityErrors(container);
  });
});
