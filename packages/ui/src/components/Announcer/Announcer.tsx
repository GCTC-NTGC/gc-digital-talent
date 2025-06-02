import {
  ReactNode,
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
} from "react";

interface AnnouncerContextValue {
  announce: (announcement: ReactNode) => void;
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
  /**
   * How live the announcement is (`aria-live`)
   *
   * SEE: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-live
   *
   */
  live?: "off" | "polite" | "assertive" | undefined;
  /**
   * Set to announce the entire message or just changed parts
   *
   * True - Announce all (default)
   * False - Announce only changed part
   *
   * SEE: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-atomic
   */
  atomic?: boolean;
  /**
   * Set a delay to when the announcement is made (milliseconds)
   */
  timeout?: number;
}

const Announcer = ({
  children,
  live = "polite",
  atomic = true,
  timeout = 150,
}: AnnouncerProps) => {
  const [announcement, setAnnouncement] = useState<ReactNode>("");

  const announce = useCallback(
    (newAnnouncement: ReactNode) => {
      setAnnouncement("");
      setTimeout(() => {
        setAnnouncement(newAnnouncement);
      }, timeout);
    },
    [timeout],
  );

  const value = useMemo(() => ({ announce }), [announce]);

  return (
    <AnnouncerContext.Provider value={value}>
      {children}
      <div
        aria-atomic={atomic}
        aria-live={live}
        aria-relevant="all"
        className="sr-only"
      >
        {announcement}
      </div>
    </AnnouncerContext.Provider>
  );
};

export default Announcer;
