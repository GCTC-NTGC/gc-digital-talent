/**
 * @jest-environment jsdom
 */
import React from "react";
import "@testing-library/jest-dom";
import { IntlProvider } from "react-intl";
import { Provider as GraphqlProvider } from "urql";
import { pipe, fromValue, delay } from "wonka";
import { waitFor, renderHook } from "@testing-library/react";
import { fakeSkills, fakePools, fakeClassifications } from "@common/fakeData";
import useFilterOptions from "./useFilterOptions";

describe("useFilterOptions", () => {
  function renderHookWithProviders({
    enableEducationSelect,
    msDelay = 0,
    responseData = {},
  }: {
    enableEducationSelect?: boolean;
    msDelay?: number;
    responseData?: object;
  }) {
    // Source: https://formidable.com/open-source/urql/docs/advanced/testing/
    const mockClient = {
      executeQuery: jest.fn(() =>
        pipe(fromValue(responseData), delay(msDelay)),
      ),
      // See: https://github.com/FormidableLabs/urql/discussions/2057#discussioncomment-1568874
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any;

    const wrapper = ({ children }: { children: React.ReactElement }) => (
      <IntlProvider locale="en">
        <GraphqlProvider value={mockClient}>{children}</GraphqlProvider>
      </IntlProvider>
    );
    const { result } = renderHook(
      () => useFilterOptions(enableEducationSelect),
      {
        wrapper,
      },
    );

    return result;
  }
  describe("enableEducationSelect toggle", () => {
    it("has key educationType when enabled and appropriate number of options", () => {
      const result = renderHookWithProviders({ enableEducationSelect: true });
      expect(result.current.emptyFormValues.educationType).toStrictEqual([]);
      expect(result.current.optionsData.educationType).toHaveLength(8);
    });

    it("does not have key educationType when disabled", () => {
      const result = renderHookWithProviders({ enableEducationSelect: false });
      expect(result.current.emptyFormValues.educationType).toBeUndefined();
      expect(result.current.optionsData.educationType).toBeUndefined();
    });

    it("does not have key educationType when unset", () => {
      const result = renderHookWithProviders({});
      expect(result.current.emptyFormValues.educationType).toBeUndefined();
      expect(result.current.optionsData.educationType).toBeUndefined();
    });
  });

  describe("rawGraphqlResults", () => {
    it("shows as fetching before response arrives", () => {
      const result = renderHookWithProviders({ msDelay: 100 });
      expect(Object.keys(result.current.rawGraphqlResults)).toHaveLength(3);
      expect(result.current.rawGraphqlResults.pools.fetching).toBe(true);
      expect(result.current.rawGraphqlResults.classifications.fetching).toBe(
        true,
      );
      expect(result.current.rawGraphqlResults.skills.fetching).toBe(true);
    });
  });

  describe("simple fields", () => {
    it("returns static optionsData of appropriate length for non-async fields", () => {
      const result = renderHookWithProviders({});
      const [countSimple, countAsync] = [11, 3];
      const countTotal = countSimple + countAsync;
      expect(Object.keys(result.current.optionsData)).toHaveLength(countTotal);

      expect(result.current.optionsData.employmentDuration).toHaveLength(2);
      expect(result.current.optionsData.jobLookingStatus).toHaveLength(3);
      expect(result.current.optionsData.languageAbility).toHaveLength(3);
      expect(result.current.optionsData.operationalRequirement).toHaveLength(7);
      expect(result.current.optionsData.workRegion).toHaveLength(8);
      expect(result.current.optionsData.equity).toHaveLength(4);
      expect(result.current.optionsData.poolCandidateStatus).toHaveLength(16);
      expect(result.current.optionsData.priorityWeight).toHaveLength(4);

      // Boolean filters
      expect(result.current.optionsData.govEmployee).toHaveLength(1);
      expect(result.current.optionsData.profileComplete).toHaveLength(1);
      expect(result.current.optionsData.hasDiploma).toHaveLength(1);
    });
  });

  describe("async fields", () => {
    it("returns undefined for async fields prior to response", () => {
      const result = renderHookWithProviders({ msDelay: 100 });

      expect(result.current.optionsData.classifications).toBeUndefined();
      expect(result.current.optionsData.pools).toBeUndefined();
      expect(result.current.optionsData.skills).toBeUndefined();
    });

    it.skip("performs 3 API client queries", () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const result = renderHookWithProviders({});
      // TODO: Refactor to access function mock and check if Urql client is being called appropriately.
      // expect(mockClient.executeQuery).toBeCalledTimes(3);
    });

    it("generates appropriate number of options after response: classifications", async () => {
      const result = renderHookWithProviders({
        responseData: {
          data: {
            pools: [],
            skills: [],
            classifications: fakeClassifications(),
          },
        },
      });
      await waitFor(() =>
        expect(result.current.optionsData.classifications).not.toBeUndefined(),
      );
      expect(result.current.optionsData.classifications).toHaveLength(4);
    });

    it("generates appropriate number of options after response: pools", async () => {
      const result = renderHookWithProviders({
        responseData: {
          data: {
            pools: fakePools(),
            skills: [],
            classifications: [],
          },
        },
      });
      await waitFor(() =>
        expect(result.current.optionsData.pools).not.toBeUndefined(),
      );
      expect(result.current.optionsData.pools).toHaveLength(2);
    });

    it("generates appropriate number of options after response: skills", async () => {
      const result = renderHookWithProviders({
        responseData: {
          data: {
            pools: [],
            skills: fakeSkills(10),
            classifications: [],
          },
        },
      });
      await waitFor(() =>
        expect(result.current.optionsData.skills).not.toBeUndefined(),
      );
      expect(result.current.optionsData.skills).toHaveLength(10);
    });
  });
});
