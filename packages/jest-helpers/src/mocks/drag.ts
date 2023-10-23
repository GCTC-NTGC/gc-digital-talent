import { LimitedDataTransfer } from "./types";

/* eslint-disable @typescript-eslint/no-explicit-any */
class DragEventMock extends Event {
  readonly dataTransfer: LimitedDataTransfer | null;

  constructor(type: string, eventInitDict?: EventInit) {
    super(type, eventInitDict);
    this.dataTransfer = {
      getData: jest.fn(),
      setData: jest.fn(),
    };
  }
}

(globalThis as any).DragEvent = DragEventMock;
