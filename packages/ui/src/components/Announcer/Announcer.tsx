import {
  ReactNode,
  createContext,
  useContext,
  useCallback,
  useMemo,
  useRef,
} from "react";

import { AriaMessage, createMessageQueue } from "./PriorityQueue";

const TIMEOUT = 1000;

interface AnnouncerContextValue {
  announce: (announcement: string, priority?: number) => void;
}

const AnnouncerContext = createContext<AnnouncerContextValue>({
  announce: () => {
    // PASS: Default announcement
  },
});

export const useAnnouncer = () => {
  const context = useContext(AnnouncerContext);

  return context;
};

interface AnnouncerProps {
  children: ReactNode;
}

const Announcer = ({ children }: AnnouncerProps) => {
  const container = useRef<HTMLDivElement | null>(null);
  const order = useRef<number>(0);
  const cycle = useRef<ReturnType<typeof setTimeout> | null>(null);
  const messageQueue = createMessageQueue();

  const setCycle = (fn: () => void) => {
    if (cycle.current) {
      clearTimeout(cycle.current);
    }
    cycle.current = setTimeout(fn, TIMEOUT);
    return cycle.current;
  };

  const clearCycle = () => {
    if (cycle.current) {
      clearTimeout(cycle.current);
      cycle.current = null;
    }
  };

  const queueMessage = useCallback(() => {
    if (cycle.current || !container.current) {
      return;
    }

    const nextCycle = () => {
      if (!container.current) {
        return;
      }

      const nextMsg = messageQueue.dequeue();
      if (nextMsg && nextMsg.message.trim().length > 0) {
        const el = document.createElement("span");
        el.innerText = nextMsg.message;

        container.current.innerText = "";
        container.current.appendChild(el);

        setCycle(nextCycle);
      } else {
        container.current.textContent = "";
        clearCycle();
      }
    };

    nextCycle();
  }, [messageQueue]);

  const announce = useCallback(
    (msg: string, priority?: number) => {
      const ariaMessage: AriaMessage = {
        message: msg,
        priority: priority ?? 0,
        createdAt: order.current++,
      };

      messageQueue.enqueue(ariaMessage);
      queueMessage();
    },
    [messageQueue, queueMessage],
  );

  const value = useMemo(() => ({ announce }), [announce]);

  return (
    <AnnouncerContext.Provider value={value}>
      {children}
      <div ref={container} aria-live="assertive" className="sr-only" />
    </AnnouncerContext.Provider>
  );
};

export default Announcer;
