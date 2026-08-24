import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { IntlProvider } from "react-intl";
import { createMemoryRouter, RouterProvider } from "react-router";
import { Provider as GraphqlProvider } from "urql";
import { delay, fromValue, pipe } from "wonka";
import { vi } from "vitest";

import {
  fakeClassifications,
  fakeDepartments,
  fakeSkills,
} from "@gc-digital-talent/fake-data";
import { makeFragmentData } from "@gc-digital-talent/graphql";
import richTextElements from "@gc-digital-talent/rich-text-elements";
import { setInSessionStorage } from "@gc-digital-talent/storage";

import { TALENT_REQUEST_STATE_KEY } from "~/constants/storageKeys";

import {
  RequestForm,
  RequestFormClassification_Fragment,
  RequestFormDepartment_Fragment,
  RequestFormSkill_Fragment,
} from "./RequestForm";

const mockClient = {
  executeQuery: vi.fn(() =>
    pipe(fromValue({ data: { poolsPaginated: { data: [] } } }), delay(0)),
  ),
};

const departmentsQuery = fakeDepartments().map((department) =>
  makeFragmentData(department, RequestFormDepartment_Fragment),
);
const classificationsQuery = fakeClassifications().map((classification) =>
  makeFragmentData(classification, RequestFormClassification_Fragment),
);
const skillsQuery = fakeSkills().map((skill) =>
  makeFragmentData(skill, RequestFormSkill_Fragment),
);

const renderRequestForm = () => {
  const router = createMemoryRouter(
    [
      {
        path: "/en/search/request",
        element: (
          <RequestForm
            departmentsQuery={departmentsQuery}
            classificationsQuery={classificationsQuery}
            communitiesQuery={[]}
            skills={skillsQuery}
            handleCreateTalentRequest={vi.fn()}
          />
        ),
      },
      { path: "/en/search", element: <p>Search form</p> },
      { path: "/en/support", element: <p>Support</p> },
    ],
    { initialEntries: ["/en/search/request"] },
  );

  render(
    <IntlProvider locale="en" defaultRichTextElements={richTextElements}>
      <GraphqlProvider value={mockClient}>
        <RouterProvider router={router} />
      </GraphqlProvider>
    </IntlProvider>,
  );

  return { router };
};

describe("RequestForm", () => {
  beforeEach(() => {
    window.sessionStorage.clear();
    setInSessionStorage(TALENT_REQUEST_STATE_KEY, {
      applicantFilter: {},
      candidateCount: 5,
    });
  });

  it("keeps the stored request state when returning to the search form", async () => {
    renderRequestForm();

    await userEvent.click(screen.getByRole("link", { name: /back/i }));

    expect(await screen.findByText("Search form")).toBeInTheDocument();
    expect(
      window.sessionStorage.getItem(TALENT_REQUEST_STATE_KEY),
    ).not.toBeNull();
  });

  it("clears the stored request state when leaving for another page", async () => {
    const { router } = renderRequestForm();

    await act(async () => {
      await router.navigate("/en/support");
    });

    expect(await screen.findByText("Support")).toBeInTheDocument();
    expect(window.sessionStorage.getItem(TALENT_REQUEST_STATE_KEY)).toBeNull();
  });
});
