import { LimitedDataTransfer } from "./types";

class ClipboardEventMock extends Event {
  readonly clipboardData: LimitedDataTransfer | null;

  constructor(type: string, eventInitDict?: EventInit | undefined) {
    super(type, eventInitDict);
    this.clipboardData = {
      getData: jest.fn(),
      setData: jest.fn(),
    };
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(globalThis as any).ClipboardEvent = ClipboardEventMock;
