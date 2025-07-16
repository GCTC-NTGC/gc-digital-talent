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
  size: () => number;
  dequeue: () => AriaMessage | null;
  enqueue: (msg: AriaMessage) => void;
}

const leftNode = (i: number): number => {
  return 2 * i + 1;
};

const rightNode = (i: number): number => {
  return 2 * i + 2;
};

const parentNode = (i: number): number => {
  return Math.floor((i - 1) / 2);
};

export const createMessageQueue = (): MessageQueue => {
  const items: AriaMessage[] = [];
  let size = 0;

  /**
   * Compare two messages for sorting
   * First, by priority then by initial index
   */
  const compare = (a: AriaMessage, b: AriaMessage): number => {
    if (a.priority !== b.priority) {
      return b.priority - a.priority;
    }

    return a.createdAt - b.createdAt;
  };

  const swap = (a: number, b: number) => {
    const tmp = items[a];
    items[a] = items[b];
    items[b] = tmp;
  };

  const heapify = (i: number) => {
    let smallest = i;
    const left = leftNode(i);
    const right = rightNode(i);

    if (left < size && compare(items[left], items[smallest]) < 0) {
      smallest = left;
    }

    if (right < size && compare(items[right], items[smallest]) < 0) {
      smallest = right;
    }

    if (smallest !== i) {
      swap(smallest, i);
      heapify(smallest);
    }
  };

  const all = () => {
    return items.slice(0, size);
  };

  const clear = () => {
    size = 0;
  };

  const peek = () => {
    if (size === 0) {
      return null;
    }

    return items[0];
  };

  const dequeue = () => {
    if (size === 0) {
      return null;
    }

    const item = items[0];
    items[0] = items[--size];
    heapify(0);

    return item;
  };

  const enqueue = (item: AriaMessage) => {
    items[size++] = item;
    let i = size - 1;
    let parent = parentNode(i);
    while (i > 0 && compare(items[parent], items[i]) > 0) {
      swap(parent, i);
      i = parent;
      parent = parentNode(i);
    }
  };

  return {
    all,
    clear,
    peek,
    size: () => size,
    enqueue,
    dequeue,
  };
};
