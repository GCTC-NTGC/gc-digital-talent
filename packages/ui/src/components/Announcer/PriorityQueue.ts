export interface AriaMessage {
  /** Message to be announced */
  message: string;
  /** Priority of message (higher value given higher priority) */
  priority: number;
  /** Index that the message was originally created at */
  createdAt: number;
}

interface MessageQueue {
  all: () => AriaMessage[];
  clear: () => void;
  peek: () => AriaMessage | null;
  enqueue: (msg: AriaMessage) => void;
  dequeue: () => AriaMessage | null;
  size: () => number;
}

export const createMessageQueue = (): MessageQueue => {
  const items: AriaMessage[] = [];

  const compare = (a: AriaMessage, b: AriaMessage): number =>
    a.priority !== b.priority
      ? b.priority - a.priority
      : a.createdAt - b.createdAt;

  const all = () => items.slice();

  const clear = () => {
    items.length = 0;
  };

  const peek = () => {
    return items.length > 0 ? items[0] : null;
  };

  const enqueue = (item: AriaMessage) => {
    let i = items.length - 1;
    while (i >= 0 && compare(items[i], item) > 0) {
      i--;
    }
    items.splice(i + 1, 0, item);
  };

  const dequeue = () => {
    return items.length > 0 ? items.shift()! : null;
  };

  const size = () => items.length;

  return { all, clear, peek, enqueue, dequeue, size };
};
