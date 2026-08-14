import { act, renderHook } from "@testing-library/react";

import useServerSyncedState from "./useServerSyncedState";

describe("useServerSyncedState", () => {
  it("starts at the server value", () => {
    const { result } = renderHook(() => useServerSyncedState(true));

    expect(result.current[0]).toBe(true);
  });

  it("adopts a changed server value", () => {
    const { result, rerender } = renderHook(
      ({ serverValue }: { serverValue: boolean }) =>
        useServerSyncedState(serverValue),
      { initialProps: { serverValue: false } },
    );

    rerender({ serverValue: true });

    expect(result.current[0]).toBe(true);
  });

  it("keeps a local value when the same server value is re-delivered", () => {
    const { result, rerender } = renderHook(
      ({ serverValue }: { serverValue: boolean }) =>
        useServerSyncedState(serverValue),
      { initialProps: { serverValue: false } },
    );

    const setValue = result.current[1];
    act(() => {
      setValue(true);
    });
    expect(result.current[0]).toBe(true);

    // A stale cached document arriving again must not undo the local value.
    rerender({ serverValue: false });

    expect(result.current[0]).toBe(true);
  });

  it("keeps a local value when the server catches up to it", () => {
    const { result, rerender } = renderHook(
      ({ serverValue }: { serverValue: boolean }) =>
        useServerSyncedState(serverValue),
      { initialProps: { serverValue: false } },
    );

    const setValue = result.current[1];
    act(() => {
      setValue(true);
    });
    rerender({ serverValue: true });

    expect(result.current[0]).toBe(true);
  });

  it("adopts a later server change that contradicts the local value", () => {
    const { result, rerender } = renderHook(
      ({ serverValue }: { serverValue: boolean }) =>
        useServerSyncedState(serverValue),
      { initialProps: { serverValue: false } },
    );

    const setValue = result.current[1];
    act(() => {
      setValue(true);
    });
    rerender({ serverValue: true });
    expect(result.current[0]).toBe(true);

    // Someone else removes it: the server is still the authority.
    rerender({ serverValue: false });

    expect(result.current[0]).toBe(false);
  });

  it("adopts the server value when the identity changes", () => {
    const { result, rerender } = renderHook(
      ({ serverValue, id }: { serverValue: boolean; id: string }) =>
        useServerSyncedState(serverValue, id),
      { initialProps: { serverValue: false, id: "a" } },
    );

    const setValue = result.current[1];
    act(() => {
      setValue(true);
    });
    expect(result.current[0]).toBe(true);

    // Now showing a different entity that happens to share the old server value: the
    // local value belongs to the previous entity and must be discarded.
    rerender({ serverValue: false, id: "b" });

    expect(result.current[0]).toBe(false);
  });

  it("works with non-boolean values", () => {
    const { result, rerender } = renderHook(
      ({ serverValue }: { serverValue: string }) =>
        useServerSyncedState(serverValue),
      { initialProps: { serverValue: "a" } },
    );

    rerender({ serverValue: "b" });

    expect(result.current[0]).toBe("b");
  });
});
