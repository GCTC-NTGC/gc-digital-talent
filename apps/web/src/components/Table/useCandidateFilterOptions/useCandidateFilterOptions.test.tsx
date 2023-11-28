/**
 * @jest-environment jsdom
 */
// This test is odd, not what is going on here but we cannot deconstruct the return value
/* eslint-disable testing-library/render-result-naming-convention */
import React from "react";
import "@testing-library/jest-dom";
import { IntlProvider } from "react-intl";
import { Provider as GraphqlProvider } from "urql";
import { pipe, fromValue, delay } from "wonka";
import { waitFor, renderHook } from "@testing-library/react";

import {
  fakeSkills,
  fakePools,
  fakeClassifications,
  fakeRoles,
} from "@gc-digital-talent/fake-data";
import { ROLE_NAME } from "@gc-digital-talent/auth";

import useCandidateFilterOptions from "./useCandidateFilterOptions";

describe("useCandidateFilterOptions", () => {
  function renderHookWithProviders({
    msDelay = 0,
    responseData = {},
  }: {
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
    const { result } = renderHook(() => useCandidateFilterOptions(), {
      wrapper,
    });

    return result;
  }

  describe("rawGraphqlResults", () => {
    it("shows as fetching before response arrives", () => {
      const result = renderHookWithProviders({ msDelay: 100 });
      expect(Object.keys(result.current.rawGraphqlResults)).toHaveLength(4);
      expect(result.current.rawGraphqlResults.pools.fetching).toBe(true);
      expect(result.current.rawGraphqlResults.classifications.fetching).toBe(
        true,
      );
      expect(result.current.rawGraphqlResults.skills.fetching).toBe(true);
      expect(result.current.rawGraphqlResults.roles.fetching).toBe(true);
    });
  });

  describe("simple fields", () => {
    it("returns static optionsData of appropriate length for non-async fields", () => {
      const result = renderHookWithProviders({});
      const [countSimple, countAsync] = [15, 4];
      const countTotal = countSimple + countAsync;
      expect(Object.keys(result.current.optionsData)).toHaveLength(countTotal);

      expect(result.current.optionsData.employmentDuration).toHaveLength(2);
      expect(result.current.optionsData.languageAbility).toHaveLength(3);
      expect(result.current.optionsData.operationalRequirement).toHaveLength(7);
      expect(result.current.optionsData.workRegion).toHaveLength(8);
      expect(result.current.optionsData.equity).toHaveLength(4);
      expect(result.current.optionsData.poolCandidateStatus).toHaveLength(18);
      expect(result.current.optionsData.priorityWeight).toHaveLength(4);
      expect(result.current.optionsData.expiryStatus).toHaveLength(3);
      expect(result.current.optionsData.suspendedStatus).toHaveLength(3);

      // Boolean filters
      expect(result.current.optionsData.govEmployee).toHaveLength(1);
      expect(result.current.optionsData.profileComplete).toHaveLength(1);
      expect(result.current.optionsData.hasDiploma).toHaveLength(1);
      expect(result.current.optionsData.trashed).toHaveLength(1);
    });
  });

  describe("async fields", () => {
    it("returns undefined for async fields prior to response", () => {
      const result = renderHookWithProviders({ msDelay: 100 });

      expect(result.current.optionsData.classifications).toBeUndefined();
      expect(result.current.optionsData.pools).toBeUndefined();
      expect(result.current.optionsData.skills).toBeUndefined();
    });

    it("generates appropriate number of options after response: classifications", async () => {
      const result = renderHookWithProviders({
        responseData: {
          data: {
            pools: [],
            skills: [],
            classifications: fakeClassifications(),
            roles: [],
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
            roles: [],
          },
        },
      });
      await waitFor(() =>
        expect(result.current.optionsData.pools).not.toBeUndefined(),
      );
      expect(result.current.optionsData.pools).toHaveLength(10);
    });

    it("generates appropriate number of options after response: skills", async () => {
      const result = renderHookWithProviders({
        responseData: {
          data: {
            pools: [],
            skills: fakeSkills(10),
            classifications: [],
            roles: [],
          },
        },
      });
      await waitFor(() =>
        expect(result.current.optionsData.skills).not.toBeUndefined(),
      );
      expect(result.current.optionsData.skills).toHaveLength(10);
    });

    it("generates appropriate number of options after response: roles", async () => {
      const result = renderHookWithProviders({
        responseData: {
          data: {
            pools: [],
            skills: [],
            classifications: [],
            roles: [
              ...fakeRoles(),
              {
                id: "platform-admin",
                name: ROLE_NAME.PlatformAdmin, // filtering roles done in useCandidateFilterOptions
              },
            ],
          },
        },
      });
      await waitFor(() =>
        expect(result.current.optionsData.roles).not.toBeUndefined(),
      );
      expect(result.current.optionsData.roles).toHaveLength(1); // only platform admin option kept
    });
  });
});
